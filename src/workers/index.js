/* global postMessage:false */
import ObjectIron from '../../externals/objectiron';

import RepresentationBaseValuesMap from '../dash/parser/maps/RepresentationBaseValuesMap';
import SegmentValuesMap from '../dash/parser/maps/SegmentValuesMap';

const objectIron = new ObjectIron([
    new RepresentationBaseValuesMap(),
    new SegmentValuesMap()
]);

// onmessage = function (e) {
//     let manifest = e.data;
//
//     if (!manifest) {
//         throw new Error('parser error');
//     }
//
//     objectIron.run(manifest);
//
//     postMessage({ manifest: manifest });
// };

module.exports = function (self) {
    self.addEventListener('message', function (e) {
        let manifest = e.data;

        if (!manifest) {
            throw new Error('parser error');
        }

        objectIron.run(manifest);

        postMessage({ manifest: manifest });
    });
};
