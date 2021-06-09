"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv-safe/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const elasticSearch_1 = require("./elasticSearch");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    app.use(express_1.default.json());
    app.use(cors_1.default());
    app.post("/reindexElastic", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        const index = yield request.body.index;
        const exists = yield elasticSearch_1.checkIndices(index);
        if (exists) {
            console.log("Index does not exists");
            yield elasticSearch_1.deleteIndex(index);
        }
        const responseCreateIndex = yield elasticSearch_1.createIndex(index);
        if (responseCreateIndex) {
            yield elasticSearch_1.createMapping(index);
            const esResponse = yield elasticSearch_1.insertData();
            console.log("Es response: ", esResponse.body);
            response.status(200).send({ body: esResponse.body.hits });
        }
        response.send("Reindex did not work");
    }));
    app.listen(parseInt(process.env.PORT), () => {
        console.log(`server started on localhost:${process.env.PORT}`);
    });
});
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=server.js.map