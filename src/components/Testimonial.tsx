import Image, { type ImageProps } from 'next/image'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { GridPattern } from '@/components/GridPattern'

export function Testimonial({
  children,
  // client,
  className,
}: {
  children: React.ReactNode
  // client: { logo: ImageProps['src']; name: string }
  className?: string
}) {
  return (
    <div
      className={clsx(
        'relative isolate bg-black py-16 sm:py-28 md:py-32 rounded-4xl',
        className,
      )}
    >
      {/* <GridPattern
        className="absolute inset-0 -z-10 h-full w-full fill-neutral-100 stroke-neutral-950/5 [mask-image:linear-gradient(to_bottom_left,white_50%,transparent_60%)]"
        yOffset={-256}
      /> */}
      <FadeIn>
        <figure className="mx-auto max-w-4xl">
          <blockquote className="relative font-display text-xl sm:text-3xl font-medium tracking-tight text-neutral-950 px-2">
            <p className="before:content-['“'] after:content-['”'] sm:before:absolute sm:before:right-full text-white">
              {children}
            </p>
          </blockquote>
          {/* <figcaption className="mt-10">
              <Image src={client.logo} alt={client.name} unoptimized />
            </figcaption> */}
        </figure>
      </FadeIn>
    </div>
  )
}
