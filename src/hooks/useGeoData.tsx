import { useEffect, useState } from "react";
import type {FeatureCollection} from 'geoData';

interface featureType {
    name: string,
    type: string,
};

const censusCategory:featureType[] = [
    {name: 'ALAND', type: 'quantitative'},
    {name: 'AWATER', type: 'quantitative'}, 
    {name: 'COUNTYFP', type: 'categorical'},
    {name: 'NAMELSAD', type: 'categorical'},
]

const categoricalColorList = [
    "#FF5733",
    "#33FF57",
    "#5733FF",
    "#FF3399",
    "#33FFFF",
    "#FF9933",
    "#3366FF",
    "#FF33CC",
    "#33CCFF",
    "#FFCC33",
    "#FF3366",
    "#66FF33",
    "#CC33FF",
    "#33FFCC",
    "#9933FF",
    "#FFFF33",
    "#66CCFF",
    "#FF66CC",
    "#66FFCC",
    "#CC66FF"
];

const quantitativeColorList = [
    "#08306b",
    "#08519c",
    "#2171b5",
    "#4292c6",
    "#6baed6",
    "#9ecae1",
    "#c6dbef",
    "#deebf7",
    "#f7fbff",
    "#eff3ff",
    "#bdd7e7"
].reverse();

export default function useGeoData() {
    const [geoData, setGeoData] = useState<FeatureCollection>();
    const [category, setCategory] = useState<featureType>();
    const [cateStyle, setCateStyle] = useState<any[]>();

    useEffect(()=>{
        if (!geoData) return;
        const catProperties = new Set(geoData.features.map(({properties})=> {
          return properties ? category ? properties[category?.name] :null : null;
        }));
        const styleList : (string|number)[] = [];
        switch (category?.type){
          case 'categorical':
            [...catProperties].forEach((e:string, i:number)=>{
              styleList.push(e);
              styleList.push(categoricalColorList[i]);
            })
            setCateStyle([
              'match',
              ['get', category?.name],
              ...styleList,
              'white',
            ]);
            break;
          case 'quantitative':
            const max = Math.max(...[...catProperties].map((e)=>(Number(e))));
            const min = Math.min(...[...catProperties].map((e)=>(Number(e))));
            const diff = Math.floor((max - min) / 10);
            for (var i=0;i<11;i+=1) {
              styleList.push(min+diff*i);
              styleList.push(quantitativeColorList[i]);
            }
            setCateStyle([
              'interpolate',
              ['linear'],
              ['get', category?.name],
              ...styleList,
            ]);
            break;
        }
      }, [category]);
    
    async function fetchGeoData (url:string) {
        const resp = await fetch(url);
        const json = await resp.json();
        setGeoData(json);
    }

    return {
        fetchGeoData,
        geoData,
        category,
        setCategory,
        cateStyle,
    }
}