export function Bag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 20a2 2 0 002 2h14a2 2 0 002-2V5.5H3z" />
      <path d="M8 5a4 4 0 018 0" />
    </svg>
  );
}
