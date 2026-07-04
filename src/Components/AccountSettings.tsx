import React from 'react'
import { Input } from './ui/input'
import { useAuthStore } from '@/Stores/AuthStore'

const AccountSettings = () => {


  const User = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.loading)

  return (
    <div w->
      <h1 className='mb-10'>Account Settings</h1>


      <div className='flex-col flex gap-3'>

        <div className='flex gap-3 items-center'>
          <label className='text-lg' htmlFor="">Username</label>
          <Input value={User?.name} disabled />
        </div>


        <div className='flex gap-3 items-center'>
          <label className='text-lg' htmlFor="">Email</label>
          <Input value={User?.email} disabled />
        </div>

        <div className='flex gap-3 items-center'>
          <label className='text-lg text-nowrap' htmlFor="">Key ammount</label>
          <Input value={User?.Keys} disabled />
        </div>


      </div>

    </div>
  )
}

export default AccountSettings