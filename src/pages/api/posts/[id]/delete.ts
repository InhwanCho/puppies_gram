import withHandler from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withApiSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      query: { id },
      session: { user },
    } = req;
    const post = await client.post.findUnique({
      where: {
        id: +id!,
      }
    })
    if(user?.id !== post?.authorId){
      return res.status(401).json({ok:false, error:'userId와 authorId가 동일하지 않습니다.'})
    }
    await client.post.delete({
      where: {
        id: +id!,
      }
    })
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
