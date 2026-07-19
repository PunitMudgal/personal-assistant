export const PER_PAGE_OPTIONS = [10, 25, 50] as const;
export type PerPageOption = (typeof PER_PAGE_OPTIONS)[number];

export function parsePerPage(value: string | undefined): PerPageOption {
  const n = Number(value);
  if (n === 10 || n === 25 || n === 50) return n;
  return 10;
}

export function parsePage(value: string | undefined): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

export function buildDataHref(params: {
  q?: string;
  page?: number;
  perPage?: number;
}): string {
  const sp = new URLSearchParams();
  const q = params.q?.trim() ?? "";
  if (q) sp.set("q", q);
  if (params.page != null && params.page > 1) {
    sp.set("page", String(params.page));
  }
  if (params.perPage != null && params.perPage !== 10) {
    sp.set("perPage", String(params.perPage));
  }
  const qs = sp.toString();
  return qs ? `/data?${qs}` : "/data";
}
