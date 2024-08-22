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
import { useState, useEffect } from 'react'
import Select from 'react-select'
import LogoBlack from '@/images/logo/logo-black.png'
import clsx from 'clsx'
import Image from 'next/image'

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
function Hit({ hit }: any) {
  return (
    <Link href={`/casedetail?order_num=${hit.order_num}`}>
      <div className="mb-4 transform rounded-lg bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">
          {hit.title}
        </h2>
        <p className="mb-1 text-sm text-gray-500">Court: {hit.court}</p>
        <p className="mb-1 text-sm text-gray-500">Year: {hit.year}</p>
        <p className="line-clamp-3 text-base text-gray-700">
          {hit.case_description}
        </p>
      </div>
    </Link>
  )
}

// Custom Refinement Dropdown
const CustomRefinementDropdown = ({
  items,
  currentRefinement,
  refine,
  attribute,
}: any) => {
  const [selectedOption, setSelectedOption] = useState<any>(null)

  // Map options
  const options = items.map((item: any) => ({
    value: item.value,
    label: `${item.label}`,
  }))

  const handleChange = (selected: any) => {
    setSelectedOption(selected)
    // Refine with the selected option (replace any previous selection)
    refine(selected ? [selected.value] : [])
  }

  // Ensure the selected option is correctly handled when the refinement changes
  useEffect(() => {
    if (!currentRefinement.length) {
      setSelectedOption(null)
    }
  }, [currentRefinement])

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={handleChange}
      placeholder={` ${attribute}`}
      className="basic-single-select w-full sm:w-48"
      classNamePrefix="select"
      isClearable
    />
  )
}

const ConnectedRefinementDropdown = connectRefinementList(
  CustomRefinementDropdown,
)

// Main search component
export default function SearchCases() {
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false)

  return (
    <InstantSearch searchClient={searchClient} indexName="cases">
      {/* Header with logo and title */}
      <div className="flex flex-col sm:flex-row items-center bg-gray-50 pt-4 px-6 sm:px-12 w-full">
        <div className="flex items-center justify-center sm:justify-start mb-2 sm:mb-0">
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
        <div className="flex-grow flex justify-center items-center">
          <h1 className="text-xl font-bold">Search Cases</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full bg-gray-50">

        {/* Search Box */}
        <div className="sticky top-0 z-10 w-full bg-gray-50 p-4">
          <div className="flex w-full flex-1 items-center">
            <SearchBox
              className="w-full"
              translations={{
                placeholder: 'Enter search query...',
              }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row flex-wrap justify-center space-y-4 lg:space-y-0 lg:space-x-4 px-6 py-4">
          <div className="w-full sm:w-auto">
            <label className="block text-gray-700">Select Journal</label>
            <ConnectedRefinementDropdown attribute="citation_name" />
          </div>
          <div className="w-full sm:w-auto max-w-xs">
            <label className="block text-gray-700">Select Year</label>
            <ConnectedRefinementDropdown attribute="year" />
          </div>

          <div className="w-full sm:w-auto max-w-xs">
            <label className="block text-gray-700">Select Court</label>
            <ConnectedRefinementDropdown attribute="court" />
          </div>

          {/* Button to show additional filters */}
          <div className="w-full sm:w-auto flex items-end">
            <button
              onClick={() => setShowAdditionalFilters(!showAdditionalFilters)}
              className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              {showAdditionalFilters ? '-' : '+'}
            </button>
          </div>
        </div>

        {/* Additional Filters (conditionally rendered) */}
        {showAdditionalFilters && (
          <div className="flex flex-col lg:flex-row flex-wrap justify-center space-y-4 lg:space-y-0 lg:space-x-4 px-6 py-4">
            <div className="w-full sm:w-auto max-w-xs">
              <label className="block text-gray-700">Select Page no.</label>
              <ConnectedRefinementDropdown attribute="page_no" />
            </div>
            <div className="w-full sm:w-auto max-w-xs">
              <label className="block text-gray-700">Select Judges</label>
              <ConnectedRefinementDropdown attribute="judges" />
            </div>
          </div>
        )}

        {/* Display hits */}
        <div className="px-4 sm:px-6 md:px-8 py-4">
          <Configure hitsPerPage={10} />
          <Hits hitComponent={Hit} />
        </div>

        {/* Pagination at the bottom */}
        <div className="flex justify-center bg-white py-4">
          <Pagination
            className="flex flex-wrap justify-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 xl:space-x-10"
            padding={2}
            showLast={true}
          />
        </div>

      </div>
    </InstantSearch>
  )
}
