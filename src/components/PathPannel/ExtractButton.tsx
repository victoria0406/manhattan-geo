import { filteredPathString } from "@/recoil/GeoStore";
import React from "react";
import { useRecoilValue } from "recoil";

export default function ExtractButton(
    {children, filteredDataOnly}
    :{children:React.ReactNode, filteredDataOnly: boolean}
) {
    const filterPathList = useRecoilValue(filteredPathString);
    function extractFiltered() {
        const fileName = `extract-string-filteted.txt`;

        const strings = filterPathList.map(({string})=>(string));
        const content = strings.join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    return (
        <button
            className="text-sm center w-full bg-blue-700 rounded mt-4 py-1"
            onClick={()=>{extractFiltered()}}
        >
            {children}
        </button>
    )
}