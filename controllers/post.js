import Post from "../models/post.js";

async function save(ctx, next) {
  //TODO checkIp

  const { body } = ctx.request.body;
  if (!body) ctx.throw(500, "Empty post");

  const newPost = new Post({ body });

  await newPost.validate();
  await newPost.findDupe();
  try {
    const result = await newPost.save();
    //populate to _id, date
    const { _id: id, date } = result;
    ctx.body = { post: { id, date } };
    ctx.success = true;
    next();
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

  const resultPost = await Post.findById(postId, "-_id body date").exec();
  if (!resultPost && resultPost === null) {
    return ctx.throw(404, "Post not found");
  }
  ctx.success = true;
  ctx.body = { post: resultPost };
  next();
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
  next();
}

//returns async middleware
function findRandom(count = 1) {
  return async function (ctx, next) {
    const randomIds = await Post.random(count);
    const randomPosts = await Post.find(
      { $or: randomIds },
      "-_id body date"
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

    next();
  };
}

// import { save as saveIp } from "../controllers/ip.js";
// import { ipBan } from "../cfg.js";

// const checkIp = async (ctx, next) => {
//   if (ipBan) {
//     const ip = ctx.headers["x-real-ip"];
//     const result = await saveIp(ip);
//     //TODO ipRef to ctx, or make transactions
//   }
//   next();
// };

export { save, getById, removeById, findRandom };
