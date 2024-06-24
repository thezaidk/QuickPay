import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function signInBtn() {
        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
                username: email,
                password: password
            });
            
            if (response.status === 200) {
                navigate('/dashboard', { state: {token: response.data.token}});
            } else {
                setError("Unexpected response status: " + response.status);
            }

        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-blue-100">
            <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
                <div className="text-center p-5">
                    <h2 className="text-3xl font-bold pb-2">Sign In</h2>
                    <h4 className="text-lg text-gray-500">Enter your credentials to access your account</h4>
                </div>
                <div className="m-2">
                    <div className="pb-3">
                        <h4 className="mb-1 font-medium">Email</h4>
                        <input className="w-full border border-gray-300 rounded-lg p-2" type="text" placeholder="johndoe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="pb-2">
                        <h4 className="mb-1 font-medium">Password</h4>
                        <input className="w-full border border-gray-300 rounded-lg p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <button className="w-full bg-black text-white p-2 rounded-lg my-3" onClick={signInBtn}>Sign In</button>
                    <div className="flex items-center">
                        <h4 className="pr-2">Don't have an account?</h4>
                        <a className="underline" href="/signup">Sign Up</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
