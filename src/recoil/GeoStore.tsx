import { atom, selector } from 'recoil';
import type { FeatureCollection, LineString } from 'geojson';
import {
  PathType, TimeFilterType, TimeUnit,
} from '@/lib/types';
import { decodeGeohash, encodeGeohash } from '@/lib/geohash';

function coordinatesToGeohashs(coordinates:number[][], precision:number) {
  return coordinates.map(([lng, lat]) => (
    encodeGeohash(lat, lng, precision)
  )).join('-');
}

// geojson data
const pathData = atom<FeatureCollection|null>({
  key: 'pathData',
  default: null,
});

const geoData = atom({
  key: 'geoData',
  default: null,
});

// 이게 연상량을 너무 늘려서 못 쓸 것 같습니다.
const mapBounds = atom({
  key: 'MapBounds',
  default: null,
});

const geohashPrecision = atom({
  key: 'geohashPrecision',
  default: 7,
});

const highlightedPath = atom<string|null>({
  key: 'highlightedPath',
  default: null,
});

const isPathDataLoaded = selector({
  key: 'isPathDataLoaded',
  get: ({ get }) => get(pathData) != null,
});
// filtered geojson dataa
function filterGeojson(geodata:FeatureCollection, timeFilter:TimeFilterType) {
  const newFeatures = geodata.features.filter(({ properties }) => {
    if (properties) {
      const isFilters = (['year', 'month', 'hour'] as TimeUnit[]).map((unit:TimeUnit) => (properties[`pickup_${unit}`] === timeFilter[unit] || !timeFilter[unit]));
      return isFilters.every((isFilter) => (isFilter));
    } return null;
  });
  return ({
    type: 'FeatureCollection',
    features: newFeatures,
  }) as FeatureCollection;
}

const timeFilter = atom<TimeFilterType>({
  key: 'timeFilter',
  default: {
    year: null,
    month: null,
    hour: null,
  },
});

const filteredPath = selector({
  key: 'filteredPath',
  get: ({ get }) => {
    const pathDataState = get(pathData);
    const timeFilterState = get(timeFilter);
    if (!(pathDataState && timeFilterState)) return null;
    return filterGeojson(pathDataState, timeFilterState);
  },
});

const filteredPathString = selector({
  key: 'filteredPathString',
  get: ({ get }) => {
    const filteredPathState = get(filteredPath);
    const precision = get(geohashPrecision);
    if (!filteredPathState) return null;
    return filteredPathState.features.map(
      ({ geometry, properties }) => ({
        string: coordinatesToGeohashs((geometry as LineString).coordinates, precision),
        key: properties?.key,
      }),
    ) as PathType[];
  },
});

const filteredPathHeatmap = selector({
  key: 'filteredPathHeatmap',
  get: ({ get }) => {
    const filteredPathStringState = get(filteredPathString);
    if (!filteredPathStringState) return null;
    const geohashes = new Map();
    filteredPathStringState.forEach(({ string }:{string:string}) => {
      [...new Set(string.split('-'))].forEach((geohash:string) => {
        if (geohashes.has(geohash)) {
          geohashes.set(geohash, geohashes.get(geohash) + 1);
        } else {
          geohashes.set(geohash, 1);
        }
      });
    });
    const geohashFeatures = [...geohashes.keys()].map((hash) => {
      const { sw, ne } = decodeGeohash(String(hash));
      const coordinates = [
        [sw.lng, sw.lat],
        [ne.lng, sw.lat],
        [ne.lng, ne.lat],
        [sw.lng, ne.lat],
        [sw.lng, sw.lat],
      ];
      return {
        type: 'Feature',
        properties: {
          geohash: String(hash),
          count: geohashes.get(hash),
        },
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
      };
    });
    return ({
      type: 'FeatureCollection',
      features: geohashFeatures,
    } as FeatureCollection);
  },
});

export {
  pathData,
  geoData,
  timeFilter,
  filteredPath,
  filteredPathString,
  filteredPathHeatmap,
  isPathDataLoaded,
  mapBounds,
  highlightedPath,
  geohashPrecision,
};
