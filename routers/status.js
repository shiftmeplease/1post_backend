//return website status

const { dbStatus } = require("../dbInit");

const status = async (ctx, next) => {
  if (dbStatus) {
    ctx.success = true;
    ctx.body = { dbStatus };
  }
  next();
};

module.exports = status;
