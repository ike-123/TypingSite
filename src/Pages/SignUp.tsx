import { SignupForm } from '@/Components/signup-form'
import React, { useState } from 'react'
import axios, { type AxiosInstance } from "axios"
import { useAuthStore } from '@/Stores/AuthStore'

import { authClient } from "@/lib/auth-client"; //import the auth client



const SignUp = () => {

  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });


  const [errorText, SetErrorText] = useState("");

  const SignUp = useAuthStore((state) => state.Register);

  function OnChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(previous => ({ ...previous, [event.target.name]: event.target.value }));
  }


  async function SignUpButton(event: React.MouseEvent<HTMLButtonElement>) {

    console.log("Signup button clicked")
    event.preventDefault();

    // try { 

    //   // console.log(input.email)
    //   // console.log(input.password)

    //   SignUp(input.username,input.email,input.password);

    // } catch (error) {

    //   if (axios.isAxiosError(error)) {

    //     // console.log(error);
    //     SetErrorText(error.response?.data);
    //   };
    // }

    const { data, error } = await authClient.signUp.email({
      email: input.email, // user email address
      password: input.password, // user password -> min 8 characters by default
      name: "ike", // user display name
      image: "", // User image URL (optional)
      callbackURL: "/" // A URL to redirect to after the user verifies their email (optional)
    }, {
      onRequest: (ctx) => {
        //show loading
      },
      onSuccess: (ctx) => {
        //redirect to the dashboard or sign in page
      },
      onError: (ctx) => {
        // display the error message
        alert(ctx.error.message);
      },
    });

    if (data) {
      console.log("User created:", data);
    }



  }


  return (
    <div className='max-w-7xl m-auto'>

      <SignupForm onChangeInput={OnChangeInput} OnSignUp={SignUpButton}></SignupForm>

    </div>
  )
}

export default SignUp