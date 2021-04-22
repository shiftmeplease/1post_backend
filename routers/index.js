const Router = require("@koa/router");
const blog = require("./blog");
const status = require("./status");

const apiRouter = new Router({ prefix: "/api" });

const allowedHandler = {
  throw: true,
  notImplemented: createErr.bind({ message: "notImplemented", status: 405 }),
  methodNotAllowed: createErr.bind({ message: "not allowed", status: 405 }),
};

apiRouter.get("/status", status);

apiRouter.use("/blog", blog.routes(), blog.allowedMethods(allowedHandler));

function createErr() {
  const errorHandler = new Error(this.message);
  errorHandler.success = false;
  errorHandler.status = this.status;
  errorHandler.body = this.message;
  return errorHandler;
}

//handle success
apiRouter.use((ctx, next) => {
  const { body, success = false } = ctx;
  if (!body && !success) {
    return next();
  }
  ctx.body = { ...body, success };
});

module.exports = apiRouter;
