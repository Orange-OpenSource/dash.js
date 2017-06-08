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

/*global dashjs*/

var OrangeDroppedFramesRule;

function OrangeDroppedFramesRuleClass() {

    let factory = dashjs.FactoryMaker;
    let context = this.context;

    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let OrangeConfig = factory.getSingletonFactoryByName('OrangeConfig');
    let Debug = factory.getSingletonFactoryByName('Debug');
    let debug = Debug(context).getInstance();
    let config = OrangeConfig(context).getInstance();

    function getMaxIndex(rulesContext) {

        var mediaType = rulesContext.getMediaInfo().type;

        var droppedFramesMaxRatio = config.getParamFor(mediaType, "ABR.droppedFramesMaxRatio", "number", 0.30),
            droppedFramesMinRatio = config.getParamFor(mediaType, "ABR.droppedFramesMinRatio", "number", 0.10),
            current = rulesContext.getCurrentValue(),
            q = SwitchRequest.NO_CHANGE,
            p = SwitchRequest.PRIORITY.DEFAULT,
            ratio;

        if (mediaType !== 'video') {
            return SwitchRequest(context).create();
        }

        // use dropped frames history
        let droppedFramesHistory = rulesContext.getDroppedFramesHistory();
        if (droppedFramesHistory) {
            let dfh = droppedFramesHistory.getFrameHistory();
            let droppedFrames = 0;
            let totalFrames = 0;
            for (let i = 1; i < dfh.length; i++) { //No point in measuring dropped frames for the zeroeth index.
                if (dfh[i]) {
                    droppedFrames = dfh[i].droppedVideoFrames;
                    totalFrames = dfh[i].totalVideoFrames;

                    ratio = droppedFrames / totalFrames;

                    debug.log("[OrangeRules][" + mediaType + "][OrangeDroppedFramesRule] DroppedFrames:" + droppedFrames + ", totalVideoFrames:" + totalFrames + " => ratio = " + ratio);

                    if (ratio > droppedFramesMaxRatio && current > 0) {
                        // If too much dropped frames, then switch to lower representation
                        q = current - 1;
                        p = SwitchRequest.PRIORITY.STRONG;
                    } else if (ratio > droppedFramesMinRatio) {
                        // Still some dropped frames, then stay at current quality
                        q = current;
                        p = SwitchRequest.PRIORITY.STRONG;
                    }
                }
            }

            debug.log("[OrangeRules][" + mediaType + "][OrangeDroppedFramesRule] SwitchRequest: q=" + q  + ", p=" + p );
            return SwitchRequest(context).create(q, {name:OrangeDroppedFramesRuleClass.__dashjs_factory_name, droppedFrames: droppedFrames}, p);
        }
        return SwitchRequest(context).create();
    }

    const instance = {
        getMaxIndex: getMaxIndex
    };
    return instance;
}

OrangeDroppedFramesRuleClass.__dashjs_factory_name = 'OrangeDroppedFramesRule';
OrangeDroppedFramesRule = dashjs.FactoryMaker.getClassFactory(OrangeDroppedFramesRuleClass);

