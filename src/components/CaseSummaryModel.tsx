'use client'

import { useState,useEffect } from 'react'
import { Dialog } from '@headlessui/react'

export default function CaseSummaryModal({ isOpen, closeModal, order_num, case_description }:any) {
  const [summary, setSummary] = useState('')

  const fetchCaseSummary = async () => {
    try {
      const response = await fetch('/api/generateSummary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_num, case_description }),
      })
      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error('Error fetching case summary:', error)
      setSummary('Failed to fetch summary.')
    }
  }

  useEffect(() => {
    console.log('Modal is open:', isOpen) 
    if (isOpen) {
      fetchCaseSummary()
    }
  }, [isOpen]) 

  return (
    <Dialog open={isOpen} onClose={closeModal} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto">
        <Dialog.Title className="text-lg font-semibold">Case Summary</Dialog.Title>
        <Dialog.Description className="mt-2 text-sm text-gray-500">
          {summary ? summary : 'Generating summary...'}
        </Dialog.Description>
        <button
          onClick={closeModal}
          className="mt-4 inline-flex items-center rounded-lg bg-black px-4 py-2 text-white"
        >
          Close
        </button>
      </div>
    </Dialog>
  )
}
