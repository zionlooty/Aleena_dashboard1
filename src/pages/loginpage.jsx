import { useState } from "react";
import React from 'react'
import { toast } from 'sonner';


function Loginpage() {
    const[email, setEmail]= useState("");
    const[password, setPassword]= useState("");

    const handleSubmit=(e) => {
        e.preventDefault ();
        if (email.length === 0 || password.length === 0){
            toast.error("email or password empty")
        } else if (password.length <=5){
            toast.error("password too short")
        } else{
            toast.success("Login successful")
        }

    }


  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e)=>{setEmail(e.target.value)}} />
            </div>
            <div>
              <label className=" text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e)=>{setPassword(e.target.value)}} />
            </div>
            <div className="flex justify-between items-center">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox text-blue-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-500 hover:underline">Forgot password?</a>
            </div>
            <div className="flex flex-col justify-center items-center gap-1 my-3">
                    
                    <input type="submit" value="Login" className="w-full rounded-md border border-slate-300 bg-black text-white p-2 hover:bg-blue-500 cursor-pointer"/>

                </div>
          </form>
        </div>

        <div className=" md:block md:w-1/2">
         
        <div className="h-full w-full">
            <img src="/pe.jpg" alt="" className='h-full w-full object-cover object-center' />
          </div>
        </div>

      </div>
    </div>
    </>


  )
}

export default Loginpage