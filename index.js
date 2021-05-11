import Koa from "koa";
import apiRouter from "./routers/index.js";
import koaBody from "koa-body";
import cors from "@koa/cors";

import { connectToMongo } from "./dbInit.js";
import { serverPort, mongoUrl } from "./cfg.js";
import { handleError } from "./koaUtils.js";

connectToMongo(mongoUrl);

const app = new Koa();
app.use(handleError);
//TODO fix cors dont allow
app.use(cors());
app.use(koaBody());
app.use(apiRouter.routes());

app.use(async (ctx) => {
  const { body, success = false } = ctx;
  if (!body && !success) {
    ctx.body = { success: false, message: "Incorrect request" };
    return;
  }

  ctx.body = { success, ...body };
});

//TODO error logging
app.on("error", (err) => {
  console.log("Error in app");
  console.log(err.message);
});

app.listen(serverPort, () => {
  console.log(`Server listening on http://localhost:${serverPort}`);
});
