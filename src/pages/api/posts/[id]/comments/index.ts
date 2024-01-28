import withHandler from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withApiSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      session: { user },
      body: { comment },
      query: { id },
    } = req;
    const comments = await client.comment.create({
      data: {
        comment,
        author: {
          connect: {
            id: +user?.id!,
          },
        },
        post: {
          connect: {
            id: +id!,
          },
        },
      },
    });
    return res.status(200).json({ ok: true, comments });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
);
