import React, { useState } from 'react';
import Loading from '@/components/Loading';
import { ViewStateType } from '@/lib/types';
import Map from '@/lib/useClientModules';
import { isPathDataLoaded, mapBounds as mapBoundsState } from '@/recoil/GeoStore';
import { debounce } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';

export default function Wrapper(
  { children, viewState }
    :{children: React.ReactNode, viewState:ViewStateType},
) {
  const [, setIsMapLoad] = useState(false);
  const isPathDataLoadedState = useRecoilValue(isPathDataLoaded);
  const [, setMapBounds] = useRecoilState(mapBoundsState);

  const prefersDark = true;
  // TODO: 다크모드는 next.js에서 다르다.
  // window.matchMedia && window.matchMedia('(prefers-color-scheme: Dark)').matches;

  const mapboxAccessToken = 'pk.eyJ1IjoidmljdG9yaWEwNDA2IiwiYSI6ImNsbTdtN3A2ODAxdXkza3MydHRxZm94MHMifQ.7G3rMAvrocvBXl0XYX8WGA';
  const mapboxStyle = `mapbox://styles/mapbox/${prefersDark ? 'dark' : 'light'}-v11`;
  const mapRender = debounce((e) => {
    setMapBounds(e.target.getBounds());
  }, 500);
  return (
    <div className="relative overflow-hidden h-full">
      <Map
        initialViewState={viewState}
        mapStyle={mapboxStyle}
        mapboxAccessToken={mapboxAccessToken}
        style={{ width: '100vw', height: '100vh' }}
        onLoad={() => setIsMapLoad(true)}
        onRender={mapRender}
        minZoom={8}
      >
        {children}
      </Map>
      {!isPathDataLoadedState
                && (
                <Loading transparent={false} isLoading>
                  fetching Data
                </Loading>
                )}
    </div>
  );
}
