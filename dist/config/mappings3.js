"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapping = void 0;
exports.mapping = {
    mappings: {
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
};
//# sourceMappingURL=mappings3.js.map