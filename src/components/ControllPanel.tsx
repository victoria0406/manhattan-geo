import React, { useEffect, useState } from 'react';
import { featureType } from '@/lib/types';

export default function ControllPanel (
  {setCategory, isGeohash, setIsGeohash, isCensus, setIsCensus, geohashPrecision, setGeohashPrecision, categories}
  :{setCategory:Function, isGeohash:boolean, setIsGeohash:Function, isCensus:boolean, setIsCensus:Function, geohashPrecision:number, setGeohashPrecision:Function, categories:featureType[]|undefined}
) {
    const [slideValue, setSlideValue] = useState<number>(geohashPrecision);
    useEffect(()=>{
      const timer = setTimeout(() => setGeohashPrecision(slideValue), 500);
      return () => {
        clearTimeout(timer);
      };
    }, [slideValue]);
    return (
    <div className='absolute w-56 m-8 p-4 bg-white rounded-xl z-10 shadow'>
      <h3 className="text-gray-900 mb-4 font-medium">Grids</h3>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={isGeohash} onChange={(e)=>{setIsGeohash(e.currentTarget.checked)}}/>
        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900">Use Geohash</span>
      </label>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={isCensus} onChange={(e)=>{setIsCensus(e.currentTarget.checked)}}/>
        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900">Use Census</span>
      </label>
      <h3 className="text-gray-900 my-4 font-medium">Controlling Geohash</h3>
      <label htmlFor="default-range" className="block mb-2 text-sm font-medium text-gray-900">Geohash Precision: {slideValue}</label>
      <input id="default-range" type="range" value={slideValue} min={4} max={7} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setSlideValue(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
      {categories && 
      <><h3 className="text-gray-900 my-4 font-medium">Filtering Census</h3>
        <div className="flex items-center mb-4">
            <input
              id={`radio-null`}
              type="radio"
              name="default-radio"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" 
              onChange={()=>setCategory(null)}
            />
            <label htmlFor={`radio-null`} className="ml-2 text-sm font-medium text-gray-900">No Filter</label>
        </div>
      {categories.map((item:featureType, i:number)=>(
        <div className="flex items-center mb-4" key={i}>
            <input
              id={`radio-${i}`}
              type="radio"
              value={item.name}
              name="default-radio"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" 
              onChange={()=>setCategory(item)}
            />
            <label htmlFor={`radio-${i}`} className="ml-2 text-sm font-medium text-gray-900">{item.name}</label>
        </div>
      ))}
      </>}
  </div>
  );
}