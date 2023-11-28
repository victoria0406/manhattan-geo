"use client";
import ControllPanel from "@/components/ControllPanel";
import DataMap from "@/components/DataMap";
import PathPannel from "@/components/PathPannel";
import { ButtonGroup, Button } from "@/components/ui";
import { DateUnit } from "@/lib/enumerates";
import { ViewStateType, featureType } from "@/lib/types";
import { useState } from "react";
import { RecoilRoot } from "recoil";

export default function Home() {
  const initialView : ViewStateType= {
    longitude:-73.9712488,
    latitude: 40.7830603,
    zoom: 12,
  }
  const pathDataUrl = 'http://deepurban.kaist.ac.kr/urban/geojson/nyc_taxi_trajectory_generated_sample.geojson';
  const censusDataUrl = 'http://deepurban.kaist.ac.kr/urban/geojson/manhattan_new_york.geojson';

  const categories: featureType[] = [
    {name: 'ALAND', type:'quantitative'},
    {name: 'AWATER', type:'quantitative'},
    {name: 'NAMELSAD', type:'categorical'},
  ];

  const [category, setCategory] = useState<featureType|null>(null);

  const [useGeohash, setUseGeohash] = useState(true);
  return (
    <main className={`relative h-screen`}>
      <RecoilRoot>
        <DataMap.Wrapper
          viewState={initialView}
        >
          <DataMap.GeoMap.Wrapper
            dataUrl={censusDataUrl}
          >
            {!useGeohash && <DataMap.GeoMap.GeoLayer category = {category}/>}
          </DataMap.GeoMap.Wrapper>
          <DataMap.PathMap.Wrapper
            pathUrl={pathDataUrl}
          >
            {useGeohash && <DataMap.PathMap.Heatmap/>}
            <DataMap.PathMap.Path />
          </DataMap.PathMap.Wrapper>
        </DataMap.Wrapper>
        <PathPannel.Wrapper>
          <PathPannel.FilterSlider filterUnit={DateUnit.hour} filterRange={[0, 23]}/>
          <PathPannel.PathList />
          <PathPannel.ExtractButton filteredDataOnly={true}>
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
              onClick={()=>{setUseGeohash(true)}}
              activate={useGeohash}
            >
              Geohash
            </Button>
            <Button
              onClick={()=>{setUseGeohash(false)}}
              activate={!useGeohash}
            >
              Census
            </Button>
          </ButtonGroup>
          {useGeohash && <ControllPanel.Geohash />}
          {!useGeohash && 
          <><div className="text-sm mt-2">Census Category</div>
          <ButtonGroup
            direction="vertical"
            gap={2}
            style="outlined"
          >
            <Button
              onClick={()=>{setCategory(null)}}
              activate={!category}
            >None</Button>
            {categories.map((newCategory:featureType, i:number)=>(
              <Button
                key={i}
                onClick={()=>{setCategory(newCategory)}}
                activate={category?.name === newCategory.name}
              >
                {newCategory.name}
              </Button>
            ))}
          </ButtonGroup>
          </>}
        </ControllPanel.Wrapper>
      </RecoilRoot>
    </main>
  )
}
