import React from 'react'
import { RegistrationForm } from '../components/ui/Registration'

const page = () => {
  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200'>
        <RegistrationForm />
    </div>
  )
}

export default page