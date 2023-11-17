import { filteredPath, highlightedPath as highlightedPathState } from "@/recoil/GeoStore"
import {Source, Layer} from '@/lib/useClientModules';
import { useRecoilValue } from "recoil"
import { useEffect } from "react";

export default function Path() {
    const filteredPathState = useRecoilValue(filteredPath);
    const highlightedPath = useRecoilValue(highlightedPathState);
    return (
        filteredPathState &&
        <Source
            type="geojson"
            data={filteredPathState}
        >
            <Layer
                id='pathLayer'
                type='line'
                paint = {{
                    'line-color': '#FFFFFF',
                    'line-width': 2,
                    'line-opacity': highlightedPath ? 0.3 : 0.5,
                }}
            />
            <Layer
                id='highlightedLayer'
                type='line'
                paint = {{
                    'line-color': '#FFFFFF',
                    'line-width': 4,
                }}
                filter ={['==', 'key', highlightedPath]}
            />
        </Source>
    )
}