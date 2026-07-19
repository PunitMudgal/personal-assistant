"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  buildDataHref,
  PER_PAGE_OPTIONS,
  parsePerPage,
  type PerPageOption,
} from "@/lib/data-search";

type EmailSearchFormProps = {
  q: string;
  perPage: PerPageOption;
};

export function EmailSearchForm({ q, perPage }: EmailSearchFormProps) {
  const router = useRouter();

  return (
    <form
      method="get"
      action="/data"
      className="flex flex-wrap items-end gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const nextQ = String(data.get("q") ?? "").trim();
        const nextPerPage = parsePerPage(String(data.get("perPage") ?? ""));
        router.push(buildDataHref({ q: nextQ, page: 1, perPage: nextPerPage }));
      }}
    >
      <div className="min-w-48 flex-1 space-y-1.5">
        <label htmlFor="data-q" className="text-xs font-medium text-muted-foreground">
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="data-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Subject, from, or body…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="data-perPage"
          className="text-xs font-medium text-muted-foreground"
        >
          Per page
        </label>
        <select
          id="data-perPage"
          name="perPage"
          defaultValue={String(perPage)}
          className="flex h-9 w-18 rounded-md border border-input bg-transparent px-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          onChange={(event) => {
            const nextPerPage = parsePerPage(event.target.value);
            router.push(buildDataHref({ q, page: 1, perPage: nextPerPage }));
          }}
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" size="sm" className="mb-0.5">
        Search
      </Button>
    </form>
  );
}
