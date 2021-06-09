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
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertData = exports.createMapping = exports.deleteIndex = exports.createIndex = exports.checkIndices = void 0;
const es_1 = require("./config/es");
require("isomorphic-unfetch");
const findAllByKey_1 = require("./utils/findAllByKey");
const core_1 = require("@urql/core");
const client = core_1.createClient({
    url: "https://magnus-sf-hasura.herokuapp.com/v1/graphql",
});
function checkIndices(index) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield es_1.esClient.indices.exists({ index });
        console.log(response.body);
        return response.body;
    });
}
exports.checkIndices = checkIndices;
function createIndex(index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield es_1.esClient.indices.create({ index });
            console.log(`Created index ${index}`);
            return response.body;
        }
        catch (err) {
            console.error(`An error occurred while creating the index ${index}:`);
            console.error(err);
            return err;
        }
    });
}
exports.createIndex = createIndex;
function deleteIndex(index) {
    return new Promise((resolve, reject) => {
        es_1.esClient.indices.delete({
            index: index,
        }, (err, res) => {
            if (err) {
                reject(err.message);
            }
            else {
                console.log(res);
                resolve("Indexes have been deleted!");
            }
        });
    });
}
exports.deleteIndex = deleteIndex;
function createMapping(index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("create mappings");
            const responseClose = yield es_1.esClient.indices.close({ index });
            console.log("response close: ", responseClose);
            const responseSettings = yield es_1.esClient.indices.putSettings({
                index,
                body: {
                    settings: {
                        analysis: {
                            tokenizer: {
                                breadcrumb_path_hierarchy: {
                                    type: "path_hierarchy",
                                    delimiter: ">",
                                },
                            },
                            analyzer: {
                                breadcrumb: {
                                    type: "custom",
                                    tokenizer: "breadcrumb_path_hierarchy",
                                    filter: ["trim"],
                                },
                                my_analyzer: {
                                    type: "custom",
                                    filter: ["lowercase", "my_stemmer"],
                                    tokenizer: "whitespace",
                                },
                            },
                            filter: {
                                my_stemmer: {
                                    type: "stemmer",
                                    name: "english",
                                },
                            },
                            normalizer: {
                                lowercase_normalizer: {
                                    filter: ["lowercase"],
                                    type: "custom",
                                },
                            },
                        },
                    },
                },
            });
            const responseOpen = yield es_1.esClient.indices.open({ index });
            console.log("response close: ", responseOpen);
            console.log(responseSettings);
            const response = yield es_1.esClient.indices.putMapping({
                index,
                body: {
                    properties: {
                        sfid: {
                            type: "text",
                        },
                        name: {
                            type: "keyword",
                            ignore_above: 256,
                            normalizer: "lowercase_normalizer",
                            fields: {
                                searchable: {
                                    type: "search_as_you_type",
                                    analyzer: "my_analyzer",
                                },
                            },
                        },
                        lastmodifieddate: {
                            type: "date",
                        },
                        category: {
                            properties: {
                                name: {
                                    type: "keyword",
                                },
                                path: {
                                    type: "text",
                                    analyzer: "breadcrumb",
                                },
                                parentCategories: {
                                    type: "keyword",
                                },
                            },
                        },
                        createddate: {
                            type: "date",
                        },
                        description: {
                            type: "text",
                            analyzer: "my_analyzer",
                        },
                        metadata: {
                            properties: {
                                id: {
                                    type: "long",
                                },
                                name: {
                                    type: "text",
                                    fields: {
                                        keyword: {
                                            type: "keyword",
                                            ignore_above: 256,
                                        },
                                    },
                                },
                                value__c: {
                                    type: "text",
                                    fields: {
                                        keyword: {
                                            type: "keyword",
                                            ignore_above: 256,
                                        },
                                    },
                                },
                            },
                        },
                        pricebookentries: {
                            properties: {
                                id: {
                                    type: "long",
                                },
                                unitprice: {
                                    type: "scaled_float",
                                    scaling_factor: 100,
                                },
                            },
                        },
                        productimage: {
                            type: "text",
                        },
                        productcode: {
                            type: "keyword",
                        },
                        productspec: {
                            properties: {
                                name: {
                                    type: "text",
                                    fields: {
                                        keyword: {
                                            type: "keyword",
                                            ignore_above: 256,
                                        },
                                    },
                                },
                                value__c: {
                                    type: "text",
                                    fields: {
                                        keyword: {
                                            type: "keyword",
                                            ignore_above: 256,
                                        },
                                    },
                                },
                            },
                        },
                        productvariety: {
                            properties: {
                                name: {
                                    type: "text",
                                    fields: {
                                        keyword: {
                                            type: "keyword",
                                            ignore_above: 256,
                                        },
                                    },
                                },
                            },
                        },
                        producttype: {
                            type: "text",
                            fields: {
                                keyword: {
                                    type: "keyword",
                                    ignore_above: 256,
                                },
                            },
                        },
                        producttag__cs: {
                            properties: {
                                name: {
                                    type: "keyword",
                                },
                            },
                        },
                        tags: {
                            type: "text",
                            analyzer: "my_analyzer",
                            fields: {
                                keyword: {
                                    type: "keyword",
                                    ignore_above: 256,
                                },
                            },
                        },
                        vendor: {
                            type: "keyword",
                        },
                        timestamp: {
                            type: "date",
                        },
                    },
                },
            });
            console.log("RESPONSE MAPPING: ", response);
            return response.body;
        }
        catch (err) {
            console.log(err.meta.body);
            return err;
        }
    });
}
exports.createMapping = createMapping;
const productFragment = `
fragment parentCategories on salesforce_product2 {
  categories {
    id
    name
    parent_c {
      id
      name
      parent_c {
        name
        id
        parent_c {
          name
          id
          parent_c {
            id
            name
          }
        }
      }
    }
  }
}
`;
const getProductQuery = `
${productFragment}
query GetProductsElastic {
  salesforce_product2 {
    name
    createddate
    description
    id
    lastmodifieddate
    metadata__cs {
      name
      value__c
      id
    }
    pricebookentries {
      unitprice
      id
      sfid
    }
    ...parentCategories
    product_image__c
    productcode
    sfid
    tags__c
    productvariety__cs {
      id
      sfid
      product__c
    }
    producttag__cs {
      name
    }
    productspec__cs {
      name
      value__c
    }
    producttypes2__cs {
      name
    }
    account {
      name
    }
    product_review {
      rating__c
      sfid
      id
      description__c
      createddate
      name
      contact {
        id
        name
        sfid
      }
    }
  product_review_aggregate {
			aggregate {
        avg {
          rating__c
        }
      }
    }
  }
}
`;
function insertData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = yield client.query(getProductQuery).toPromise();
            if (data) {
                let products = [];
                yield data.salesforce_product2.forEach((db) => {
                    const values = findAllByKey_1.findAllByKey(db.categories.parent_c, "name");
                    const categories = `${values
                        .reverse()
                        .map((category) => category)
                        .join(" > ")} > ${db.categories.name}`;
                    console.log(`product ${db.categories.name} ${db.product_review_aggregate.aggregate.avg.rating__c}`);
                    const priceEntries = db.pricebookentries.map((entry) => {
                        return {
                            id: entry.id,
                            unitprice: entry.unitprice,
                            sfid: entry.sfid,
                            pricebook2id: entry.pricebook2id,
                        };
                    });
                    let product = {
                        name: db.name,
                        category: {
                            name: `${db.categories.name}`,
                            path: categories,
                            parentCategories: values.map((category) => `${category}`),
                        },
                        createddate: db.createddate,
                        lastmodifeddate: db.lastmodifieddate,
                        timestamp: Math.floor(Date.now() / 1000),
                        description: db.description,
                        metadata: db.metadata__cs,
                        productcode: db.productcode,
                        productspec: db.productspec__cs,
                        productvariety: db.productvariety__cs,
                        productimage: db.product_image__c,
                        pricebookentries: priceEntries,
                        sfid: db.sfid,
                        tags: db.producttag__cs.map((tag) => tag.name),
                        producttype: db.producttypes2__cs.map((type) => type.name),
                        id: db.id,
                        vendor: db.account && db.account.name !== null ? db.account.name : "",
                        rating: db.product_review_aggregate.aggregate.avg.rating__c &&
                            db.product_review_aggregate.aggregate.avg.rating__c,
                    };
                    console.log("vendor: ", product.producttype);
                    products.push(product);
                });
                const body = yield products.flatMap((doc) => [
                    { index: { _index: "products" } },
                    doc,
                ]);
                const { body: bulkResponse } = yield es_1.esClient.bulk({
                    refresh: true,
                    body,
                });
                if (bulkResponse.errors) {
                    console.log(bulkResponse.errors);
                    const erroredDocuments = [];
                    bulkResponse.items.forEach((action, i) => {
                        const operation = Object.keys(action)[0];
                        if (action[operation].error) {
                            erroredDocuments.push({
                                status: action[operation].status,
                                error: action[operation].error,
                                operation: body[i * 2],
                                document: body[i * 2 + 1],
                            });
                        }
                    });
                    console.log(erroredDocuments);
                }
                const params = {
                    index: "products",
                    body: {
                        query: {
                            match_all: {},
                        },
                    },
                };
                const response = yield es_1.esClient.search(params);
                return response;
            }
        }
        catch (err) {
            console.log(`Error reading file from disk: ${err}`);
            return err;
        }
    });
}
exports.insertData = insertData;
//# sourceMappingURL=elasticSearch.js.map