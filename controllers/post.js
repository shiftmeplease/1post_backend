import Post from "../models/post.js";
import DOMPurify from "dompurify";
import MarkdownIt from "markdown-it";

//TODO better preview;  with styles;
const md = MarkdownIt();

//workaround to make work in nodejs
import { JSDOM } from "jsdom";
const { window } = new JSDOM("<!DOCTYPE html>");
const domPurify = DOMPurify(window);

const selectedFields = "id date value country";

async function save(ctx, next) {
  const { value } = ctx.request.body;
  const {
    ip: { _id: ipId, country },
  } = ctx.state;
  if (!value) ctx.throw(500, "Empty post");

  const postHtml = domPurify.sanitize(md.render(value));
  const newPost = new Post({ value: postHtml, ip: ipId, country });

  await newPost.validate();
  await newPost.findDupe();

  try {
    const result = await newPost.save();
    //populate to _id, date
    const { _id, date } = result;
    ctx.body = { post: { _id, date, country, value: postHtml } };
    ctx.success = true;
    return next();
  } catch (e) {
    const { code } = e;
    if (code === 11000) {
      ctx.throw(400, "Same post already created, index error");
    } else {
      ctx.throw(400, "Error during save");
    }
  }
}

async function getById(ctx, next) {
  const { postId } = ctx.params;

  if (!/^\d+$/.test(postId)) ctx.throw(400, "Invalid postId");

  const resultPost = await Post.findById(postId, selectedFields).exec();
  if (!resultPost && resultPost === null) {
    return ctx.throw(404, "Post not found");
  }
  ctx.success = true;
  ctx.body = { post: resultPost };
  return next();
}

async function removeById(ctx, next) {
  const { postId } = ctx.params;

  if (!/^[0-9a-fA-F]{24}$/.test(postId)) ctx.throw(400, "Invalid postId");

  const resultPost = await Post.findByIdAndDelete(postId).exec();
  if (!resultPost && resultPost === null) {
    return ctx.throw(404, "Post not found");
  }
  ctx.success = true;
  ctx.body = { message: `Removed post with id: ${postId}` };
  return next();
}

//returns async middleware
function findRandom(count = 1) {
  return async function (ctx, next) {
    const randomIds = await Post.random(count);
    const randomPosts = await Post.find(
      { $or: randomIds },
      selectedFields
    ).exec();
    if (!randomPosts && randomPosts.length === 0) {
      return ctx.throw(404, "Posts not found");
    }

    ctx.success = true;
    if (count === 1) {
      ctx.body = { post: randomPosts[0] };
    } else {
      ctx.body = { posts: randomPosts };
    }

    return next();
  };
}

async function getPage(ctx, next) {
  let { sortType = "newest", pageNum = 0 } = ctx.request.body;
  if (!sortType || !Number.isInteger(pageNum))
    ctx.throw(400, "Invalid request");

  if (!/^\d+$/.test(pageNum)) ctx.throw(404, "Page not found");
  if (["newest", "oldest"].indexOf(sortType) === -1)
    ctx.throw(404, "Invalid sortType");

  let sortQuery;
  switch (sortType) {
    case "newest":
      sortQuery = { _id: "desc" };
      break;
    case "oldest":
      sortQuery = { _id: "asc" };
      break;
  }

  // pageNum = Math.floor(+pageNum);
  if (pageNum < 0) {
    ctx.throw(404, "Page not found");
  } else if (pageNum !== 0) {
    pageNum -= 1;
  }

  const posts = await Post.find()
    .sort(sortQuery)
    .select(selectedFields)
    .setOptions({ skip: pageNum * 10, limit: 10 })
    .exec();
  if (posts.length <= 0) {
    ctx.throw("No more posts");
  }
  ctx.success = true;
  ctx.body = { posts: posts };
  return next();
}

//search

async function search(ctx, next) {
  let { text } = ctx.request.body;
  if (!text || !typeof text === "string") ctx.throw(400, "Invalid request");

  if (/\n|\r\n/.test(text)) ctx.throw(400, "Invalid text search");

  const posts = await Post.find({ $text: { $search: text } })
    .select(selectedFields)
    .setOptions({ limit: 10 })
    .sort({
      score: { $meta: "textScore" },
    })
    .exec();

  if (posts.length <= 0) {
    ctx.throw(404, "Nothing found");
  }
  ctx.success = true;
  ctx.body = { posts: posts };
  return next();
}

// Post.find(
//   { $text: { $search: "cake" } }
// ).sort( { score: { $meta: "textScore" } } )

// import { save as saveIp } from "../controllers/ip.js";
// import { ipBan } from "../cfg.js";

// const checkIp = async (ctx, next) => {
//   if (ipBan) {
//     const ip = ctx.headers["x-real-ip"];
//     const result = await saveIp(ip);
//     //TODO ipRef to ctx, or make transactions
//   }
//   return next();
// };

export { save, getById, removeById, findRandom, getPage, search };
