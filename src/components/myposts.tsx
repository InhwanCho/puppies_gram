import { elapsedTime } from "@/libs/client/utils";
import Image from "next/image";
import { useRouter } from "next/router";

interface MypostProps {
  id: number;
  content: string;
  image?: string;
  video?: string;
  createdAt: Date;
  authorId: number;
  author: { name: string; avatar?: string; }
  _count: { likes?: number; comments?: number };
  comment?: string;
}

export default function Myposts({
  id, content, image, video, createdAt, authorId, author: { name, avatar }, comment
}: MypostProps) {
  const router = useRouter()
  const movePostPage = (id: number) => {
    router.push(`/post/${id}`)
  }
  const moveCommentPage = (id:number)=>{
    router.push(`/post/${id}`)
  }
  
  return (
    
    <li className="w-full flex flex-col p-6 border-b">
      {/* Post 상단 영역 */}
      <div className="w-full flex justify-between items-center mb-5">
        {/* 아바타 */}
        <Image src={`/images/avatar/${avatar}.png`}
          className="w-11 aspect-square rounded-full object-contain border"
          priority={true}
          width={100}
          height={100} alt={"avatar"}/>  
        {/* 이름, 작성일자 */}
        <div className="w-full flex flex-col ml-4 space-y-1">
          <span className="text-sm font-bold">{name}</span>
          <span className="text-xs text-gray-400">
            {elapsedTime(createdAt)}
          </span>
        </div>
        {/* 상세 페이지 이동 버튼 */}
        <button
          
          onClick={comment ? ()=>{}: () => movePostPage(id)}
          title="클릭 시 상세 페이지로 이동합니다."
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#9CA3AF"
            className="w-6 h-6 cursor-pointer"
          >
            <path
              fillRule="evenodd"
              d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* image */}
      {false ?
        'image' : null}

      {/* youtube */}
      {false ? 'video' : null}

      {/* content */}
      <div className="px-1 pb-2 text-sm whitespace-pre truncate">
        {comment ? comment : content}
      </div>
    </li>
  );
};
