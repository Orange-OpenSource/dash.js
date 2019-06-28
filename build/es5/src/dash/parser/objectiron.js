/**
 * The copyright in this software is being made available under the BSD License,
 * included below. This software may be subject to other third party and contributor
 * rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2013, Dash Industry Forum.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation and/or
 *  other materials provided with the distribution.
 *  * Neither the name of Dash Industry Forum nor the names of its
 *  contributors may be used to endorse or promote products derived from this software
 *  without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 *  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 *  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _coreFactoryMaker=require('../../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);function ObjectIron(mappers){function mergeValues(parentItem,childItem){for(var _name in parentItem) {if(!childItem.hasOwnProperty(_name)){childItem[_name] = parentItem[_name];}}}function mapProperties(properties,parent,child){for(var i=0,len=properties.length;i < len;++i) {var property=properties[i];if(parent[property.name]){if(child[property.name]){ // check to see if we should merge
if(property.merge){var parentValue=parent[property.name];var childValue=child[property.name]; // complex objects; merge properties
if(typeof parentValue === 'object' && typeof childValue === 'object'){mergeValues(parentValue,childValue);} // simple objects; merge them together
else {child[property.name] = parentValue + childValue;}}}else { // just add the property
child[property.name] = parent[property.name];}}}}function mapItem(item,node){for(var i=0,len=item.children.length;i < len;++i) {var childItem=item.children[i];var array=node[childItem.name + '_asArray'];if(array){for(var v=0,len2=array.length;v < len2;++v) {var childNode=array[v];mapProperties(item.properties,node,childNode);mapItem(childItem,childNode);}}}}function run(source){if(source === null || typeof source !== 'object'){return source;}if('period' in mappers){var periodMapper=mappers.period;var periods=source.Period_asArray;for(var i=0,len=periods.length;i < len;++i) {var period=periods[i];mapItem(periodMapper,period);if('adaptationset' in mappers){var adaptationSets=period.AdaptationSet_asArray;if(adaptationSets){var adaptationSetMapper=mappers.adaptationset;for(var _i=0,_len=adaptationSets.length;_i < _len;++_i) {mapItem(adaptationSetMapper,adaptationSets[_i]);}}}}}return source;}return {run:run};}ObjectIron.__dashjs_factory_name = 'ObjectIron';var factory=_coreFactoryMaker2['default'].getClassFactory(ObjectIron);exports['default'] = factory;module.exports = exports['default'];
//# sourceMappingURL=objectiron.js.map
