import {Source, Layer} from '@/lib/useClientModules';
import { filteredPathHeatmap } from '@/recoil/GeoStore';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

export default function Heatmap() {
    const filteredPathHeatmapState = useRecoilValue(filteredPathHeatmap);
    const [heatmapMax, setHeatmapMax] = useState(0);
    useEffect(()=>{
        if (filteredPathHeatmapState?.features) {
            setHeatmapMax(Math.max(...filteredPathHeatmapState?.features.map(({properties}) => (properties.count))));
        }
    }, [filteredPathHeatmapState]);
    return (
        filteredPathHeatmapState &&
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
                1,'#0fffff',
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
}