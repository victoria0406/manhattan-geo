import React from 'react';

type Size = 'lg' | 'md' | 'sm' | 'xs'

interface Props {
    children: React.ReactNode,
    onClick?: Function,
    activate?: Boolean,
    size?: Size
}

export default function Button(props: Props) {
  const {
    children, onClick = () => {}, activate = false, size = 'md',
  } = props;
  return (
    <button
      className={`p-1 text-${size} ${activate ? 'active' : ''}`}
      onClick={(e) => onClick(e)}
      type="button"
    >
      {children}
    </button>
  );
}
