import { useEffect, useState } from "react";
import {LngLatBounds} from '@/lib/useClientModules';
import { decodeGeohash, encodeGeohash } from "@/lib/geohash";

interface geohashFeatureType {
    type: 'Feature',
    properties: {
      geohash: string,
    },
    geometry: {
      type: 'Polygon',
      coordinates: number[][][],
    },
  };

interface geohashJsonType {
    type: 'FeatureCollection',
    features: geohashFeatureType[],
};

export default function useGeoHash(initalPrecision:number = 5) {
    const [geoBounds, setGeoBounds] = useState<LngLatBounds>();
    const [geohashPrecision, setGeohashPrecision] = useState<number>(initalPrecision);
    const [geohash, setGeohash] = useState<geohashJsonType>();

    useEffect(()=>{
        if (!geoBounds) return;
        const ne = geoBounds.getNorthEast(); // 북동쪽 꼭지점 좌표
        const sw = geoBounds.getSouthWest(); // 남서쪽 꼭지점 좌표
    
        // 북동쪽과 남서쪽 꼭지점의 Geohash 생성
        const neGeohash = encodeGeohash(ne.lat, ne.lng, geohashPrecision);
        const swGeohash = encodeGeohash(sw.lat, sw.lng, geohashPrecision);
    
        const latDiff = 180/(8**Math.floor(geohashPrecision/2)*4**(geohashPrecision - Math.floor(geohashPrecision/2)));
        const lngDiff = 360/(4**Math.floor(geohashPrecision/2)*8**(geohashPrecision - Math.floor(geohashPrecision/2)));
    
        // Geohash 그리드 생성
        const geohashes = new Set();
        for (let lat = sw.lat; lat < ne.lat+latDiff; lat +=latDiff) {
          for (let lng = sw.lng; lng < ne.lng+lngDiff; lng +=lngDiff) {
            const hash = encodeGeohash(lat, lng, geohashPrecision);
            geohashes.add(hash);
          }
        }
        // Geohash bounds list 생성
        const geohashFeatures = [...geohashes].map((hash):geohashFeatureType=>{
          const {sw, ne} =decodeGeohash(String(hash));
          const coordinates = [
            [sw.lng, sw.lat],
            [ne.lng, sw.lat],
            [ne.lng, ne.lat],
            [sw.lng, ne.lat],
            [sw.lng, sw.lat],
          ];
          return {
            type: "Feature",
            properties: {
              geohash: String(hash),
            },
            geometry: {
              type: "Polygon",
              coordinates: [coordinates],
            },
          }
        });
        setGeohash({
          type: 'FeatureCollection',
          features: geohashFeatures,
        })
      }, [geoBounds, geohashPrecision]);

    return {
        setGeoBounds,
        setGeohashPrecision,
        geohashPrecision,
        geohash
    }
}