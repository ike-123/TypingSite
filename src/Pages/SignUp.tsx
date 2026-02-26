import { SignupForm } from '@/Components/signup-form'
import React, { useState } from 'react'
import axios, { type AxiosInstance } from "axios"

const SignUp = () => {

  const [input, setInput] = useState({
    username:"",
    email: "",
    password: ""
  });


  const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:3001/api/Auth/",
    withCredentials: true,
  });

  const [errorText, SetErrorText] = useState("");

  function OnChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(previous => ({ ...previous, [event.target.name]: event.target.value }));
  }


  async function SignUpButton(event: React.MouseEvent<HTMLButtonElement>) {

    console.log("Signup button clicked")
    event.preventDefault();

    try { 

      // console.log(input.email)
      // console.log(input.password)

       const {data} = await api.post("register", { username:input.username, email: input.email, password:input.password });
       console.log(data);

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