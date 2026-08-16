import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'


const NavMenu = () => {
    return (
        <div className='flex justify-center bg-zinc-900 p-1 border-1 rounded-full h-13 '>

            <NavLink to={"/"} >

                {({ isActive }) => (

                    <Button className='rounded-full text-xl h-full' variant={isActive ? "default" : "ghost"}>Solo</Button>

                )}

            </NavLink>

            <NavLink to={"/Multiplayer"} >

                {({ isActive }) => (

                    <Button className='rounded-full text-xl h-full' variant={isActive ? "default" : "ghost"}>Multiplayer</Button>

                )}

            </NavLink>


            <NavLink to={"/Games"} >

                {({ isActive }) => (

                    <Button className='rounded-full text-xl h-full' variant={isActive ? "default" : "ghost"}>Games</Button>

                )}

            </NavLink>

        </div>
    )
}

export default NavMenu