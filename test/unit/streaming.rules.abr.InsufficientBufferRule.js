import InsufficientBufferRule from '../../src/streaming/rules/abr/InsufficientBufferRule';
import SwitchRequest from '../../src/streaming/rules/SwitchRequest';
import EventBus from '../../src/core/EventBus.js';
import Events from '../../src/core/events/Events';
import DashMetricsMock from './mocks/DashMetricsMock';

const expect = require('chai').expect;

const context = {};
let insufficientBufferRule;
const eventBus = EventBus(context).getInstance();

describe('InsufficientBufferRule', function () {
    beforeEach(function () {
        insufficientBufferRule = InsufficientBufferRule(context).create({});
    });

    it('should return an empty switchRequest when getMaxIndex function is called with an empty parameter', function () {
        const maxIndexRequest = insufficientBufferRule.getMaxIndex();

        expect(maxIndexRequest.quality).to.be.equal(SwitchRequest.NO_CHANGE);  // jshint ignore:line
    });

    it('should return an empty switchRequest when getMaxIndex function is called with an malformed parameter', function () {
        const maxIndexRequest = insufficientBufferRule.getMaxIndex({});

        expect(maxIndexRequest.quality).to.be.equal(SwitchRequest.NO_CHANGE);  // jshint ignore:line
    });

    it('should throw an exception when attempting to call getMaxIndex While the config attribute has not been set properly', function () {
        expect(insufficientBufferRule.getMaxIndex.bind(insufficientBufferRule, {getMediaType: {}})).to.throw('Missing config parameter(s)');
    });

    it('should return an empty switch request when bufferState is empty', function () {
        const dashMetricsMock = new DashMetricsMock();
        const metricsModelMockWithEmptyBufferState = {
            getReadOnlyMetricsFor: function () {
                return {
                    BufferState: []
                };
            }
        };
        const rulesContextMock = {
            getMediaInfo: function () {},
            getMediaType: function () { return 'video'; },
            getAbrController: function () {},
            getRepresentationInfo: function () { return { fragmentDuration: 4 };}
        };
        const rule = InsufficientBufferRule(context).create({
            metricsModel: metricsModelMockWithEmptyBufferState,
            dashMetrics: dashMetricsMock
        });

        const maxIndexRequest = rule.getMaxIndex(rulesContextMock);
        expect(maxIndexRequest.quality).to.be.equal(SwitchRequest.NO_CHANGE);
    });

    it('should return an empty switch request when first call is done with a buffer in state bufferStalled', function () {
        const dashMetricsMock = new DashMetricsMock();
        const metricsModelMockWithBufferState = {
            getReadOnlyMetricsFor: function () {
                return {
                    BufferState: [{ state: 'bufferStalled' }]
                };
            }
        };
        const rulesContextMock = {
            getMediaInfo: function () {},
            getMediaType: function () { return 'video'; },
            getAbrController: function () {},
            getRepresentationInfo: function () { return { fragmentDuration: 4 };}
        };
        const rule = InsufficientBufferRule(context).create({
            metricsModel: metricsModelMockWithBufferState,
            dashMetrics: dashMetricsMock
        });

        let maxIndexRequest = rule.getMaxIndex(rulesContextMock);
        expect(maxIndexRequest.quality).to.be.equal(SwitchRequest.NO_CHANGE);
    });

    it('should return an empty switch request with a buffer in state bufferLoaded and fragmentDuration is NaN', function () {
        const dashMetricsMock = new DashMetricsMock();
        const metricsModelMockWithBufferState = {
            getReadOnlyMetricsFor: function () {
                return {
                    BufferState: [{ state: 'bufferLoaded' }]
                };
            }
        };
        const rulesContextMock = {
            getMediaInfo: function () {},
            getMediaType: function () { return 'video'; },
            getAbrController: function () {},
            getRepresentationInfo: function () { return { fragmentDuration: NaN };}
        };
        const rule = InsufficientBufferRule(context).create({
            metricsModel: metricsModelMockWithBufferState,
            dashMetrics: dashMetricsMock
        });

        const maxIndexRequest = rule.getMaxIndex(rulesContextMock);
        expect(maxIndexRequest.quality).to.be.equal(SwitchRequest.NO_CHANGE);
    });

    it('should return index 0 after two fragments appended with a buffer in state bufferLoaded and fragmentDuration is NaN and then bufferStalled with fragmentDuration > 0', function () {
        let bufferState = {
            state: 'bufferLoaded'
        };
        let representationInfo = { fragmentDuration: NaN };
        const dashMetricsMock = new DashMetricsMock();
        const metricsModelMockBuffer = {
            getReadOnlyMetricsFor: function () {
                return {
                    BufferState: [bufferState]
                };
            }
        };
        const rulesContextMock = {
            getMediaInfo: function () {},
            getMediaType: function () { return 'video'; },
            getAbrController: function () {},
            getRepresentationInfo: function () { return representationInfo;}
        };

        const rule = InsufficientBufferRule(context).create({
            metricsModel: metricsModelMockBuffer,
            dashMetrics: dashMetricsMock
        });

        let e = { mediaType: 'video', startTime: 0 };
        eventBus.trigger(Events.BYTES_APPENDED_END_FRAGMENT, e);

        e = { mediaType: 'video', startTime: 4 };//Event objects can't be reused because they get annotated by eventBus.
        eventBus.trigger(Events.BYTES_APPENDED_END_FRAGMENT, e);

        bufferState.state = 'bufferStalled';
        representationInfo.fragmentDuration = 4;
        const maxIndexRequest = rule.getMaxIndex(rulesContextMock);
        expect(maxIndexRequest.quality).to.be.equal(0);
    });

    it('should return index -1 for zero and one fragments appended after a seek, then index 0 afterwards when bufferStalled', function () {
        const bufferState = {
            state: 'bufferStalled'
        };
        const representationInfo = { fragmentDuration: 4 };
        const dashMetricsMock = new DashMetricsMock();
        const metricsModelMockBuffer = {
            getReadOnlyMetricsFor: function () {
                return {
                    BufferState: [bufferState]
                };
            }
        };
        const rulesContextMock = {
            getMediaInfo: function () {},
            getMediaType: function () { return 'video'; },
            getAbrController: function () {},
            getRepresentationInfo: function () { return representationInfo;}
        };

        const rule = InsufficientBufferRule(context).create({
            metricsModel: metricsModelMockBuffer,
            dashMetrics: dashMetricsMock
        });

        let maxIndexRequest = rule.getMaxIndex(rulesContextMock);
        expect(maxIndexRequest.quality).to.be.equal(-1);

        let e = { mediaType: 'video', startTime: 0 };
        eventBus.trigger(Events.BYTES_APPENDED_END_FRAGMENT, e);
        maxIndexRequest = rule.getMaxIndex(rulesContextMock);
        expect(maxIndexRequest.quality).to.be.equal(-1);

        e = { mediaType: 'video', startTime: 4 };
        eventBus.trigger(Events.BYTES_APPENDED_END_FRAGMENT, e);
        maxIndexRequest = rule.getMaxIndex(rulesContextMock);
        expect(maxIndexRequest.quality).to.be.equal(0);
    });
});
