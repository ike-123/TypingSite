import AccountSettings from '@/Components/AccountSettings'
import React from 'react'

const Settings = () => {
  return (
    <div className='max-w-7xl flex h-100 m-auto'>
        <div className='bg-amber-200 flex-1'>

        </div>

        <div className='bg-neutral-900 flex-5 text-3xl font-bold'>


            <AccountSettings/>
        </div>
    </div>
  )
}

export default Settings