/*"use client";

import Map, {Source, Layer, Popup, MapLayerMouseEvent, LngLatBounds} from '@/lib/useClientModules';
import type {FeatureCollection} from 'geojson';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import ControllPanel from '@/components/ControllPanel';
import Loading from '@/components/Loading';
import PathPannel from '@/components/PathPannel';
import useGeoHash from '@/hooks/useGeohash';
import useSensor from '@/hooks/useSensor';
import useOdData from '@/hooks/useOdData';
import { ViewStateType } from '@/lib/types';
import { MapMouseEvent } from 'mapbox-gl';

const mapSetting = {
  minZoom: 8,
}

const quantitativeColorList = [
  "#08306b",
  "#08519c",
  "#2171b5",
  "#4292c6",
  "#6baed6",
  "#9ecae1",
  "#c6dbef",
  "#deebf7",
  "#f7fbff",
  "#eff3ff",
  "#bdd7e7"
].reverse();

export default function SensorMap(
  { pathUrl, dataUrl, extraUrl, initialView }
  :{ pathUrl: string, dataUrl: string, extraUrl:string, initialView:ViewStateType }
) {
  const [isCensus, setIsCensus] = useState(true);
  const [isGeohash, setIsGeohash] = useState(true);
  
  const [isMapLoad, setIsMapLoad] = useState<boolean>(false);

  const {setGeoBounds, setGeohashPrecision, geohashPrecision, geohash} = useGeoHash();

  // 저장되어야 할 데이터
  const [viewState, setViewState] = useState<ViewStateType>();
  const {
    fetchOddata, setOdDataYear, setOdDataMonth, setOdDataHour, setSelectedPath,
    odData, odDataYear, odDataMonth, odDataHour, odDataFilter, odPaths, selectedPath, 
  } = useOdData('sensor');

  const {
    sensorData, selectedSensor, sensorCountMax,
    setSelectedSensor, clickSensor, fetchSensorData, reset
  } = useSensor();

  useEffect(()=> {
    setSelectedSensor(null);
  }, [selectedPath]);

  useEffect(()=>{
    fetchData();
  }, [])

  async function fetchData() {
    
    setViewState(initialView);
    await fetchOddata(pathUrl);
    await fetchSensorData(dataUrl, extraUrl);
  };

  const mapRender = debounce((e) => {
    setGeoBounds(e.target.getBounds());
  },500);

  const onClick = (e:MapMouseEvent) => {
    const {lngLat} = e
    clickSensor(lngLat);
  }

  return (
    <div className='relative overflow-hidden'>
      {(!odData || !isMapLoad) && <Loading transparent={false}/>}
      {!!odData && <>
      <ControllPanel
        setCategory={()=>{}}
        isGeohash={isGeohash}
        setIsGeohash={setIsGeohash}
        isCensus={isCensus}
        setIsCensus={setIsCensus}
        geohashPrecision={geohashPrecision}
        setGeohashPrecision={setGeohashPrecision}
        categories={undefined}
      />
      <PathPannel
        paths={odPaths}
        odDataYear={odDataYear}
        setOdDataYear={setOdDataYear}
        odDataMonth = {odDataMonth}
        setOdDataMonth = {setOdDataMonth}
        odDataHour = {odDataHour}
        setOdDataHour = {setOdDataHour}
        setSelectedPath={setSelectedPath}
      />
      {odData &&
      <><Map
        initialViewState={viewState}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken='pk.eyJ1IjoidmljdG9yaWEwNDA2IiwiYSI6ImNsbTdtN3A2ODAxdXkza3MydHRxZm94MHMifQ.7G3rMAvrocvBXl0XYX8WGA'
        style={{width: '100vw', height: '100vh'}}
        onLoad={()=>setIsMapLoad(true)}
        onRender = {mapRender}
        onClick={onClick}
        {...mapSetting}
      >
        {!!geohash && isGeohash &&
        <Source type="geojson" data={geohash}>
          <Layer
            id="geohashLayer"
            type="line"
            paint={{
              'line-color': 'gray',
            }}
            
          />
        </Source>}
        {!!odData &&
          <Source type="geojson" data={odData} lineMetrics={true}>
          <Layer
            id="odLayer"
            type="line"
            // beforeId="sensorLayer"
            paint={{
              'line-color': selectedPath ? [
                'match',
                ['get', 'key'],
                selectedPath,'#000000', 
                '#aaaaaa'
              ] : '#444444',
              'line-width': 4,
              // 'line-gradient' must be specified using an expression
              // with the special 'line-progress' property
              'line-opacity': selectedPath ? [
                'match',
                ['get', 'key'],
                selectedPath, 1, 
                0.01
              ] : 0.3
            }}
            layout={{
              'line-cap': 'round',
              'line-join': 'round'
            }}
            filter={['all', ...odDataFilter]}
          />
        </Source>
        }
        {!!sensorData &&
          <Source type="geojson" data={sensorData}>
          {!!selectedSensor && <Layer
            id="sensorAdjLayer"
            type="symbol"
            layout={{
              'text-field': ['get', `adj-${selectedSensor}`],
              'text-anchor': 'bottom',
              'text-offset': [0, -1],
            }}
            filter={selectedSensor ? ['>', ['get', `adj-${selectedSensor}`], 0.1] : ['all']}
          />}
          <Layer
            id="sensorLayer"
            type="circle"
            paint={{
              'circle-stroke-width': 1,
              'circle-stroke-opacity': selectedPath && !selectedSensor ? [
                'match',
                ['get', 'ssid'], 
                odPaths.find(({key})=>selectedPath === key)?.string?.split(','),
                0.7,
                0.2
              ]: 1,
              'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'count'],
              0, quantitativeColorList[0],
              sensorCountMax/10, quantitativeColorList[1],
              sensorCountMax*2/10, quantitativeColorList[2],
              sensorCountMax*3/10, quantitativeColorList[3],
              sensorCountMax*4/10, quantitativeColorList[4],
              sensorCountMax*5/10, quantitativeColorList[5],
              sensorCountMax*6/10, quantitativeColorList[6],
              sensorCountMax*7/10, quantitativeColorList[7],
              sensorCountMax*8/10, quantitativeColorList[8],
              sensorCountMax*9/10, quantitativeColorList[9],
              ],
              'circle-radius': selectedSensor ? [
                'interpolate',
                ['linear'],
                ['get', `adj-${selectedSensor}`],
                0, 0,
                1, 32
              ] : 4,
              'circle-opacity': selectedPath && !selectedSensor ? [
                'match',
                ['get', 'ssid'], 
                odPaths.find(({key})=>selectedPath === key)?.string?.split(','),
                0.7,
                0.2
              ]: 1
            }}
            //filter={selectedPath ? ['in', 'ssid', ...odPaths.find(({key})=>selectedPath === key)?.string?.split(',')] : ['all']}
          />
        </Source>
        }
      </Map>
      </>
      }
      </>}
    </div>
  )
}
*/