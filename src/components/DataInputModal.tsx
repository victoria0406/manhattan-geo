import { ViewStateType, featureType } from "@/lib/types";
import { useEffect, useState } from "react";

interface DataTypeType {
    type:string,
    fullName:string,
}

const dataTypeList = [{
    type: 'geo',
    fullName: 'Path with Geography Data'
},
{
    type: 'sensor',
    fullName: 'Path with SensorData'
}]

const locationList = [
    'metr-la', 'pems-bay', 'pemsd7'
]

const dataServerUrl = 'https://deepurban.kaist.ac.kr/urban/geojson/traffic/'

export default function DataInputModal (
    {fetchDatas, hasPreviousData, close}:
    {fetchDatas: Function, hasPreviousData:boolean, close: Function}
) {
    const [dataType, setDataType] = useState<DataTypeType|undefined>(dataTypeList[0]);
    const [pathUrl, setPathUrl] = useState<string|undefined>();
    const [dataUrl, setDataUrl] = useState<string|undefined>();
    const [extraUrl, setExtraUrl] = useState<string|undefined>();
    const [initailView, setInitalView] = useState<ViewStateType|undefined>({
        longitude: -73.9712488,
        latitude:  40.7830603,
        zoom: 12
    });
    const [timeUsage, setTimeUsage] = useState<boolean[]>([false, false, false]);
    const [isDropDown, setIsDropDown] = useState<boolean>(false);
    const [quantData, setQuantData] = useState<string>()
    const [catData, setCatData] = useState<string>()

    useEffect(() => {
        setPathUrl(undefined);
        setDataUrl(undefined);
        setExtraUrl(undefined);
    }, [dataType])

    async function submit() {
        // validation checks - 현재는
        const urlStart = /^https:\/\//;
        const quatCategories: featureType[]|undefined = quantData?.split(',').map((data:string)=>({name:data.trim(), type:'quantitative'}));
        const catCategories: featureType[]|undefined = catData?.split(',').map((data:string)=>({name:data.trim(), type:'categorical'}));
        const categories:featureType[]=[]
        if (quatCategories) quatCategories.forEach((e)=>categories.push(e));
        if (catCategories) catCategories.forEach((e)=>categories.push(e));
        await fetchDatas(dataType?.type, pathUrl, dataUrl, extraUrl, initailView, timeUsage, categories);
    }
    function changeTime(i:number) {
        console.log(i);
        const tmp = [...timeUsage];
        tmp[i] = !timeUsage[i];
        setTimeUsage(tmp);
    }
    function setDefaultPath (name:string) {
        setPathUrl(`${dataServerUrl}${name}-1000.geojson`);
        setDataUrl(`${dataServerUrl}${name}-sensors.geojson`);
        setExtraUrl(`${dataServerUrl}${name}-sensor-adjmx.json`);
        const tempInitailView = name === 'metr-la' ? {
            longitude: -118.3992154,
            latitude: 34.1114597,
            zoom: 10,
          } : name === 'pems-bay' ? {
            longitude:  -121.92809670018664,
            latitude: 37.34048422339241,
            zoom: 10
          } : {
            longitude: -118.21073650795017,
            latitude: 33.92243661859156,
            zoom: 10
          }
        setInitalView(tempInitailView)
    }
    return (
        <div className="fixed w-full h-full z-20 ">
            <div className="absolute w-full h-full bg-black opacity-50">
            </div>
            <div className="absolute w-full bg-white h-full p-8">
                <div className="flex justify-between">
                    <h3 className="text-gray-900 text-lg mb-4 font-medium">
                        {dataType?.fullName ? dataType?.fullName : 'Other Options'}
                    </h3>
                    {dataType && <button
                        className="float-right text-gray-900 py-2 px-4 rounded border border-gray-200"
                        onClick={()=>{setDataType(undefined)}}
                    >
                        Other Options
                    </button>}
                </div>
                {!dataType && 
                <div className="grid grid-cols-2 gap-10">
                    {dataTypeList.map((eDataType, i)=>(
                        <div
                            key={i}
                            className="text-gray-900 border border-gray-200 rounded h-24 flex justify-center items-center hover:border-blue-500 text-center"
                            onClick={()=>{setDataType(eDataType)}}
                        >
                            {eDataType.fullName}
                        </div>
                    ))}
                </div>
                }
                {dataType &&
                <><form className="w-full">
                    {dataType?.type == 'sensor' &&
                    <><div
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    >
                        Use Default Path
                    </div>
                    <div className="grid grid-cols-3 gap-10 mb-6">
                        {locationList.map((name, i)=>(
                            <div
                                key={i}
                                className="text-gray-900 border border-gray-200 rounded h-12 flex justify-center items-center hover:border-blue-500 text-center"
                                onClick={()=>setDefaultPath(name)}
                            >
                                {name}
                            </div>
                        ))}
                    </div></>
                    }
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-3/4 px-3">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="path-url"
                            >
                                Path Data URL
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="path-url"
                                type="text"
                                placeholder="https://"
                                value={pathUrl}
                                onChange={(e)=>setPathUrl(e.target.value)}
                            />
                            <p className="text-gray-600 text-xs italic">text</p>
                        </div>
                        <div
                            className="w-full md:w-1/4 px-3 relative"
                        >
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="path-url"
                            >
                                Filtering Units
                            </label>
                            
                            <button
                                onClick={()=>{setIsDropDown(!isDropDown)}}
                                className="w-full inline-flex justify-between items-center py-2 px-4 mb-3 font-medium text-center bg-gray-200 rounded text-gray-900 border border-gray-200"
                                type="button"
                            >
                                <div className="inline-flex h-7">
                                    &nbsp;
                                {['Year', 'Month', 'Hour'].filter((unit, i)=>(timeUsage[i])).map((unit, i)=>(
                                    <div
                                        key={i}
                                        className="w-20 bg-blue-500 mr-2 rounded text-white p-0.5"
                                    >
                                        {unit}
                                    </div>
                                ))}
                                </div>
                                <svg className={`w-2.5 h-2.5 ml-2.5 ${isDropDown&&'transform rotate-180'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                                </svg>
                            </button>
                            <div className={`z-10 bg-white rounded-lg shadow w-[calc(100%-1.5rem)] absolute ${!isDropDown&&'hidden'}`}>
                                <ul className="p-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
                                    {['Year', 'Month', 'Hour'].map((unit, i)=>(
                                        <li
                                            key={i}
                                        >
                                            <div className="flex items-center p-2 rounded hover:bg-gray-100">
                                            <input
                                                id={`checkbox-item-${i}`}
                                                type="checkbox"
                                                onChange={()=>{changeTime(i)}}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                                                checked={timeUsage[i]}
                                            />
                                            <label
                                                htmlFor={`checkbox-item-${i}`}
                                                className="w-full ml-2 text-sm font-medium text-gray-900 rounded"
                                            >
                                                {unit}
                                            </label>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <p className="text-gray-600 text-xs italic">text</p>
                        </div>
                    </div>
                    {dataType.type == 'sensor' &&
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="data-url"
                            >
                                {{geo: 'Geography Data', sensor:'Sensor Position'}[dataType.type]} URL
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="data-url"
                                type="text"
                                placeholder="https://"
                                value={dataUrl}
                                onChange={(e)=>setDataUrl(e.target.value)}
                            />
                            <p className="text-gray-600 text-xs italic">text</p>
                        </div>
                    </div>
                    }
                    {dataType.type == 'geo' &&
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3 md:w-1/2">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="data-url"
                            >
                                {{geo: 'Geography Data', sensor:'Sensor Position'}[dataType.type]} URL
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="data-url"
                                type="text"
                                placeholder="https://"
                                value={dataUrl}
                                onChange={(e)=>setDataUrl(e.target.value)}
                            />
                            <p className="text-gray-600 text-xs italic">text</p>
                        </div>
                        <div className="w-1/2 px-3 md:w-1/4">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="data-features-quantitative"
                            >
                                Quantitative Features
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="data-features-quantitative"
                                type="text"
                                placeholder="Q1, Q2"
                                value={quantData}
                                onChange={(e)=>setQuantData(e.target.value)}
                            />
                            <p className="text-gray-600 text-xs italic">text</p>
                        </div>
                        <div className="w-1/2 px-3 md:w-1/4">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="data-features-categorical"
                            >
                                categorical Features
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="data-features-categorical"
                                type="text"
                                placeholder="C1, C2"
                                value={catData}
                                onChange={(e)=>setCatData(e.target.value)}
                            />
                            <p className="text-gray-600 text-xs italic">text</p>
                        </div>
                    </div>}
                    {dataType.type == 'sensor' &&
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                        <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="extra-url">
                            Sensor Adjacent Data URL
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="extra-url"
                            type="text"
                            placeholder="https://"
                            value={extraUrl}
                            onChange={(e)=>setExtraUrl(e.target.value)}
                        />
                        <p className="text-gray-600 text-xs italic">test</p>
                        </div>
                    </div>
                    }
                    <div className="flex flex-wrap -mx-3 mb-2">
                        <div className="w-full sm:w-1/3 px-3 mb-6 sm:mb-0">
                            <label 
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="latitude"
                            >
                                Latitude
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="latitude"
                                type="text"
                                value={initailView?.latitude}
                                onChange={(e)=>setInitalView({...initailView, latitude: Number(e.target.value)} as ViewStateType)}
                            />
                        </div>
                        <div className="w-full sm:w-1/3 px-3 mb-6 sm:mb-0">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="longitude"
                            >
                                Longitude
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="longitude"
                                type="text"
                                value={initailView?.longitude}
                                onChange={(e)=>setInitalView({...initailView, longitude: Number(e.target.value)} as ViewStateType)}
                            />
                        </div>
                        <div className="w-full sm:w-1/3 px-3 mb-6 sm:mb-0">
                        <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="zoom"
                        >
                            Zoom
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="zoom"
                            type="number"
                            value={initailView?.zoom}
                            onChange={(e)=>setInitalView({...initailView, zoom: Number(e.target.value)} as ViewStateType)}
                        />
                        </div>
                    </div>
                </form>
                <div className="flex justify-between absolute bottom-8 w-[calc(100%-4rem)]">
                <button
                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded disabled:border-gray-300 disabled:text-gray-300 disabled:bg-transparent"
                    disabled={!hasPreviousData}
                    onClick={()=>close()}
                >
                    Back
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 disabled:hover:bg-blue-300" disabled={!(pathUrl)}
                    onClick={()=>submit()}
                >
                    Visualize Datas
                </button>
                </div>
                </>
                }
            </div>
        </div>
    )
}