import withHandler from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withApiSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      session: { user },
      query: { page },
    } = req;

    const showNumber = 3;
    const postCount = await client.post.count();

    const posts = await client.post.findMany({
      orderBy: { createdAt: "desc" },
      take: showNumber,
      skip: (+page! - 1) * showNumber,
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });

    const postsWithLiked = posts.map((post) => ({
      ...post,
      isLiked:
        post.likes.filter((like: any) => like.userId === user?.id).length === 1
          ? true
          : false,
    }));

    return res.status(200).json({
      ok: true,
      posts: postsWithLiked,
      pages: Math.ceil(postCount / showNumber),
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false,
  })
);
