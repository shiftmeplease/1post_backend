import Router from "@koa/router";
import * as Post from "../controllers/post.js";
// import { handleError } from "../koaUtils.js";

const post = new Router({ methods: ["POST", "GET", "DELETE", "PUT"] });

post.get("/id/:postId", Post.getById); //get post by id, for sharing... //full info of post
post.get("/3random", Post.findRandom(3)); // 3 random posts for main page
post.get("/lucky", Post.findRandom());

post.put("/", Post.save); //create post

post.del("/:postId", Post.removeById);

//get posts, paginated by id; //preview, all posts

//search posts, paginated

//search special computed tags: laconic, nigger, blm, etc..
//https://medium.com/dida-machine-learning/the-best-free-labeling-tools-for-text-annotation-in-nlp-844525c5c65b
export default post;
