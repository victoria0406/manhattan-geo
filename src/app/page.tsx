"use client";
import DataMap from "@/components/DataMap";
import PathPannel from "@/components/PathPannel";
import { DateUnit } from "@/lib/enumerates";
import { ViewStateType } from "@/lib/types";
import { RecoilRoot } from "recoil";

export default function Home() {
  const initialView : ViewStateType= {
    longitude:-73.9712488,
    latitude: 40.7830603,
    zoom: 12,
  }
  const pathDataUrl = 'http://deepurban.kaist.ac.kr/urban/geojson/nyc_taxi_trajectory_generated_sample.geojson'

  return (
    <main className={`relative h-screen`}>
      <RecoilRoot>
        <DataMap.Wrapper
          viewState={initialView}
        >
          <DataMap.PathMap.Wrapper
            pathUrl={pathDataUrl}
          >
            <DataMap.PathMap.Heatmap/>
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
      </RecoilRoot>
    </main>
  )
}
