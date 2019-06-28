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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _EventBus=require('./EventBus');var _EventBus2=_interopRequireDefault(_EventBus);var _eventsEvents=require('./events/Events');var _eventsEvents2=_interopRequireDefault(_eventsEvents);var _FactoryMaker=require('./FactoryMaker');var _FactoryMaker2=_interopRequireDefault(_FactoryMaker);var LOG_LEVEL_NONE=0;var LOG_LEVEL_FATAL=1;var LOG_LEVEL_ERROR=2;var LOG_LEVEL_WARNING=3;var LOG_LEVEL_INFO=4;var LOG_LEVEL_DEBUG=5; /**
 * @module Debug
 */function Debug(){var context=this.context;var eventBus=(0,_EventBus2['default'])(context).getInstance();var logFn=[];var instance=undefined,showLogTimestamp=undefined,showCalleeName=undefined,startTime=undefined,logLevel=undefined;function setup(){showLogTimestamp = true;showCalleeName = true;logLevel = LOG_LEVEL_WARNING;startTime = new Date().getTime();if(typeof window !== 'undefined' && window.console){logFn[LOG_LEVEL_FATAL] = getLogFn(window.console.error);logFn[LOG_LEVEL_ERROR] = getLogFn(window.console.error);logFn[LOG_LEVEL_WARNING] = getLogFn(window.console.warn);logFn[LOG_LEVEL_INFO] = getLogFn(window.console.info);logFn[LOG_LEVEL_DEBUG] = getLogFn(window.console.debug);}}function getLogFn(fn){if(fn && fn.bind){return fn.bind(window.console);} // if not define, return the default function for reporting logs
return window.console.log.bind(window.console);} /**
     * Retrieves a logger which can be used to write logging information in browser console.
     * @param {object} instance Object for which the logger is created. It is used
     * to include calle object information in log messages.
     * @memberof module:Debug
     * @returns {Logger}
     * @instance
     */function getLogger(instance){return {fatal:fatal.bind(instance),error:error.bind(instance),warn:warn.bind(instance),info:info.bind(instance),debug:debug.bind(instance)};} /**
     * Sets up the log level. The levels are cumulative. For example, if you set the log level
     * to dashjs.Debug.LOG_LEVEL_WARNING all warnings, errors and fatals will be logged. Possible values
     *
     * <ul>
     * <li>dashjs.Debug.LOG_LEVEL_NONE<br/>
     * No message is written in the browser console.
     *
     * <li>dashjs.Debug.LOG_LEVEL_FATAL<br/>
     * Log fatal errors. An error is considered fatal when it causes playback to fail completely.
     *
     * <li>dashjs.Debug.LOG_LEVEL_ERROR<br/>
     * Log error messages.
     *
     * <li>dashjs.Debug.LOG_LEVEL_WARNING<br/>
     * Log warning messages.
     *
     * <li>dashjs.Debug.LOG_LEVEL_INFO<br/>
     * Log info messages.
     *
     * <li>dashjs.Debug.LOG_LEVEL_DEBUG<br/>
     * Log debug messages.
     * </ul>
     * @param {number} value Log level
     * @default true
     * @memberof module:Debug
     * @instance
     */function setLogLevel(value){logLevel = value;} /**
     * Use this method to get the current log level.
     * @memberof module:Debug
     * @instance
     */function getLogLevel(){return logLevel;} /**
     * Prepends a timestamp in milliseconds to each log message.
     * @param {boolean} value Set to true if you want to see a timestamp in each log message.
     * @default LOG_LEVEL_WARNING
     * @memberof module:Debug
     * @instance
     */function setLogTimestampVisible(value){showLogTimestamp = value;} /**
     * Prepends the callee object name, and media type if available, to each log message.
     * @param {boolean} value Set to true if you want to see the callee object name and media type in each log message.
     * @default true
     * @memberof module:Debug
     * @instance
     */function setCalleeNameVisible(value){showCalleeName = value;} /**
     * Toggles logging to the browser's javascript console.  If you set to false you will still receive a log event with the same message.
     * @param {boolean} value Set to false if you want to turn off logging to the browser's console.
     * @default true
     * @memberof module:Debug
     * @instance
     * @deprecated
     */function setLogToBrowserConsole(value){ // Replicate functionality previous to log levels feature
if(value){logLevel = LOG_LEVEL_DEBUG;}else {logLevel = LOG_LEVEL_NONE;}} /**
     * Use this method to get the state of logToBrowserConsole.
     * @returns {boolean} The current value of logToBrowserConsole
     * @memberof module:Debug
     * @instance
     * @deprecated
     */function getLogToBrowserConsole(){return logLevel !== LOG_LEVEL_NONE;}function fatal(){for(var _len=arguments.length,params=Array(_len),_key=0;_key < _len;_key++) {params[_key] = arguments[_key];}doLog.apply(undefined,[LOG_LEVEL_FATAL,this].concat(params));}function error(){for(var _len2=arguments.length,params=Array(_len2),_key2=0;_key2 < _len2;_key2++) {params[_key2] = arguments[_key2];}doLog.apply(undefined,[LOG_LEVEL_ERROR,this].concat(params));}function warn(){for(var _len3=arguments.length,params=Array(_len3),_key3=0;_key3 < _len3;_key3++) {params[_key3] = arguments[_key3];}doLog.apply(undefined,[LOG_LEVEL_WARNING,this].concat(params));}function info(){for(var _len4=arguments.length,params=Array(_len4),_key4=0;_key4 < _len4;_key4++) {params[_key4] = arguments[_key4];}doLog.apply(undefined,[LOG_LEVEL_INFO,this].concat(params));}function debug(){for(var _len5=arguments.length,params=Array(_len5),_key5=0;_key5 < _len5;_key5++) {params[_key5] = arguments[_key5];}doLog.apply(undefined,[LOG_LEVEL_DEBUG,this].concat(params));}function doLog(level,_this){if(logLevel < level){return;}var message='';var logTime=null;if(showLogTimestamp){logTime = new Date().getTime();message += '[' + (logTime - startTime) + ']';}if(showCalleeName && _this && _this.getClassName){message += '[' + _this.getClassName() + ']';if(_this.getType){message += '[' + _this.getType() + ']';}}if(message.length > 0){message += ' ';}for(var _len6=arguments.length,params=Array(_len6 > 2?_len6 - 2:0),_key6=2;_key6 < _len6;_key6++) {params[_key6 - 2] = arguments[_key6];}Array.apply(null,params).forEach(function(item){message += item + ' ';});if(logFn[level]){logFn[level](message);} // TODO: To be removed
eventBus.trigger(_eventsEvents2['default'].LOG,{message:message});}instance = {getLogger:getLogger,setLogTimestampVisible:setLogTimestampVisible,setCalleeNameVisible:setCalleeNameVisible,setLogToBrowserConsole:setLogToBrowserConsole,getLogToBrowserConsole:getLogToBrowserConsole,setLogLevel:setLogLevel,getLogLevel:getLogLevel};setup();return instance;}Debug.__dashjs_factory_name = 'Debug';var factory=_FactoryMaker2['default'].getSingletonFactory(Debug);factory.LOG_LEVEL_NONE = LOG_LEVEL_NONE;factory.LOG_LEVEL_FATAL = LOG_LEVEL_FATAL;factory.LOG_LEVEL_ERROR = LOG_LEVEL_ERROR;factory.LOG_LEVEL_WARNING = LOG_LEVEL_WARNING;factory.LOG_LEVEL_INFO = LOG_LEVEL_INFO;factory.LOG_LEVEL_DEBUG = LOG_LEVEL_DEBUG;_FactoryMaker2['default'].updateSingletonFactory(Debug.__dashjs_factory_name,factory);exports['default'] = factory;module.exports = exports['default'];
//# sourceMappingURL=Debug.js.map
