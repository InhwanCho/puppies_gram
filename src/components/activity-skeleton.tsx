import Skeleton from "react-loading-skeleton";
import { SkeletonProps } from "@/components/main-skeleton";

export default function ActivitySkeleton({ count = 1 }: SkeletonProps) {
  return (    
    <div>
      {new Array(count).fill(0).map((a, i) => (
        <div key={i} className="w-full flex flex-col p-6 border-b">
          <div className="w-full flex justify-between items-center mb-5">
            <div>
              <Skeleton width={44} height={44} circle />
            </div>
            <div className="w-full flex flex-col ml-4 space-y-1">
              <Skeleton width={44} /> <Skeleton width={55} />
            </div>
          </div>
          <div className="w-[80%]">
            <Skeleton />
          </div>
        </div>
      ))}
    </div>

  )
}
