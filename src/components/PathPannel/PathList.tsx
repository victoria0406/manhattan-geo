import { filteredPathString, highlightedPath as highlightedPathState} from "@/recoil/GeoStore";
import { useRecoilState, useRecoilValue } from "recoil"

export default function PathList() {
    const pathList = useRecoilValue(filteredPathString);
    const [highlightedPath, setHighlightedPath] = useRecoilState(highlightedPathState);
    console.log(pathList ? pathList.map(({key})=>(key)):null);
    return (
        pathList && <>
        <div className="text-sm mt-4">Path Strings: {pathList.length}</div>
        <ul className="h-96 overflow-y-scroll">
            {pathList.map(({string, key}, i:number)=>(
                <li
                    key={i}
                    className={`text-gray-900 dark:text-white text-sm overflow-hidden whitespace-nowrap p-2 my-2 rounded flex center ${highlightedPath === key ? 'bg-blue-900':''}`}
                    onClick={()=>{setHighlightedPath(highlightedPath === key ? null : key)}}
                >
                    <span className="mr-2 group bg-blue-700 inline-block text-white rounded text-center shadow">
                        <span className="w-8 h-8 p-1 inline-block">{i+1}</span>
                    </span>
                    <span className="text-ellipsis overflow-hidden inline-block w-28 m-1">{string}</span>
                </li>
            ))}
        </ul>
        </>
        
    )
}