import { LoginForm } from '@/Components/login-form'
import React, { useState } from 'react'
import axios, { type AxiosInstance } from "axios"

const Login = () => {

  const [input, setInput] = useState({
    email: "",
    password: ""
  });


  const api: AxiosInstance = axios.create({
    baseURL: "https://festus123-001-site1.qtempurl.com/api/Auth/",
    withCredentials: true,
  });

  const [errorText, SetErrorText] = useState("");

  function OnChangeInput(event: React.ChangeEvent<HTMLInputElement>) {

    setInput(previous => ({ ...previous, [event.target.name]: event.target.value }));
  }


  async function LoginButton(event: React.MouseEvent<HTMLButtonElement>) {

    event.preventDefault();

    try {
      // await Login(input.email, input.password);
       const {data} = await api.post("Login", { email: input.email, password:input.password });
       console.log(data);

      // navigate("/home/1")

    } catch (error) {

      if (axios.isAxiosError(error)) {

        // console.log(error);
        SetErrorText(error.response?.data);
      };
    }
  }


  return (
    <div className='max-w-7xl m-auto'>

      <LoginForm></LoginForm>

    </div>
  )
}

export default Login