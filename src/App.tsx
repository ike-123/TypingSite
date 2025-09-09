import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import Home from './Pages/Home';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer';


const PageStructure = ()=>{



  return(
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

const router = createBrowserRouter([
{

  
  path: "/",
  element: <PageStructure/>,
  children:[
    {
      path:"/",
      element:<Home/>
    }
  ]
  
},

{
  path: "/Multiplayer",
  element: <div>Hello Multiplayer</div>,
  
},
]);

function App() {

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
   
  
}

export default App
