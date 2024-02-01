import withHandler from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withApiSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      body: { content, video, imageId},
      session: {user}
    } = req;
    if(imageId){
      const post = await client.post.create({
        data: {
          content,
          image : imageId,
          video,
          author: {
            connect: {
              id: user?.id,
            },
          },
        },
      });    
    } else {
      const post = await client.post.create({
        data: {
          content,
          video,
          author: {
            connect: {
              id: user?.id,
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