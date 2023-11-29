import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { geoData as geoDataState } from '@/recoil/GeoStore';

export default function Wrapper(
  { children, dataUrl }
    :{children:React.ReactNode, dataUrl:string},
) {
  const [, setGeoData] = useRecoilState(geoDataState);
  useEffect(() => {
    async function getData() {
      const resp = await fetch(dataUrl);
      const json = await resp.json();
      setGeoData(json);
    }
    if (dataUrl) {
      getData();
    }
  }, [dataUrl, setGeoData]);
  return (
    children
  );
}
