'use client'

import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  Hits,
  Configure,
  Pagination,
  connectRefinementList,
} from 'react-instantsearch-dom'
import '@/styles/base.css'
import { useState, useEffect, useMemo } from 'react'
import Select from 'react-select'
import LogoBlack from '@/images/logo/logo-black.png'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import { Tooltip } from '@nextui-org/tooltip'

// Dynamically load InstantSearch components to disable SSR (Server-Side Rendering)
const InstantSearch = dynamic(
  () => import('react-instantsearch-dom').then((mod) => mod.InstantSearch),
  { ssr: true },
)
const SearchBox = dynamic(
  () => import('react-instantsearch-dom').then((mod) => mod.SearchBox),
  { ssr: true },
)

// Set up TypeSense InstantSearch adapter
const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'qxfa25ROV2MmKOE',
    nodes: [
      {
        host: 'localhost',
        port: 8108,
        protocol: 'http',
      },
    ],
  },
  additionalSearchParameters: {
    query_by: 'title,description,citation,court,year',
  },
})

const searchClient = typesenseInstantsearchAdapter.searchClient

// Component to render each hit
const Hit = ({ hit }: any) => {
  return (
    <Link className="m-0" href={`/casedetail?order_num=${hit.order_num}`}>
      <div className="mb-4 h-auto transform rounded-lg border border-gray-200 bg-white p-4 duration-300 hover:shadow-lg sm:max-h-fit lg:h-64">
        <h2 className="mb-2 line-clamp-3 text-base font-semibold text-gray-900 lg:text-lg">
          {hit.title}
        </h2>
        <p className="mb-1 text-sm text-gray-500">Court: {hit.court}</p>
        <p className="mb-1 text-sm text-gray-500">Year: {hit.year}</p>
        <p className="line-clamp-1 text-base text-gray-700">
          {hit.case_description}
        </p>
      </div>
    </Link>
  )
}

// Custom Refinement Dropdown
const CustomRefinementDropdown = React.memo(function CustomRefinementDropdown({ items, currentRefinement, refine, attribute }: any) {
    const [selectedOption, setSelectedOption] = useState<any>(null)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
      setIsClient(true)
    }, [])

    const options = useMemo(
      () =>
        items.map((item: any) => ({
          value: item.value.toString(),
          label: `${item.label}`,
        })),
      [items],
    )

    const handleChange = (selected: any) => {
      if (selected) {
        refine([selected.value.toString()])
        setSelectedOption(selected)
      } else {
        if (selectedOption !== null) {
          setSelectedOption(null)
          refine([])
        }
      }
    }

    useEffect(() => {
      if (
        !currentRefinement.length ||
        !currentRefinement.includes(selectedOption?.value)
      ) {
        setSelectedOption(null)
      }
    }, [currentRefinement])

    if (!isClient) {
      return null
    }

    // Define custom placeholder text based on the attribute
    const placeholderText: any = {
      citation_name: 'Select a Journal',
      year: 'Select a Year',
      court: 'Select a Court',
      page_no: 'Select Page Number',
      judges: 'Select a Judge',
    }

    return (
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholderText[attribute] || `Select ${attribute}`}
        className="basic-single-select w-full sm:w-48"
        classNamePrefix="select"
        isClearable
        isMulti={false}
      />
    )
  },
)

const ConnectedRefinementDropdown = connectRefinementList(
  CustomRefinementDropdown,
)

