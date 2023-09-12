import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';

interface featureType {
    name: string,
    type: string,
  }
  

const censusCategory:featureType[] = [
    {name: 'ALAND', type: 'quantitative'},
    {name: 'AWATER', type: 'quantitative'}, 
    {name: 'COUNTYFP', type: 'categorical'},
    {name: 'NAMELSAD', type: 'categorical'},
  ]

{/*<label
  for="countries"
  className="block mb-2 text-sm font-medium text-gray-900"
>
  Select Category
</label>
<select
  id="countries"
  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  onChange={(e)=>{setCategory(e.target.value)}}
>
  {censusCategory.map((item:featureType, i:number)=>(
    <option value={item.name} key={i}>{item.name}</option>
  ))}
</select>
*/}

export default function ControllPanel (
  {getPath, setCategory, isGeohash, setIsGeohash, isCensus, setIsCensus, geohashPrecision, setGeohashPrecision}
  :{getPath: Function, setCategory:Function, isGeohash:boolean, setIsGeohash:Function, isCensus:boolean, setIsCensus:Function, geohashPrecision:number, setGeohashPrecision:Function}
) {
    const [slideValue, setSlideValue] = useState<number>(geohashPrecision);
    useEffect(()=>{
      const timer = setTimeout(() => {
        console.log(slideValue);
        return setGeohashPrecision(slideValue);
      }, 500);
      return () => {
        clearTimeout(timer);
      };
    }, [slideValue]);
    return (
    <div className='fixed w-56 m-8 p-4 bg-white rounded-xl z-10 shadow'>
      <h3 className="text-gray-900 mb-4">Grids</h3>
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
      <h3 className="text-gray-900 mb-4">Controlling Geohash</h3>
      <label htmlFor="default-range" className="block mb-2 text-sm font-medium text-gray-900">Geohash Precision</label>
      <input id="default-range" type="range" value={slideValue} min={4} max={7} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setSlideValue(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
      <h3 className="text-gray-900 my-4">Filtering Census</h3>
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
      {censusCategory.map((item:featureType, i:number)=>(
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
    <button
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      onClick={()=>getPath()}
    >Get Path</button>
  </div>
  );
}