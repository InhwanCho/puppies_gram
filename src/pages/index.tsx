import Layout from "@/components/layout";
import PostItem from "@/components/postItem";
import { useInfiniteScroll } from "@/libs/client/useInfiniteScroll";
import { Post, User } from "@prisma/client";
import Head from "next/head";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";

interface PostWithSome extends Post {
  author: User;
  _count: {
    likes: number;
    comments: number;
  }
  likes: number[];
  isLiked: boolean;
}

interface HomeResponse {
  ok: boolean;
  posts: PostWithSome[];
  pages: number;
}

export default function Home() {
  // const { data } = useSWR<HomeResponse>("/api/posts");
  const getKey = (pageIndex: number, previousPageData: HomeResponse) => {
    if (pageIndex === 0) return `/api/posts?page=1`;
    if (pageIndex + 1 > previousPageData.pages) return null;
    return `/api/posts?page=${pageIndex + 1}`;
  };
  const { data, setSize } = useSWRInfinite<HomeResponse>(getKey);

  const posts = data ? data.map((item) => item.posts).flat() : [];
  const page = useInfiniteScroll(); //pagenation
  useEffect(() => {
    setSize(page);
  }, [setSize, page]);

    return (
      <>
        <Layout hasTitleLogo >
          <Head>
            <title>PuppiesGram</title>
          </Head>

          <ul className="">
            {posts.map(post => (
              <PostItem key={post.id} {...post} />
            ))}
          </ul>
        </Layout>
      </>
    );
  }
