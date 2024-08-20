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
import { useState } from 'react'
import Select from 'react-select'

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
      <div className="mb-4 transform rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
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
  const [selectedOptions, setSelectedOptions] = useState<any[]>([])

  const options = items.map((item: any) => ({
    value: item.value,
    label: `${item.label} (${item.count})`,
  }))

  const handleChange = (selected: any) => {
    setSelectedOptions(selected)
    refine(selected.map((opt: any) => opt.value))
  }

  return (
    <Select
      options={options}
      isMulti
      value={selectedOptions}
      onChange={handleChange}
      placeholder={` ${attribute}`}
      className="basic-multi-select w-48"
      classNamePrefix="select"
    />
  )
}

const ConnectedRefinementDropdown = connectRefinementList(
  CustomRefinementDropdown,
)

// Main search component
export default function SearchCases() {
  return (
    <InstantSearch searchClient={searchClient} indexName="cases">
      <div className="min-h-screen w-full bg-gray-50">
        {/* Search input at the top */}
        <div className="sticky top-0 z-10 w-full bg-white p-4 shadow-lg">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <button
              onClick={() => window.history.back()}
              className="w-auto rounded-lg border border-black bg-black px-4 py-2 text-white transition hover:bg-gray-800"
            >
              Back
            </button>
            <div className="flex w-full flex-1 items-center">
              <SearchBox
                className="w-full"
                translations={{
                  placeholder: 'Enter search query...',
                }}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col justify-center space-y-4 px-6 py-4 lg:flex-row lg:space-x-4 lg:space-y-0">
          <div className="w-auto">
            <label className="block text-gray-700">Select Journal</label>
            <ConnectedRefinementDropdown attribute="citation_name" />
          </div>
          <div className="w-full max-w-xs">
            <label className="block text-gray-700">Select Year</label>
            <ConnectedRefinementDropdown attribute="year" />
          </div>

          <div className="w-full max-w-xs">
            <label className="block text-gray-700">Select Court</label>
            <ConnectedRefinementDropdown attribute="court" />
          </div>
        </div>

        {/* Display hits */}
        <div className="px-8 py-4">
          <Configure hitsPerPage={10} />
          <Hits hitComponent={Hit} />
        </div>

        {/* Pagination at the bottom */}
        <div className="flex justify-center bg-white py-4">
          <Pagination
            className="flex flex-wrap justify-center space-x-2"
            padding={2}
            showLast={true}
          />
        </div>
      </div>
    </InstantSearch>
  )
}
