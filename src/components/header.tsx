"use client";

import Link from "next/link";

export function Header() {

  return (
    <div className="bg-[#ac396d] w-full h-12.5">
      <div className="ml-5 max-w-250 h-full flex items-center font-medium text-[14px]">
        <div className="mr-auto flex hover:text-gray-300">
          <Link className="mr-2" href="/">
            Replay Analyzer
          </Link>
        </div>
      </div>
    </div>
  );
}