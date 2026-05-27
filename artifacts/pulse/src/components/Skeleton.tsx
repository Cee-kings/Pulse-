export function FeedSkeleton() {
  return (
    <div className="space-y-0">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="py-7 border-b border-border">
          {/* Author row */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="skeleton w-7 h-7 rounded-full flex-shrink-0" />
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-3 w-16 rounded" />
          </div>
          {/* Title */}
          <div className="skeleton h-5 w-4/5 rounded mb-2" />
          <div className="skeleton h-5 w-2/3 rounded mb-3" />
          {/* Preview */}
          <div className="skeleton h-4 w-full rounded mb-1.5" />
          <div className="skeleton h-4 w-5/6 rounded" />
          {/* Footer */}
          <div className="mt-4 flex items-center gap-3">
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-3 w-12 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PostSkeleton() {
  return (
    <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-10">
      <div className="skeleton h-4 w-16 rounded mb-10" />
      <div className="skeleton h-10 w-full rounded mb-3" />
      <div className="skeleton h-10 w-3/4 rounded mb-5" />
      <div className="skeleton h-6 w-full rounded mb-2" />
      <div className="skeleton h-6 w-4/5 rounded mb-8" />
      <div className="flex items-center gap-3 mb-8">
        <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
        <div className="space-y-1.5">
          <div className="skeleton h-3.5 w-28 rounded" />
          <div className="skeleton h-3 w-36 rounded" />
        </div>
      </div>
      <div className="border-t border-border pt-8 space-y-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-4.5 w-full rounded" />
            <div className="skeleton h-4.5 w-full rounded" />
            <div className="skeleton h-4.5 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
