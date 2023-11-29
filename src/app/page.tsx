'use client';

import ControllPanel from '@/components/ControllPanel';
import DataMap from '@/components/DataMap';
import PathPannel from '@/components/PathPannel';
import { ButtonGroup, Button, InputText } from '@/components/ui';
import { ViewStateType, featureType } from '@/lib/types';
import React, { useState } from 'react';
import { RecoilRoot } from 'recoil';

export default function Home() {
  /* const initialView : ViewStateType= {
    longitude:-73.9712488,
    latitude: 40.7830603,
    zoom: 12,
  }
  const pathDataUrl = 'https://deepurban.kaist.ac.kr/urban/geojson/nyc_taxi_trajectory_generated_sample.geojson';
  const censusDataUrl = 'https://deepurban.kaist.ac.kr/urban/geojson/manhattan_new_york.geojson';
  */
  const categories: featureType[] = [
    { name: 'ALAND', type: 'quantitative' },
    { name: 'AWATER', type: 'quantitative' },
    { name: 'NAMELSAD', type: 'categorical' },
  ];

  const [category, setCategory] = useState<featureType|null>(null);

  const [useGeohash, setUseGeohash] = useState(true);

  const [initialView, setInitalView] = useState<ViewStateType>();
  const [pathDataUrl, setPathDataUrl] = useState<string>();
  const [geoDataUrl, setGeoDataUrl] = useState<string>();
  return (
    <main className="relative h-screen">
      {!initialView
      && (
      <div className="w-screen h-screen bg-[url('/setting-bg.jpg')] bg-cover">
        <div className="xl:w-1/3 lg:w-1/2 w-full dark:bg-gray-800 bg-white h-screen float-right flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl pb-8">PATH VIZ</h1>
          <InputText
            value={pathDataUrl}
            id="path-data-url"
            label="path data url"
            onChange={(e) => setPathDataUrl(e.target.value)}
            placeholder="https://"
            information="The url should be https, not http"
          />
          <InputText value={geoDataUrl} id="geo-data-url" label="Geographic data url" onChange={(e) => setGeoDataUrl(e.target.value)} placeholder="https://" />
          <ButtonGroup direction="horizontal" gap={5}>
            <Button size="lg">Prev</Button>
            <Button size="lg" activate>Next</Button>
          </ButtonGroup>
        </div>
      </div>
      )}
      {initialView
      && (
      <RecoilRoot>
        <DataMap.Wrapper
          viewState={initialView}
        >
          {geoDataUrl && (
          <DataMap.GeoMap.Wrapper
            dataUrl={geoDataUrl}
          >
            {!useGeohash && <DataMap.GeoMap.GeoLayer category={category} />}
          </DataMap.GeoMap.Wrapper>
          )}
          {pathDataUrl && (
          <DataMap.PathMap.Wrapper
            pathUrl={pathDataUrl}
          >
            {useGeohash && <DataMap.PathMap.Heatmap />}
            <DataMap.PathMap.Path />
          </DataMap.PathMap.Wrapper>
          )}
        </DataMap.Wrapper>
        <PathPannel.Wrapper>
          <PathPannel.FilterSlider filterUnit="year" filterRange={[0, 23]} />
          <PathPannel.PathList />
          <PathPannel.ExtractButton filteredDataOnly>
            Extract Strings
          </PathPannel.ExtractButton>
        </PathPannel.Wrapper>
        <ControllPanel.Wrapper>
          <div className="text-sm mt-2">Select Background</div>
          <ButtonGroup
            direction="horizontal"
            style="container"
          >
            <Button
              onClick={() => { setUseGeohash(true); }}
              activate={useGeohash}
            >
              Geohash
            </Button>
            <Button
              onClick={() => { setUseGeohash(false); }}
              activate={!useGeohash}
            >
              Census
            </Button>
          </ButtonGroup>
          {useGeohash && <ControllPanel.Geohash />}
          {!useGeohash
          && (
          <>
            <div className="text-sm mt-2">Census Category</div>
            <ButtonGroup
              direction="vertical"
              gap={2}
              style="outlined"
            >
              <Button
                onClick={() => { setCategory(null); }}
                activate={!category}
                size="sm"
              >
                None
              </Button>
              {categories.map((newCategory:featureType) => (
                <Button
                  key={newCategory.name}
                  onClick={() => { setCategory(newCategory); }}
                  activate={category?.name === newCategory.name}
                  size="sm"
                >
                  {newCategory.name}
                </Button>
              ))}
            </ButtonGroup>
          </>
          )}
        </ControllPanel.Wrapper>
      </RecoilRoot>
      )}
    </main>
  );
}
