import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function IconMail(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3.5 5.5A1.5 1.5 0 0 1 5 4h10a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 15 16H5a1.5 1.5 0 0 1-1.5-1.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="m4.5 6.5 5.5 4 5.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconLock(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <rect x="4.5" y="8.5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 8.5V6.5a3 3 0 1 1 6 0v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.5 16.5c.8-2.6 2.9-4 5.5-4s4.7 1.4 5.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconLogout(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M8 4.5H5.5A1.5 1.5 0 0 0 4 6v8a1.5 1.5 0 0 0 1.5 1.5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 10H8m0 0 2.5-2.5M8 10l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 4.5H16v11h-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M4 6h12M4 10h12M4 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="m5.5 5.5 9 9m0 0-9 9m9-9 9 9m-9-9 9-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconLayout(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <rect x="3.5" y="3.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 8.5h13" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 8.5v8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 10h13M10 3.5c1.8 1.6 2.8 3.7 2.8 6.5S11.8 14.9 10 16.5M10 3.5C8.2 5.1 7.2 7.2 7.2 10s1 4.9 2.8 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="7" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.5 15.5c.6-2 2-3 3.5-3s2.9 1 3.5 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12.5 8.25a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M11.5 15.5c.35-1.35 1.35-2.25 2.75-2.25s2.4.9 2.75 2.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
