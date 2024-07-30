import { type Metadata } from 'next'
import Image from 'next/image'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
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
  ['Confidential', logoUnseal],
  ['Responsive Solutions', logoUnseal],
  ['Case Summary', logoUnseal],
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
        <p>
          We believe technology holds the key to addressing the world’s most complex challenges. However, it can also contribute to these challenges, placing us in a paradoxical situation.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <FadeInStagger className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {caseStudies.map((caseStudy) => (
            <FadeIn key={caseStudy.href} className="flex">
              <article className="relative flex w-full flex-col rounded-3xl p-6 ring-1 ring-neutral-950/5 transition hover:bg-neutral-50 sm:p-8">
                <h3>
                  <span className="absolute inset-0 rounded-3xl" />
                  <Image
                    src={caseStudy.logo}
                    alt={caseStudy.client}
                    className="h-16 w-16"
                    unoptimized
                  />

                </h3>
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
        eyebrow="Comming Soon"
        title="Enhancing Your Legal Journey with Innovative AI Solutions."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          As long as those opportunities involve giving us money to re-purpose
          old projects — we can come up with an endless number of those.
        </p>
      </SectionIntro>

      <Container className="mt-16">
        <div className="lg:flex lg:items-center lg:justify-end">
          <div className="flex justify-center lg:w-1/2 lg:justify-end lg:pr-12">
            <FadeIn className="w-[33.75rem] flex-none lg:w-[45rem]">
              <StylizedImage
                src={imageLaptop}
                sizes="(min-width: 1024px) 41rem, 31rem"
                className="justify-center lg:justify-end"
              />
            </FadeIn>
          </div>
          <List className="mt-16 lg:mt-0 lg:w-1/2 lg:min-w-[33rem] lg:pl-4">
            <ListItem title="Document Review" >
              Our AI-powered Document Review feature carefully examines your legal documents for accuracy and compliance. It highlights any potential issues, inconsistencies, and risks, providing a detailed review that saves you time and improves the quality of your paperwork. Whether you are dealing with contracts, agreements, or other legal documents, our AI ensures they are thorough and error-free.
            </ListItem>
            <ListItem title="Legal Consultation">
              Our Legal Consultation feature offers personalized legal advice using AI-driven insights. By understanding your unique situation, our platform provides tailored recommendations and guidance to help you navigate complex legal matters. Whether you need advice on legal strategies, compliance, or specific legal questions, our AI consultation service delivers precise and actionable advice, making legal expertise accessible and affordable for both individuals and businesses.
            </ListItem>
            <ListItem title="Legal Agreement Drafting">
              Our Legal Consultation feature offers personalized legal advice using AI-driven insights. By understanding your unique situation, our platform provides tailored recommendations and guidance to help you navigate complex legal matters. Whether you need advice on legal strategies, compliance, or specific legal questions, our AI consultation service delivers precise and actionable advice, making legal expertise accessible and affordable for both individuals and businesses.
            </ListItem>
            {/* <ListItem title="Summary">
              AI Attorney harnesses advanced AI technology to offer a comprehensive suite of services, including document generation, personalized legal advice, and digital solutions for law firms. Our goal is to make legal processes more efficient, accurate, and cost-effective, enabling individuals and businesses to navigate legal challenges with confidence.
            </ListItem> */}
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

export default async function Home({invert}:{invert: boolean}) {
  let caseStudies = (await loadCaseStudies()).slice(0, 6)

  return (
    <div>
      <Container className='mt-20 sm:mt-32 md:mt-52'>
        <div className="flex items-center">
          <TextAnimation />
        </div>
      </Container>


      <Container className="mt-10">
        <FadeIn className="max-w-3xl">
          <h1 className="font-display text-5xl font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-7xl">
            What is AI Attorney.
          </h1>
          <p className="mt-6 text-xl text-neutral-600 text-justify">
            AI Attorney is a pioneering legal technology company dedicated to revolutionizing the legal industry through the power of artificial intelligence (AI). Our platform utilizes cutting-edge AI algorithms to generate legal documents, draft agreements, and provide tailored legal advice to individuals and businesses. By harnessing the capabilities of AI, we aim to streamline legal processes, enhance efficiency, and provide cost-effective solutions to legal challenges.
          </p>
        </FadeIn>

        <Button href="/signup" invert={invert} className='mt-5'>
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
        The team at Studio went above and beyond with our onboarding, even
        finding a way to access the user’s microphone without triggering one of
        those annoying permission dialogs.
      </Testimonial>

      <Services />

      <ContactSection />
    </>
  )
}
