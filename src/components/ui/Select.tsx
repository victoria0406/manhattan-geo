import React from 'react';

interface Props {
    children:React.ReactNode,
    id:string,
    placeholder?:string,
    onChange: React.ChangeEventHandler<HTMLSelectElement>,
    multiple?:boolean
}

export default function Select(props:Props) {
  const {
    children, id, placeholder = '', onChange, multiple = false,
  } = props;
  return (
    <div>
      <label htmlFor="countries" className="block uppercase tracking-wide text-gray-300 text-xs mb-2">
        Select an option
        <select multiple={multiple} id="countries" className="border border-gray-300 text-gray-900 rounded focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:border-blue-500" onChange={onChange}>
          {children}
        </select>
      </label>

    </div>
  );
}
