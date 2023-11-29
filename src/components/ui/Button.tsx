import React from 'react';

type Size = 'lg' | 'md' | 'sm' | 'xs';
type ButtonStyle = 'container' | 'outlined';

interface Props {
    children: React.ReactNode,
    onClick?: Function,
    activate?: boolean,
    size?: Size,
    style?:ButtonStyle,
    disabled?: boolean
}

export default function Button(props: Props) {
  const {
    children, onClick = () => {}, activate = false, size = 'md', style = 'container', disabled = false,
  } = props;

  const outlineStyle = 'border-2 [&.active]:border-blue-200 border-blue-400 [&.active]:text-blue-200 text-blue-400 disabled:text-gray-500 disabled:border-gray-500 disabled:cursor-not-allowed';
  const containerStyle = '[&.active]:bg-blue-500 bg-blue-900 disabled:bg-blue-300 disabled:cursor-not-allowed';

  const styleList:Record<ButtonStyle, string> = {
    container: containerStyle,
    outlined: outlineStyle,
  };

  return (
    <button
      className={`rounded py-1 px-2 text-${size} ${activate ? 'active' : ''} ${styleList[style]}`}
      onClick={(e) => onClick(e)}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
}
