export interface ViewStateType {
    longitude: number|undefined,
    latitude: number|undefined,
    zoom: number|undefined,
}
export interface featureType {
    name: string,
    type: string,
  };
export interface inputDataType {
    dataType:string,
    pathUrl: string, 
    dataUrl: string,
    extraUrl: string,
    initialView: ViewStateType,
    filterUsage: boolean[],
    categories:featureType[]
}

export type TimeUnit = 'year' | 'month' | 'hour';

export interface TimeFilterType {
    year: string|null,
    month: string|null, 
    hour: string|null,
}
export interface PathType {
    string: string, 
    key:string,
}