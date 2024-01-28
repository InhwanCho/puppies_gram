import { NextApiRequest, NextApiResponse } from "next";

type method = "GET" | "POST" | "DELETE"

interface ConfigType {
  methods: method[],
  handler: (req: NextApiRequest, res: NextApiResponse) => void,
  isPrivate? : boolean
}
export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

export default function withHandler({
  methods, handler, isPrivate
} : ConfigType) {
  return async function (req:NextApiRequest, res:NextApiResponse):Promise<any>{
    if(req.method && !methods.includes(req.method as any)){
      return res.status(405).end()
    }
    if (isPrivate ){//&& !req.session.user
      return res.status(401).json({ok: false, error:'로그인이 안되있습니다. 로그인해주세요.'})
    }
    try {
      await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ok:false, error})
    }
  }
}
