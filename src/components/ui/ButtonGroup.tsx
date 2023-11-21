import React from "react";

export default function ButtonGroup(
    {children, direction, gap, style}
    :{children:React.ReactNode |void, direction:string, gap:number|undefined, style:string}
) {
    const outlineStyle = '[&>button]:border-2 [&>.active]:border-blue-500 [&>:not(.active)]:border-blue-900';
    const containerStyle = '[&>.active]:bg-blue-500 [&>:not(.active)]:bg-blue-900';

    const styleList = {
        container: containerStyle,
        outlined: outlineStyle,
    }
    return (
        <div className={`${styleList[style]} my-4 grid ${direction === 'horizontal'? `grid-cols-${children?.length}`:''} rounded w-full overflow-hidden ${gap? `gap-2 [&>*]:rounded`:''}`}>
            {children}
        </div>
    )
}