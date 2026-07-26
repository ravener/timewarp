'use client';

export function LocalDate({ date }: { date: Date }) {
  return (
    <>
      {date.toLocaleString()}
    </>
  );
}