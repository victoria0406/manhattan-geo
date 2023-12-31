import React, { ReactNode } from 'react';

type DirectionKey = 'vertical' | 'horizontal';

interface Props {
    children: ReactNode,
    direction?:DirectionKey,
    gap?:number,
}

export default function ButtonGroup(props: Props) {
  const {
    children, direction = 'vertical', gap = 0,
  } = props;

  const directionStyle = direction === 'horizontal' ? 'grid-cols-2 [$>button]:rounded-none' : '';

  const gapStyle = gap ? 'gap-2 [&>*]:rounded' : '';
  return (
    <div className={`my-4 grid ${directionStyle} w-full overflow-hidden ${gapStyle}`}>
      {children}
    </div>
  );
}
