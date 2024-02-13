import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

export interface SkeletonProps {
  count?: number
}

export default function MainSkeleton({ count = 1 }: SkeletonProps) {
  return (
    <div>
      {new Array(count).fill(0).map((a, i) => (
        <div key={i} className="w-full flex flex-col px-5 py-4 border-b border-slate-500">
          <div className="flex w-full h-full p-2 rounded items-center mb-3">
            <div className="flex mr-4">
              <Skeleton circle width={30} height={30} />
            </div>
            <div className="w-20">
              <Skeleton />
            </div>
          </div>
          <div>
            <Skeleton className="youtubeContainer rounded-md pt-3 border" />
          </div>
          <div className="w-[95%] mb-2">
            <Skeleton />
          </div>
          <div className="gap-3 grid grid-cols-2 w-40 pb-10">
            <Skeleton height={20} /> <Skeleton height={20} />
          </div>

        </div>
      ))}
    </div>

  )
}
