import React from "react";

export default function Button(
    {children, onClick, activate}
    :{children: React.ReactNode, onClick:Function|undefined, activate:boolean}
){
    return (
        <button
            className={`p-1 text-sm ${activate ? 'active': ''}`}
            onClick={(e)=>onClick ? onClick(e):null}
        >
            {children}
        </button>
    )
}