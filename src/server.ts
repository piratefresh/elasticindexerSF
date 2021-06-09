import "dotenv-safe/config";
import express from "express";
import cors from "cors";
import {
  createMapping,
  deleteIndex,
  insertData,
  checkIndices,
  createIndex,
} from "./elasticSearch";

const main = async () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.post("/reindexElastic", async (request, response) => {
    const index = await request.body.index;
    const exists = await checkIndices(index);
    if (exists) {
      console.log("Index does not exists");
      await deleteIndex(index);
    }

    const responseCreateIndex = await createIndex(index);
    if (responseCreateIndex) {
      await createMapping(index);
      const esResponse = await insertData();
      console.log("Es response: ", esResponse.body);
      response.status(200).send({ body: esResponse.body.hits });
    }
    response.send("Reindex did not work"); // echo the result back
  });

  app.listen(parseInt(process.env.PORT as string), () => {
    console.log(`server started on localhost:${process.env.PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
