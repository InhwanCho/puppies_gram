import withHandler from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/libs/server/withApiSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      session: { user },
    } = req;
    if (user) {
      req.session.destroy();
      return res.json({ ok: true, message: "로그아웃 완료" });
    } else {
      return res.json({ ok: false, message: "로그아웃 실패?" });
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
