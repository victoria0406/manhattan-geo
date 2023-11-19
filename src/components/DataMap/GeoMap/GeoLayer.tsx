import {Source, Layer} from '@/lib/useClientModules';
import { geoData as geoDataState } from '@/recoil/GeoStore';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

export default function GeoLayer(
    {category}:{category:string|null}
) {
    const geoData = useRecoilValue(geoDataState);
    const [maxValue, setMaxValue] = useState(100000);
    useEffect(()=>{
        if (geoData && category) {
            console.log(geoData.features[0].properties);
            const list = geoData.features.map(({properties})=>(
                properties[category]
            ));
            const mean = list.reduce((sum, value) => sum + value, 0) / list.length;
            const standardDeviation = Math.sqrt(list.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / list.length);
            const estimatedMaxValue = mean + 2 * standardDeviation;
            setMaxValue(estimatedMaxValue);
        }
    }, [category])
    return (
        geoData && <Source
            type="geojson"
            data={geoData}
        >
            {category &&<Layer
                id='geomapLayer'
                beforeId="geomapLineLayer"
                type='fill'
                paint = {{
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', category],
                        0,'#00ffff',
                        maxValue, '#0000ff',
                      ],
                    'fill-opacity': 0.5
                }}
            />}
            <Layer
                id='geomapLineLayer'
                beforeId="pathLayer"
                type='line'
                paint = {{
                    'line-color': '#444444'
                }}
            />
        </Source>
    )
}