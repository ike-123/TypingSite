import { LoginForm } from '@/Components/login-form'
import React, { useState } from 'react'
import axios, { type AxiosInstance } from "axios"
import { useAuthStore } from '@/Stores/AuthStore'

const Login = () => {

  const [input, setInput] = useState({
    email: "",
    password: ""
  });

  const [errorText, SetErrorText] = useState("");


    const Login = useAuthStore((state) => state.Login)



  function OnChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(previous => ({ ...previous, [event.target.name]: event.target.value }));
  }

  async function LoginButton(event: React.MouseEvent<HTMLButtonElement>) {

    console.log("Login button clicked")
    event.preventDefault();

    try {

      // console.log(input.email)
      // console.log(input.password)

      await Login(input.email,input.password)

    } catch (error) {

      if (axios.isAxiosError(error)) {

        // console.log(error);
        SetErrorText(error.response?.data);
      };
    }
  }


  return (
    <div className='max-w-7xl m-auto'>

      <LoginForm onChangeInput={OnChangeInput} onLogin={LoginButton}></LoginForm>

    </div>
  )
}

export default Login