import { Skeleton, SkeletonCard } from "@/components/shared/skeleton"

export default function Loading() {
  // This is the global loading state that Next.js automatically swaps in 
  // during any route transitions, making navigation feel instantly responsive.
  return (
    <div className="container max-w-6xl mx-auto px-4 py-24 space-y-24">
      {/* Hero Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4 max-w-2xl" />
        <Skeleton className="h-6 w-full max-w-lg" />
        <Skeleton className="h-6 w-5/6 max-w-md" />
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard className="hidden lg:flex" />
      </div>
    </div>
  )
}
