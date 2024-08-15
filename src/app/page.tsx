
import { type Metadata } from 'next'
import Image from 'next/image'

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
import rightarrow from '@/images/clients/arrows/right-arrow.png'
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
  ['Confidential', logoUnseal],
  ['Responsive Solutions', logoUnseal],
  ['Case Summary', logoUnseal],
]



function Clients() {
  return (
    <div className="mt-24 h-auto rounded-4xl bg-neutral-950 py-10  lg:mt-56">
      <Container className="h-full w-full px-4 sm:px-6 lg:px-8">
        <FadeIn className="flex items-center gap-x-8">
          {/* <div className="h-px flex-auto bg-neutral-800" /> */}
        </FadeIn>
        <FadeInStagger faster>
        <div className="mt-10 flex h-full w-full flex-col gap-0 sm:flex-row">
  <div className="flex w-full flex-col justify-center text-white sm:w-1/3 sm:border-r sm:border-white sm:pr-6">
    <h3 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
      AI Attorney
    </h3>
    <p className="mt-6 text-base sm:text-base lg:text-base">
      AI Attorney is a pioneering legal tech company revolutionizing
      the legal industry with cutting-edge AI solutions. Our platform
      excels in generating legal documents, drafting agreements.
    </p>
    <p className="mt-6 text-base sm:text-base lg:text-base">
      By streamlining legal processes, enhancing efficiency, and
      delivering cost-effective legal services, we empower our clients
      to navigate the legal landscape with ease and confidence.
    </p>
  </div>

  <div className="flex w-full items-center justify-center sm:w-2/3 sm:pl-16 sm:py-4 sm:pt-6 sm:pb-6 mt-6 sm:mt-0">
    <video
      controls
      preload="metadata"
      loop
      autoPlay
      muted
      className="h-auto max-h-[400px] w-full transform rounded-lg sm:max-h-[500px] sm:w-[500px] lg:max-h-[800px] lg:w-[800px]"
      style={{ objectFit: 'cover' }}
    >
      <source src="/videos/Dummy.mp4" type="video/mp4" />
    </video>
  </div>
</div>

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
    <div id="case-studies">
      <SectionIntro title="Features" className="mt-24 sm:mt-32 lg:mt-40">
        <p>
          We believe technology holds the key to addressing the world’s most
          complex challenges. However, it can also contribute to these
          challenges, placing us in a paradoxical situation.
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
                <p className="mt-6 font-display text-2xl font-semibold text-neutral-950 h-16">
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
    </div>
  )
}

function Services() {
  return (
    <div>
      <SectionIntro
        // eyebrow="Comming Soon"
        title="Comming Soon"
        className="mt-24 text-2xl sm:mt-32 lg:mt-40"
      >
        <p>Enhancing Your Legal Journey with Innovative AI Solutions.</p>
      </SectionIntro>

      <Container className="mt-16">
        <div className="lg:flex lg:items-center lg:justify-end">
          <div className="flex justify-center lg:w-1/2 lg:justify-end lg:pr-12">
            <FadeIn className="w-[33.75rem] flex-none lg:w-[40rem]">
              <div id="comming-soon">
                <StylizedImage
                  src={imageLaptop}
                  sizes="(min-width: 1024px) 41rem, 31rem"
                  className="justify-center lg:justify-end"
                />
              </div>
            </FadeIn>
          </div>
          <div>
            <List className="mt-16 lg:mt-0 lg:w-1/2 lg:min-w-[33rem] lg:pl-4">
              <ListItem title="Digital solution for law firms">
                Our AI-powered Document Review feature carefully examines your
                legal documents for accuracy and compliance. It highlights any
                potential issues, inconsistencies, and risks, providing a
                detailed review that saves you time and improves the quality of
                your paperwork. Whether you are dealing with contracts,
                agreements, or other legal documents, our AI ensures they are
                thorough and error-free.
              </ListItem>
              <ListItem title="Legal Consultation">
              Get instant, reliable legal advice with AI Attorney’s consultation feature. Our AI-powered bot is trained on an extensive database of legal cases, providing you with accurate and relevant insights tailored to your specific queries. Whether you're a client seeking advice or a lawyer looking for a second opinion, AI Attorney offers accessible, on-demand legal consultation that you can trust.
              </ListItem>
              <ListItem title="Legal Agreement Drafting">
                Our Legal Consultation feature offers personalized legal advice
                using AI-driven insights. By understanding your unique
                situation, our platform provides tailored recommendations and
                guidance to help you navigate complex legal matters. Whether you
                need advice on legal strategies, compliance, or specific legal
                questions, our AI consultation service delivers precise and
                actionable advice, making legal expertise accessible and
                affordable for both individuals and businesses.
              </ListItem>
              {/* <ListItem title="Summary">
              AI Attorney harnesses advanced AI technology to offer a comprehensive suite of services, including document generation, personalized legal advice, and digital solutions for law firms. Our goal is to make legal processes more efficient, accurate, and cost-effective, enabling individuals and businesses to navigate legal challenges with confidence.
            </ListItem> */}
            </List>
          </div>
        </div>
      </Container>
    </div>
  )
}

export const metadata: Metadata = {
  description:
    'We are a development studio working at the intersection of design and technology.',
}

export default async function Home({ invert }: { invert: boolean }) {
  let caseStudies = (await loadCaseStudies()).slice(0, 3)

  return (
    <div>
      <Container className="mt-20 sm:mt-32 md:mt-52">
        <div className="flex items-center">
          <TextAnimation />
        </div>
      </Container>

      <Container className="mt-10">
        <FadeIn className="max-w-3xl">
          {/* <h1 className="font-display text-5xl font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-7xl">
          Introduction
        </h1> */}
          <p className="mt-6 text-xl text-neutral-600 ">
            AI Attorney is a leading legal tech company transforming the legal industry with advanced AI. Our platform generates legal documents, drafts agreements, and offers tailored legal advice for individuals and businesses. We streamline legal processes, boost efficiency, and provide cost-effective legal solutions.
          </p>
        </FadeIn>

        <Button href="/signup" invert={invert} className="mt-5">
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
        className="mt-24 sm:mt-32 lg:mt-40 p-4 sm:p-6 lg:p-8 text-xs sm:text-base lg:text-lg"
      // client={{ name: 'Phobia', logo: logoPhobiaDark }}
      >
        Combining the power of AI with the profound depth of Pakistani legal
        precedents, our platform transforms legal research into a precise and
        insightful process, ensuring you’re always equipped with the
        knowledge to lead.
      </Testimonial>

      <Services />

      <ContactSection />
    </div>
  )
}
