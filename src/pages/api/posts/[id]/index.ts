import withHandler from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withApiSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { id },
      session: { user },
    } = req;
    const post = await client.post.findUnique({
      where: {
        id: Number(id),
      },
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
        comments:{
          select: {
            id: true,
            comment :true,
            createdAt: true,
            authorId: true,
            author: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        }
      },
    });
    if (!post) {
      return res
        .status(404)
        .json({ ok: false, errMsg: "해당 글이 존재하지 않습니다." });
    }
    const isLiked = Boolean(
      await client.like.findFirst({
        where: {
          postId: Number(id),
          userId: user?.id,
        },
        select: {
          id: true,
        },
      })
    );
    return res.status(200).json({ ok: true, post, isLiked });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false,
  })
);
