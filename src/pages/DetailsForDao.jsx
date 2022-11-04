import React from 'react'

const DetailsForDao = () => {
    const handleFileSelected = (myEvent) => {
        const files = Array.from(myEvent.target.files)
        console.log("files:", files)
      }
  return (
    <div>
        <label>
            Logo
            <input type="file" onChange={handleFileSelected} accept=".png"/>
            Header
            <input type="file" onChange={handleFileSelected}/>
        </label>
    </div>
  )
}

export default DetailsForDao