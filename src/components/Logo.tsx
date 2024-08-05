import { useId } from 'react';
import clsx from 'clsx';

export function Logomark({
  invert = false,
  filled = false,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & {
  invert?: boolean;
  filled?: boolean;
}) {
  return (
    <svg
      width="188"
      height="162"
      viewBox="0 0 188 162"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('transition-all duration-300', { 'fill-white': invert, 'fill-neutral-950': !invert })}
      {...props}
    >
      <path d="M3 160.5L92 3L106 26.5L42.5 138.5H70L92 99.5L106 121L84.5 160.5H3Z" className={clsx({ 'w-8': filled, 'w-0 group-hover/logo:w-8': !filled })} />
      <path d="M120 53L106 75L120 93L132.5 75L120 53Z" />
      <path d="M144.5 95.5L132.5 114.5L158 160.5H184.5L144.5 95.5Z" />
      <path d="M3 160.5L92 3L106 26.5L42.5 138.5H70L92 99.5L106 121L84.5 160.5H3Z" stroke="#0E0D0D" strokeWidth="3" />
      <path d="M120 53L106 75L120 93L132.5 75L120 53Z" stroke="#0E0D0D" strokeWidth="3" />
      <path d="M144.5 95.5L132.5 114.5L158 160.5H184.5L144.5 95.5Z" stroke="#0E0D0D" strokeWidth="3" />
    </svg>
  );
}

export function Logo({
  className,
  invert = false,
  filled = false,
  fillOnHover = false,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & {
  invert?: boolean;
  filled?: boolean;
  fillOnHover?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 170 32"
      aria-hidden="true"
      className={clsx('group/logo', className)}
      {...props}
    >
      <text
        x="5" // Adjusted x-coordinate to reduce gap
        y="25"
        className={clsx(
          'font-bold text-xl transition-all duration-300',
          invert ? 'fill-white' : 'fill-neutral-950'
        )}
        fontSize="20"
        fontFamily="sans-serif"
        // fontStyle="italic"
      >
        AI Attorney
      </text>
    </svg>
  );
}
