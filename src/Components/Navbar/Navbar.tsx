import { useAuthStore } from '@/Stores/AuthStore'
import React from 'react'
import { Spinner } from '../ui/spinner'
// import './Navbar.scss'

const Navbar = () => {

  const User = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.loading)



  // if (isLoading) {
  //   return (
  //     <Spinner />
  //   )
  // }

  // if (!User) {
  //   return (
  //     <></>
  //   )
  // }

  return (
    <div className='Navbar  h-10'>
      <div className="container flex justify-end">

        {
          isLoading ? (

            <div className='w-10 h-10 flex justify-center items-center'>
              <Spinner className='size-6'/>

            </div>
          )


            :

            (User

              ?

              <div className="logo">
                <img className='rounded-full h-10 w-10 object-cover' src={User.image} alt="" />
              </div>

              : "")
        }


      </div>
    </div>
  )
}

export default Navbar