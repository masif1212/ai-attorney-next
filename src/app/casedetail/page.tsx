'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import CaseSummaryModal from '../../components/CaseSummaryModel'
import casesData from '../../../data/casesdata.json'

export default function CaseDetail() {
  const searchParams = useSearchParams()
  const order_num = searchParams?.get('order_num')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Find the case by the order_num from the URL
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

        <div className='flex flex-row justify-between mb-5'>
          <button
            onClick={() => window.history.back()}
            className="mr-2 flex h-10 px-5 items-center justify-center rounded-4xl border-black bg-black hover:bg-buttonHover text-white"
          >
            Back
          </button>
        
          <button
            onClick={openModal}
            className="mr-2 flex h-10 px-5 items-center justify-center rounded-4xl border-black bg-black hover:bg-buttonHover text-white"
          >
            Case Summary
          </button>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-xl">
          <h1 className="mb-4 text-center text-2xl font-extrabold text-gray-800">
            {caseItem.title}
          </h1>
          <p className="mb-6 text-center text-lg font-semibold text-gray-600">
            {caseItem.court}
          </p>
          <p className="mb-6 text-center text-lg font-semibold text-gray-600">
            {caseItem.citation}
          </p>
          <p className="mb-6 text-center text-lg font-semibold text-gray-600">
            {caseItem.judges}
          </p>
          <p className="text-justify text-gray-700 leading-relaxed">
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
