import withHandler from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withApiSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      session: { user },
      query: { id },
    } = req;
    const alreadyExists = await client.like.findFirst({
      where: {
        postId: +id!,
        userId: +user?.id!,
      },
    });
    if (alreadyExists) {
      await client.like.delete({
        where: {
          id: alreadyExists.id,
        },
      });
    } else {
      await client.like.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          post: {
            connect: {
              id: +id!,
            },
          },
        },
      });
    }
    return res.status(200).json({ ok: true });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
);
