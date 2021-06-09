import { esClient } from "./config/es";
// import fs from "fs";
import "isomorphic-unfetch";
import { ApiResponse, RequestParams } from "@elastic/elasticsearch";

import { findAllByKey } from "./utils/findAllByKey";
import { createClient } from "@urql/core";

const client = createClient({
  url: "https://magnus-sf-hasura.herokuapp.com/v1/graphql",
});

export async function checkIndices(index: string) {
  const response = await esClient.indices.exists({ index });
  console.log(response.body);
  return response.body;
}

export async function createIndex(index: string) {
  try {
    const response = await esClient.indices.create({ index });
    console.log(`Created index ${index}`);

    return response.body;
  } catch (err) {
    console.error(`An error occurred while creating the index ${index}:`);
    console.error(err);

    return err;
  }
}

export function deleteIndex(index: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    // if (index === "_all") {
    //     reject("Can not delete all indices");
    // }
    esClient.indices.delete(
      {
        index: index,
      },
      (err, res) => {
        if (err) {
          reject(err.message);
        } else {
          console.log(res);
          resolve("Indexes have been deleted!");
        }
      }
    );
  });
}

export async function createMapping(index: string) {
  try {
    console.log("create mappings");
    const responseClose = await esClient.indices.close({ index });
    console.log("response close: ", responseClose);
    const responseSettings = await esClient.indices.putSettings({
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
    const responseOpen = await esClient.indices.open({ index });
    console.log("response close: ", responseOpen);
    console.log(responseSettings);
    const response = await esClient.indices.putMapping({
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
  } catch (err) {
    console.log(err.meta.body);
    return err;
  }
}

export interface IProduct {
  id: number;
  sfid: string;
  name: string;
  createddate: string;
  lastmodifieddate: string;
  tags__c: [string];
  product_image__c: string;
  productcode: string;
  description: string;
  pricebookentries: [IPriceBook];
  categories: ICategory;
  metadata__cs: [IMetadata];
  productspec__cs: [IProductSpec];
  productvariety__cs: [IProductVar];
  producttag__cs: [IProductType];
  producttypes2__cs: [
    {
      name: string;
    }
  ];
  account: {
    name: string;
  };
  product_review: ProductReview[];
  product_review_aggregate: {
    aggregate: {
      avg: {
        rating__c: number;
      };
    };
  };
}

interface ProductReview {
  name: string;
  sfid: string;
  id: number;
  description__c: string;
  createddate: string;
  contact: {
    name: string;
    id: number;
  };
}

interface ICategory {
  name: string;
  sfid?: string;
  parent_c: [IParent];
}

interface IParent {
  parent_c: [{ name: string }];
}

interface IPriceBook {
  id?: number;
  unitprice: number;
  sfid: string;
  pricebook2id: string;
}

interface IMetadata {
  name: string;
  value__c: string;
}
interface IProductSpec {
  name: string;
  value__c: string;
}
interface IProductVar {
  name: string;
  sfid: string;
  product: string;
}
interface IProductType {
  name: string;
}

type elasticProduct = {
  id: number;
  sfid: string;
  name: string;
  description: string;
  lastmodifeddate: string;
  createddate: string;
  category: {
    name: string;
    path?: string;
    parentCategories?: [{ name: string }];
  };
  metadata?: [{ name: string; value__c: string }];
  pricebookentries?: IPriceBook[];
  productimage: string;
  timestamp: number;
  productcode: string;
  productspec?: [{ name: string; value__c: string }];
  productvariety?: [{ name: string; sfid: string; product: string }];
  producttype: string[];
  tags?: string[];
  vendor: string;
  rating?: number;
};

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

// Init elasticsearch server
export async function insertData() {
  // initData();
  try {
    const { data } = await client.query(getProductQuery).toPromise();

    // parse JSON string to JSON object
    if (data) {
      //   const databases = await JSON.parse(data.salesforce_product2);
      let products: elasticProduct[] = [];
      // print all databases
      await data.salesforce_product2.forEach((db: IProduct) => {
        const values = findAllByKey(db.categories.parent_c, "name");
        const categories = `${values
          .reverse()
          .map((category: String) => category)
          .join(" > ")} > ${db.categories.name}`;
        console.log(
          `product ${db.categories.name} ${db.product_review_aggregate.aggregate.avg.rating__c}`
        );
        const priceEntries = db.pricebookentries.map((entry) => {
          return {
            id: entry.id,
            unitprice: entry.unitprice,
            sfid: entry.sfid,
            pricebook2id: entry.pricebook2id,
          };
        });
        let product: elasticProduct = {
          name: db.name,
          category: {
            name: `${db.categories.name}`,
            path: categories,
            parentCategories: values.map((category: String) => `${category}`),
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
          rating:
            db.product_review_aggregate.aggregate.avg.rating__c &&
            db.product_review_aggregate.aggregate.avg.rating__c,
        };

        console.log("vendor: ", product.producttype);

        products.push(product);
      });

      const body = await products.flatMap((doc: elasticProduct) => [
        { index: { _index: "products" } },
        doc,
      ]);

      const { body: bulkResponse } = await esClient.bulk({
        refresh: true,
        body,
      });

      if (bulkResponse.errors) {
        console.log(bulkResponse.errors);
        const erroredDocuments: any[] = [];
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action: any, i: number) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            erroredDocuments.push({
              // If the status is 429 it means that you can retry the document,
              // otherwise it's very likely a mapping error, and you should
              // fix the document before to try it again.
              status: action[operation].status,
              error: action[operation].error,
              operation: body[i * 2],
              document: body[i * 2 + 1],
            });
          }
        });
        console.log(erroredDocuments);
      }

      const params: RequestParams.Search = {
        index: "products",
        body: {
          query: {
            match_all: {},
          },
        },
      };

      const response: ApiResponse = await esClient.search(params);

      return response;
    }
  } catch (err) {
    console.log(`Error reading file from disk: ${err}`);
    return err;
  }
}
