import withHandler from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { email, password, name },
  } = req;
  if (!email || !password) {
    return res.status(404).end();
  }
  console.log(email, password, name);
  let user;
  try {
    user = await client.user.findUnique({
      where: { email: email },
    });
    if (user) {
      return res.status(401).json({
        ok: false,
        errMsg: "이미 존재하는 이메일이 있습니다. 아이디 생성 실패",
      });
    } else {
      user = await client.user.create({
        data: { email, password, name: name || "익명", avatar: "dog" },
      });
      return res.json({ ok: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).end().json({ ok: false, error: error });
  }
}

export default withHandler({
  methods: ["POST"],
  handler,
  isPrivate: false,
});
