import { Client } from "@elastic/elasticsearch";

export const index = "products";
export const type = "product";

export interface IProduct {
  _source: {
    id: number;
    sfid: string;
    name: string;
    tags__c: [string];
    product_image__c: string;
    description: string;
    pricebookentries: [IPriceBook];
    category2: ICategory;
  };
}

interface ICategory {
  name: string;
  parentCategory?: [ICategory];
}

interface IPriceBook {
  id: number;
  unitprice: number;
}

export const esClient = new Client({
  cloud: {
    id: "commerce:dXMtd2VzdDEuZ2NwLmNsb3VkLmVzLmlvJGE1ZWRkMTBiY2NiODQwMWViYjI2NDEyNzczMWU3MDA2JDU2ZWI0YTIwNzFmMTQ2MTQ5OWUzZjcyZDMyNjE4MjQ2",
  },
  auth: {
    username: "magnus",
    password: "magnus92",
  },
});

/**
 * @function createIndex
 * @returns {void}
 * @description Creates an index in ElasticSearch.
 */

// async function createIndex(index: string) {
//   try {
//     await esClient.indices.create({ index });
//     console.log(`Created index ${index}`);
//   } catch (err) {
//     console.error(`An error occurred while creating the index ${index}:`);
//     console.error(err);
//   }
// }

// async function setPostMapping() {
//   try {
//     await esClient.indices.putMapping({
//       index,
//       type,
//       include_type_name: true,
//       body: {
//         properties: {
//           sfid: {
//             type: "text",
//           },
//           name: {
//             type: "text",
//             analyzer: "whitespace",
//           },
//           lastmodifieddate: {
//             type: "text",
//           },
//           createddate: {
//             type: "date",
//           },
//           description: {
//             type: "text",
//             analyzer: "whitespace",
//           },
//           metadata__cs: {
//             type: "text",
//           },
//           pricebookentries: {
//             properties: {
//               id: {
//                 type: "number",
//               },
//               unitprice: {
//                 type: "number",
//               },
//             },
//           },
//           product_image__c: {
//             type: "text",
//           },
//           productcode: {
//             type: "text",
//           },
//           tags__c: {
//             type: "text",
//           },
//           productspec__cs: {
//             type: "text",
//           },
//           productvariety__cs: {
//             type: "text",
//           },
//           producttag__cs: {
//             properties: {
//               name: "text",
//             },
//           },
//         },
//       },
//     });

//     console.log("Post mapping created successfully");
//   } catch (err) {
//     console.error("An error occurred while setting the Post mapping:");
//     console.error(err);
//   }
// }
