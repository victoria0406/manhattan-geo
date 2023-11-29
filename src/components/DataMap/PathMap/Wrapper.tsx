import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { pathData as pathDataState } from '@/recoil/GeoStore';
import { FeatureCollection } from 'geojson';

export default function Wrapper(
  { children, pathUrl }
    :{children: React.ReactNode, pathUrl:string},
) {
  const [, setPathData] = useRecoilState<FeatureCollection|null>(pathDataState);
  useEffect(() => {
    async function getPath() {
      const resp = await fetch(pathUrl);
      const json:FeatureCollection = await resp.json();
      const newFeatures = json.features.map((features) => {
        const { properties } = features;
        const datetime = properties?.pickup_datetime.split(' ');
        const [fulldate, time] = datetime;
        const [year, month] = fulldate.split('-');
        const [hour, ,] = time.split(':');
        if (properties) {
          properties.pickup_year = year;
          properties.pickup_month = month;
          properties.pickup_hour = hour;
        }
        const newFeature = features;
        newFeature.properties = properties;
        return newFeature;
      });
      if (newFeatures) json.features = newFeatures;
      setPathData(json);
    }
    if (pathUrl) {
      getPath();
    }
  }, [pathUrl, setPathData]);
  return (
    children
  );
}
