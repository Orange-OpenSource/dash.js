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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _get=function get(_x,_x2,_x3){var _again=true;_function: while(_again) {var object=_x,property=_x2,receiver=_x3;_again = false;if(object === null)object = Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc === undefined){var parent=Object.getPrototypeOf(object);if(parent === null){return undefined;}else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}}else if('value' in desc){return desc.value;}else {var getter=desc.get;if(getter === undefined){return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}var _coreEventsEventsBase=require('../../core/events/EventsBase');var _coreEventsEventsBase2=_interopRequireDefault(_coreEventsEventsBase); /**
 * @class
 *
 */var ProtectionEvents=(function(_EventsBase){_inherits(ProtectionEvents,_EventsBase); /**
     * @description Public facing external events to be used when including protection package.
     * All public events will be aggregated into the MediaPlayerEvents Class and can be accessed
     * via MediaPlayer.events.  public_ is the prefix that we use to move event names to MediaPlayerEvents.
     */function ProtectionEvents(){_classCallCheck(this,ProtectionEvents);_get(Object.getPrototypeOf(ProtectionEvents.prototype),'constructor',this).call(this); /**
         * Event ID for events delivered when the protection set receives
         * a key message from the CDM
         *
         * @ignore
         */this.INTERNAL_KEY_MESSAGE = 'internalKeyMessage'; /**
         * Event ID for events delivered when a key system selection procedure
         * completes
         * @ignore
         */this.INTERNAL_KEY_SYSTEM_SELECTED = 'internalKeySystemSelected'; /**
         * Event ID for events delivered when the status of one decryption keys has changed
         * @ignore
         */this.INTERNAL_KEY_STATUS_CHANGED = 'internalkeyStatusChanged'; /**
         * Event ID for events delivered when a new key has been added
         *
         * @constant
         * @deprecated The latest versions of the EME specification no longer
         * use this event.  {@MediaPlayer.models.protectionModel.eventList.KEY_STATUSES_CHANGED}
         * is preferred.
         * @event ProtectionEvents#KEY_ADDED
         */this.KEY_ADDED = 'public_keyAdded'; /**
         * Event ID for events delivered when an error is encountered by the CDM
         * while processing a license server response message
         * @event ProtectionEvents#KEY_ERROR
         */this.KEY_ERROR = 'public_keyError'; /**
         * Event ID for events delivered when the protection set receives
         * a key message from the CDM
         * @event ProtectionEvents#KEY_MESSAGE
         */this.KEY_MESSAGE = 'public_keyMessage'; /**
         * Event ID for events delivered when a key session close
         * process has completed
         * @event ProtectionEvents#KEY_SESSION_CLOSED
         */this.KEY_SESSION_CLOSED = 'public_keySessionClosed'; /**
         * Event ID for events delivered when a new key sessions creation
         * process has completed
         * @event ProtectionEvents#KEY_SESSION_CREATED
         */this.KEY_SESSION_CREATED = 'public_keySessionCreated'; /**
         * Event ID for events delivered when a key session removal
         * process has completed
         * @event ProtectionEvents#KEY_SESSION_REMOVED
         */this.KEY_SESSION_REMOVED = 'public_keySessionRemoved'; /**
         * Event ID for events delivered when the status of one or more
         * decryption keys has changed
         * @event ProtectionEvents#KEY_STATUSES_CHANGED
         */this.KEY_STATUSES_CHANGED = 'public_keyStatusesChanged'; /**
         * Event ID for events delivered when a key system access procedure
         * has completed
         * @ignore
         */this.KEY_SYSTEM_ACCESS_COMPLETE = 'public_keySystemAccessComplete'; /**
         * Event ID for events delivered when a key system selection procedure
         * completes
         * @event ProtectionEvents#KEY_SYSTEM_SELECTED
         */this.KEY_SYSTEM_SELECTED = 'public_keySystemSelected'; /**
         * Event ID for events delivered when a license request procedure
         * has completed
         * @event ProtectionEvents#LICENSE_REQUEST_COMPLETE
         */this.LICENSE_REQUEST_COMPLETE = 'public_licenseRequestComplete'; /**
         * Event ID for needkey/encrypted events
         * @ignore
         */this.NEED_KEY = 'needkey'; /**
         * Event ID for events delivered when the Protection system is detected and created.
         * @event ProtectionEvents#PROTECTION_CREATED
         */this.PROTECTION_CREATED = 'public_protectioncreated'; /**
         * Event ID for events delivered when the Protection system is destroyed.
         * @event ProtectionEvents#PROTECTION_DESTROYED
         */this.PROTECTION_DESTROYED = 'public_protectiondestroyed'; /**
         * Event ID for events delivered when a new server certificate has
         * been delivered to the CDM
         * @ignore
         */this.SERVER_CERTIFICATE_UPDATED = 'serverCertificateUpdated'; /**
         * Event ID for events delivered when the process of shutting down
         * a protection set has completed
         * @ignore
         */this.TEARDOWN_COMPLETE = 'protectionTeardownComplete'; /**
         * Event ID for events delivered when a HTMLMediaElement has been
         * associated with the protection set
         * @ignore
         */this.VIDEO_ELEMENT_SELECTED = 'videoElementSelected';}return ProtectionEvents;})(_coreEventsEventsBase2['default']);var protectionEvents=new ProtectionEvents();exports['default'] = protectionEvents;module.exports = exports['default'];
//# sourceMappingURL=ProtectionEvents.js.map
