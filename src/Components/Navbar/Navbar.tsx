import { useAuthStore } from '@/Stores/AuthStore'
import React from 'react'
import { Spinner } from '../ui/spinner'


import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Link } from 'react-router-dom'


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





      <div className="container flex h-full justify-end">


        <div className='flex flex-row items-center mr-10 '>
          <img className='h-full' src="https://static.vecteezy.com/system/resources/previews/022/187/081/non_2x/3d-key-caps-or-keyboard-icon-rendering-free-png.png" alt="" />
          <h1>{User?.Keys}</h1>
        </div>

        {
          isLoading ? (

            <div className='w-10 h-10 flex justify-center items-center'>
              <Spinner className='size-6' />

            </div>
          )


            :

            (User

              ?

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>



                    <NavigationMenuTrigger className='h-10'>


                      <div className="flex gap-3 justify-center items-center">
                        <img className='rounded-full h-10 w-10 object-cover' src={User.image} alt="" />

                        <div>{User.name}</div>
                      </div>






                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink> <Link to="/stats">My Stats</Link></NavigationMenuLink>
                      <NavigationMenuLink><Link to="/settings">Settings</Link></NavigationMenuLink>
                      <NavigationMenuLink><Link to="/locker">Locker</Link></NavigationMenuLink>
                      <NavigationMenuLink>Logout</NavigationMenuLink>

                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>



              : "")
        }


      </div>
    </div>
  )
}

export default Navbar