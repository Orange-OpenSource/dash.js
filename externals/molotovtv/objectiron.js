/*
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * author Digital Primates
 * copyright dash-if 2012
 */

/*
 * var parent,
 *     child,
 *     properties = [
                    {
                        name: 'profiles',
                        merge: false
                    }
                ];
 *
 * parent = {};
 * parent.name = "ParentNode";
 * parent.isRoor = false;
 * parent.isArray = false;
 * parent.children = [];
 * parent.properties = properties;
 *
 * child = {};
 * child.name = "ChildNode";
 * child.isRoor = false;
 * child.isArray = true;
 * child.children = null;
 * child.properties = properties;
 * parent.children.push(child);
 *
 */

export default class ObjectIron {

    constructor(map) {
        this.map = map;
    }

    mergeValues(parentItem, childItem) {
        var name;

        if (parentItem === null || childItem === null) {
            return;
        }

        for (name in parentItem) {
            if (parentItem[name]) {
                if (!childItem[name]) {
                    childItem[name] = parentItem[name];
                }
            }
        }
    }

    mapProperties(properties, parent, child) {

        if (properties === null || properties.length === 0) {
            return;
        }

        for (let i = 0, len = properties.length; i < len; i += 1) {
            let property = properties[i];

            if (parent[property.name]) {
                if (child[property.name]) {
                    // check to see if we should merge
                    if (property.merge) {
                        let parentValue = parent[property.name];
                        let childValue = child[property.name];

                        // complex objects; merge properties
                        if (typeof parentValue === 'object' && typeof childValue === 'object') {
                            this.mergeValues(parentValue, childValue);
                        }
                        // simple objects; merge them together
                        else {
                            if (property.mergeFunction) {
                                child[property.name] = property.mergeFunction(parentValue, childValue);
                            } else {
                                child[property.name] = parentValue + childValue;
                            }
                        }
                    }
                } else {
                    // just add the property
                    child[property.name] = parent[property.name];
                }
            }
        }
    }

    mapItem(item, node) {

        if (item.children === null || item.children.length === 0) {
            return;
        }

        for (let i = 0, len = item.children.length; i < len; i += 1) {
            let childItem = item.children[i];

            if (node[childItem.name]) {
                if (childItem.isArray) {
                    let array = node[childItem.name + '_asArray'];
                    for (let v = 0, len2 = array.length; v < len2; v += 1) {
                        let childNode = array[v];
                        this.mapProperties(item.properties, node, childNode);
                        this.mapItem(childItem, childNode);
                    }
                } else {
                    let childNode = node[childItem.name];
                    this.mapProperties(item.properties, node, childNode);
                    this.mapItem(childItem, childNode);
                }
            }
        }
    }

    run(source) {

        if (source === null || typeof source !== 'object') {
            return source;
        }

        let periods = source.Period_asArray;
        for (let i = 0, len = periods.length; i < len; ++i) {
            const period = periods[i];
            this.mapItem(this.map[1], period);

            const adaptationSet = period.AdaptationSet_asArray;
            if (adaptationSet) {
                for (let i = 0, len = adaptationSet.length; i < len; ++i) {
                    this.mapItem(this.map[0], adaptationSet[i]);
                }
            }
        }

        return source;
    }
}
