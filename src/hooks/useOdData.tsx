import { useEffect, useState } from "react";
import type {FeatureCollection} from 'geojson';
import { encodeGeohash } from "@/lib/geohash";

function coordinatesToGeohashs(coordinates:number[][]) {
  return coordinates.map(([lng, lat]) => (
    encodeGeohash(lat, lng)
  )).join('-');
}

export default function useOdData(pathStringType:string|undefined) {
    const [odData, setOdData] = useState<FeatureCollection>();
    const [odDataYear, setOdDataYear] = useState<string|null>(null);
    const [odDataMonth, setOdDataMonth] = useState<string|null>(null);
    const [odDataHour, setOdDataHour] = useState<string|null>(null);
    const [odPaths, setOdPaths] = useState<{string: string, key: string}[]>([]);
    const [selectedPath, setSelectedPath] = useState<String|null>(null);
    const [odDataFilter, setOdDatafilter] = useState<String[][]>();

    useEffect(()=>{
      const localGeoData = localStorage.getItem('odData');
      const localOdDataYear = localStorage.getItem('odDataYear');
      const localOdDataMonth = localStorage.getItem('odDataMonth');
      const localOdDataHour = localStorage.getItem('odDataHour');
      if (localGeoData) setOdData(JSON.parse(localGeoData));
      if (localOdDataYear) setOdDataYear(localOdDataYear);
      if (localOdDataMonth) setOdDataMonth(localOdDataMonth);
      if (localOdDataHour) setOdDataHour(localOdDataHour);
    }, [])
    
    useEffect(()=>{
      if (odDataYear) localStorage.setItem('odDataYear', odDataYear);
      if (odDataMonth) localStorage.setItem('odDataMonth', odDataMonth);
      if (odDataHour) localStorage.setItem('odDataHour', odDataHour);
    }, [odDataHour, odDataMonth, odDataYear]);
    

    useEffect(()=> {
      if (odData) {
          const geohashPath = odData?.features.filter(({properties})=> (
            (!odDataYear || properties?.pickup_year == odDataYear)
            && (!odDataMonth || properties?.pickup_month == odDataMonth)
            && (!odDataHour || properties?.pickup_hour == odDataHour)
          )).map(({geometry, properties})=>({
            string: pathStringType === 'sensor' ? properties?.path_sensors : pathStringType === 'geohash' ? coordinatesToGeohashs(geometry?.coordinates) :properties.key,
            key: properties?.key,
          }));
          if (geohashPath) setOdPaths(geohashPath);
      }
  
    }, [odData, odDataYear, odDataMonth, odDataHour]);

    useEffect(() => {
      const datafilter = [];
      if (odDataYear) datafilter.push(['==', 'pickup_year', odDataYear]);
      if (odDataMonth) datafilter.push(['==', 'pickup_month', odDataMonth]);
      if (odDataHour) datafilter.push(['==', 'pickup_hour', odDataHour]);
      setOdDatafilter(datafilter);
    },[odDataYear, odDataMonth, odDataHour]);
 
    async function fetchOddata(url: string, {isParseYear, isParseMonth, isParseHour}: {isParseYear:boolean, isParseMonth:boolean, isParseHour:boolean}={isParseYear:false, isParseMonth:false, isParseHour:false}) {
        const resp = await fetch(url);
        const json = await resp.json();
        if (isParseYear || isParseMonth || isParseHour) {
          json.features.forEach(({properties}, i:number)=>{
            const [fulldate, time, utc] = properties.pickup_datetime.split(' ');
            const [year, month, date] = fulldate.split('-');
            const [hour, minute, second] = time.split(':');
            if (isParseYear) json.features[i].properties.pickup_year = year;
            if (isParseMonth) json.features[i].properties.pickup_month = month;
            if (isParseHour) json.features[i].properties.pickup_hour = hour;
          });
          if (isParseYear) setOdDataYear('2009');
          if (isParseMonth) setOdDataMonth('01');
          if (isParseHour) setOdDataHour('00');
        }
        setOdData(json);
        localStorage.setItem('odData', JSON.stringify(json));
    }
    return {
      fetchOddata,
      odData,
      odDataYear,
      setOdDataYear,
      odDataMonth,
      setOdDataMonth,
      odDataHour,
      setOdDataHour,
      odDataFilter,
      odPaths,
      selectedPath,
      setSelectedPath,
    }
}