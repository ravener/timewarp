'use client';

export function LocalDate({ date }: { date: Date }) {
  return (
    <>
      {new Date(date).toLocaleString()}
    </>
  );
}