import React from "react";

export default function ButtonGroup(
    {children, direction}
    :{children:React.ReactNode |void, direction:string}
) {
    return (
        <div className={`my-2 grid ${direction === 'horizontal'? `grid-cols-${children?.length}`:''} rounded w-full overflow-hidden`}>
            {children}
        </div>
    )
}