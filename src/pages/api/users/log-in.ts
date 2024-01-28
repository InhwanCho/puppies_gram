import withHandler from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withApiSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      body: { email, password },
    } = req;
    try {
      const user = await client.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        return res.status(401).json({
          ok: false,
          errMsg: "가입된 이메일이 존재하지 않습니다.",
          errField: "email",
        });
      }
      if (password !== user.password) {
        return res.status(401).json({
          ok: false,
          errMsg: "이메일과 비밀번호가 일치하지 않습니다.",
          errField: "password",
        });
      }
      req.session.user = { id: user.id };
      await req.session.save();

      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(405).end().json({ ok: false, error });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
);
