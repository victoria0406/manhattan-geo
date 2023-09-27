import { useEffect, useState } from "react";

export default function PathPannel (
    {paths, odDataYear, setOdDataYear, setSelectedPath, setIsPlaying}
    :{paths:String[], odDataYear:string, setOdDataYear:Function, setSelectedPath:Function, setIsPlaying:Function}
  ) {
    const [pinnedKey, setPinnedKey] = useState<string|null>(null);
    const [playKey, setPlayKey] = useState<string|null>(null);

    useEffect(()=>{
        setSelectedPath(pinnedKey);
    }, [pinnedKey])
      return (
      <div className='absolute right-0 w-56 m-8 p-4 bg-white rounded-xl z-10 shadow'>
        <h3 className="text-gray-900 mb-4 font-medium">Path</h3>
        {/*<label htmlFor="default-range" className="block mb-2 text-sm font-medium text-gray-900">Year: {odDataYear}</label>
        <input
            id="default-range" type="range" value={odDataYear}
            min={2009} max={2015}
            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                setOdDataYear(e.target.value);
                setPinnedKey(null);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
        </input>
        */}
        <h3 className="text-gray-900 my-4 font-medium">Path Strings</h3>
        <ul className="mt-4 h-96 overflow-y-scroll">
            {paths.map(({string, key}, i)=>(
                <li className={`text-gray-900 text-sm overflow-hidden whitespace-nowrap p-2 my-2 rounded flex center ${pinnedKey === key ? 'bg-blue-300': ''} ${pinnedKey === key ? '': 'hover:bg-blue-100'}`}
                    // onMouseEnter={()=>{pinnedKey == null ? setSelectedPath(key): null}}
                    // onMouseLeave={()=>{pinnedKey == null ? setSelectedPath(null): null}}
                    onClick={()=>{
                        setPinnedKey(pinnedKey === key ? null: key);
                    }}
                >
                    <span className="mr-2 group bg-blue-700 inline-block text-white rounded text-center shadow">
                        <span className="w-8 h-8 p-1 inline-block group-hover:hidden">{i+1}</span>
                        <span className="w-8 h-8 p-1 hidden group-hover:inline-block" onClick={()=>setIsPlaying(true)}>▶</span>
                    </span>
                    <span className="text-ellipsis overflow-hidden inline-block w-28 m-1">{string}</span>
                </li>
            ))}
        </ul>
    </div>
    );
  }