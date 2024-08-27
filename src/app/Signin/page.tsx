/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Inputs = {
  email: string
  password: string
}

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const [showPassword, setShowPassword] = useState(false)
  const [serverResponse, setServerResponse] = useState<{
    message: string
    isError: boolean
  } | null>(null)
  const router = useRouter()

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      console.log(data, 'data from repsonse api')
      if (response.ok) {
        localStorage.setItem('token', data?.token)
        localStorage.setItem('name', data?.username)
        localStorage.setItem('activeChatId', data?.chatId)
        localStorage.setItem('activeUserId', data?.userId)
        document.cookie = `token=${data?.token}; path=/`
        console.log('cookies')
        setServerResponse({
          message: 'Logged in successfully!',
          isError: false,
        })

        setTimeout(() => {
          router.push('/chat')
        }, 0)
      } else {
        setServerResponse({ message: data.message, isError: true })
      }
    } catch (error) {
      setServerResponse({
        message: 'An error occurred. Please try again.',
        isError: true,
      })
    }
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {serverResponse && (
          <div className="flex justify-center">
            <div
              className={`mt-4 rounded-md p-2 ${
                serverResponse.isError ? 'bg-red-500' : 'bg-green-500'
              } max-w-sm text-center text-white`}
            >
              {serverResponse.message}
            </div>
          </div>
        )}
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email', { required: 'Email is required' })}
                className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
                className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
              <label className="flex w-2/4 items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                />
                <span className="py-2 text-xs tracking-wide text-black dark:text-white">
                  Show Password
                </span>
              </label>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-buttonHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="font-semibold leading-6 text-black hover:text-indigo-500"
          >
            SignUp
          </Link>
        </p>
      </div>
    </div>
  )
}
