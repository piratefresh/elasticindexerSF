"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllByKey = void 0;
function findAllByKey(obj, keyToFind) {
    return Object.entries(obj).reduce((acc, [key, value]) => key === keyToFind
        ? acc.concat(value)
        : typeof value === "object"
            ? acc.concat(findAllByKey(value, keyToFind))
            : acc, []);
}
exports.findAllByKey = findAllByKey;
//# sourceMappingURL=findAllByKey.js.map