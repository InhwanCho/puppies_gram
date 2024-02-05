import { withIronSessionApiRoute } from "iron-session/next";
import { IronSessionOptions } from 'iron-session';

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

// const cookieOptions = {
//   cookieName: "puppiesGramSession",
//   password: "njnjnjnjnjdcscamsklmlsadfkjkklj123123njknjknasdjkcnskcnsdjkcsndjkcsdnckjsdnjkcsndkcnsdjcksndjkcsdnkjnjk",
//   //process.env.COOKIE_PASSWORD!,
//   cookieOptions: {
//     secure: false,
//   },
// };
export const sessionOptions: IronSessionOptions = {
  cookieName: 'puppiesGramSession',
  cookieOptions: {
    httpOnly: true,
    maxAge: undefined,
    path: '/',
    sameSite: 'lax',
    secure: true,
  },
  password: process.env.COOKIE_PASSWORD as string,
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, sessionOptions);
}
