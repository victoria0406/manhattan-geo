import { useEffect, useState } from "react";
import type {FeatureCollection} from 'geojson';

export default function useSensor() {
    const [sensorData, setSensorData] = useState<FeatureCollection>();
    const [selectedSensor, setSelectedSensor] = useState<string|null>();
    const [sensorCountMax, setSensorCountMax] = useState<number>(5000);

    useEffect(()=>{
      const localSensorData = localStorage.getItem('sensorData');
      const localSensorAdjData = localStorage.getItem('sensorAdjData');
      if (localSensorData) setSensorData(JSON.parse(localSensorData));
    }, []);

    useEffect(()=>{
      console.log('change')
      if (sensorData) setSensorCountMax(Math.max(...sensorData?.features.map(({geometry, properties})=>(properties?.count))));
    }, [sensorData]);

    // url example: `https://deepurban.kaist.ac.kr/urban/geojson/traffic/${LOCATION}-sensors.geojson`
    async function fetchSensorData(url:string) {
      const resp = await fetch(url);
      const json = await resp.json();
      setSensorData(json);
      try {
        localStorage.setItem('sensorData', JSON.stringify(json));
      } catch (e) {
        console.log('size fault');
      }
    };
    // url example: `https://deepurban.kaist.ac.kr/urban/geojson/traffic/${LOCATION}-sensor-adjmx.json`
    async function fetchSensorAdjData(url:string) {
      const resp = await fetch(url);
      const json = await resp.json();
      console.log(json);
      console.log(sensorData);
      let use = false
      sensorData?.features.forEach(({properties}, i)=>{
        Object.entries(json[properties.ssid]).forEach(([key, value]) => {
          sensorData.features[i].properties[`adj-${key}`]= Number(value.toFixed(3));
        });
      })
      setSensorData({...sensorData});
      try {
        localStorage.setItem('sensorAdjData', JSON.stringify(json));
      } catch (e) {
        console.log('size fault');
      }
    }

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
        fetchSensorAdjData,
        reset,
        sensorData,
        selectedSensor,
        sensorCountMax,
    }
}