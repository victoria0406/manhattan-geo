/*import { useEffect, useState } from "react";

const locationList = [
    'manhatton', 'metr-la', 'pems-bay', 'pemsd7'
]

export default function SettingModal (
    {submit}:
    {submit: Function}
) {
    const [location, setLocation] = useState<string>();
    const [dataSize, setDataSize] = useState<number>();
    return (
        <div className="fixed w-full h-full z-20 ">
            <div className="absolute w-full h-full bg-black opacity-50">
            </div>
            <div className="absolute w-1/2 h-1/2 left-1/4 top-1/4 bg-white rounded-xl shadow p-4">
                <h3 className="text-gray-900 text-lg mb-4 font-medium">Choosing Datasets</h3>
                <div className="flex justify-between ">
                    {locationList.map((name:string, i:number)=> (
                        <div
                            key = {i}
                            className={`bg-white rounded-xl shadow text-gray-900 p-2 ${location === name ? 'border-gray-500 border-solid border-2':''}`}
                            onClick={()=>setLocation(name)}
                        >
                            {name}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between ">
                    {[1000, 2000, 3000, 5000, 10000].map((size, i)=>(
                        <div
                            key={i}
                            className={`bg-white rounded-xl shadow text-gray-900 p-2 ${dataSize === size ? 'border-gray-500 border-solid border-2':''}`}
                            onClick={()=>{setDataSize(size)}}
                        >
                            {size}
                        </div>
                    ))}
                </div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 disabled:hover:bg-blue-300" disabled={!(dataSize && location)}
                    onClick={()=>submit(location, dataSize)}
                >
                    Visualize Datas
                </button>
            </div>
        </div>
    )
}
*/