import React from 'react'

const Games = () => {
  return (
    <div className='bg-amber-500 w-50 h-19'>

      {/* Games */}

      <input className=' border-4 transpare  w-full  border-white' type="text"


        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "a") {
            e.preventDefault();
          }
        }}
      />
    </div>
  )
}

export default Games