'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import CaseSummaryModal from '../../components/CaseSummaryModel'
import casesData from '../../../data/casesdata.json'

function CaseDetailContent() {
  const searchParams = useSearchParams()
  const order_num = searchParams?.get('order_num')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const caseItem = casesData.find((item) => item.order_num === order_num)

  if (!caseItem) {
    return <p className="text-center text-gray-700">Case not found.</p>
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-gray-100 to-gray-300 p-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="sticky top-0 z-10 mb-5 flex flex-row justify-between bg-gradient-to-r from-gray-100 to-gray-300 px-4 py-3">
          <button
            onClick={() => window.history.back()}
            className="mr-2 flex h-8 items-center justify-center rounded-4xl border-black bg-black px-3 text-white hover:bg-buttonHover sm:h-10 sm:px-5"
          >
            Back
          </button>

          <button
            onClick={openModal}
            className="mr-2 flex h-8 items-center justify-center rounded-4xl border-black bg-black px-3 text-white hover:bg-buttonHover sm:h-10 sm:px-5"
          >
            Case Summary
          </button>
        </div>

        {/* Add top padding to create space for sticky buttons */}
        <div className="rounded-lg bg-white p-6 pt-20 shadow-xl sm:p-8">
          <h1 className="mb-4 text-center text-xl font-extrabold text-gray-800 sm:text-2xl">
            {caseItem.title}
          </h1>
          <p className="mb-4 text-center text-base font-semibold text-gray-600 sm:mb-6 sm:text-lg">
            {caseItem.court}
          </p>
          <p className="mb-4 text-center text-base font-semibold text-gray-600 sm:mb-6 sm:text-lg">
            {caseItem.citation}
          </p>
          <p className="mb-4 text-center text-base font-semibold text-gray-600 sm:mb-6 sm:text-lg">
            {caseItem.judges}
          </p>
          <p className="text-justify text-sm leading-relaxed text-gray-700 sm:text-base">
            {caseItem.case_description}
          </p>
          {/* You can add more case details here */}
        </div>
      </div>

      {/* Modal Component */}
      <CaseSummaryModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        order_num={caseItem.order_num}
        case_description={caseItem.case_description}
      />
    </div>
  )
}

export default function CaseDetail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CaseDetailContent />
    </Suspense>
  )
}
