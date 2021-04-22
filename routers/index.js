const Router = require("@koa/router");
const blog = require("./blog");
const { dbActive, statusHandler } = require("./status");

const apiRouter = new Router({ prefix: "/api" });

apiRouter.get("/status", statusHandler);
apiRouter.use("/blog", dbActive, blog.routes());

//handle success
apiRouter.use((ctx, next) => {
  const { body, success = false } = ctx;
  if (!body && !success) {
    return next();
  }
  ctx.body = { ...body, success };
});

module.exports = apiRouter;
