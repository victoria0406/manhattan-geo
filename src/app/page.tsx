"use client";

import Map, {Source, Layer, Popup, MapLayerMouseEvent, LngLatBounds} from '@/lib/useClientModules';
import type {FeatureCollection} from 'geojson';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import ControllPanel from '@/components/ControllPanel';
import Loading from '@/components/Loading';
import PathPannel from '@/components/PathPannel';
import SettingModal from '@/components/SettingModal';
import useGeoHash from '@/hooks/useGeohash';
import useSensor from '@/hooks/useSensor';
import useOdData from '@/hooks/useOdData';
import useGeoData from '@/hooks/useGeoData';
import DataInputModal from '@/components/DataInputModal';


interface geohashFeatureType {
  type: 'Feature',
  properties: {
    geohash: string,
  },
  geometry: {
    type: 'Polygon',
    coordinates: number[][][],
  },
};

interface featureType {
  name: string,
  type: string,
};

interface ViewStateType {
  longitude: number,
  latitude: number,
  zoom: number
}
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

export default function Home() {
  const [isCensus, setIsCensus] = useState(true);
  const [isGeohash, setIsGeohash] = useState(true);
  const [viewState, setViewState] = useState<ViewStateType>();
  const [pathStringType, setPathStringType] = useState<string>();
  
  const [isSetted, setIsSetted] = useState<boolean>(false);
  const [isMapLoad, setIsMapLoad] = useState<boolean>(false);

  const {setGeoBounds, setGeohashPrecision, geohashPrecision, geohash} = useGeoHash();
  const {
    sensorData, sensorKeyValues, selectedSensor, adjSensors, sensorCountMax,
    setSelectedSensor, clickSensor, fetchSensorData, fetchSensorAdjData
  } = useSensor();
  const {
    fetchOddata, setOdDataYear, setOdDataMonth, setOdDataHour, setSelectedPath,
    odData, odDataYear, odDataMonth, odDataHour, odDataFilter, odPaths, selectedPath, 
  } = useOdData(pathStringType);

  const {
    fetchGeoData, setCategory,
    geoData, category, cateStyle,
} = useGeoData();

  useEffect(()=> {
    setSelectedSensor(null);
  }, [selectedPath]);

  async function fetchSensorDataGroup(
    pathUrl: string, dataUrl: string, extraUrl:string, 
  ) {
    fetchOddata(pathUrl);
    fetchSensorData(dataUrl);
    setPathStringType('sensor');
    fetchSensorAdjData(extraUrl);
  };

  async function fetchGeoDataGroup(
    pathUrl: string, dataUrl: string, filterUsage: boolean[]
  ) {
    setPathStringType('geohash');
    fetchOddata(pathUrl, {isParseHour: filterUsage[2], isParseMonth: filterUsage[1], isParseYear: filterUsage[0]});
    fetchGeoData(dataUrl);
  }

  async function fetchDatas(
    dataType: string, pathUrl: string, dataUrl: string, extraUrl:string, initailView:ViewStateType, filterUsage: boolean[]
  ){
    switch (dataType) {
      case 'geo':
        await fetchGeoDataGroup(pathUrl, dataUrl, filterUsage);
        break;
      case 'sensor':
        await fetchSensorDataGroup(pathUrl, dataUrl, extraUrl);
        break;
      default:
        break;
    }
    setViewState(initailView);
    setIsSetted(true);
  }

  const mapRender = debounce((e) => {
    setGeoBounds(e.target.getBounds());
  },500);

  const onClick = (e) => {
    console.log(e.lngLat);
    const {lngLat} = e
    clickSensor(lngLat);
  }

  return (
    <main className='relative'>
      {!isSetted && <DataInputModal fetchDatas={fetchDatas}/>}
      {!!isSetted && (!odData || !isMapLoad) && <Loading transparent={false}/>}
      {!!isSetted && !!odData && <>
      <ControllPanel
        setCategory={setCategory}
        isGeohash={isGeohash}
        setIsGeohash={setIsGeohash}
        isCensus={isCensus}
        setIsCensus={setIsCensus}
        geohashPrecision={geohashPrecision}
        setGeohashPrecision={setGeohashPrecision}
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
      {odData && <Map
        initialViewState={viewState}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken='pk.eyJ1IjoidmljdG9yaWEwNDA2IiwiYSI6ImNsbTdtN3A2ODAxdXkza3MydHRxZm94MHMifQ.7G3rMAvrocvBXl0XYX8WGA'
        style={{width: '100vw', height: '100vh'}}
        onLoad={()=>setIsMapLoad(true)}
        onRender = {mapRender}
        onClick={onClick}
        {...mapSetting}
      >
        {isCensus && geoData && <Source type="geojson" data={geoData}>
          {!!category && <Layer
            id="geojsonLayerCategory"
            type="fill"
            paint={{
              'fill-color': cateStyle,
            }}
            beforeId="geojsonLayer"
          />}
          <Layer
            id="geojsonLayer"
            type="line"
            paint={{
              'line-color': 'gray',
            }}
          />
        </Source>}
        {!!geohash && isGeohash &&<Source type="geojson" data={geohash}>
          <Layer
            id="geohashLayer"
            type="line"
            paint={{
              'line-color': 'gray',
            }}
            
          />
        </Source>}
        {!!odData &&
          <Source type="geojson" data={odData}>
          <Layer
            id="odLayer"
            type="line"
            // beforeId="sensorLayer"
            paint={{
              'line-color': selectedPath ? [
                'match',
                ['get', 'key'],
                selectedPath, 'black', 
                '#aaaaaa'
              ] : '#444444',
              'line-width': 2,
              'line-opacity': selectedPath ? [
                'match',
                ['get', 'key'],
                selectedPath, 1, 
                0.01
              ] : 0.5
            }}
            filter={['all', ...odDataFilter]}
          />
        </Source>
        }
        {!!sensorData && !!sensorKeyValues &&
          <Source type="geojson" data={sensorData}>
          {!!selectedSensor && <Layer
            id="sensorAdjLayer"
            type="symbol"
            layout={{
              'text-field': ['match', ['get', 'ssid'], ...sensorKeyValues, ''],
              'text-anchor': 'bottom',
              'text-offset': [0, -1],
            }}
            filter={selectedPath ? ['in', 'ssid', ...odPaths.find(({key})=>selectedPath === key)?.string?.split(',')] : ['all']}
          />}
          <Layer
            id="sensorLayer"
            type="circle"
            paint={{
              'circle-stroke-width': 1,
              'circle-stroke-opacity':selectedSensor ? [
                'case',
                ['in', ['get', 'ssid'], ["literal", adjSensors]],
                1,
                0.3
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
                'match',
                ['get', 'ssid'],
                selectedSensor, 8,
                4
              ] : 4,
              'circle-opacity': selectedSensor ? [
                'case',
                ['in', ['get', 'ssid'], ["literal", adjSensors]],
                1,
                0.1
              ]: 1
            }}
            filter={selectedPath ? ['in', 'ssid', ...odPaths.find(({key})=>selectedPath === key)?.string?.split(',')] : ['all']}
          />
        </Source>
        }
      </Map>}
      </>}
    </main>
  )
}
