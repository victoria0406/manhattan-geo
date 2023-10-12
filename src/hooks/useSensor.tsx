import { useEffect, useState } from "react";
import type {FeatureCollection} from 'geojson';

export default function useSensor() {
    const [sensorData, setSensorData] = useState<FeatureCollection>();
    const [sensorAdjData, setSensorAdjData] = useState<object>();
    const [selectedSensor, setSelectedSensor] = useState<string|null>();
    const [adjSensors, setAdjSensors] = useState<string[]>([]);
    const [sensorKeyValues, setSensorKeyValues] = useState<string[]>([]);
    const [sensorCountMax, setSensorCountMax] = useState<number>(5000);
    const [adjSensitivity, setAdjSensitivity] = useState<number>(0.1);

    useEffect(()=>{
      const localSensorData = localStorage.getItem('sensorData');
      const localSensorAdjData = localStorage.getItem('sensorAdjData');
      if (localSensorData) setSensorData(JSON.parse(localSensorData));
      if (localSensorAdjData) setSensorAdjData(JSON.parse(localSensorAdjData));
    }, []);

    useEffect(()=>{
      if (sensorData) setSensorCountMax(Math.max(...sensorData?.features.map(({geometry, properties})=>(properties?.count))));
    }, [sensorData]);

    useEffect(()=>{
        if (selectedSensor && sensorAdjData) {
          const tArray = []
          const keys = Object.keys(sensorAdjData[selectedSensor]);
          const values = Object.values(sensorAdjData[selectedSensor]);
          for (let i=0; i< keys.length; i++) {
            tArray.push(keys[i]);
            tArray.push(values[i] > adjSensitivity ? String(values[i].toFixed(3)): '');
          }
          setSensorKeyValues(tArray);
          setAdjSensors(keys.filter((_, i) => values[i] > adjSensitivity));
        }
      }, [selectedSensor, sensorAdjData])

    // url example: `https://deepurban.kaist.ac.kr/urban/geojson/traffic/${LOCATION}-sensors.geojson`
    async function fetchSensorData(url:string) {
      const resp = await fetch(url);
      const json = await resp.json();
      setSensorData(json);
      localStorage.setItem('sensorData', JSON.stringify(json));
    };
    // url example: `https://deepurban.kaist.ac.kr/urban/geojson/traffic/${LOCATION}-sensor-adjmx.json`
    async function fetchSensorAdjData(url:string) {
      const resp = await fetch(url);
      const json = await resp.json();
      setSensorAdjData(json);
      localStorage.setItem('sensorAdjData', JSON.stringify(json));
    }

    function clickSensor(lngLat:{lng:number, lat:number}) {
        const clickedSensor = sensorData?.features.find(({geometry}) => ((Math.abs(geometry.coordinates[0] - lngLat.lng) < 0.001 ) && (Math.abs(geometry.coordinates[1] - lngLat.lat) < 0.001)));
        if (clickedSensor) {
        setSelectedSensor(clickedSensor.properties.ssid === selectedSensor ? null :clickedSensor.properties.ssid);
        }
    }

    return {
        setSelectedSensor,
        clickSensor,
        fetchSensorData,
        fetchSensorAdjData,
        sensorData,
        sensorKeyValues,
        selectedSensor,
        adjSensors,
        sensorCountMax,
    }
}