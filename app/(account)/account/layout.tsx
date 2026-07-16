import Link from "next/link";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container flex flex-col gap-8 py-10 md:flex-row">
      <nav className="flex shrink-0 gap-4 md:w-48 md:flex-col">
        <Link href="/account" className="text-sm font-medium hover:text-brand">
          Liste de souhaits
        </Link>
        <Link href="/account/inquiries" className="text-sm font-medium hover:text-brand">
          Mes demandes
        </Link>
      </nav>
      <div className="flex-1">{children}</div>
    </div>
  );
}
