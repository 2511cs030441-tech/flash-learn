import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="hidden md:block h-10 w-32 rounded-full" />
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-5">
        <Skeleton className="col-span-12 lg:col-span-8 h-56 rounded-2xl" />
        <Skeleton className="col-span-6 lg:col-span-4 h-56 rounded-2xl" />
        <Skeleton className="col-span-6 lg:col-span-3 h-36 rounded-2xl" />
        <Skeleton className="col-span-6 lg:col-span-3 h-36 rounded-2xl" />
        <Skeleton className="col-span-6 lg:col-span-3 h-36 rounded-2xl" />
        <Skeleton className="col-span-6 lg:col-span-3 h-36 rounded-2xl" />
      </div>

      {/* Quick actions */}
      <div className="space-y-5">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FlashcardsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-11 h-11 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-11 h-11 rounded-xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <Skeleton className="w-20 h-20 rounded-2xl" />
        <Skeleton className="h-6 w-52" />
        <Skeleton className="h-4 w-72" />
        <div className="grid grid-cols-2 gap-2 w-full max-w-md mt-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-12 rounded-2xl" />
          ))}
        </div>
      </div>
      <Skeleton className="h-14 rounded-2xl mt-4" />
    </div>
  );
}
