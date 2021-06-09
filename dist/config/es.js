"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.esClient = exports.type = exports.index = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
exports.index = "products";
exports.type = "product";
exports.esClient = new elasticsearch_1.Client({
    cloud: {
        id: "commerce:dXMtd2VzdDEuZ2NwLmNsb3VkLmVzLmlvJGE1ZWRkMTBiY2NiODQwMWViYjI2NDEyNzczMWU3MDA2JDU2ZWI0YTIwNzFmMTQ2MTQ5OWUzZjcyZDMyNjE4MjQ2",
    },
    auth: {
        username: "magnus",
        password: "magnus92",
    },
});
//# sourceMappingURL=es.js.map