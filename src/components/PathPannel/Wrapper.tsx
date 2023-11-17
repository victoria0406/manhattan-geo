export default function Wrapper(
    {children, }
    :{children:React.ReactNode}
){
    return (
        <div className='absolute right-0 top-0 w-56 m-8 p-4 bg-white dark:bg-gray-800 rounded-xl z-10 shadow'>
            <h3 className="text-gray-900 dark:text-white mb-4 font-medium">Path</h3>
            {children}
        </div>
    )
}