import { PropsWithChildren } from 'react';

export function Container({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto w-full min-[900px]:max-w-250 bg-[#2a2226] mb-2.5">
      <div className="px-12 py-2.5">
        {children}
      </div>
    </div>
  );
}
