const handleError = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log("Error in router: " + err);
    //todo remove stack
    console.log(err);

    ctx.type = "json";
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      success: false,
      message: err.message,
      ...err.props,
    };
    // ctx.app.emit("error", err, ctx);
  }
};

// const handleError = async (ctx, next) => {
//   return next().catch((err) => {
//     console.log("Error in router: " + err);

//     // ctx.type = "json";
//     // ctx.status = err.statusCode || err.status || 500;

//   });
// };

export { handleError };
