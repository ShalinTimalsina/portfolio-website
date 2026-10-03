import { Skeleton, SkeletonCard } from "@/components/shared/skeleton"

export default function Loading() {
  // This is the global loading state that Next.js automatically swaps in 
  // during any route transitions, making navigation feel instantly responsive.
  return (
    <div className="container max-w-6xl mx-auto px-4 py-24 space-y-32 animate-in fade-in duration-700">
      {/* Hero Skeleton (2-column layout) */}
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="space-y-6 flex-1 w-full">
          {/* Status Badge */}
          <Skeleton className="h-6 w-32 rounded-full" />
          
          {/* Headline */}
          <div className="space-y-3">
            <Skeleton className="h-14 lg:h-16 w-full max-w-xl" />
            <Skeleton className="h-14 lg:h-16 w-3/4 max-w-md" />
          </div>
          
          {/* Description */}
          <div className="space-y-2 pt-2">
            <Skeleton className="h-5 w-full max-w-lg" />
            <Skeleton className="h-5 w-5/6 max-w-md" />
          </div>
          
          {/* CTAs */}
          <div className="flex gap-4 pt-6">
            <Skeleton className="h-11 w-36 rounded-md" />
            <Skeleton className="h-11 w-36 rounded-md" />
          </div>
        </div>
        
        {/* Terminal Skeleton Placeholder */}
        <div className="flex-1 w-full hidden lg:block">
          <Skeleton 
            className="h-[400px] w-full rounded-[24px] border border-border" 
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }} 
          />
        </div>
      </div>

      {/* Grid Content Skeleton */}
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard className="hidden lg:flex" />
        </div>
      </div>
    </div>
  )
}
