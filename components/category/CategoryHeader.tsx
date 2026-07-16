import Image from "next/image";

export function CategoryHeader({
  name,
  description,
  image,
}: {
  name: string;
  description?: string;
  image?: string | null;
}) {
  return (
    <div className="mb-6 flex items-center gap-4">
      {image ? (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-surface-alt">
          <Image src={image} alt={name} fill sizes="64px" className="object-contain p-2" />
        </div>
      ) : null}
      <div>
        <h1 className="text-2xl font-bold">{name}</h1>
        {description ? (
          <p
            className="mt-1 max-w-2xl text-sm text-ink-muted"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : null}
      </div>
    </div>
  );
}
