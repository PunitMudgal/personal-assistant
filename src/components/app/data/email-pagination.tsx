import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buildDataHref, type PerPageOption } from "@/lib/data-search";
import { cn } from "@/lib/utils";

type EmailPaginationProps = {
  q: string;
  page: number;
  perPage: PerPageOption;
  total: number;
};

function pageWindow(current: number, totalPages: number): number[] {
  const maxLinks = 5;
  if (totalPages <= maxLinks) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  let start = Math.max(1, current - 2);
  let end = start + maxLinks - 1;
  if (end > totalPages) {
    end = totalPages;
    start = end - maxLinks + 1;
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function EmailPagination({
  q,
  page,
  perPage,
  total,
}: EmailPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages <= 1) return null;

  const pages = pageWindow(page, totalPages);
  const hrefFor = (p: number) => buildDataHref({ q, page: p, perPage });

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 pt-2"
      aria-label="Email results pagination"
    >
      <p className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          asChild={page > 1}
        >
          {page > 1 ? (
            <Link href={hrefFor(page - 1)}>Previous</Link>
          ) : (
            <span>Previous</span>
          )}
        </Button>
        {pages.map((p) => (
          <Button
            key={p}
            variant={p === page ? "secondary" : "ghost"}
            size="sm"
            className={cn("min-w-8", p === page && "pointer-events-none")}
            asChild={p !== page}
          >
            {p === page ? (
              <span aria-current="page">{p}</span>
            ) : (
              <Link href={hrefFor(p)}>{p}</Link>
            )}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          asChild={page < totalPages}
        >
          {page < totalPages ? (
            <Link href={hrefFor(page + 1)}>Next</Link>
          ) : (
            <span>Next</span>
          )}
        </Button>
      </div>
    </nav>
  );
}
