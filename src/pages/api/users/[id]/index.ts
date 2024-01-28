import withHandler from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withApiSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query: { id },
    } = req;
    const user = await client.user.findUnique({
      where: {
        id: +id!,
      },
    });
    if (!user) {
      return res.status(401).json({
        ok: false,
        errMsg: "해당 유저가 존재하지 않습니다.",
      });
    }

    const writtenPosts = await client.post.findMany({
      where: {
        authorId: Number(user?.id),
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
        likes: {
          select: {
            userId: true,
            createdAt:true
          },
        },
      },
    });
    const writtenComments = await client.comment.findMany({
      where: {
        authorId: Number(user?.id),
      },
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
        post: {
          select: {
            id: true
          }
        }
      },
      
    });
    const likedPosts = await client.post.findMany({
      where: {
        likes: {
          some: {
            userId: {
              equals: Number(user?.id),
            },
          },
        },
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
        likes: {
          select: {
            userId: true,
            createdAt: true,
          },
        },
      },
    });
    return res.status(200).json({
      ok:true, user, writtenPosts, writtenComments, likedPosts
    })
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false,
  })
);
