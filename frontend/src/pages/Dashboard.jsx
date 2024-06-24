import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('');
    const location = useLocation();
    const { state } = location;
    const token = state?.token;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) { 
                    throw new Error("User not verified, please signup");
                }

                // Getting user info
                const userDetail = await axios.get("http://localhost:3000/api/v1/user/userinfo", {
                    headers: {
                        Authorization: 'Bearer ' + token 
                    }
                });
                if (userDetail.status !== 200) {
                    throw new Error("User not verified, please signup");
                }
                setUserInfo(userDetail.data.user);

                // Getting user bank balance
                const userBank = await axios.get("http://localhost:3000/api/v1/account/balance", {
                    headers: {
                        Authorization: 'Bearer ' + token 
                    }
                });
                if (userBank.status !== 200) {
                    throw new Error("User not verified, please signup");
                }
                setBalance(userBank.data.balance);

                // Getting users Detail
                const usersDetails = await axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`, {
                    headers: {
                        Authorization: 'Bearer ' + token 
                    }
                });
                if (usersDetails.status !== 200) {
                    throw new Error("User not verified");
                }

                // Filter out the logged-in user
                const filteredUsers = usersDetails.data.users.filter(user => user._id !== userDetail.data.user._id);
                setUsers(filteredUsers);

            } catch (error) {
                if (error.response && error.response.status === 411) {
                    setUsers([]); // No users found
                } else {
                    navigate("/error", { state: { status: 401, message: "Something wrong happened!" } });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filter, token, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between p-3 items-center border shadow-md bg-gray-100">
                <div className="ml-3">
                    <h2 className="text-2xl font-bold">QuickPay</h2>
                </div>
                <div className="flex items-center">
                    <div className="mr-4">Hello, {userInfo.firstName}</div>
                    <div className="bg-blue-500 px-3 py-1 items-center rounded-full">{userInfo.firstName[0].toUpperCase()}</div>
                </div>
            </div>
            <div className="mt-8 mx-3">
                <div className="flex mx-3 mb-8 items-center">
                    <h3 className="text-lg font-bold pr-3">Your Balance:</h3>
                    <h4 className="font-bold">${balance.toFixed(2)}</h4>
                </div>
                <div className="mx-3">
                    <h3 className="text-lg font-bold">Users</h3>
                    <input className="w-full border border-2 rounded my-3 px-3 py-1" type="text" placeholder="Search user..." onChange={(e) => setFilter(e.target.value)}/>
                    <div className="mt-3">
                        { users.length > 0 ? users.map(user => <Users key={user._id} user={user} token={token} />) : <div>No users found</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Users({ user, token }) {
    const navigate = useNavigate()

    return (
        <div className="flex justify-between my-3 items-center">
            <div className="flex items-center">
                <div className="bg-slate-400 font-medium px-4 py-2 items-center rounded-full">{user.firstName[0]}</div>
                <h4 className="font-bold ml-4">{user.firstName} {user.lastName}</h4>
            </div>
            <button className="bg-black text-white rounded-lg text-sm p-2" onClick={(e) => {
                navigate("/send?id=" + user._id + "&name=" + user.firstName, { state: {token}});
            }}>Send Money</button>
        </div>
    );
}
