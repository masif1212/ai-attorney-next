import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { Offices } from '@/components/Offices'
import { socialMediaProfiles } from '@/components/SocialMedia'
import Link from 'next/link'
import { SocialMedia } from '@/components/SocialMedia'

export function ContactSection() {

  const navigation = [
    {
      title: 'Connect',
      links: socialMediaProfiles,
    },
  ]


  function Navigation() {
    return (
      <nav className='flex flex-row'>
        <ul role="list" className="flex space-x-8">
          {navigation.map((section, sectionIndex) => (
            <li key={sectionIndex}>
              <div className="font-display text-sm  tracking-wider text-neutral-950">
                {section.title}
              </div>
              <ul role="list" className="mt-2 space-x-5 text-sm flex flex-row text-white font-medium">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="transition hover:text-gray-300"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    );
  }




  return (
    <Container className="mt-24 sm:mt-28 lg:mt-28">
      <FadeIn className="-mx-6 rounded-4xl bg-neutral-950 px-6 py-20 sm:mx-0 sm:py-20 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-xl ">
            <h2 className="font-display text-3xl font-medium text-white [text-wrap:balance] sm:text-4xl">
              We're happy to assist you.
            </h2>
            <div className="mt-6 flex">
              <Button href="/contact" invert>
                Say Hello
              </Button>
            </div>

            <div className="mt-10 border-t border-white/10 pt-10 w-full">
              <h3 className="font-display text-base font-semibold text-white">
                Our offices
              </h3>

              <Offices
                invert
                className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2"
              />
            </div>

          </div>

          <div className="mt-10  max-w-xl border-t border-white/10 pt-10 w-full" />

          <SocialMedia className="mt-6" />

        </div>
      </FadeIn>
    </Container>
  )
}
