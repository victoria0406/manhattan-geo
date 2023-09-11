
interface featureType {
    name: string,
    type: string,
  }
  

const censusCategory:featureType[] = [
    {name: 'ALAND', type: 'quantitative'},
    {name: 'AWATER', type: 'quantitative'}, 
    {name: 'COUNTYFP', type: 'categorical'},
    {name: 'NAMELSAD', type: 'categorical'},
  ]

{/*<label
  for="countries"
  className="block mb-2 text-sm font-medium text-gray-900"
>
  Select Category
</label>
<select
  id="countries"
  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  onChange={(e)=>{setCategory(e.target.value)}}
>
  {censusCategory.map((item:featureType, i:number)=>(
    <option value={item.name} key={i}>{item.name}</option>
  ))}
</select>
*/}

export default function ControllPanel ({getPath, setCategory}:{getPath: Function, setCategory:Function}) {
    return (<div className='fixed w-40 h-80 m-8 p-4 bg-white rounded-xl z-10 shadow'>
          {censusCategory.map((item:featureType, i:number)=>(
            <div className="flex items-center mb-4" key={i}>
                <input
                  id={`radio-${i}`}
                  type="radio"
                  value={item.name}
                  name="default-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" 
                  onChange={()=>setCategory(item)}
                />
                <label for={`radio-${i}`} className="ml-2 text-sm font-medium text-gray-900">{item.name}</label>
            </div>
          ))}
        <button
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onClick={()=>getPath()}
        >Get Path</button>
      </div>
    );
}