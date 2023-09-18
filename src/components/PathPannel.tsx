export default function PathPannel (
    {getPath, odDataYear, setOdDataYear}
    :{getPath:Function, odDataYear:string, setOdDataYear:Function}
  ) {
      return (
      <div className='absolute right-0 w-56 m-8 p-4 bg-white rounded-xl z-10 shadow'>
        <h3 className="text-gray-900 mb-4">Path</h3>
        <label htmlFor="default-range" className="block mb-2 text-sm font-medium text-gray-900">Year: {odDataYear}</label>
        <input id="default-range" type="range" value={odDataYear} min={2009} max={2015} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setOdDataYear(e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
      <button
        className="mt-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onClick={()=>getPath()}
      >Get Path</button>
    </div>
    );
  }