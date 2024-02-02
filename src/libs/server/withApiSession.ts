import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  cookieName: "puppiesGramSession",
  password: "njnjnjnjnjdcscamsklmlsadfkjkklj123123njknjknasdjkcnskcnsdjkcsndjkcsdnckjsdnjkcsndkcnsdjcksndjkcsdnkjnjk",
  //process.env.COOKIE_PASSWORD!,
  cookieOptions: {
    secure: false,
  },
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}
