export function FeedSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i}
          className="rounded-2xl p-5 sm:p-6"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="skeleton w-6 h-6 rounded-full flex-shrink-0" />
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-3 w-12 rounded" />
          </div>
          <div className="skeleton h-5 w-4/5 rounded mb-2" />
          <div className="skeleton h-5 w-3/5 rounded mb-3" />
          <div className="skeleton h-4 w-full rounded mb-1.5" />
          <div className="skeleton h-4 w-4/5 rounded mb-4" />
          <div className="flex items-center gap-2">
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-16 rounded-full" />
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
        <div className="space-y-2">
          <div className="skeleton h-3.5 w-28 rounded" />
          <div className="skeleton h-3 w-36 rounded" />
        </div>
      </div>
      <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "2rem" }} />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
