import React, { ChangeEventHandler } from 'react';

interface Props {
    id: string,
    placeholder?:string,
    value: string|undefined,
    label?:string,
    onChange?: ChangeEventHandler<HTMLInputElement>,
    information?:string,
}

export default function InputText(props:Props) {
  const {
    id, value, label = null, onChange, placeholder = '', information = null,
  } = props;
  return (
    <div className="w-full  mb-4">
      {label && (
      <label
        className="block uppercase tracking-wide text-gray-300 text-xs mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      )}
      <input
        className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:border-gray-500"
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {information && <p className="text-sm text-gray-300">{information}</p>}
    </div>
  );
}
