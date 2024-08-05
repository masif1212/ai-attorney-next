import clsx from 'clsx'

function Office({
  name,
  children,
  invert = false,
}: {
  name: string
  children: React.ReactNode
  invert?: boolean
}) {
  return (
    <address
      className={clsx(
        'text-sm not-italic',
        invert ? 'text-neutral-300' : 'text-neutral-600',
      )}
    >
      <strong className={invert ? 'text-white' : 'text-neutral-950'}>
        {name}
      </strong>
      <br />
      {children}
    </address>
  )
}

export function Offices({
  invert = false,
  ...props
}: React.ComponentPropsWithoutRef<'ul'> & { invert?: boolean }) {
  return (
    <ul role="list" {...props}>
      <li>
        <Office name="Pakistan" invert={invert}>
        
        Building 184, 3rd Floor, Spring North, Near Shaheen Chowk, Baharia Town Phase 7, Islamabad
          <br />
          DHA I, Islamabad
        </Office>
      </li>
      <li>
        <Office name="Canada" invert={invert}>
        4124, Regina Avenue, Regina SK
          <br />
          Canada S4S 0H9
        </Office>
      </li>
    </ul>
  )
}
