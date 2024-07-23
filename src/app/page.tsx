
import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { List, ListItem } from '@/components/List'
import { SectionIntro } from '@/components/SectionIntro'
import { StylizedImage } from '@/components/StylizedImage'
import { Testimonial } from '@/components/Testimonial'
import logoBrightPath from '@/images/clients/bright-path/logo-light.svg'
import logoFamilyFund from '@/images/clients/family-fund/logo-light.svg'
import logoGreenLife from '@/images/clients/green-life/logo-light.svg'
import logoHomeWork from '@/images/clients/home-work/logo-light.svg'
import logoMailSmirk from '@/images/clients/mail-smirk/logo-light.svg'
import logoNorthAdventures from '@/images/clients/north-adventures/logo-light.svg'
import logoPhobiaDark from '@/images/clients/phobia/logo-dark.svg'
import logoPhobiaLight from '@/images/clients/phobia/logo-light.svg'
import logoUnseal from '@/images/clients/unseal/logo-light.svg'
import imageLaptop from '@/images/laptop.jpg'
import rightarrow from "@/images/clients/arrows/right-arrow.png"
import TextAnimation from '@/components/TextAnimation'
import { type CaseStudy, type MDXEntry, loadCaseStudies } from '@/lib/mdx'

const clients = [
  ['Phobia', logoPhobiaLight],
  ['Family Fund', logoFamilyFund],
  ['Unseal', logoUnseal],
  ['Mail Smirk', logoMailSmirk],
  ['Home Work', logoHomeWork],
  ['Green Life', logoGreenLife],
  ['Bright Path', logoBrightPath],
  ['North Adventures', logoNorthAdventures],
]

function Clients() {
  return (
    <div className="mt-24 rounded-4xl bg-neutral-950 py-20 sm:mt-32 sm:py-32 lg:mt-56">
      <Container>
        <FadeIn className="flex items-center gap-x-8">
          <h2 className="text-center font-display text-sm font-semibold tracking-wider text-white sm:text-left">
            We’ve worked with hundreds of amazing people
          </h2>
          <div className="h-px flex-auto bg-neutral-800" />
        </FadeIn>
        <FadeInStagger faster>
          <ul
            role="list"
            className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4"
          >
            {clients.map(([client, logo]) => (
              <li key={client}>
                <FadeIn>
                  <Image src={logo} alt={client} unoptimized />
                </FadeIn>
              </li>
            ))}
          </ul>
        </FadeInStagger>
      </Container>
    </div>
  )
}

function CaseStudies({
  caseStudies,
}: {
  caseStudies: Array<MDXEntry<CaseStudy>>
}) {
  return (
    <>
      <SectionIntro
        title="Features"
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p className='text-justify'>
          We believe AI can transform the legal industry, making it more accessible and efficient. However, we recognize the need to balance innovation with ethical considerations.
        </p>

      </SectionIntro>
      <Container className="mt-16">
        <FadeInStagger className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {caseStudies.map((caseStudy) => (
            <FadeIn key={caseStudy.href} className="flex">
              <article className="relative flex w-full flex-col rounded-3xl p-6 ring-1 ring-neutral-950/5 transition hover:bg-neutral-50 sm:p-8">
                <h3>
                  <Link href={caseStudy.href}>
                    <span className="absolute inset-0 rounded-3xl" />
                    <Image
                      src={caseStudy.logo}
                      alt={caseStudy.client}
                      className="h-16 w-16"
                      unoptimized
                    />
                  </Link>
                </h3>
                <p className="mt-6 flex gap-x-2 text-sm text-neutral-950">
                  <time
                    dateTime={caseStudy.date.split('-')[0]}
                    className="font-semibold"
                  >
                    {caseStudy.date.split('-')[0]}
                  </time>
                  <span className="text-neutral-300" aria-hidden="true">
                    /
                  </span>
                  <span>Case study</span>
                </p>
                <p className="mt-6 font-display text-2xl font-semibold text-neutral-950">
                  {caseStudy.title}
                </p>
                <p className="mt-4 text-base text-neutral-600">
                  {caseStudy.description}
                </p>
              </article>
            </FadeIn>
          ))}
        </FadeInStagger>
      </Container>
    </>
  )
}

