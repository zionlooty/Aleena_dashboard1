import React from 'react'

const SummaryCard = ({icon, count, title, subtitle}) => {
  return (
    <div className='w-[250px] h-[150px] border border-gray-400 rounded-md bg-white p-4 flex justify-between items-center'>
        <div className='flex flex-col gap-5'>
            <div>
             {icon}
            </div>
            {/* <BsFillBasketFill size={40}/> */}
            <h1 className='text-xl'>{title}</h1>
            <small>available products</small>
        </div>

        <h1 className='text-3xl font-bold text-gray-600'>{count}</h1>
    </div>
  )
}

export default SummaryCard