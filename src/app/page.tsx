"use client";

import Map, {Source, Layer, Popup, MapLayerMouseEvent, LngLatBounds} from '@/lib/useClientModules';
import type {FeatureCollection} from 'geojson';
import { useEffect, useState } from 'react';
import { encodeGeohash, decodeGeohash } from '@/lib/geohash';
import { debounce } from 'lodash';

import ControllPanel from '@/components/ControllPanel';
import Loading from '@/components/Loading';
import PathPannel from '@/components/PathPannel';

const LOCATION = 'pemsd7'; // metr-la, pems-bay, pemsd7 중 하나 입력
const STARTVIEW = LOCATION === 'metr-la' ? {
  longitude: -118.3992154,
  latitude: 34.1114597,
  zoom: 10,
} : LOCATION === 'pems-bay' ? {
  longitude:  -121.92809670018664,
  latitude: 37.34048422339241,
  zoom: 10
} : {
  longitude: -118.21073650795017,
  latitude: 33.92243661859156,
  zoom: 10
};

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

interface geohashJsonType {
  type: 'FeatureCollection',
  features: geohashFeatureType[],
};

interface featureType {
  name: string,
  type: string,
};

const censusCategory:featureType[] = [
  {name: 'ALAND', type: 'quantitative'},
  {name: 'AWATER', type: 'quantitative'}, 
  {name: 'COUNTYFP', type: 'categorical'},
  {name: 'NAMELSAD', type: 'categorical'},
]

const viewState = {
  ...STARTVIEW,
};

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

const categoricalColorList = [
  "#FF5733",
  "#33FF57",
  "#5733FF",
  "#FF3399",
  "#33FFFF",
  "#FF9933",
  "#3366FF",
  "#FF33CC",
  "#33CCFF",
  "#FFCC33",
  "#FF3366",
  "#66FF33",
  "#CC33FF",
  "#33FFCC",
  "#9933FF",
  "#FFFF33",
  "#66CCFF",
  "#FF66CC",
  "#66FFCC",
  "#CC66FF"
]

