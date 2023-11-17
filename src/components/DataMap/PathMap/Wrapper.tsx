import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { pathData as pathDataState } from "@/recoil/GeoStore";

export default function Wrapper(
    {children, pathUrl}
    :{children: React.ReactNode, pathUrl:string}
) {
    const [pathData, setPathData] = useRecoilState(pathDataState);
    useEffect(() => {
        async function getPath() {
            const resp = await fetch(pathUrl);
            const json = await resp.json();
            json.features.forEach(({properties}, i:number)=>{
                const [fulldate, time, utc] = properties.pickup_datetime.split(' ');
                const [year, month, date] = fulldate.split('-');
                const [hour, minute, second] = time.split(':');
                json.features[i].properties.pickup_year = year;
                json.features[i].properties.pickup_month = month;
                json.features[i].properties.pickup_hour = hour;
            });
            setPathData(json)
        }
        if (pathUrl) {
            getPath();

        }
    }, [])
    return (
        children
    )
}