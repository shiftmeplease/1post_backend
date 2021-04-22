import Koa from "koa";
import apiRouter from "./routers/index.js";

import { connectToMongo } from "./dbInit.js";
import { serverPort, mongoUrl } from "./cfg.js";

connectToMongo(mongoUrl);

const app = new Koa();

app.use(apiRouter.routes());

app.use(async (ctx) => {
  if (!ctx.body) {
    ctx.body = { success: false, message: "Incorrect request" };
  }
});

//TODO error logging
app.on("error", (err) => {
  console.log(err.message);
});

app.listen(serverPort, () => {
  console.log(`Server listening on http://localhost:${serverPort}`);
});
