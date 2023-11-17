import Loading from "@/components/Loading"
import { ViewStateType } from "@/lib/types";
import Map, {Source, Layer, Popup, MapLayerMouseEvent, LngLatBounds} from '@/lib/useClientModules';
import { isPathDataLoaded } from "@/recoil/GeoStore";
import { debounce } from "lodash";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { mapBounds as mapBoundsState } from '@/recoil/GeoStore';

const mapSetting = {
    minZoom: 8,
  }

export default function Wrapper(
    {children, viewState}
    :{children: React.ReactNode, viewState:ViewStateType}
) {
    const [isMapLoad, setIsMapLoad] = useState(false);
    const isPathDataLoadedState = useRecoilValue(isPathDataLoaded);
    const [mapBounds, setMapBounds] = useRecoilState(mapBoundsState);

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: Dark)').matches;

    const mapboxAccessToken = 'pk.eyJ1IjoidmljdG9yaWEwNDA2IiwiYSI6ImNsbTdtN3A2ODAxdXkza3MydHRxZm94MHMifQ.7G3rMAvrocvBXl0XYX8WGA';
    const mapboxStyle = `mapbox://styles/mapbox/${prefersDark ?"dark":"light"}-v11`;
    const mapRender = debounce((e) => {
        setMapBounds(e.target.getBounds());
      },500);
    return (
        <div className='relative overflow-hidden h-full'>
            <Map
                initialViewState={viewState}
                mapStyle={mapboxStyle}
                mapboxAccessToken={mapboxAccessToken}
                style={{width: '100vw', height: '100vh'}}
                onLoad={()=>setIsMapLoad(true)}
                onRender = {mapRender}
                {...mapSetting}
            >
                {children}
            </Map>
            {!isPathDataLoadedState && 
                <Loading transparent={false} isLoading={true}>
                    fetching Data
                </Loading>
            }
        </div>
    )
}