import withHandler from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withApiSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      body: { avatar, name, password },
      session: { user },
    } = req;
    const currentUser = await client.user.findUnique({
      where: {
        id: +user?.id!,
      },
    });
    if (avatar !== currentUser?.avatar) {
      await client.user.update({
        where: { id: currentUser?.id },
        data: { avatar }
      });
    }
    if (name !== currentUser?.name){
      await client.user.update({
        where: { id: currentUser?.id },
        data: { name }
      });
    }
    if (password !== currentUser?.password){
      await client.user.update({
        where: { id: currentUser?.id },
        data: { password }
      });
    }
    return res.status(200).json({
      ok: true
    })
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
);
