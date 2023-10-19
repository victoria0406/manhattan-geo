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
import { featureType, ViewStateType } from '@/lib/types';

const mapSetting = {
  minZoom: 8,
}

export default function GeoMap(
  {pathUrl, dataUrl, initialView, filterUsage, initialCategories}
  :{pathUrl: string, dataUrl: string, initialView:ViewStateType, filterUsage: boolean[], initialCategories:featureType[]}
) {
  const [isCensus, setIsCensus] = useState(true);
  const [isGeohash, setIsGeohash] = useState(true);

  const [isMapLoad, setIsMapLoad] = useState<boolean>(false);

  const {setGeoBounds, setGeohashPrecision, geohashPrecision, geohash} = useGeoHash();

  // 저장되어야 할 데이터
  const [viewState, setViewState] = useState<ViewStateType>();
  const [categories, setCategories] = useState<featureType[]|undefined>();
  const {
    fetchOddata, setOdDataYear, setOdDataMonth, setOdDataHour, setSelectedPath,
    odData, odDataYear, odDataMonth, odDataHour, odDataFilter, odPaths, selectedPath, 
  } = useOdData('geohash');

  const {
    fetchGeoData, setCategory,
    geoData, category, cateStyle,
  } = useGeoData();
  
  useEffect(()=>{
    fetchData();
  }, []);

  async function fetchData() {
    console.log(pathUrl, dataUrl)
    await fetchOddata(pathUrl, {isParseHour: filterUsage[2], isParseMonth: filterUsage[1], isParseYear: filterUsage[0]});
    await fetchGeoData(dataUrl);
    setCategories(categories);
    setViewState(initialView);
  } 

  const mapRender = debounce((e) => {
    setGeoBounds(e.target.getBounds());
  },500);

  return (
    <div className='relative overflow-hidden'>
      {(!odData || !isMapLoad) && <Loading transparent={false}/>}
      {!!odData &&
      <>
      <ControllPanel
        setCategory={setCategory}
        isGeohash={isGeohash}
        setIsGeohash={setIsGeohash}
        isCensus={isCensus}
        setIsCensus={setIsCensus}
        geohashPrecision={geohashPrecision}
        setGeohashPrecision={setGeohashPrecision}
        categories={categories}
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
      {!!odData &&
      <><Map
        initialViewState={viewState}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken='pk.eyJ1IjoidmljdG9yaWEwNDA2IiwiYSI6ImNsbTdtN3A2ODAxdXkza3MydHRxZm94MHMifQ.7G3rMAvrocvBXl0XYX8WGA'
        style={{width: '100vw', height: '100vh'}}
        onLoad={()=>setIsMapLoad(true)}
        onRender = {mapRender}
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
      </Map>
      </>
      }
      </>}
    </div>
  )
}
