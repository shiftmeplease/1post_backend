const { dbStatus } = require("../dbInit");

const statusHandler = async (ctx, next) => {
  if (dbStatus) {
    ctx.success = true;
    ctx.body = { dbStatus };
  }
  next();
};

const dbActive = async (ctx, next) => {
  if (dbStatus.active) {
    return next();
  }
  ctx.success = false;
  ctx.body = { message: "db disconnected" };
};

module.exports = { statusHandler, dbActive };
