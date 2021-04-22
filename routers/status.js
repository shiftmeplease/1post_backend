import { dbStatus } from "../dbInit.js";

export const statusHandler = async (ctx, next) => {
  if (dbStatus) {
    ctx.success = true;
    ctx.body = { dbStatus };
  }
  next();
};

export const dbActive = async (ctx, next) => {
  if (dbStatus.active) {
    return next();
  }
  ctx.success = false;
  ctx.body = { message: "db disconnected" };
};
