import { featureType } from '@/lib/types';
import {Source, Layer} from '@/lib/useClientModules';
import { geoData as geoDataState } from '@/recoil/GeoStore';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

const colorPalette = [
    '#B0E0E6', '#ADD8E6', '#87CEFA', '#87CEEB', '#00BFFF',
    '#1E90FF', '#6495ED', '#4682B4', '#5F9EA0', '#7B68EE',
    '#6A5ACD', '#483D8B', '#87CEFA', '#1E90FF', '#B0C4DE',
    '#778899', '#708090', '#C0C0C0', '#DCDCDC', '#F8F8FF',
    '#F0F8FF', '#00CED1', '#5F9EA0', '#4682B4', '#B0C4DE',
    '#B0E0E6', '#87CEEB', '#00BFFF', '#1E90FF', '#6495ED'
  ];

export default function GeoLayer(
    {category}:{category:featureType|null, type}
) {
    const geoData = useRecoilValue(geoDataState);
    const [maxValue, setMaxValue] = useState(100000);
    const [colorStyle, setColorStyle] = useState([]);
    useEffect(()=>{
        if (geoData && category) {
            console.log(geoData.features[0].properties);
            const list = geoData.features.map(({properties})=>(
                properties[category.name]
            ));
            if (category.type === 'quantitative') {
                const mean = list.reduce((sum, value) => sum + value, 0) / list.length;
                const standardDeviation = Math.sqrt(list.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / list.length);
                const estimatedMaxValue = mean + 2 * standardDeviation;
                setMaxValue(estimatedMaxValue);
            } else {
                const style = [];
                [...new Set(list)].forEach((cate:string, i:number) => {
                    style.push(cate);
                    style.push(colorPalette[i]);
                });
                console.log(style)
                setColorStyle(style);
            }

        }
    }, [category])
    return (
        geoData && <Source
            type="geojson"
            data={geoData}
        >
            {category && category.type === 'quantitative' &&<Layer
                id='geomapLayer'
                beforeId="geomapLineLayer"
                type='fill'
                paint = {{
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', category.name],
                        0,'#00ffff',
                        maxValue, '#0000ff',
                      ],
                    'fill-opacity': 0.3
                }}
            />}
            {category && category.type === 'categorical' &&<Layer
                id='geomapLayer'
                beforeId="geomapLineLayer"
                type='fill'
                paint = {{
                    'fill-color': [
                        'match',
                        ['get', category.name],
                        ...colorStyle,
                        'white',
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