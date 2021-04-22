const Router = require("@koa/router");

const blog = new Router({ methods: ["POST", "GET", "DELETE", "PUT"] });

//get post by id
blog.get("/", async (ctx) => {
  ctx.body = [1, 2, 3, 4];
});

// //get posts, paginated by id
// blog.get("/", (ctx) => {});

// //search posts, paginated by id
// blog.get("/", (ctx) => {});

//create post by id
blog.put("/", async (ctx, next) => {});

//delete post by id
blog.del("/", async (ctx, next) => {});

//create post
//preview, all posts
//full info of post
//delete post

module.exports = blog;
