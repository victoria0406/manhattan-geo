import React from "react";

export default function Button(
    {children, onClick, activate}
    :{children: React.ReactNode, onClick:Function|undefined, activate:boolean}
){
    return (
        <button
            className={`p-1 ${activate ? 'bg-blue-500':'bg-blue-800'} text-sm`}
            onClick={(e)=>onClick ? onClick(e):null}
        >
            {children}
        </button>
    )
}