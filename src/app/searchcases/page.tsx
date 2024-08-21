'use client'

import { useMemo,useState } from 'react'
import casesData from '../../../data/casesdata.json'
import Link from 'next/link'
import {  redirect, useRouter } from 'next/navigation'
interface CaseItem {
  order_num: string
  citation: string
  title: string
  court: string
  relatedcase_type: string
  description: string
  below_notes: string
  case_description: string
  year: string
  citation_name: string
  page_no: string
  related_laws: string
  judges: string
  refer_link: string | null
  case_facts: string
  case_judgement: string
  case_proceddings: string
  Questions: string
  Vocabulary: string
}

export default function SearchCases() {
  const [filteredCases, setFilteredCases] = useState(casesData.slice(0, 10))
  const [searchQuery, setSearchQuery] = useState('')


 const router =useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
 

    const filtered = casesData.filter(
      (caseItem) =>
        caseItem.title.toLowerCase().includes(query) ||
        caseItem.description.toLowerCase().includes(query) ||
        caseItem.citation.toLowerCase().includes(query) ||
        caseItem.court.toLowerCase().includes(query),
    )
    setFilteredCases(filtered)
 
  }

  return (
    <>
    <div className="min-h-screen w-full bg-gray-100">
      {/* Search input at the top */}
      <div className="sticky top-0 z-10  w-full  bg-white p-4 shadow-lg">
        <div className="ml-auto flex flex-row justify-center items-center">

          <button
            onClick={() => window.history.back()}
            className="mr-2 flex h-8 sm:h-10 px-3 sm:px-5 items-center justify-center rounded-4xl border-black bg-black hover:bg-buttonHover text-white"
          >
            Back
          </button>


          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Enter search query..."
            className="mx-auto block w-full max-w-xl sm:max-w-2xl rounded-lg sm:rounded-2xl border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>

      <div className="p-6">
        <div className="mx-auto w-full max-w-6xl space-y-4 z-1">
          {filteredCases.length > 0 ? (
            filteredCases.map((caseItem) => (
              <Link
                key={caseItem.order_num}
                href={`/casedetail?order_num=${caseItem.order_num}`}
                className="block"
              >
                <div
                  key={caseItem.order_num}
                  className="transform rounded-lg bg-white p-4 sm:p-6 shadow-lg transition-transform hover:scale-100"
                >
                  <h2 className="text-xl sm:text-2xl text-black-800 mb-2 font-semibold">
                    {caseItem.title}
                  </h2>
                  <p className="mb-2 font-medium text-gray-700 text-sm sm:text-base">
                    {caseItem.court}
                  </p>
                  <p className="line-clamp-4 text-gray-900 text-sm sm:text-base">
                    {caseItem.case_description}
                  </p>
                </div>
              </Link>

            ))
          ) : (
            <p className="text-center text-gray-700">No cases found.</p>
          )}
        </div>
      </div>
    </div>


</>

  )
}
