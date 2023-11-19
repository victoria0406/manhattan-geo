import { useRecoilState } from "recoil";
import { geohashPrecision as geohashPrecisionState } from "@/recoil/GeoStore";

export default function Geohash() {
    const [geohashPrecision, setGeohashPrecision] = useRecoilState(geohashPrecisionState);
    return (
        <>
        <label
            htmlFor="geohash-precision"
            className="flex justify-between items-center mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
            {`Geohash Precision: ${geohashPrecision}`}
        </label>
        <input
            id="geohash-precision" type="range" value={geohashPrecision}
            min={5} max={8}
            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                setGeohashPrecision(Number(e.target.value));
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
        </input>
        </>
    )
}