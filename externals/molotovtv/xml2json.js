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

function X2JS(config) {
    'use strict';

    var VERSION = '1.2.0';

    config = config || {};

    const DOMNodeTypes = {
        ELEMENT_NODE: 1,
        TEXT_NODE: 3,
        CDATA_SECTION_NODE: 4,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9
    };

    initConfigDefaults();

    function initConfigDefaults() {
        if (config.ignoreRoot === undefined) {
            config.ignoreRoot = false;
        }
    }

    function toArrayAccessForm(obj, childName) {
        obj[childName + '_asArray'] = obj[childName] instanceof Array ? obj[childName] : [obj[childName]];
    }

    function parseDOMChildren(node) {

        let result;

        switch (node.nodeType) {

            case DOMNodeTypes.DOCUMENT_NODE:

                return config.ignoreRoot ? parseDOMChildren(node.firstChild) : { [node.firstChild.nodeName]: parseDOMChildren(node.firstChild) };

            case DOMNodeTypes.ELEMENT_NODE:

                result = {};

                // Children nodes of the current node
                let child = node.firstChild;
                if (child) {

                    const len = node.childNodes.length;
                    let children = new Array(len);

                    for (let cidx = 0; cidx < len; ++cidx) {

                        let childName = child.nodeName;

                        let childNode = result[childName];
                        if (!childNode) {
                            let c = parseDOMChildren(child);
                            children[cidx] = { [childName]: c };
                            result[childName] = c;
                            toArrayAccessForm(result, childName);
                        }
                        else {
                            if (childNode && !(childNode instanceof Array)) {
                                childNode = result[childName] = [result[childName]];
                                toArrayAccessForm(result, childName);
                            }

                            let c = parseDOMChildren(child);
                            children[cidx] = { [childName]: c };
                            childNode[result[childName].length] = c;
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
                    for (let m = 0, ml = config.matchers.length; m < ml; ++m) {
                        let matchobj = config.matchers[m];
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

    this.parseXmlString = function (xmlDocStr) {

        if (xmlDocStr === undefined) { return null; }

        var xmlDoc;
        var parser = new window.DOMParser();
        var parsererrorNS = null;

        try {
            xmlDoc = parser.parseFromString( xmlDocStr, 'text/xml' );
            if ( parsererrorNS != null && xmlDoc.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0) {
                xmlDoc = null;
            }
        }
        catch (err) {
            xmlDoc = null;
        }

        return xmlDoc;
    };

    this.xml_str2json = function (xmlDocStr) {
        // The regex:
        // - removes sequences of space-like characters between elements (including newlines)
        // - removes XML comments
        // - replaces sequences of space-like characters by a single space
        var xmlDoc = this.parseXmlString(xmlDocStr.replace(emptyTextNodeOrComment, '><').replace(/\s+/g, ' '));
        return xmlDoc ? parseDOMChildren(xmlDoc) : null;
    };

    this.getVersion = function () {
        return VERSION;
    };
}

export default X2JS;
