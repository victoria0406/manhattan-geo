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
    function fetchSensorData(url:string) {
        setSensorData(undefined);
        fetch(url)
          .then(resp => resp.json())
          .then(json => {
            console.log(json);
            setSensorData(json);
            setSensorCountMax(Math.max(...json?.features.map(({geometry, properties})=>(properties?.count))));
          })
          .catch(err => console.error('Could not load data', err));
    };
    // url example: `https://deepurban.kaist.ac.kr/urban/geojson/traffic/${LOCATION}-sensor-adjmx.json`
    function fetchSensorAdjData(url:string) {
        setSensorAdjData(undefined);
        fetch(url)
        .then(resp => resp.json())
        .then(json => {
            setSensorAdjData(json);
        })
        .catch(err => console.error('Could not load data', err));
    }

    function clickSensor(lngLat) {
        const clickedSensor = sensorData?.features.find(({geometry}) => ((Math.abs(geometry.coordinates[0] - lngLat.lng) < 0.001 ) && (Math.abs(geometry.coordinates[1] - lngLat.lat) < 0.001)));
        if (clickedSensor) {
        console.log(clickedSensor);
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