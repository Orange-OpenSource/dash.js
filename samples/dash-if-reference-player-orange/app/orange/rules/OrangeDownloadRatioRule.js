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

var OrangeDownloadRatioRule;

function OrangeDownloadRatioRuleClass() {

    let factory = dashjs.FactoryMaker;
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let MetricsModel = factory.getSingletonFactoryByName('MetricsModel');
    let DashMetrics = factory.getSingletonFactoryByName('DashMetrics');
    let DashManifestModel = factory.getSingletonFactoryByName('DashManifestModel');
    let Debug = factory.getSingletonFactoryByName('Debug');
    let OrangeConfig = factory.getSingletonFactoryByName('OrangeConfig');

    let context = this.context;
    let debug = Debug(context).getInstance();
    let config = OrangeConfig(context).getInstance();

    function getBytesLength(request) {
        return request.trace.reduce((a, b) => a + b.b[0], 0);
    }

    function getMaxIndex(rulesContext) {

        var mediaType = rulesContext.getMediaInfo().type;
        var current = rulesContext.getCurrentValue();

        let metricsModel = MetricsModel(context).getInstance();
        let dashMetrics = DashMetrics(context).getInstance();
        let dashManifest = DashManifestModel(context).getInstance();
        var metrics = metricsModel.getReadOnlyMetricsFor(mediaType);

        var requests = dashMetrics.getHttpRequests(metrics),
            lastRequest = null,
            currentRequest = null,
            downloadTime,
            totalTime,
            calculatedBandwidth,
            currentBandwidth,
            latencyInBandwidth,
            switchUpRatioSafetyFactor,
            currentRepresentation,
            count,
            bandwidths = [],
            i,
            q = SwitchRequest.NO_CHANGE,
            p = SwitchRequest.PRIORITY.DEFAULT,
            totalBytesLength = 0;

        latencyInBandwidth = config.getParamFor(mediaType, "ABR.latencyInBandwidth", "boolean", true);
        switchUpRatioSafetyFactor = config.getParamFor(mediaType, "ABR.switchUpRatioSafetyFactor", "number", 1.5);
        //debug.log("Checking download ratio rule...");
        debug.log("[OrangeRules][" + mediaType + "][DownloadRatioRule] Checking download ratio rule... (current = " + current + ")");

        if (!metrics) {
            debug.log("[OrangeRules][" + mediaType + "][DownloadRatioRule] No metrics, bailing.");
            return SwitchRequest(context).create();
        }

        // Get last valid request
        i = requests.length - 1;
        while (i >= 0 && lastRequest === null) {
            currentRequest = requests[i];
            if (currentRequest._tfinish && currentRequest.trequest && currentRequest.tresponse && currentRequest.trace && currentRequest.trace.length > 0) {
                lastRequest = requests[i];
            }
            i--;
        }

        if (lastRequest === null) {
            debug.log("[OrangeRules][" + mediaType + "][DownloadRatioRule] No valid requests made for this stream yet, bailing.");
            return SwitchRequest(context).create();
        }

        if(lastRequest.type !== 'MediaSegment' ) {
            debug.log("[OrangeRules][" + mediaType + "][DownloadRatioRule] Last request is not a media segment, bailing.");
            return SwitchRequest(context).create();
        }

        totalTime = (lastRequest._tfinish.getTime() - lastRequest.trequest.getTime()) / 1000;
        downloadTime = (lastRequest._tfinish.getTime() - lastRequest.tresponse.getTime()) / 1000;

        if (totalTime <= 0) {
            debug.log("[OrangeRules][" + mediaType + "][DownloadRatioRule] Don't know how long the download of the last fragment took, bailing.");
            return SwitchRequest(context).create();
        }

        totalBytesLength = getBytesLength(lastRequest);

        debug.log("[OrangeRules][" + mediaType + "][DownloadRatioRule] DL: " + Number(downloadTime.toFixed(3)) + "s, Total: " + Number(totalTime.toFixed(3)) + "s, Length: " + totalBytesLength);

        // Take average bandwidth over 3 requests
        count = 1;
        while (i >= 0 && count < 3) {
            currentRequest = requests[i];

            if (currentRequest.type !== 'MediaSegment' && currentRequest._tfinish && currentRequest.trequest && currentRequest.tresponse && currentRequest.trace && currentRequest.trace.length > 0) {

                var _totalTime = (currentRequest._tfinish.getTime() - currentRequest.trequest.getTime()) / 1000;
                var _downloadTime = (currentRequest._tfinish.getTime() - currentRequest.tresponse.getTime()) / 1000;
                debug.log("[OrangeRules][" + mediaType + "][DownloadRatioRule] DL: " + Number(_downloadTime.toFixed(3)) + "s, Total: " + Number(_totalTime.toFixed(3)) + "s, Length: " + getBytesLength(currentRequest));

                totalTime += _totalTime;
                downloadTime += _downloadTime;
                totalBytesLength += getBytesLength(currentRequest);
                count += 1;
            }
            i--;
        }

        // Set length in bits
        totalBytesLength *= 8;

        calculatedBandwidth = latencyInBandwidth ? (totalBytesLength / totalTime) : (totalBytesLength / downloadTime);

        debug.log("[OrangeRules][" + mediaType + "][DownloadRatioRule] BW = " + Math.round(calculatedBandwidth / 1000) + " kb/s");

        if (isNaN(calculatedBandwidth)) {
            return SwitchRequest(context).create();
        }

        count = rulesContext.getMediaInfo().representationCount;
        currentRepresentation = rulesContext.getTrackInfo();
        currentBandwidth = dashManifest.getBandwidth(currentRepresentation);
        for (i = 0; i < count; i += 1) {
            bandwidths.push(rulesContext.getMediaInfo().bitrateList[i].bandwidth);
        }
        if (calculatedBandwidth <= currentBandwidth) {
            for (i = current - 1; i > 0; i -= 1) {
                if (bandwidths[i] <= calculatedBandwidth) {
                    break;
                }
            }
            q = i;
            p = SwitchRequest.PRIORITY.WEAK;

            debug.log("[OrangeRules][" + mediaType + "][DownloadRatioRule] SwitchRequest: q=" + q + "/" + (count - 1) + " (" + bandwidths[q] + ")" + ", p=" + p);
            return SwitchRequest(context).create(q, {name : OrangeDownloadRatioRuleClass.__dashjs_factory_name},  p);
        } else {
            for (i = count - 1; i > current; i -= 1) {
                if (calculatedBandwidth > (bandwidths[i] * switchUpRatioSafetyFactor)) {
                    // debug.log("[OrangeRules][" + mediaType + "][DownloadRatioRule] bw = " + calculatedBandwidth + " results[i] * switchUpRatioSafetyFactor =" + (bandwidths[i] * switchUpRatioSafetyFactor) + " with i=" + i);
                    break;
                }
            }

            q = i;
            p = SwitchRequest.PRIORITY.STRONG;

            debug.log("[OrangeRules][" + mediaType + "][DownloadRatioRule] SwitchRequest: q=" + q + "/" + (count - 1) + " (" + bandwidths[q] + ")" + ", p=" + p);
            return SwitchRequest(context).create(q, {name : OrangeDownloadRatioRuleClass.__dashjs_factory_name},  p);
        }
    }

    const instance = {
        getMaxIndex: getMaxIndex
    };
    return instance;
}

OrangeDownloadRatioRuleClass.__dashjs_factory_name = 'OrangeDownloadRatioRule';
OrangeDownloadRatioRule = dashjs.FactoryMaker.getClassFactory(OrangeDownloadRatioRuleClass);
