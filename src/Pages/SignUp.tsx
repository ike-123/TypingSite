import { SignupForm } from '@/Components/signup-form'
import React, { useState } from 'react'
import axios, { type AxiosInstance } from "axios"
import { useAuthStore } from '@/Stores/AuthStore'


const SignUp = () => {

  const [input, setInput] = useState({
    username:"",
    email: "",
    password: ""
  });


  const [errorText, SetErrorText] = useState("");

  const SignUp = useAuthStore((state)=> state.Register);

  function OnChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(previous => ({ ...previous, [event.target.name]: event.target.value }));
  }


  async function SignUpButton(event: React.MouseEvent<HTMLButtonElement>) {

    console.log("Signup button clicked")
    event.preventDefault();

    try { 

      // console.log(input.email)
      // console.log(input.password)

      SignUp(input.username,input.email,input.password);

    } catch (error) {

      if (axios.isAxiosError(error)) {

        // console.log(error);
        SetErrorText(error.response?.data);
      };
    }
  }


  return (
    <div className='max-w-7xl m-auto'>

      <SignupForm onChangeInput={OnChangeInput} OnSignUp={SignUpButton}></SignupForm>

    </div>
  )
}

export default SignUp