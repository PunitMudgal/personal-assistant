import Link from "next/link";

const GetStarted = () => {
  return (
    <Link
      href="/sign-in"
      className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-6 text-base font-semibold text-black transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-neutral-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CC2E9] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      Start free
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="none"
        className="h-4 w-4 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
      >
        <path
          d="M3 8h10m0 0L9 4m4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
};

export default GetStarted;
