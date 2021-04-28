import Router from "@koa/router";
import * as Post from "../controllers/post.js";
// import { handleError } from "../koaUtils.js";

const post = new Router({ methods: ["POST", "GET", "DELETE", "PUT"] });

post.get("/id/:postId", Post.getById);
post.put("/", Post.save);
post.del("/:postId", Post.removeById);
post.get("/3random", Post.findRandom(3));
post.get("/lucky", Post.findRandom());

//im feeling lucky
//get post by id, for sharing...

// //get posts, paginated by id
// blog.get("/", (ctx) => {});

// //search posts, paginated by id
// blog.get("/", (ctx) => {});

// 3 random posts for main page

//create post
//preview, all posts
//full info of post
//delete post
//search special computed tags: laconic, nigger, blm, etc..
//https://medium.com/dida-machine-learning/the-best-free-labeling-tools-for-text-annotation-in-nlp-844525c5c65b
export default post;
