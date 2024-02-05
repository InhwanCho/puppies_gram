import { elapsedTime } from "@/libs/client/utils";
import useMutation from "@/libs/client/useMutation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import cfimage from "@/libs/client/cfimage";
import VideoPlayer from "./videoplayer";

interface CommentForm {
  comment: string;
}

interface PostItemProps {
  id: string;
  content: string;
  image?: string | null;
  video?: string | null;
  createdAt: Date;
  authorId: number;
  author: { name: string; avatar?: string | null };
  _count: { likes: number, comments: number };
  isLiked: boolean;
}

export default function PostItem({
  id, content, image, video, createdAt, authorId, author: { name, avatar }, _count: { likes, comments }, isLiked
}: PostItemProps) {
  const [isLike] = useMutation()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const [comment, { loading }] = useMutation<CommentForm>()
  const [CommentCount, setCommentCount] = useState(comments)
  const onValid = (form: any) => {
    if (loading) return;
    setCommentCount(CommentCount + 1)
    comment(`/api/posts/${id}/comments`, form)
    reset();
  }

  // 더보기 및 간략히 기능 구현
  const [isOpen, setIsOpen] = useState(false);
  const [showReadMoreBtn, setShoReadMoreBtn] = useState(false)

  const ref = useRef<null | HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      // 스크롤 높이와 실제 텍스트 높이 확인
      // console.log(ref.current.scrollHeight, ref.current.clientHeight)
      setShoReadMoreBtn(ref.current.scrollHeight !== ref.current.clientHeight)
    }
  }, [])

  const [like, setIslike] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(likes)

  const likeBtn = async () => {
    if (loading) return;
    await isLike(`/api/posts/${id}/like`);
    setIslike(!like)
    setLikeCount(like ? likeCount - 1 : likeCount + 1)
  };

  return (
    <li className="w-full flex flex-col px-5 py-4 border-b border-slate-500">
      <Link href={`/user/${authorId}`}>        
        <div className="flex items-center p-2 space-x-3 hover:cursor-pointer">

          <Image src={`/images/avatar/${avatar}.png`}
            className="w-11 aspect-square rounded-full object-contain border"
            priority={true}
            width={44}
            height={44} alt={"avatar"} />
            
          <div className="flex flex-col ">
            <div className="flex gap-2">
              <span className="hover:underline cursor-pointer">{name} </span>
              <span className="flex text-sm text-slate-600 items-center">· {elapsedTime(createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-2">
        <Link href={`/post/${id}`}>
          {image ? <div className="youtubeContainer rounded-md border"><Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="image" fill src={cfimage({ imageUrl: image, type: 'public' })} className="youtubeContaineriframe object-contain" /></div> : null}
        </Link>
        {video ? <VideoPlayer videoId={video} /> : null}

        <div className="">
          {/* 내용 */}
          <p className={`${isOpen ? null : 'paragraphStyle'}`} ref={ref}>
            <span className="font-semibold text-slate-700/70 cursor-pointer text-sm"><Link href={`/user/${authorId}`}>{name}</Link> · </span><Link href={`/post/${id}`}><span className="">{content}</span></Link></p>
          {showReadMoreBtn && (
            <span className="text-slate-500 text-sm block" onClick={() => setIsOpen(!isOpen)} >{isOpen ? '숨기기' : '... 글 더보기'}</span>
          )}
          {/* 좋아요 및 댓글 */}
          <div className="flex space-x-4 my-2 mt-4">
            <div onClick={likeBtn} className={like ? 'text-red-500 transition flex hover:text-red-400' : 'hover:text-slate-400 text-black flex'}>
              {like ?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>

                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>}
              <p className="select-none flex ml-2 text-slate-700 text-sm items-center">좋아요 {likeCount}개</p>
            </div>
            <Link href={`/post/${id}`}>
              <div className="hover:text-slate-400 text-black flex">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 flex">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
                <span className="ml-2 items-center text-sm flex text-slate-700 cursor-pointer">{'댓글 ' + CommentCount + '개'}</span>
              </div>
            </Link>
          </div>
          <form className="relative mt-1" onSubmit={handleSubmit(onValid)}>
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
            })} type="text" className="text-sm w-full focus:bg-slate-50 focus:outline-slate-200 focus:p-2 transition-all focus:rounded-md py-2 text-slate-500" placeholder='댓글 달기...' />
            {watch('comment') && (<p className="absolute right-2 top-2 cursor-pointer text-blue-500 hover:text-blue-400 text-sm">게시</p>)}
            <p className="pt-4 text-red-500">{errors.comment?.message?.toString()}</p>
          </form>
        </div>
      </div>
    </li>
  )
}