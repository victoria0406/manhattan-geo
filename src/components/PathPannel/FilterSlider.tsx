import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { timeFilter as timeFilterState } from '@/recoil/GeoStore';
import { TimeUnit } from '@/lib/types';

export default function FilterSlider(
  { filterUnit, filterRange }:
    {filterUnit: TimeUnit, filterRange:number[]},
) {
  const [filterValue, setFilterValue] = useState(filterRange[0]);
  const [timeFilter, setTimeFilter] = useRecoilState(timeFilterState);
  const [player, setPlayer] = useState<any>(null);

  function play() {
    let playValue = filterValue - 1;
    const interval = setInterval(() => {
      if (playValue >= filterRange[1]) {
        clearInterval(interval);
        setPlayer(null);
      } else {
        playValue += 1;
        setFilterValue(playValue);
      }
    }, 1000);
    setPlayer(interval);
  }

  function pause() {
    if (player) {
      clearInterval(player);
      setPlayer(null);
    }
  }

  useEffect(() => {
    if (filterValue !== undefined) {
      const newFilter = { ...timeFilter };
      newFilter[filterUnit] = filterUnit === 'year' ? filterValue.toString() : filterValue.toLocaleString('en-US', { minimumIntegerDigits: 2 });
      setTimeFilter(newFilter);
    }
  }, [filterValue]);
  return (
    <>
      <label
        htmlFor="default-range"
        className="flex justify-between items-center mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {filterUnit[0].toUpperCase() + filterUnit.slice(1)}
        :
        {timeFilter[filterUnit]}
        <button
          type="button"
          className="bg-blue-700 p-1 rounded"
          onClick={() => { if (player) { pause(); } else { play(); } }}
        >
          {player ? 'Pause' : 'Play'}
        </button>
      </label>
      <input
        id="month-range"
        type="range"
        value={filterValue}
        min={filterRange[0]}
        max={filterRange[1]}
        disabled={!!player}
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
          setFilterValue(Number(e.target.value));
        }}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </>
  );
}
