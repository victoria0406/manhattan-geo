import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { geoData as geoDataState } from "@/recoil/GeoStore";

export default function Wrapper(
    {children, dataUrl}
    :{children:React.ReactNode, dataUrl:string}
) {
    const [geoData, setGeoData] = useRecoilState(geoDataState);
    useEffect(()=>{
        async function getData() {
            console.log(dataUrl);
            const resp = await fetch(dataUrl);
            const json = await resp.json();
            console.log('fetched');
            setGeoData(json);
        }
        if (dataUrl) {
            getData();
        }
    }, []);
    return (
        children
    )
}