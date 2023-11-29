import React from 'react';
import { filteredPathString, highlightedPath as highlightedPathState } from '@/recoil/GeoStore';
import { useRecoilState, useRecoilValue } from 'recoil';

export default function PathList() {
  const pathList = useRecoilValue(filteredPathString);
  const [highlightedPath, setHighlightedPath] = useRecoilState(highlightedPathState);
  function selectPath(key:string) {
    const newKey = highlightedPath === key ? null : key;
    setHighlightedPath(newKey);
    if (newKey) {
      const newString = pathList?.filter(({ key: pathkey }) => (pathkey === key))[0].string;
      if (newString) {
        // TODO: string copy
        /* var range = document.createRange();
                range.selectNode(newString);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                document.execCommand("copy");
                window.getSelection().removeAllRanges(); */
      }
    }
  }
  return (
    pathList && (
    <>
      <div className="text-sm mt-4">
        Path Strings:
        {pathList.length}
      </div>
      <ul className="h-96 overflow-y-scroll">
        {pathList.map(({ string, key }, i:number) => (
          <li
            key={key}
          >
            <button
              type="button"
              className={`text-gray-900 dark:text-white text-xs overflow-hidden whitespace-nowrap p-2 my-2 rounded flex center ${highlightedPath === key ? 'bg-blue-900' : ''}`}
              onClick={() => { selectPath(key); }}
            >
              <span className="mr-2 group bg-blue-700 inline-block text-white rounded text-center shadow">
                <span className="w-6 h-6 p-1 inline-block">{i + 1}</span>
              </span>
              <span className="text-ellipsis overflow-hidden inline-block m-1">{string}</span>
            </button>

          </li>
        ))}
      </ul>
    </>
    )

  );
}
