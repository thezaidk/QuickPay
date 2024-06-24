import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import axios from 'axios';

export function Send() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const location = useLocation();
    const { state } = location;
    const token = state?.token;
    const [amount, setAmount] = useState('');

    const handleTransfer = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/api/v1/account/transfer", {
                to: id,
                amount: Number(amount)
            }, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                alert("Transfer successful");
            } else {
                alert("Transaction failed!");
            }
        } catch (error) {
            console.error(error);
            alert("Transaction failed!");
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 justify-center items-center">
            <div className="p-8 rounded-lg shadow-lg bg-white w-full max-w-md">
                <div className="flex justify-center mb-10">
                    <h1 className="text-3xl font-bold">Send Money</h1>
                </div>
                <div className="flex justify-center items-center mb-8">
                    <h4 className="bg-green-400 px-5 py-2 rounded-full items-center mr-2 text-2xl">{name[0]}</h4>
                    <h4 className="text-lg font-medium mr-1">Sending to</h4>
                    <h4 className="text-lg font-bold">{name}</h4>
                </div>
                <div className="">
                    <h4 className="font-medium">Amount (in USD)</h4>
                    <input
                        className="w-full border px-2 py-1 rounded-lg mt-2"
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <button
                        className="w-full bg-green-400 mt-2 p-1 rounded-lg"
                        onClick={handleTransfer}
                    >
                        Initiate Transfer
                    </button>
                </div>
            </div>
        </div>
    );
}
