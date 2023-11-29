import React, { useEffect, useState } from 'react';
import { Source, Layer } from '@/lib/useClientModules';
import { filteredPathHeatmap } from '@/recoil/GeoStore';
import { useRecoilValue } from 'recoil';
import type { FeatureCollection } from 'geojson';

export default function Heatmap() {
  const filteredPathHeatmapState = useRecoilValue<FeatureCollection|null>(filteredPathHeatmap);
  const [heatmapMax, setHeatmapMax] = useState(0);
  useEffect(() => {
    if (filteredPathHeatmapState?.features) {
      const values = filteredPathHeatmapState?.features.map(
        ({ properties }) => (properties?.count),
      );
      if (values) {
        setHeatmapMax(Math.max(...values));
      }
    }
  }, [filteredPathHeatmapState]);
  return (
    filteredPathHeatmapState
        && (
        <Source
          type="geojson"
          data={filteredPathHeatmapState}
        >
          <Layer
            beforeId="pathLayer"
            id="geohashFillLayer"
            type="fill"
            paint={{
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'count'],
                1, '#0fffff',
                heatmapMax, '#0000ff',
              ],
              'fill-opacity': [
                'interpolate',
                ['linear'],
                ['get', 'count'],
                1, 0.3,
                heatmapMax, 1,
              ],
            }}
          />
        </Source>
        )
  );
}
