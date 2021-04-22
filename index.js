const Koa = require("koa");
const apiRouter = require("./routers");

const { dbInit, dbStatus, db } = require("./dbInit");
const { serverPort, mongoUrl } = require("./cfg");

dbInit(mongoUrl);

const appStatus = {
  dbStatus,
};

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
