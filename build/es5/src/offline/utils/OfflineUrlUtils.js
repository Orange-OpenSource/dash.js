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
 */import FactoryMaker from'../../core/FactoryMaker';import OfflineConstants from'../constants/OfflineConstants';import DefaultURLUtils from'./../../streaming/utils/DefaultURLUtils';/**
 * @module OfflineUrlUtils
 * @description Provides utility functions for operating on offline URLs.
 * Initially this is simply a method to determine the Base URL of a URL, but
 * should probably include other things provided all over the place such as
 * determining whether a URL is relative/absolute, resolving two paths etc.
 */function OfflineUrlUtils(){let defaultURLUtils;const context=this.context;function setup(){defaultURLUtils=DefaultURLUtils(context).getInstance();}function getRegex(){return OfflineConstants.OFFLINE_URL_REGEX;}/*
     * -------------------
     * DEFAULT BEHAVIOUR
     * -------------------
     */function parseBaseUrl(url){return defaultURLUtils.parseBaseUrl(url);}function parseOrigin(url){return defaultURLUtils.parseOrigin(url);}function parseScheme(url){return defaultURLUtils.parseScheme(url);}function isSchemeRelative(url){return defaultURLUtils.isSchemeRelative(url);}function isHTTPURL(url){return defaultURLUtils.isHTTPURL(url);}function isHTTPS(url){return defaultURLUtils.isHTTPS(url);}function isPathAbsolute(url){return defaultURLUtils.isPathAbsolute(url);}/*
     * -------------------
     * SPECIFIC BEHAVIOUR
     * -------------------
     */function removeHostname(url){return url.replace(/(^\w+:|^)\/\//,'');}function isRelative(){return false;}function resolve(url,baseUrl){if(baseUrl.charAt(baseUrl.length-1)%1===0){return baseUrl.substring(0,baseUrl.length-1)+url;}else{return baseUrl+url;}}setup();const instance={getRegex:getRegex,parseBaseUrl:parseBaseUrl,parseOrigin:parseOrigin,parseScheme:parseScheme,isRelative:isRelative,isPathAbsolute:isPathAbsolute,isSchemeRelative:isSchemeRelative,isHTTPURL:isHTTPURL,isHTTPS:isHTTPS,removeHostname:removeHostname,resolve:resolve};return instance;}OfflineUrlUtils.__dashjs_factory_name='OfflineUrlUtils';export default FactoryMaker.getSingletonFactory(OfflineUrlUtils);
//# sourceMappingURL=OfflineUrlUtils.js.map
