import withHandler from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withApiSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      session: { user },
      // query: { page },
    } = req;


    const posts = await client.post.findMany({
      orderBy: { createdAt: "desc" },      
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
