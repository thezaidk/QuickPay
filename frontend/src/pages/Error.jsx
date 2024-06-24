import { useLocation } from "react-router-dom"

export function Error() {
    const location= useLocation()
    const { state }= location
    const status= state?.status
    const message= state?.message

    return (
        <div className="p-8 bg-red-500 w-full h-screen items-center">
            <h1 className="text-3xl font-bold mb-4">Error {status}</h1>
            <div className="flex items-center mb-1">
                <h4 className="text-lg font-bold mr-2">Description: </h4>
                <h4 className="text-md font-medium mr-2">{message}</h4>
                <h4 className="animate-bounce text-md font-medium">:(</h4>
            </div>
            <div>
                <a className="text-md font-medium underline" href="/signup">Try again!</a>
            </div>
        </div>
    )
}