function Services() {
  return (
    <>
      <SectionIntro
        eyebrow="Services"
        title="AI Attorney optimizes legal processes with AI technology."
        className="mt-24 sm:mt-32 lg:mt-40"
      >

      </SectionIntro>
      
      <Container className="mt-16">
        <div className="lg:flex lg:items-center lg:justify-end">
          <div className="flex justify-center lg:w-1/2 lg:justify-end lg:pr-12">
            <FadeIn className="w-[33.75rem] flex-none lg:w-[40rem]">
              <StylizedImage
                src={imageLaptop}
                sizes="(min-width: 1024px) 41rem, 31rem"
                className="justify-center lg:justify-end"
              />
            </FadeIn>
          </div>
          <List className="mt-16 lg:mt-0 lg:w-1/2 lg:min-w-[33rem] lg:pl-4">
            <ListItem title="AI-Powered Document Generation">
              Our platform generates precise legal documents, including contracts and agreements, tailored to your specific needs. By automating this process, we save you time and reduce errors, allowing you to focus on strategic legal matters.
            </ListItem>
            <ListItem title="Personalized Legal Advice">
              AI Attorney provides tailored legal advice by analyzing your situation with AI. Our advice is relevant, up-to-date, and designed to help you make informed decisions without the high costs of traditional consultations.
            </ListItem>
            <ListItem title="Digital Solutions for Law Firms">
              We offer digital solutions that streamline law firm operations, from case management to client communication. Our AI tools automate routine tasks, enhance productivity, and help law firms deliver superior service in a competitive legal landscape.
            </ListItem>
            <ListItem title="Summary">
              AI Attorney harnesses advanced AI technology to offer a comprehensive suite of services, including document generation, personalized legal advice, and digital solutions for law firms. Our goal is to make legal processes more efficient, accurate, and cost-effective, enabling individuals and businesses to navigate legal challenges with confidence.
            </ListItem>
          </List>
        </div>
      </Container>
    </>
  )
}

export const metadata: Metadata = {
  description:
    'We are a development studio working at the intersection of design and technology.',
}

export default async function Home({ invert = false, }: { invert?: boolean }) {
  let caseStudies = (await loadCaseStudies()).slice(0, 3)



  return (
    <div>
      <Container className='mt-10 sm:mt-32 md:mt-52'>
        <div className=" flex items-center">
          <TextAnimation />
        </div>
      </Container>

      <Container className="mt-10">
        <FadeIn className="max-w-3xl">
          {/* <h1 className="font-display text-5xl font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-7xl">
          Introduction
        </h1> */}
          <p className="mt-6 text-xl text-neutral-600 text-justify">
            AI Attorney is a leading legal tech company transforming the legal industry with advanced AI. Our platform generates legal documents, drafts agreements, and offers tailored legal advice for individuals and businesses. We streamline legal processes, boost efficiency, and provide cost-effective legal solutions.
          </p>
        </FadeIn>

        <Button href="" invert={invert} className='mt-5'>
          Get Started
          <Image
          src={rightarrow}
          unoptimized
          height={30}
          width={30}
          className="ml-2"
          alt="Arrow"
        />
        </Button>
      </Container>

      <Clients />

      <CaseStudies caseStudies={caseStudies} />

      <Testimonial
        className="mt-24 sm:mt-32 lg:mt-40"
        client={{ name: 'Phobia', logo: logoPhobiaDark }}
      >
        The team at Studio went above and beyond with our onboarding, even finding a way to access the user’s microphone without triggering one of those annoying permission dialogs.
      </Testimonial>

      <Services />

      <ContactSection />
    </div>
  )
}
