import React, { ReactNode } from 'react';

type StyleKey = 'container' | 'outlined';
type DirectionKey = 'vertical' | 'horizontal';

interface Props {
    children: ReactNode,
    direction?:DirectionKey,
    gap?:number,
    style?:StyleKey
}

export default function ButtonGroup(props: Props) {
  const {
    children, direction = 'vertical', gap = 0, style = 'container',
  } = props;
  const outlineStyle = '[&>button]:border-2 [&>.active]:border-blue-500 [&>:not(.active)]:border-blue-900';
  const containerStyle = '[&>.active]:bg-blue-500 [&>:not(.active)]:bg-blue-900';

  const styleList:Record<StyleKey, string> = {
    container: containerStyle,
    outlined: outlineStyle,
  };
  const gapStyle = gap ? `gap-${gap} [&>*]:rounded` : '';
  return (
    <div className={`${styleList[style]} my-4 grid ${direction === 'horizontal' && Array.isArray(children) ? `grid-cols-${children.length}` : ''} rounded w-full overflow-hidden ${gapStyle}`}>
      {children}
    </div>
  );
}
