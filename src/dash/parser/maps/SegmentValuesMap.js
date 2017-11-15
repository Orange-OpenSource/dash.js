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
/**
 * @classdesc a SegmentValuesMap type for input to objectiron
 */
import MapNode from './MapNode';
import DashConstants from '../../constants/DashConstants';

/*
 * As described in chapter 5.3.9.1, Representations are assigned Segment
 * Information through the presence of the elements BaseURL, SegmentBase,
 * SegmentTemplate and/or SegmentList.
 *
 * The elements SegmentBase, SegmentTemplate and SegmentList may be present in
 * the Representation element itself. In addition, to expresse default values,
 * they may be present in the Period and AdaptationSet element. At each level at
 * mot one of the three, SegmentBase, SegmentTemplate and SegmentList shall be
 * present. Further, if SegmentTemplate or SegmentList is present on one level
 * of the hierarchy, then the other one shall not be present on any lower
 * hierarchy level.
 *
 * SegmentBase, SegmentTemplate and SegmentList shall inherit attributes and
 * elements from the same element on a higher level. If the same attribute or
 * element is present on both levels, the one on the lower level shall take
 * precedence over the one on the higher level.
 *
 * As the Period element is a parent of the AdaptationSet element, which is
 * itself a parent of the Representation element, this class is used by the
 * ObjectIron class to map SegmentBase, SegmentTemplate and/or SegmetnList
 * elements of the parent element to the children elements recursively.
 */
class SegmentValuesMap extends MapNode {
    constructor() {
        const commonProperties = [
            DashConstants.SEGMENT_BASE, DashConstants.SEGMENT_TEMPLATE, DashConstants.SEGMENT_LIST
        ];

        super(DashConstants.PERIOD, commonProperties, [
            new MapNode(DashConstants.ADAPTATION_SET, commonProperties, [
                new MapNode(DashConstants.REPRESENTATION, commonProperties)
            ])
        ]);
    }
}

export default SegmentValuesMap;
