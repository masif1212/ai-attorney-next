"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  linkedinUrl?: string;
  facebookUrl?: string;
};

type ServerResponse = {
  message: string;
  isError: boolean;
};

export default function SignUp() {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<RegisterForm>();
  const [serverResponse, setServerResponse] = useState<ServerResponse | null>(null);
  const router = useRouter();

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setServerResponse({ message: 'Passwords do not match', isError: true });
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok) {
      setServerResponse({ message: 'Signup successful!', isError: false });
      setTimeout(() => {
        router.push('/signin');
      }, 1000);
    } else {
      setServerResponse({ message: result.message, isError: true });
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign Up to your account
        </h2>
      </div>
      {serverResponse && (
          <div
            className={`mt-4 p-3 rounded-md ${
              serverResponse.isError ? 'bg-red-500' : 'bg-green-500'
            } text-white text-center`}
          >
            {serverResponse.message}
          </div>
        )}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              Name <span className="text-red-500 font-bold text-xl">*</span>
            </label>
            <div className="mt-2">
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address <span className="text-red-500 font-bold text-xl">*</span>
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
              Phone Number <span className="text-red-500 font-bold text-xl">*</span>
            </label>
            <div className="mt-2">
              <input
                id="phone"
                type="tel"
                {...register('phone', { required: 'Phone number is required', pattern: { value: /^[0-9]{11}$/, message: 'Invalid phone number' } })}
                placeholder="03XXXXXXXXX"
                className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              />
              {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password <span className="text-red-500 font-bold text-xl">*</span>
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long',
                  },
                  maxLength: {
                    value: 20,
                    message: 'Password cannot exceed 20 characters',
                  },
                 })}
                className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              />
              {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
              Confirm Password <span className="text-red-500 font-bold text-xl">*</span>
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', { required: 'Confirm Password is required' })}
                className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              />
              {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
            </div>
          </div>
          <div>
            <label htmlFor="linkedinUrl" className="block text-sm font-medium leading-6 text-gray-900">
              Linkedin Profile URL
            </label>
            <div className="mt-2">
              <input
                id="linkedinUrl"
                type="url"
                {...register('linkedinUrl')}
                placeholder="Enter LinkedIn profile URL"
                className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="facebookUrl" className="block text-sm font-medium leading-6 text-gray-900">
              Facebook Profile URL
            </label>
            <div className="mt-2">
              <input
                id="facebookUrl"
                type="url"
                {...register('facebookUrl')}
                placeholder="Enter Facebook profile URL"
                className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-buttonHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            >
              Sign up
            </button>
          </div>
        </form>
     
        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/signin" className="font-semibold leading-6 text-black hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
