import { useEffect, useState } from "react";
import type {FeatureCollection} from 'geojson';

export default function useSensor() {
    const [sensorData, setSensorData] = useState<FeatureCollection>();
    const [selectedSensor, setSelectedSensor] = useState<string|null>();
    const [sensorCountMax, setSensorCountMax] = useState<number>(5000);

    useEffect(()=>{
      if (sensorData?.features) setSensorCountMax(Math.max(...sensorData?.features.map(({geometry, properties})=>(properties?.count))));
    }, [sensorData]);

    // url example: `https://deepurban.kaist.ac.kr/urban/geojson/traffic/${LOCATION}-sensors.geojson`
    async function fetchSensorData(url:string, adjUrl: string) {
      const resp = await fetch(url);
      const json = await resp.json();
      const respAdj = await fetch(adjUrl);
      const jsonAdj = await respAdj.json();
      json?.features.forEach(({properties}, i)=>{
        Object.entries(jsonAdj[properties.ssid]).forEach(([key, value]) => {
          json.features[i].properties[`adj-${key}`]= Number(value.toFixed(3));
        });
      })
      setSensorData(json);
    };
    // url example: `https://deepurban.kaist.ac.kr/urban/geojson/traffic/${LOCATION}-sensor-adjmx.json

    function clickSensor(lngLat:{lng:number, lat:number}) {
        const clickedSensor = sensorData?.features.find(({geometry}) => ((Math.abs(geometry.coordinates[0] - lngLat.lng) < 0.001 ) && (Math.abs(geometry.coordinates[1] - lngLat.lat) < 0.001)));
        if (clickedSensor) {
          setSelectedSensor(clickedSensor.properties.ssid === selectedSensor ? null :clickedSensor.properties.ssid);
        }
    }
    function reset() {
      setSensorData(undefined);
      setSelectedSensor(null);
    }

    return {
        setSelectedSensor,
        clickSensor,
        fetchSensorData,
        reset,
        sensorData,
        selectedSensor,
        sensorCountMax,
    }
}