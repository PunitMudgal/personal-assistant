import { redirect } from "next/navigation";

import { EmailList } from "@/components/app/data/email-list";
import { EmailPagination } from "@/components/app/data/email-pagination";
import { EmailSearchForm } from "@/components/app/data/email-search-form";
import { parsePage, parsePerPage } from "@/lib/data-search";
import { searchUserEmails } from "@/lib/email-search";
import { auth } from "@/server/auth";

export default async function DataPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; perPage?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/data");
  }

  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const page = parsePage(params.page);
  const perPage = parsePerPage(params.perPage);

  const { items, total } = await searchUserEmails(session.user.id, {
    q: q || undefined,
    page,
    perPage,
  });
// console.log('Total emails', items)
  const hasQuery = q.length > 0;

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col gap-6 overflow-y-auto px-4 py-8 sm:px-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Data
        </h1>
        <p className="text-sm text-muted-foreground">
          Search through your email archive
        </p>
      </header>

      <EmailSearchForm q={q} perPage={perPage} />

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {hasQuery
            ? `${total} result${total === 1 ? "" : "s"} for “${q}”`
            : `${total} email${total === 1 ? "" : "s"}`}
        </p>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              {hasQuery
                ? "No emails match your search."
                : "No emails in your archive yet."}
            </p>
          </div>
        ) : (
          <>
            <EmailList items={items} />
            <EmailPagination
              q={q}
              page={page}
              perPage={perPage}
              total={total}
            />
          </>
        )}
      </div>
    </div>
  );
}
