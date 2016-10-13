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
 */

import FactoryMaker from '../core/FactoryMaker';
import Debug from '../core/Debug';
import DashParser from '../dash/parser/DashParser';
import MssParser from '../mss/MssParser';
import ErrorHandler from '../streaming/utils/ErrorHandler';

function Parser( /*config*/ ) {

    const context = this.context;
    const log = Debug(context).getInstance().log;
    const errorHandler = ErrorHandler(context).getInstance();

    let _parser,
        instance;

    function setup() {}

    function reset() {
        _parser = undefined;
    }

    function parse(data, xlinkController) {
        log('[Parser]', 'Select proper parser');
        if (_parser === undefined) {
            // we parse the response of the request to know the manifest type
            if (data.indexOf('SmoothStreamingMedia') > -1) {
                //do some business to transform it into a Dash Manifest
                _parser = MssParser(context).create();
            }
            /* else if (data.indexOf("#EXTM3U") > -1) {
                        }*/
            else if (data.indexOf('MPD') > -1) {
                _parser = DashParser(context).create();
            } else {
                errorHandler.manifestError('manifest type unknown', 'parse', data);
                return null;
            }
        }

        return _parser.parse(data, xlinkController);
    }

    instance = {
        parse: parse,
        reset: reset
    };

    setup();

    return instance;
}

Parser.__dashjs_factory_name = 'Parser';
export default FactoryMaker.getClassFactory(Parser);