import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export function Signup() {
    const [firstName, setFirstName]= useState('')
    const [lastName, setLastName]= useState('')
    const [email, setEmail]= useState('')
    const [password, setPassword]= useState('')
    const [error, setError]= useState('')

    const navigate= useNavigate()

    async function signUpBtn() {
        // hit the /signup backend and get the response
        try {
            const response= await axios.post("http://localhost:3000/api/v1/user/signup", {
                username: email,
                firstName: firstName,
                lastName: lastName,
                password: password
            }) 
            
            if(response.status === 200){  
                navigate('/dashboard', { state: {token: response.data.token}});
            } else {
                setError("Unexpected response status: " + response.status)
            }
        } catch (error) {
            if(error.response) {
                setError(error.response.data.message)
            } else {
                setError("An unexpected error occurred");
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center p-5">
                    <h2 className="text-3xl font-bold pb-2">Sign Up</h2>
                    <h4 className="text-lg text-gray-500">Enter your information to create an account</h4>
                </div>
                <div className="m-2">
                    <div className="pb-2">
                        <h4 className="mb-1">First name</h4>
                        <input className="w-full border border-gray-300 p-2 rounded-lg" onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="John" />
                    </div>
                    <div className="pb-2">
                        <h4 className="mb-1">Last name</h4>
                        <input className="w-full border border-gray-300 p-2 rounded-lg" onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Doe" />
                    </div>
                    <div className="pb-2">
                        <h4 className="mb-1">Email</h4>
                        <input className="w-full border border-gray-300 p-2 rounded-lg" onChange={(e) => setEmail(e.target.value)} type="text" placeholder="johndoe@example.com" />
                    </div>
                    <div className="pb-2">
                        <h4 className="mb-1">Password</h4>
                        <input className="w-full border border-gray-300 p-2 rounded-lg" onChange={(e) => setPassword(e.target.value)} type="password" />
                    </div>
                    {error && (
                        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3'>
                            <strong className="font-bold">Error: </strong>
                            <span className='block sm:inline'>{error}</span>
                        </div>
                    )}
                    <button className="w-full bg-black text-white rounded-lg p-2 my-3" onClick={signUpBtn}>Sign Up</button>
                    <div className="flex justify-center">
                        <h4 className="mr-2">Already have an account?</h4>
                        <a className="underline" href="/signin">Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
