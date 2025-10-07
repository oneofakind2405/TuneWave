import type { SVGProps } from 'react';

export function GuitarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.59 2.74a1.5 1.5 0 0 0-2.12 0l-8.66 8.66a1.5 1.5 0 0 0 0 2.12l4.24 4.24a1.5 1.5 0 0 0 2.12 0l8.66-8.66a1.5 1.5 0 0 0 0-2.12l-4.24-4.24Z"></path>
      <path d="m14 8.5 2.5-2.5"></path>
      <path d="M12.5 10 10 12.5"></path>
      <path d="M11 11.5 8.5 14"></path>
      <path d="m9.5 13-2.5 2.5"></path>
      <path d="M2.74 15.59 7 20l4.24-4.24"></path>
    </svg>
  );
}
