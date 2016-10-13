/*
 * The copyright in this software module is being made available under the BSD License, included below. This software module may be subject to other third party and/or contributor rights, including patent rights, and no such rights are granted under this license.
 * The whole software resulting from the execution of this software module together with its external dependent software modules from dash.js project may be subject to Orange and/or other third party rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2014, Orange
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * •  Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * •  Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * •  Neither the name of the Orange nor the names of its contributors may be used to endorse or promote products derived from this software module without specific prior written permission.
 *
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import BASE64 from '../../externals/base64';
import FactoryMaker from '../core/FactoryMaker';

function VoWvPssh() {

    function createVOWidevinePssh(KID, debug) {
        let pssh = new Uint8Array([
                0xFF, 0xFF, 0xFF, 0xFF, // Box length
                0x70, 0x73, 0x73, 0x68, // Box type = 'pssh'
                0x00, // Version = 0
                0x00, 0x00, 0x00, // Flags = 0
                0xed, 0xef, 0x8b, 0xa9, // SystemID = Widevine system ID = 'edef8ba9-79d6-4ace-a3c8-27dcd51d21ed'
                0x79, 0xd6, 0x4a, 0xce,
                0xa3, 0xc8, 0x27, 0xdc,
                0xd5, 0x1d, 0x21, 0xed,
                0xFF, 0xFF, 0xFF, 0xFF, // Data string length
                0x08, // Encrypting algorithm flag
                0x01, // Encrypting algorithm = 1 (AES-CTR)
                0x12, // KID flag
                0x10, // KID length
                0xFF, 0xFF, 0xFF, 0xFF, // KID = KID from protection header
                0xFF, 0xFF, 0xFF, 0xFF,
                0xFF, 0xFF, 0xFF, 0xFF,
                0xFF, 0xFF, 0xFF, 0xFF,
                0x1a, // Signer/provider flag
                0x0c, // Signer/provider length
                0x76, 0x69, 0x61, 0x63, // Signer/provider = 'viaccessorca'
                0x63, 0x65, 0x73, 0x73,
                0x6f, 0x72, 0x63, 0x61,
                /*0x22,                   // ContentID flag
                0x18,                   // ContentID length
                0xFF, 0xFF, 0xFF, 0xFF, // ContentID = ?
                0xFF, 0xFF, 0xFF, 0xFF,
                0xFF, 0xFF, 0xFF, 0xFF,
                0xFF, 0xFF, 0xFF, 0xFF,
                0xFF, 0xFF, 0xFF, 0xFF,
                0xFF, 0xFF, 0xFF, 0xFF,*/
                0x2a, // Content type flag
                0x02, // Content type length
                0x53, 0x44 // Content type = 'SD'
                /*0x32,                   // Policy flag
                0x00                    // Policy length*/
            ]);
        let length = pssh.length;
        let dataLength = length - 32;
        let str = '';
        let i = 0;

        // Update box length value
        pssh[0] = (length & 0xFF000000) >> 32;
        pssh[1] = (length & 0x00FF0000) >> 16;
        pssh[2] = (length & 0x0000FF00) >> 8;
        pssh[3] = (length & 0x000000FF);

        // Update data string length value
        pssh[28] = (dataLength & 0xFF000000) >> 32;
        pssh[29] = (dataLength & 0x00FF0000) >> 16;
        pssh[30] = (dataLength & 0x0000FF00) >> 8;
        pssh[31] = (dataLength & 0x000000FF);

        // Set KID
        pssh.set(KID, 36);

        if (debug) {
            str = '';
            for (i = 0; i < pssh.length; i++) {
                str += '\\0x' + pssh[i].toString(16);
            }
            debug.log('[VoWvPssh] ' + str);
        }

        pssh = String.fromCharCode.apply(null, pssh);

        if (debug) {
            debug.log('[VoWvPssh] ' + pssh);
        }

        // Encode in Base 64
        pssh = BASE64.encodeASCII(pssh);

        if (debug) {
            debug.log('[VoWvPssh] ' + pssh);
        }

        return pssh;
    }

    const instance = {
        createVOWidevinePssh: createVOWidevinePssh
    };

    return instance;
}

VoWvPssh.__dashjs_factory_name = 'VoWvPssh';
export default FactoryMaker.getSingletonFactory(VoWvPssh);