import { LoginForm } from '@/Components/login-form'
import React, { useState } from 'react'
import axios, { type AxiosInstance } from "axios"
import { useAuthStore } from '@/Stores/AuthStore'
import { useNavigate } from 'react-router-dom'


import { authClient } from "@/lib/auth-client"; //import the auth client

import { createAuthClient } from "better-auth/client";




const Login = () => {




  const [input, setInput] = useState({
    email: "",
    password: ""
  });

  const [errorText, SetErrorText] = useState("");
  const navigate = useNavigate();



  const Login = useAuthStore((state) => state.Login)



  function OnChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(previous => ({ ...previous, [event.target.name]: event.target.value }));
  }

  async function LoginButton(event: React.MouseEvent<HTMLButtonElement>) {

    console.log("Login button clicked")
    event.preventDefault();

    // try {

    //   // console.log(input.email)
    //   // console.log(input.password)

    //   await Login(input.email, input.password)
    //   navigate("/")


    // } catch (error) {

    //   if (axios.isAxiosError(error)) {

    //     // console.log(error);
    //     SetErrorText(error.response?.data);
    //   };
    // }

    const { data, error } = await authClient.signIn.email({
      /**
       * The user email
       */
      email: input.email,
      /**
       * The user password
       */
      password: input.password,
      /**
       * A URL to redirect to after the user verifies their email (optional)
       */
      callbackURL: "/",
      /**
       * remember the user session after the browser is closed. 
       * @default true
       */
      rememberMe: false
    }, {
      //callbacks
    })

    if (data) {
      console.log("User created:", data);
    }

  }

  async function loginWithGoogle(event: React.MouseEvent<HTMLButtonElement>) {

    event.preventDefault();

      const data = await authClient.signIn.social({
        provider: "google",
        callbackURL:"http://localhost:5173"
      });

      if(data){
        console.log(data);
      }

  }


  return (
    <div className='max-w-7xl m-auto'>

      <LoginForm onChangeInput={OnChangeInput} onLogin={LoginButton} onLoginWithGoogle={loginWithGoogle}></LoginForm>

    </div>
  )
}

export default Login