import { motion } from 'framer-motion';
import {  useMemo } from 'react';

type AlertProps = {
  serverResponse: { message: string; isError: boolean } | null;
  setServerResponse: (value: { message: string; isError: boolean } | null) => void;
};

export default function Alert({ serverResponse, setServerResponse }: AlertProps) {
    useMemo(() => {
        if (serverResponse) {
            const timer = setTimeout(() => {
        setServerResponse(null); 
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [serverResponse, setServerResponse]);

  if (!serverResponse) return null;

  return (
    <div className='w-full'>

    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 10 }}
      className={`mt-4 p-3 rounded-md ${
        serverResponse.isError ? 'bg-red-500' : 'bg-green-500'
      } text-white text-center`}
    >
      {serverResponse.message}
    </motion.div>
    </div>
  );
}
