import Router from "@koa/router";
import * as Post from "../controllers/post.js";
// import { handleError } from "../koaUtils.js";

const post = new Router({ methods: ["POST", "GET", "DELETE", "PUT"] });

post.get("/id/:postId", Post.getById); //get post by id, for sharing... //full info of post
post.get("/3random", Post.findRandom(3)); // 3 random posts for main page
post.get("/lucky", Post.findRandom());
post.post("/page/:pageNum*", Post.getPage);

post.put("/", Post.save); //create post

post.del("/:postId", Post.removeById);

//get posts, paginated by id; //preview, all posts

//search posts, paginated

export default post;
