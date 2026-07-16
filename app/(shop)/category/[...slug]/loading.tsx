import { Skeleton } from "@/components/ui/Skeleton";

export default function CategoryLoading() {
  return (
    <div>
      <Skeleton className="mb-6 h-10 w-1/3" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    </div>
  );
}
