"use client";
import { useEffect, useState } from 'react';
import DataInputModal from '@/components/DataInputModal';
import { featureType, ViewStateType, inputDataType } from '@/lib/types';
import GeoMap from '@/components/GeoMap';
import SensorMap from '@/components/SensorMap';

export default function Home() {
  const [isSetted, setIsSetted] = useState(false);
  const [datas, setDatas] = useState<inputDataType[]>([]);

  useEffect(()=>{
    console.log(datas);
  }, [datas])

  async function fetchDatas(
    isAdd: boolean, dataType: string, pathUrl: string, dataUrl: string, extraUrl:string, initialView:ViewStateType, filterUsage: boolean[], categories:featureType[]
  ){
    const newData: inputDataType = {
      dataType, pathUrl, dataUrl, extraUrl, initialView, filterUsage, categories
    }
    setDatas([]);
    if (isAdd) {
      datas.push(newData);
      setDatas([...datas]);
    }
    else {
      setDatas([newData]);
    }
    setIsSetted(true);
  }

  return (
    <main className={`relative grid grid-cols-${Math.max(1, datas.length)}`}>
      {!isSetted &&
      <DataInputModal
        fetchDatas={fetchDatas}
        hasPreviousData={datas.length > 0}
        close={()=>setIsSetted(true)}
      />}
      {
        datas.map(({
          dataType,
          pathUrl,
          dataUrl,
          extraUrl,
          initialView,
          filterUsage,
          categories,
        }, i) => (
          dataType == 'geo' ?  
          <GeoMap
            key={pathUrl}
            pathUrl = {pathUrl}
            dataUrl = {dataUrl}
            initialView = {initialView}
            filterUsage = {filterUsage}
            initialCategories = {categories}
          /> : 
          <SensorMap
            key={pathUrl}
            pathUrl={pathUrl}
            dataUrl={dataUrl}
            extraUrl={extraUrl}
            initialView={initialView}
          />
        ))
      }
      <button
          className="absolute bottom-8 right-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 disabled:hover:bg-blue-300"
          onClick={()=>setIsSetted(false)}
      >
          Setting New
      </button>

    </main>
  )
}
