import Layout from "@/components/layout";
import useUser from "@/libs/client/useUser";
import { elapsedTime } from "@/libs/client/utils";
import useMutation from "@/libs/client/useMutation";
import { Comment, Post, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import cfimage from "@/libs/client/cfimage";
import VideoPlayer from "@/components/videoplayer";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import ActivitySkeleton from "@/components/activity-skeleton";

interface CommentWithSome extends Comment {
  author: {
    name: string;
    avatar?: string | null;
  }
}

interface PostWithLikes extends Post {
  author: User;
  authorId: number;
  _count: {
    likes: number;
    comments: number;
  }
  comments: CommentWithSome[];
}

interface PostItemResult {
  ok: boolean;
  errMsg: string;
  post: PostWithLikes;
  isLiked: boolean;
}

interface CommentForm {

}

export default function DetailPage() {
  const router = useRouter()
  const [comment, { loading }] = useMutation<CommentForm>()
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const { user } = useUser()

  const { data, mutate } = useSWR<PostItemResult>(router.query.id ? `/api/posts/${router.query.id}` : null)
  useEffect(() => {
    if (!data?.ok && data?.errMsg) {
      router.replace('/')
    }
  }, [data, router])

  // like 활성화 비활성화
  const [isLike] = useMutation()
  const likeBtn = () => {
    if (!data) return;
    mutate({
      ...data,
      isLiked: !data.isLiked,
      post: {
        ...data.post,
        _count: {
          ...data.post._count,
          likes: data.isLiked ? data.post._count.likes - 1 : data.post._count.likes + 1,
        }
      }
    }, false
    )
    isLike(`/api/posts/${router.query.id}/like`);//백엔드로 바뀐 정보 보내기
  }

  const onValid = async (form: CommentForm) => {
    if (loading) return;
    if (!data) return;
    await comment(`/api/posts/${router.query.id}/comments`, form);

    mutate({
      ...data,
      post: {
        ...data.post,
        comments: [...data.post.comments, {
          id: data?.post?.comments.at(-1)?.id! + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: +user?.id!,
          postId: +router?.query?.id!,
          comment: getValues('comment'),
          author: {
            name: user?.name!,
            avatar: user?.avatar,
          }
        }]
      }
    }, false)

    reset();
  }
  const [deletePost, { data: deletePostData }] = useMutation()
  const onDeletePost = () => {
    if (!data) return
    if (window.confirm('해당 글을 정말로 삭제하겠습니까?')) {
      deletePost(`/api/posts/${router.query.id}/delete`)
    }
  }


  const [deleteComment, { data: deleteCommentData }] = useMutation()
  const onDeleteComment = async (commentId: number) => {
    if (!data) return;
    if (window.confirm('해당 댓글을 정말로 삭제하겠습니까?')) {
      deleteComment(`/api/posts/${router.query.id}/comments/${commentId}/delete`)
    }
  }
  useEffect(() => {
    if (deletePostData?.ok) {
      alert('해당 글이 삭제되었습니다.')
      router.replace('/')
    }
    if (deleteCommentData?.ok) {
      alert('해당 댓글이 삭제되었습니다.')
    }
  }, [deleteCommentData, deletePostData, router])


  return (

    <Layout pageTitle="Post details page" hasBackBtn>
      <div className="w-full flex flex-col px-5 py-6 border-b ">
        <div className="flex items-center space-x-3 justify-between mb-4">
          <div className="flex items-center">
            {data?.post?.author?.avatar ? <Image src={`/images/avatar/${data?.post?.author?.avatar}.png`}
              className="w-11 aspect-square rounded-full object-contain border"
              priority={true}
              width={100}
              height={100} alt={"avatar"} /> : <Skeleton circle width={44} height={44} />}
            <div className="flex flex-col pl-3 items-center">
              {data?.post?.author?.name ? <div className="flex gap-2 ">
                <Link href={`/user/${data?.post?.authorId}`}><p className="hover:cursor-pointer">{data?.post?.author?.name}</p></Link>
                <p>· {data?.post?.createdAt && elapsedTime(data?.post?.createdAt)}</p>
              </div> :
                <div className="flex gap-2 ">
                  <Skeleton width={120} />
                </div>}
            </div>
          </div>
          <div className="flex items-center gap-7">
            <div onClick={likeBtn} className={data?.isLiked ? 'text-red-500 transition hover:text-red-400 flex' : 'hover:text-slate-400 text-black flex'}>
              {data?.isLiked ?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>}


              <p className="pl-2 select-none">{data?.post?._count?.likes}</p>
            </div>

            {data?.post?.authorId === user?.id ? (
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#9CA3AF"
                  className="w-6 h-6 cursor-pointer"
                  onClick={onDeletePost}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </div>) : null}
          </div>
        </div>
        {/* 로딩 스켈레톤 */}
        {data?.post ? null :
          <div>
            <div className="border-b-2">
              <Skeleton className="youtubeContainer rounded-md" />
              <div className="my-2"><Skeleton height={22} width={'90%'} /></div>
            </div>
            <div>
              <ActivitySkeleton count={3} />
            </div>
          </div>
        }
        {/* 이미지 영역 */}

        {data?.post?.image ? <Image alt="detailImg" property="true" width={550} height={700} src={cfimage({ imageUrl: data?.post?.image, type: 'public' })} className="w-full object-fill border rounded-md mb-6" /> : null}
        {/* 동영상 영역 */}
        {data?.post?.video ? <VideoPlayer videoId={data?.post?.video} /> : null}

        {/* 컨텐츠 영역 */}
        <div className="my-3">{data?.post?.content}</div>
        <ul>
          {data?.post?.comments.map((comment) => (
            <li className="pt-5 pb-3 border-t-2 border-dashed first:border-t-slate-400 first:border-t-2 first:border-solid" key={comment.id}>

              <div className="flex items-center space-x-3 justify-between">
                <div className="flex items-center">
                  {comment.author.avatar ? <Link href={`/user/${comment?.authorId}`}><Image src={`/images/avatar/${comment.author.avatar}.png`}
                    className="w-11 aspect-square rounded-full object-contain border"
                    priority={true}
                    width={100}
                    height={100} alt={"avatar"} /></Link> : null}
                  <div className="flex flex-col pl-3 items-center">
                    <div className="flex gap-2 ">
                      <Link href={`/user/${comment?.authorId}`}><p className="hover:cursor-pointer">{comment.author.name}</p></Link>
                      <p>· {elapsedTime(comment.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {comment.author.name === user?.name ? (
                  <div className="flex items-center" onClick={() => onDeleteComment(comment.id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#9CA3AF"
                      className="w-6 h-6 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>

                  </div>
                ) : null}

              </div>

              <div className="py-3">{comment.comment}</div>
            </li>
          ))}
        </ul>
        <div className="pt-5 pb-3 border-t-2 border-dashed">
          <form onSubmit={handleSubmit(onValid)} className="relative">
            <input {...register('comment', {
              required: '댓글을 입력해주세요.',
              minLength: {
                value: 2,
                message: "댓글을 2글자 이상 입력해주세요."
              },
              maxLength: {
                value: 200,
                message: '댓글을 200글자 이하로 입력해주세요.'
              }
            })} type="text" className="bg-slate-100 h-12 text-sm w-full focus:outline-slate-300 rounded-md p-2 text-slate-600" placeholder='댓글 달기...' />
            {watch('comment') && (<p className="absolute right-2 top-[15px] cursor-pointer text-blue-500 hover:text-blue-400 text-sm" onClick={handleSubmit(onValid)}>게시</p>)}
            <p className="pt-4 text-red-500">{errors.comment?.message?.toString()}</p>
          </form>
        </div>
      </div>
    </Layout>
  )
}
