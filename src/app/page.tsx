"use client";

import Map, {Source, Layer, Popup, MapLayerMouseEvent, LngLatBounds} from '@/lib/useClientModules';
import type {FeatureCollection} from 'geojson';
import { useEffect, useState } from 'react';
import { encodeGeohash, decodeGeohash } from '@/lib/geohash';
import { debounce } from 'lodash';

import ControllPanel from '@/components/ControllPanel';
import Loading from '@/components/Loading';
import PathPannel from '@/components/PathPannel';

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
  longitude: -73.9712488,
  latitude: 40.7830603,
  zoom: 12
};

const mapSetting = {
  minZoom: 11,
}

// function getRandomHexColor() {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

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
  const [geohashPrecision, setGeohashPrecision] = useState<number>(6);
  const [geohash, setGeohash] = useState<geohashJsonType>();

  const [odData, setOdData] = useState<FeatureCollection>();
  const [odDataYear, setOdDataYear] = useState('2009');

  useEffect(()=>{
    setGeojson(undefined);
    fetch('https://deepurban.kaist.ac.kr/urban/geojson/manhattan_new_york.geojson')
      .then(resp => resp.json())
      .then(json => setGeojson(json))
      .catch(err => console.error('Could not load data', err));
    }, []);

  useEffect(()=>{
    setOdData(undefined);
    fetch('http://deepurban.kaist.ac.kr/urban/geojson/nyc_taxi_trajectory_generated_sample.geojson')
      .then(resp => resp.json())
      .then(json => {
        // setOdData(json);
        json.features.forEach(({properties}, i)=>{
          json.features[i].properties.pickup_year = properties.pickup_datetime.split('-')[0]
        });
        console.log(json);
        setOdData(json);
        // console.log(timeFeatures.sort());
      })
      .catch(err => console.error('Could not load data', err));
  }, [])

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
        console.log(max, min);
        const diff = Math.floor((max - min) / 10);
        for (var i=0;i<11;i+=1) {
          styleList.push(min+diff*i);
          styleList.push(quantitativeColorList[i]);
        }
        console.log(styleList);
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

  function getPath() {
    fetch('https://deepurban.kaist.ac.kr/urban/geojson/sample_trace.geojson')
      .then(resp => resp.json())
      .then(json => setPathData(json))
      .catch(err => console.error('path is not loaded', err));
  }

  const mapRender = debounce((e) => {
    setGeoBounds(e.target.getBounds());
  },500);

  return (
    <main className='relative'>
      {(!isMapLoad || !geohash || !geojson) && <Loading />}
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
        getPath={getPath}
        odDataYear={odDataYear}
        setOdDataYear={setOdDataYear}
      />
      <Map
        initialViewState={viewState}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken='pk.eyJ1IjoidmljdG9yaWEwNDA2IiwiYSI6ImNsbTdtN3A2ODAxdXkza3MydHRxZm94MHMifQ.7G3rMAvrocvBXl0XYX8WGA'
        style={{width: '100vw', height: '100vh'}}
        onLoad={()=>setIsMapLoad(true)}
        onRender = {mapRender}
        {...mapSetting}
      >
        {isCensus && <Source type="geojson" data={geojson}>
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
        {!!odData &&
          <Source type="geojson" data={odData}>
          <Layer
            id="odLayer"
            type="line"
            paint={{
              'line-color': 'blue',
              'line-opacity': 0.3,
              'line-width': 4
            }}
            filter={['==', 'pickup_year', odDataYear]}
          />
        </Source>
        }
      </Map>
    </main>
  )
}
