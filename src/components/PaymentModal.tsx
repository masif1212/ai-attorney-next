'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';

export default function SimpleFormModal({ isOpen, closeModal }: any) {
  const [input1, setInput1] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Input 1:', input1);
    if (attachment) {
      console.log('Attachment:', attachment.name);
    }
    closeModal(); // Close the modal after submission
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      className="fixed w-full h-full inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div
        className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto"
        style={{ maxHeight: '80vh', overflowY: 'auto', width: '90%', maxWidth: '600px' }}
      >
        <Dialog.Title className="text-lg font-semibold">Payment Form</Dialog.Title>
        <Dialog.Description className="mt-4 space-y-4">

       
          <input
            type="text"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            placeholder="Enter Transaction Id"
            className="w-full p-2 border rounded-lg"
          />
          
          {/* Attachment Input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Screenshot of transaction</label>
            <input
              type="file"
              onChange={handleAttachmentChange}
              className="w-full text-gray-700 mt-1 p-1 border rounded-lg"
            />
          </div>
        </Dialog.Description>
        <button
          onClick={handleSubmit}
          className="mt-4 inline-flex items-center rounded-lg bg-black px-4 py-2 text-white"
        >
          Submit
        </button>

      </div>
    </Dialog>
  );
}
