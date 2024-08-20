'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'

function formatResponseText(inputMessage: string):any {
  const generalHeadingPattern = /^(\s*-*\s*\d*\.?\s*)(.*?):/gm;
  const markdownHeaderPattern = /^#+\s*(.*?):?/gm;
  const boldTextPattern = /\*\*(.*?)\*\*/g;
  const caseNumberPattern = /Case Number: ([\s\S]*?)(?=\n)/g;

  let finalText = inputMessage.replace(generalHeadingPattern, (match, p1, p2) => {
    return `<h3 style="font-size: 1.4em; margin-top: 8px; color: black;"><strong style="font-weight: 600;">${p2.trim()}:</strong></h3>`;
  });

  finalText = finalText.replace(markdownHeaderPattern, (match, p1) => {
    return `<h3 style="font-size: 1.4em; margin-top: 8px; color: black;"><strong style="font-weight: 600;">${p1.trim()}</strong></h3>`;
  });

  finalText = finalText.replace(boldTextPattern, (match, p1) => `<strong>${p1}</strong>`);

  finalText = finalText.replace(caseNumberPattern, (match, p1) => `<span style="font-weight: 700; font-size: 1.3em;">Case Number: &#8226; ${p1.trim()}</span>`);

  finalText = finalText.replace(/^- (.*)/gm, (match, p1) => `<p>${p1.trim()}</p>`);

  // Clean up any excessive new lines
  finalText = finalText.replace(/\n{2,}/g, "\n\n");
  finalText = finalText.replace(/^\n+|\n+$/g, "");

  return finalText;
}



export default function CaseSummaryModal({ isOpen, closeModal, order_num, case_description }: any) {
  const [summary, setSummary] = useState('');
  console.log("hehkasdfajhdfjafdjh", summary)

    const fetchCaseSummary = async () => {
        try {
            const response = await fetch('http://a2.aiattorney.com.pk/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: case_description }),
            })
            const data = await response.json();
            // Format summary before setting it
            setSummary(formatResponseText(data.summary));
        } catch (error) {
            setSummary('Failed to fetch summary.');
        }
    }

  useEffect(() => {
    if (isOpen) {
      fetchCaseSummary();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={closeModal} className="fixed w-full h-full inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto" style={{ maxHeight: '80vh', overflowY: 'auto', width: '90%', maxWidth: '600px' }}>
        <Dialog.Title className="text-lg font-semibold">Case Summary</Dialog.Title>
        <Dialog.Description className="mt-2 text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: summary ? summary : 'Generating summary...' }}>
        </Dialog.Description>
        <button onClick={closeModal} className="mt-4 inline-flex items-center rounded-lg bg-black px-4 py-2 text-white">
          Close
        </button>
      </div>
    </Dialog>
  )
}
