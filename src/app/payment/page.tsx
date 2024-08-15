'use client';

import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import SimpleFormModal from '@/components/PaymentModal'; // Ensure this path is correct

interface PricingFrequency {
  value: string;
  label: string;
  priceSuffix: string;
}

interface PricingTier {
  name: string;
  id: string;
  href: string;
  price: {
    monthly: string;
    annually: string;
  };
  description: string;
  features: string[];
  mostPopular: boolean;
}

const pricing = {
  frequencies: [
    { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
    { value: 'annually', label: 'Annually', priceSuffix: '/year' },
  ] as PricingFrequency[],
  tiers: [
    {
      name: '1 Month',
      id: 'tier-1-month',
      href: '#',
      price: { monthly: 'Rs 600', annually: '$144' },
      description: 'Access to essential AI Attorney features for basic purpose.',
      features: ['Legal document generation', 'Basic case search', 'Email support'],
      mostPopular: false,
    },
    {
      name: '6 Months',
      id: 'tier-6-months',
      href: '#',
      price: { monthly: 'Rs 3000', annually: '$288' },
      description: 'Enhanced support and advanced features for growing firms.',
      features: [
        'Legal document generation',
        'Advanced case search',
        'Priority email support',
        'Access to premium templates',
      ],
      mostPopular: false,
    },
    {
      name: '1 Year',
      id: 'tier-1-year',
      href: '#',
      price: { monthly: 'Rs 6000', annually: '$576' },
      description: 'Comprehensive plan with full access to all AI Attorney tools.',
      features: [
        'Unlimited legal document generation',
        'Full case search access',
        '24/7 priority support',
        'Customizable templates',
        'AI-driven legal insights',
      ],
      mostPopular: true,
    },
  ] as PricingTier[],
};

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const Example: React.FC = () => {
  const [frequency, setFrequency] = useState<PricingFrequency>(pricing.frequencies[0]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  const openModal = (tier: PricingTier) => {
    setSelectedTier(tier);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTier(null);
  };

  return (
    <div className="bg-white">
      <main>
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mt-2 text-4xl font-bold tracking-tight text-black sm:text-5xl">
              Pricing plans for teams of&nbsp;all&nbsp;sizes
            </p>
          </div>

          <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-3">
            {pricing.tiers.map((tier) => (
              <div
                key={tier.id}
                className={classNames(
                  tier.mostPopular ? 'ring-1 ring-gray-300' : 'ring-1 ring-gray-300',
                  'rounded-3xl p-8 bg-white'
                )}
              >
                <h2
                  id={tier.id}
                  className={classNames(
                    tier.mostPopular ? 'text-black' : 'text-gray-900',
                    'text-lg font-semibold leading-8'
                  )}
                >
                  {tier.name}
                </h2>
                <p className="mt-4 text-sm leading-6 text-gray-700">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-black">{tier.price[frequency.value]}</span>
                </p>
                <button
                  onClick={() => openModal(tier)}
                  className={classNames(
                    tier.mostPopular
                      ? 'bg-black text-white shadow-sm hover:bg-gray-800'
                      : 'bg-black text-white shadow-sm hover:bg-gray-800',
                    'mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black'
                  )}
                >
                  Buy plan
                </button>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-700">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-black" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <SimpleFormModal isOpen={isModalOpen} closeModal={closeModal} selectedTier={selectedTier} />
      )}
    </div>
  );
};

export default Example;
