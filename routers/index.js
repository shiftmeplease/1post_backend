import Router from "@koa/router";
import post from "./post.js";
import { dbActive, statusHandler } from "./status.js";

const apiRouter = new Router({ prefix: "/api" });

apiRouter.get("/status", statusHandler);
apiRouter.use("/post", dbActive, post.routes());

export default apiRouter;