export default function Home() {
  const [isCensus, setIsCensus] = useState(true);
  const [isGeohash, setIsGeohash] = useState(true);
  
  const [isMapLoad, setIsMapLoad] = useState<boolean>(false);
  const [geojson, setGeojson] = useState<FeatureCollection>();
  const [pathData, setPathData] = useState();
  const [category, setCategory] = useState<featureType>();
  const [cateStyle, setCateStyle] = useState<any[]>();

  const [geoBounds, setGeoBounds] = useState<LngLatBounds>();
  const [geohashPrecision, setGeohashPrecision] = useState<number>(1);
  const [geohash, setGeohash] = useState<geohashJsonType>();

  const [odData, setOdData] = useState<FeatureCollection>();

  const [odDataYear, setOdDataYear] = useState('2009');

  const [odPaths, setOdPaths] = useState<{string: string, key: string}[]>([]);
  const [selectedPath, setSelectedPath] = useState<String|null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playPathGeoJson, setPlayPathGeoJson] = useState(null);

  const [sensorData, setSensorData] = useState<FeatureCollection>();
  const [sensorAdjData, setSensorAdjData] = useState();
  const [selectedSensor, setSelectedSensor] = useState<string>();
  const [sensorKeyValues, setSensorKeyValues] = useState<string[]>([]);

  useEffect(()=>{
    setGeojson(undefined);
    fetch('https://deepurban.kaist.ac.kr/urban/geojson/manhattan_new_york.geojson')
      .then(resp => resp.json())
      .then(json => setGeojson(json))
      .catch(err => console.error('Could not load data', err));
    }, []);

  useEffect(()=>{
    setOdData(undefined);
    fetch(`https://deepurban.kaist.ac.kr/urban/geojson/traffic/${LOCATION}-1000.geojson`)
      .then(resp => resp.json())
      .then(json => {
        /*json.features.forEach(({properties}, i)=>{
          json.features[i].properties.pickup_year = properties.pickup_datetime.split('-')[0]
        });*/
        setOdData(json);
        console.log(json);
      })
      .catch(err => console.error('Could not load data', err));
  }, []);

  useEffect(()=> {
    const geohashPath = odData?.features.map(({geometry, properties})=>({
      string: properties?.path_sensors,
      key: properties?.key,
    }));
    if (geohashPath) setOdPaths(geohashPath);
  }, [odData, odDataYear]);

  useEffect(()=>{
    setOdData(undefined);
    fetch(`https://deepurban.kaist.ac.kr/urban/geojson/traffic/${LOCATION}-sensors.geojson`)
      .then(resp => resp.json())
      .then(json => {
        console.log(json);
        setSensorData(json);
      })
      .catch(err => console.error('Could not load data', err));
  }, []);

  useEffect(()=>{
    if (!geojson) return;
    const catProperties = new Set(geojson.features.map(({properties})=> {
      return properties ? category ? properties[category?.name] :null : null;
    }));
    const styleList : (string|number)[] = [];
    switch (category?.type){
      case 'categorical':
        [...catProperties].forEach((e:string, i:number)=>{
          styleList.push(e);
          styleList.push(categoricalColorList[i]);
        })
        setCateStyle([
          'match',
          ['get', category?.name],
          ...styleList,
          'white',
        ]);
        break;
      case 'quantitative':
        const max = Math.max(...[...catProperties].map((e)=>(Number(e))));
        const min = Math.min(...[...catProperties].map((e)=>(Number(e))));
        const diff = Math.floor((max - min) / 10);
        for (var i=0;i<11;i+=1) {
          styleList.push(min+diff*i);
          styleList.push(quantitativeColorList[i]);
        }
        setCateStyle([
          'interpolate',
          ['linear'],
          ['get', category?.name],
          ...styleList,
        ]);
        break;
    }
  }, [category]);

  useEffect(()=>{
    setSensorAdjData(undefined);
    fetch(`https://deepurban.kaist.ac.kr/urban/geojson/traffic/${LOCATION}-sensor-adjmx.json`)
      .then(resp => resp.json())
      .then(json => {
        setSensorAdjData(json);
      })
      .catch(err => console.error('Could not load data', err));
  }, [])

  useEffect(()=>{
    if (selectedSensor && sensorAdjData) {
      const tArray = []
      const keys = Object.keys(sensorAdjData[selectedSensor]);
      const values = Object.values(sensorAdjData[selectedSensor]);
      for (let i=0; i< keys.length; i++) {
        tArray.push(keys[i]);
        tArray.push(values[i] > 0.001 ? String(values[i].toFixed(3)): '');
      }
      setSensorKeyValues(tArray);
    }
  }, [selectedSensor, sensorAdjData])

  useEffect(()=> {
    setSelectedSensor(null);
  }, [selectedPath]);

  useEffect(()=>{
    if (!geoBounds) return;
    const ne = geoBounds.getNorthEast(); // 북동쪽 꼭지점 좌표
    const sw = geoBounds.getSouthWest(); // 남서쪽 꼭지점 좌표

    // 북동쪽과 남서쪽 꼭지점의 Geohash 생성
    const neGeohash = encodeGeohash(ne.lat, ne.lng, geohashPrecision);
    const swGeohash = encodeGeohash(sw.lat, sw.lng, geohashPrecision);

    const latDiff = 180/(8**Math.floor(geohashPrecision/2)*4**(geohashPrecision - Math.floor(geohashPrecision/2)));
    const lngDiff = 360/(4**Math.floor(geohashPrecision/2)*8**(geohashPrecision - Math.floor(geohashPrecision/2)));

    // Geohash 그리드 생성
    const geohashes = new Set();
    for (let lat = sw.lat; lat < ne.lat+latDiff; lat +=latDiff) {
      for (let lng = sw.lng; lng < ne.lng+lngDiff; lng +=lngDiff) {
        const hash = encodeGeohash(lat, lng, geohashPrecision);
        geohashes.add(hash);
      }
    }
    // Geohash bounds list 생성
    const geohashFeatures = [...geohashes].map((hash):geohashFeatureType=>{
      const {sw, ne} =decodeGeohash(String(hash));
      const coordinates = [
        [sw.lng, sw.lat],
        [ne.lng, sw.lat],
        [ne.lng, ne.lat],
        [sw.lng, ne.lat],
        [sw.lng, sw.lat],
      ];
      return {
        type: "Feature",
        properties: {
          geohash: String(hash),
        },
        geometry: {
          type: "Polygon",
          coordinates: [coordinates],
        },
      }
    });
    setGeohash({
      type: 'FeatureCollection',
      features: geohashFeatures,
    })
  }, [geoBounds, geohashPrecision]);

  /*useEffect(()=>{
    if (isPlaying) {
      const filteredFeature = odData?.features.filter(({properties})=>(properties.key===selectedPath));
      let idx = 2;
      console.log(filteredFeature);
      const maxIdx = filteredFeature[0].geometry.coordinates.length-1;
      const interval = setInterval(()=>{
        if (idx === maxIdx) {
          clearInterval(interval);
          setIsPlaying(false);
        } else {
          const newGeojson = odData;
          console.log([{
            ...filteredFeature[0],
            geometry: filteredFeature[0].geometry.coordinates.slice(0, idx),
          }]);
          Object.assign(newGeojson, {
            ...odData,
            features: [{
              ...filteredFeature[0],
              geometry: filteredFeature[0].geometry.coordinates.slice(0, idx),
            }],
          });
          setPlayPathGeoJson(newGeojson);
          idx += 1;
        }
      }, 500);
    }
  }, [isPlaying]);*/

  function getPath() {
    fetch('https://deepurban.kaist.ac.kr/urban/geojson/sample_trace.geojson')
      .then(resp => resp.json())
      .then(json => setPathData(json))
      .catch(err => console.error('path is not loaded', err));
  }

  const mapRender = debounce((e) => {
    setGeoBounds(e.target.getBounds());
  },500);

  const onClick = (e) => {
    console.log(e.lngLat);
    const {lngLat} = e
    const clickedSensor = sensorData?.features.find(({geometry}) => ((Math.abs(geometry.coordinates[0] - lngLat.lng) < 0.001 ) && (Math.abs(geometry.coordinates[1] - lngLat.lat) < 0.001)));
    if (clickedSensor) {
      console.log(clickedSensor);
      setSelectedSensor(clickedSensor.properties.ssid === selectedSensor ? null :clickedSensor.properties.ssid);
    }
  }

  return (
    <main className='relative'>
      {(!isMapLoad || !geohash || !geojson) && <Loading transparent={false}/>}
      {!odData && <Loading transparent={true}/>}
      <ControllPanel
        getPath = {getPath}
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
        setSelectedPath={setSelectedPath}
        setIsPlaying={setIsPlaying}
      />
      <Map
        initialViewState={viewState}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken='pk.eyJ1IjoidmljdG9yaWEwNDA2IiwiYSI6ImNsbTdtN3A2ODAxdXkza3MydHRxZm94MHMifQ.7G3rMAvrocvBXl0XYX8WGA'
        style={{width: '100vw', height: '100vh'}}
        onLoad={()=>setIsMapLoad(true)}
        onRender = {mapRender}
        onClick={onClick}
        {...mapSetting}
      >
        {isCensus && geojson && <Source type="geojson" data={geojson}>
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
        {!!pathData &&
          <Source type="geojson" data={pathData}>
          <Layer
            id="pathLayer"
            type="fill"
            paint={{
              'fill-color': 'blue',
              'fill-opacity': 0.5,
            }}
            
          />
        </Source>
        }
        {!!geohash && isGeohash &&<Source type="geojson" data={geohash}>
          <Layer
            id="geohashLayer"
            type="line"
            paint={{
              'line-color': 'gray',
            }}
            
          />
        </Source>}
        {!playPathGeoJson && !!odData &&
          <Source type="geojson" data={odData}>
          <Layer
            id="odLayer"
            type="line"
            beforeId="sensorLayer"
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
            // filter={['==', 'pickup_year', odDataYear]}
          />
        </Source>
        }
        {!!playPathGeoJson &&
          <Source type="geojson" data={playPathGeoJson}>
          <Layer
            id="odPathLayer"
            type="line"
            paint={{
              'line-color': 'blue',
              'line-width': 4
            }}
          />
        </Source>
        }
        {!playPathGeoJson && !!sensorData && !!sensorKeyValues &&
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
              'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'count'],
              0, quantitativeColorList[0],
              500, quantitativeColorList[1],
              1000, quantitativeColorList[2],
              1500, quantitativeColorList[3],
              2000, quantitativeColorList[4],
              2500, quantitativeColorList[5],
              3000, quantitativeColorList[6],
              3500, quantitativeColorList[7],
              4000, quantitativeColorList[8],
              4500, quantitativeColorList[9],
              ],
              'circle-radius': selectedSensor ? [
                'match',
                ['get', 'ssid'],
                selectedSensor, 16,
                4
              ] : 4,
              'circle-opacity': selectedSensor ? [
                'match',
                ['get', 'ssid'],
                selectedSensor, 1,
                0.2
              ]: 1
            }}
            filter={selectedPath ? ['in', 'ssid', ...odPaths.find(({key})=>selectedPath === key)?.string?.split(',')] : ['all']}
          />
        </Source>
        }
      </Map>
    </main>
  )
}
