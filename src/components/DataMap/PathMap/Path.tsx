import { filteredPath, highlightedPath as highlightedPathState } from "@/recoil/GeoStore"
import {Source, Layer} from '@/lib/useClientModules';
import { useRecoilValue } from "recoil"
import { useEffect } from "react";
import { FeatureCollection } from "geojson";

export default function Path() {
    const filteredPathState = useRecoilValue<FeatureCollection|null>(filteredPath);
    const highlightedPath = useRecoilValue(highlightedPathState);
    return (
        filteredPathState &&
        <Source
            type="geojson"
            data={filteredPathState}
            lineMetrics={true}
        >
            <Layer
                id='pathLayer'
                type='line'
                paint = {{
                    'line-color': '#ffffff',
                    'line-width': 3,
                    'line-opacity': highlightedPath ? 0.3 : 0.5,
                }}
            />
            <Layer
                id='highlightedLayer'
                type='line'
                paint = {{
                    'line-color': '#FFFFFF',
                    'line-width': 6,
                }}
                filter ={['==', 'key', highlightedPath]}
            />
        </Source>
    )
}