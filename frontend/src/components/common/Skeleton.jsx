import React from 'react';

export const Skeleton = ({ className = 'h-6 w-full', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-slate-800/60 animate-pulse rounded-xl ${className}`}
        />
      ))}
    </>
  );
};
