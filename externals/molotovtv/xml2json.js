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

function X2JS(config) {
    'use strict';

    var VERSION = '1.2.0';

    config = config || {};
    initConfigDefaults();

    function initConfigDefaults() {
        if (config.escapeMode === undefined) {
            config.escapeMode = true;
        }

        if (config.skipEmptyTextNodesForObj === undefined) {
            config.skipEmptyTextNodesForObj = true;
        }

        if (config.useDoubleQuotes === undefined) {
            config.useDoubleQuotes = false;
        }

        config.jsonPropertiesFilter = config.jsonPropertiesFilter || [];

        if (config.keepCData === undefined) {
            config.keepCData = false;
        }
    }

    var DOMNodeTypes = {
        ELEMENT_NODE: 1,
        TEXT_NODE: 3,
        CDATA_SECTION_NODE: 4,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9
    };

    function toArrayAccessForm(obj, childName) {
        obj[childName + '_asArray'] = obj[childName] instanceof Array ? obj[childName] : [obj[childName]];
    }

    function parseDOMChildren(node) {

        let nodeChildren;
        let result;

        switch (node.nodeType) {

            case DOMNodeTypes.DOCUMENT_NODE:

                nodeChildren = node.childNodes;
                // Alternative for firstElementChild which is not supported in some environments
                for (let cidx = 0, len = nodeChildren.length; cidx < len; ++cidx) {
                    let child = nodeChildren.item(cidx);
                    if (child.nodeType === DOMNodeTypes.ELEMENT_NODE) {
                        result = parseDOMChildren(child);
                    }
                }
                return result;

            case DOMNodeTypes.ELEMENT_NODE:

                result = {};
                let __cnt = 0;

                let children = [];
                nodeChildren = node.childNodes;

                // Children nodes
                let childName;
                for (let cidx = 0, len = nodeChildren.length; cidx < len; ++cidx) {
                    let child = nodeChildren[cidx];
                    childName = child.nodeName;

                    if (child.nodeType != DOMNodeTypes.COMMENT_NODE) {
                        ++__cnt;
                        if (!result[childName]) {
                            let c = parseDOMChildren(child);
                            if (childName != '#text' || /[^\s]/.test(c)) { // Don't add white-space text nodes
                                children[children.length] = { [childName]: c };
                            }
                            result[childName] = c;
                            toArrayAccessForm(result, childName);
                        }
                        else {
                            if (result[childName]) {
                                if ( !(result[childName] instanceof Array)) {
                                    result[childName] = [result[childName]];
                                    toArrayAccessForm(result, childName);
                                }
                            }

                            let c = parseDOMChildren(child);
                            if (childName != '#text' || /[^\s]/.test(c)) { // Don't add white-space text nodes
                                children[children.length] = { [childName]: c };
                            }
                            result[childName][result[childName].length] = c;
                        }
                    }
                }

                result.__children = children;

                // Attributes
                let nodeLocalName = node.nodeName;
                for (let aidx = 0, len = node.attributes.length; aidx < len; aidx++) {
                    let attr = node.attributes[aidx];
                    ++__cnt;

                    let value2 = attr.value;
                    for (let m = 0, ml = config.matchers.length; m < ml; ++m) {
                        let matchobj = config.matchers[m];
                        if (matchobj.test(attr, nodeLocalName)) {
                            value2 = matchobj.converter(attr.value);
                        }
                    }

                    result[attr.name] = value2;
                }

                // Node namespace prefix
                let nodePrefix = node.prefix;
                if (nodePrefix != null && nodePrefix != '') {
                    ++__cnt;
                    result.__prefix = nodePrefix;
                }

                if (result['#text'] != null) {
                    result.__text = result['#text'];
                    if (result.__text instanceof Array) {
                        result.__text = result.__text.join("\n");
                    }
                    delete result['#text'];
                    delete result['#text_asArray'];
                }

                if ( __cnt == 1 && result.__text != null  ) {
                    result = result.__text;
                }
                else
                if ( __cnt > 1 && result.__text != null && config.skipEmptyTextNodesForObj) {
                    if ( result.__text.trim() == '') {
                        delete result.__text;
                    }
                }

                return result;

            case DOMNodeTypes.TEXT_NODE:
            case DOMNodeTypes.CDATA_SECTION_NODE:

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
        var xmlDoc = this.parseXmlString(xmlDocStr);
        return xmlDoc ? parseDOMChildren(xmlDoc) : null;
    };

    this.getVersion = function () {
        return VERSION;
    };
}

export default X2JS;
