import React from 'react'

const CreateDao = ({formData, setFormData}) => {
  return (
    <div>
        <label>
            Enter Dao Name
            <input type="text" value={formData.DaoName} onChange={(myEvent) => setFormData({...formData, DaoName: myEvent.target.value})}/>
            Enter Dao Description
            <input type="text" value={formData.DaoDesc} onChange={(myEvent) => setFormData({...formData, DaoDesc: myEvent.target.value})}/>
        </label>
    </div>
  )
}

export default CreateDao