// Main search component
export default function SearchCases() {
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false)

  return (
    <div className="min-h-screen w-full bg-white">
      <InstantSearch searchClient={searchClient} indexName="cases">
        {/* Header with logo and title */}
        <div className="flex w-full flex-col items-center bg-white px-6 pt-4 sm:flex-row sm:px-12">
          <div className="mb-2 flex items-center justify-center sm:mb-0 sm:justify-start">
            <Image
              src={LogoBlack}
              width={40}
              height={30}
              alt="Logo"
              className={clsx(
                'text-xl font-bold transition-all duration-300',
                'fill-neutral-950',
              )}
            />
          </div>
          {/* Search Box */}
          <div className="sticky top-0 z-10 w-full bg-white p-4">
            <div className="flex w-full flex-1 items-center">
              <SearchBox
                className="w-full"
                translations={{
                  placeholder: 'Search cases here...',
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full bg-white">
          <div className="flex flex-col py-4 sm:flex-row">
            {/* new filter for small screen */}
            <div className="flex w-full flex-col bg-white px-4 py-4 sm:hidden sm:w-[600px] sm:px-6 md:px-8">
              {/* Title */}
              <div className="items-center justify-center font-sans text-base font-bold text-black">
                Advanced Filter
              </div>

              <div className="mb-4 w-full sm:w-auto">
                <label className="block text-black">Select Journal</label>
                <ConnectedRefinementDropdown attribute="citation_name" />
              </div>
              <div className="mb-4 w-full sm:w-auto">
                <label className="block text-black">Select Year</label>
                <ConnectedRefinementDropdown attribute="year" />
              </div>

              <div className="mb-4 w-full sm:w-auto">
                <label className="block text-black">Select Court</label>
                <ConnectedRefinementDropdown attribute="court" />
              </div>

              <div className="mb-4 flex w-full justify-center sm:w-auto">
                <Tooltip
                  placement="right"
                  classNames={{
                    base: [
                      // arrow color
                      'bg-black',
                    ],
                    content: ['text-white'],
                  }}
                  content="Additional Filters"
                >
                  <button
                    onClick={() =>
                      setShowAdditionalFilters(!showAdditionalFilters)
                    }
                    className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-700"
                  >
                    {showAdditionalFilters ? '-' : '+'}
                  </button>
                </Tooltip>
              </div>

              {/* Additional Filters (conditionally rendered) */}
              {showAdditionalFilters && (
                <div className="w-full">
                  <div className="mb-4 w-full sm:w-auto">
                    <label className="block text-black">Select Page no.</label>
                    <ConnectedRefinementDropdown attribute="page_no" />
                  </div>
                  <div className="mb-4 w-full sm:w-auto">
                    <label className="block text-black">Select Judges</label>
                    <ConnectedRefinementDropdown attribute="judges" />
                  </div>
                </div>
              )}
            </div>

            {/* Display hits */}
            <div className="w-full border-gray-200 bg-white px-4 py-4 sm:px-6 md:px-8">
              <Configure hitsPerPage={4} />
              <Hits hitComponent={Hit} />
            </div>

            <div className="mx-4 hidden w-px bg-gray-800 sm:block"></div>

            {/* Filter section */}
            <div className="hidden w-full flex-col bg-white px-4 py-4 sm:flex sm:w-[600px] sm:px-6 md:px-8">
              {/* Title */}
              <div className="items-center justify-center font-sans text-base font-bold text-black">
                Advanced Filter
              </div>

              <div className="mb-4 w-full sm:w-auto">
                <label className="block text-black">Select Journal</label>
                <ConnectedRefinementDropdown attribute="citation_name" />
              </div>
              <div className="mb-4 w-full sm:w-auto">
                <label className="block text-black">Select Year</label>
                <ConnectedRefinementDropdown attribute="year" />
              </div>

              <div className="mb-4 w-full sm:w-auto">
                <label className="block text-black">Select Court</label>
                <ConnectedRefinementDropdown attribute="court" />
              </div>

              <div className="mb-4 flex w-full justify-center sm:w-auto">
                {!showAdditionalFilters ? (
                  <Tooltip
                    placement="right"
                    delay={0}
                    closeDelay={0}
                    classNames={{
                      base: [
                        'bg-black rounded bg-opacity-80', // arrow color
                      ],
                      content: ['py-2 px-4', 'text-white'],
                    }}
                    content="Additional Filters"
                  >
                    <button
                      onClick={() =>
                        setShowAdditionalFilters(!showAdditionalFilters)
                      }
                      className="w-[40px] rounded-md bg-black px-4 py-2 text-white hover:bg-gray-700"
                    >
                      +
                    </button>
                  </Tooltip>
                ) : (
                  <button
                    onClick={() =>
                      setShowAdditionalFilters(!showAdditionalFilters)
                    }
                    className="w-[40px] rounded-md bg-black px-4 py-2 text-white hover:bg-gray-700"
                  >
                    -
                  </button>
                )}
              </div>

              {/* Additional Filters (conditionally rendered) */}
              {showAdditionalFilters && (
                <div className="w-full">
                  <div className="mb-4 w-full sm:w-auto">
                    <label className="block text-black">Select Page no.</label>
                    <ConnectedRefinementDropdown attribute="page_no" />
                  </div>
                  <div className="mb-4 w-full sm:w-auto">
                    <label className="block text-black">Select Judges</label>
                    <ConnectedRefinementDropdown attribute="judges" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pagination at the bottom */}
          <div className="border-l-1 flex justify-center bg-white sm:flex-row">
            <Pagination
              className="flex flex-wrap justify-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 xl:space-x-10"
              padding={2}
              showLast={true}
            />
          </div>
        </div>
      </InstantSearch>
    </div>
  )
}
