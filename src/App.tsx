import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import Home from './Pages/Home';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer';
import Multiplayer from './Pages/Multiplayer';
import Home2 from './Pages/Home2';
import SinglePageTypingTest from './Pages/SinglePageTypingTest';
import TestResults from './Components/TestResults';
import TestResultsPage from './Components/TestResultsPage';
import Games from './Pages/Games';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import { useAuthStore } from './Stores/AuthStore';
import MyStats from './Pages/MyStats';
import Shop from './Components/Shop';
import Success from './Pages/Success';
import Product from './Pages/Product';




const PageStructure = () => {



  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

const router = createBrowserRouter([
  {


    path: "/",
    element: <PageStructure />,
    children: [
      {
        path: "/",
        element: <SinglePageTypingTest />
      },
      {
        path: "/Multiplayer",
        element: <Multiplayer />
      },
      {
        path: "/Games",
        element: <Games />
      },
      {
        path: "/Login",
        element: <Login />
      },
      {
        path: "/SignUp",
        element: <SignUp />
      },
      {
        path: "/stats",
        element: <MyStats />
      },
      {
        path: "/shop",
        element: <Shop />
      },
      {
        path: "/success",
        element: <Success />
      },
      {
        path: "/product/:id",
        element: <Product />
      }


    ]

  },
]);

function App() {

  const FetchUser = useAuthStore((state) => state.getUser)


  useEffect(() => {

    async function Call_FetchUser() {
      await FetchUser()
    }

    Call_FetchUser();

  }, [])

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )


}

export default App
