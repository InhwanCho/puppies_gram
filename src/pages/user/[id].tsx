import Layout from "@/components/layout";
import Myposts from "@/components/myposts";

import useUser from "@/libs/client/useUser";
import { cls } from "@/libs/client/utils";
import { Comment, Post, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface PostWithLikes extends Post {
  author: {
    name: string;
    avatar?: string;
  }
  _count: {
    likes: number;
    comments: number;
  }
  likes: {
    userId: number;
    createdAt: Date;
  }
}

interface CommentWithAuthor extends Comment {
  author: {
    name: string;
    avatar?: string;
  }
  post: {
    id: number;
  }
}

interface ProfileResponse {
  ok: boolean;
  errMsg?: string;
  user: User;
  writtenPosts: PostWithLikes[];
  writtenComments: CommentWithAuthor[];
  likedPosts: PostWithLikes[];
}

export default function Profile() {
  const router = useRouter()
  const { data } = useSWR<ProfileResponse>(router.query.id ? `/api/users/${router.query.id}` : null);
  const { user } = useUser()
  const [tab, setTab] = useState("writtenPosts");

  useEffect(() => {
    if (!data?.ok && data?.errMsg) {
      alert(data?.errMsg);
      router.replace("/");
    }
  }, [data, router]);
  return (
    <Layout pageTitle="Activities" hasBackBtn>
      <div className="w-full px-5 pb-10">
        {/* 유저 정보 영역 */}
        <div className="py-5 flex flex-col items-center">
          {data?.user?.avatar ? (<Image src={`/images/avatar/${data?.user?.avatar}.png`}
            className="w-44 aspect-square rounded-full object-contain border"
            priority={true}
            width={200}
            height={200} alt={"avatar"} />) : <div className="w-44 aspect-square rounded-full object-contain border"></div>}
          <span className="font-bold mt-8">{data?.user?.name}</span>
          <span className="text-sm text-slate-700 mb-5">
            {data?.user?.email}
          </span>
        </div>
        {/* 탭 메뉴 */}
        <div className="grid grid-cols-3 space-x-2 mx-5">
          <button
            type="button"
            className={cls(
              "col-span-1 text-center text-sm py-2",
              tab === "writtenPosts" ? "font-bold border-b-2 border-amber-200" : "text-slate-700"
            )}
            onClick={() => setTab("writtenPosts")}
          >
            작성한 글
          </button>
          <button
            type="button"
            className={cls(
              "col-span-1 text-center text-sm py-2",
              tab === "writtenComments" ? "font-bold border-b-2 border-amber-200" : "text-slate-700"
            )}
            onClick={() => setTab("writtenComments")}
          >
            작성한 댓글
          </button>
          <button
            type="button"
            className={cls(
              "col-span-1 text-center text-sm py-2",
              tab === "likedPosts" ? "font-bold border-b-2 border-amber-200" : "text-slate-700"
            )}
            onClick={() => setTab("likedPosts")}
          >
            좋아요 누른 글
          </button>
        </div>
        {/* 글 목록 */}


        <ul>
          {tab === "writtenPosts" ? (
            data?.writtenPosts?.length as number > 0 ?
              data?.writtenPosts.map((post: any) => (
                <Myposts key={post.id} {...post} />
              ))
              : <div className="my-10 text-center text-sm text-slate-700">작성한 글이 없습니다</div>
          ) : null}
          {tab === "writtenComments" ? (
            data?.writtenComments?.length as number > 0 ?
              data?.writtenComments.map((post: any) => (
                <Myposts key={post.id} {...post} />
              ))
              : <div className="my-10 text-center text-sm text-slate-700">작성한 댓글이 없습니다</div>
          ) : null}
          {tab === "likedPosts" ? (
            data?.likedPosts?.length as number > 0 ?
              data?.likedPosts.map((post: any) => (
                <Myposts key={post.id} {...post} />
              ))
              : <div className="my-10 text-center text-sm text-slate-700">좋아요를 누른 글이 없습니다</div>
          ) : null}

        </ul>
      </div>

    </Layout>
  );
};
