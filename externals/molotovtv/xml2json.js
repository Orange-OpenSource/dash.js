/*
 Copyright 2011-2013 Abdulla Abdurakhmanov
 Original sources are available at https://code.google.com/p/x2js/

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*
  Further modified for dashjs to:
  - keep track of children nodes in order in attribute __children.
  - add type conversion matchers
  - re-add ignoreRoot
  - allow zero-length attributePrefix
  - don't add white-space text nodes
  - remove explicit RequireJS support
*/

const emptyTextNodeOrComment = /\>\s+(<!--.+--\>\s+)?</g;
const segmentRepeat = /(<S d="(\d+)" \/><S d="(\d+)" \/><S d="(\d+)" \/>)+/;
const DOMNodeTypes = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9
};
const VERSION = '1.2.0';

export default class X2JS {


    constructor(config) {

        this.config = config || {};

        if (config.ignoreRoot === undefined) {
            this.config.ignoreRoot = false;
        }
    }

    toArrayAccessForm(obj, childName) {
        obj[childName + '_asArray'] = obj[childName] instanceof Array ? obj[childName] : [obj[childName]];
    }

    parseDOMChildren(node) {

        let result;

        switch (node.nodeType) {

            case DOMNodeTypes.DOCUMENT_NODE:

                return this.config.ignoreRoot ? this.parseDOMChildren(node.firstChild) : { [node.firstChild.nodeName]: this.parseDOMChildren(node.firstChild) };

            case DOMNodeTypes.ELEMENT_NODE:

                result = {};

                // Children nodes of the current node
                let child = node.firstChild;
                if (child) {

                    let len = node.childNodes.length;
                    let children = new Array(len);

                    for (let cidx = 0; cidx < len; ++cidx) {

                        let childName = child.nodeName;

                        if (childName === 'repeat') {

                            // number of segments to add
                            let count = parseInt(child.attributes.count.value, 10) * 3;
                            len += count - 1;

                            let segmentList;
                            segmentList = new Array(count + 1);
                            segmentList[0] = result.S;
                            result.S = result.S_asArray = segmentList;

                            // starting at index 1 for the segmentList array
                            let index = 1;
                            while (index < count) {
                                segmentList[index++] = this.segment1;
                                segmentList[index++] = this.segment2;
                                segmentList[index++] = this.segment3;
                                children[cidx++] = this.child1;
                                children[cidx++] = this.child2;
                                children[cidx++] = this.child3;
                            }

                            --cidx; // have to go backward because cidx will be incremented in the for loop

                        } else {

                            let childNode = result[childName];
                            if (!childNode) {
                                let c = this.parseDOMChildren(child);
                                children[cidx] = { [childName]: c };
                                result[childName] = c;
                                // FIXME: change this call by direct code
                                this.toArrayAccessForm(result, childName);
                            }
                            else {
                                if (childNode && !(childNode instanceof Array)) {
                                    childNode = result[childName] = [result[childName]];
                                    // FIXME: change this call by direct code
                                    this.toArrayAccessForm(result, childName);
                                }

                                let c = this.parseDOMChildren(child);
                                children[cidx] = { [childName]: c };
                                childNode[childNode.length] = c;
                            }
                        }

                        child = child.nextSibling;
                    }

                    result.__children = children;
                }


                // Attributes of the current node
                let nodeLocalName = node.nodeName;
                const nodeAttributes = node.attributes;
                for (let aidx = 0, len = nodeAttributes.length; aidx < len; ++aidx) {
                    let attr = nodeAttributes[aidx];

                    let value = attr.value;
                    for (let m = 0, ml = this.config.matchers.length; m < ml; ++m) {
                        let matchobj = this.config.matchers[m];
                        if (matchobj.test(attr, nodeLocalName)) {
                            value = matchobj.converter(attr.value);
                        }
                    }

                    result[attr.name] = value;
                }

                // Dash.js does not need prefix?
                // Node namespace prefix
                // let nodePrefix = node.prefix;
                // if (nodePrefix != null && nodePrefix != '') {
                //     result.__prefix = nodePrefix;
                // }

                return result;

            case DOMNodeTypes.TEXT_NODE:

                return node.nodeValue;
        }
    }

    parseXmlString(xmlDocStr) {

        if (xmlDocStr === undefined) { return null; }

        var xmlDoc;
        var parser = new window.DOMParser();
        var parsererrorNS = null;

        try {
            xmlDoc = parser.parseFromString( xmlDocStr, 'text/xml' );
            if ( parsererrorNS && xmlDoc.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0) {
                xmlDoc = null;
            }
        }
        catch (err) {
            xmlDoc = null;
        }

        return xmlDoc;
    }

    xml_str2json(xmlDocStr) {
        // The regex:
        // - removes sequences of space-like characters between elements (including newlines)
        // - removes XML comments
        // - replaces sequences of space-like characters by a single space
        let xmlDocStrClean = xmlDocStr.replace(emptyTextNodeOrComment, '><').replace(/\s+/g, ' ');

        let segmentMatches = xmlDocStrClean.match(segmentRepeat);
        if (segmentMatches) {

            this.segment1 = {d: parseFloat(segmentMatches[2])};
            this.segment2 = {d: parseFloat(segmentMatches[3])};
            this.segment3 = {d: parseFloat(segmentMatches[4])};
            this.child1 = {S: this.segment1};
            this.child2 = {S: this.segment2};
            this.child3 = {S: this.segment3};

            const match = segmentMatches[0];
            xmlDocStrClean = xmlDocStrClean.split(match).join(`<repeat count="${match.length / segmentMatches[1].length}"/>`);
        }

        const xmlDoc = this.parseXmlString(xmlDocStrClean);
        return xmlDoc ? this.parseDOMChildren(xmlDoc) : null;
    }

    getVersion() {
        return VERSION;
    }
}
