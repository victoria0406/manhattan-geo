"use client";

import Map, {Source, Layer} from '@/lib/useClientModules';
import { useEffect, useState } from 'react';
import { encodeGeohash, decodeGeohash } from '@/lib/geohash';

interface featureType {
  name: string,
  type: string,
}

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

const viewState = {
  longitude: -73.9712488,
  latitude: 40.7830603,
  zoom: 12
};



const censusCategory:featureType[] = [
  {name: 'ALAND', type: 'quantitative'},
  {name: 'AWATER', type: 'quantitative'}, 
  {name: 'COUNTYFP', type: 'categorical'},
  {name: 'NAMELSAD', type: 'categorical'},
]

export default function Home() {
  const [geojson, setGeojson] = useState();
  const [pathData, setPathData] = useState();
  const [category, setCategory] = useState<string>();
  const [geohashPrecision, setGeohashPrecision] = useState(6);
  const [geohash, setGeohash] = useState<geohashJsonType>();

  useEffect(()=>{
    setGeojson(undefined);
    fetch('https://deepurban.kaist.ac.kr/urban/geojson/manhattan_new_york.geojson')
      .then(resp => resp.json())
      .then(json => setGeojson(json))
      .catch(err => console.error('Could not load data', err));
    }, []);

  function getPath() {
    fetch('https://deepurban.kaist.ac.kr/urban/geojson/sample_trace.geojson')
      .then(resp => resp.json())
      .then(json => setPathData(json))
      .catch(err => console.error('path is not loaded', err));
  }

  function mapLoad(e) {
    const bounds = e.target.getBounds();
    const ne = bounds.getNorthEast(); // 북동쪽 꼭지점 좌표
    const sw = bounds.getSouthWest(); // 남서쪽 꼭지점 좌표
    console.log(ne, sw);

    // 북동쪽과 남서쪽 꼭지점의 Geohash 생성
    const neGeohash = encodeGeohash(ne.lat, ne.lng, geohashPrecision);
    const swGeohash = encodeGeohash(sw.lat, sw.lng, geohashPrecision);
    console.log(neGeohash, swGeohash);

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
    console.log(geohashes);
    // Geohash bounds list 생성
    const geohashFeatures = [...geohashes].map((hash:string):geohashFeatureType=>{
      const {sw, ne} =decodeGeohash(hash);
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
          geohash: hash,
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
  }
  return (
    <main>
      <div className='fixed w-40 h-60 m-12 p-4 bg-white rounded-xl z-10 shadow'>
        {/*<label
          for="countries"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Select Category
        </label>
        <select
          id="countries"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e)=>{setCategory(e.target.value)}}
        >
          {censusCategory.map((item:featureType, i:number)=>(
            <option value={item.name} key={i}>{item.name}</option>
          ))}
        </select>
          */}
        <button
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onClick={getPath}
        >Get Path</button>
      </div>
      <Map
        initialViewState={viewState}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken='pk.eyJ1IjoidmljdG9yaWEwNDA2IiwiYSI6ImNsbTdtN3A2ODAxdXkza3MydHRxZm94MHMifQ.7G3rMAvrocvBXl0XYX8WGA'
        style={{width: '100vw', height: '100vh'}}
        onLoad = {mapLoad}
      >
        <Source type="geojson" data={geojson}>
          <Layer
            id="geojsonLayer"
            type="line"
            paint={{
              'line-color': 'gray',
            }}
            
          />
        </Source>
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
        {!!geohash &&<Source type="geojson" data={geohash}>
          <Layer
            id="geohashLayer"
            type="line"
            paint={{
              'line-color': 'gray',
            }}
            
          />
        </Source>}
      </Map>
    </main>
  )
}
