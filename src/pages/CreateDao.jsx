import React from "react";

const CreateDao = ({ formData, setFormData }) => {
  return (
    <div className="mt-4">
      <div>
        <label className="text-lg text-white">
          Enter DAO Name :
          <input
            type="text"
            value={formData.DaoName}
            onChange={(myEvent) =>
              setFormData({ ...formData, DaoName: myEvent.target.value })
            }
            className="flex mt-2 w-full text-black rounded-md"
          />
        </label>
      </div>
      <div className="mt-4">
        <label className="text-lg text-white">
          Enter DAO Description : 
          <input
            type="text"
            value={formData.DaoDesc}
            onChange={(myEvent) =>
              setFormData({ ...formData, DaoDesc: myEvent.target.value })
            }
            className= "flex mt-2 w-full text-black rounded-md"
            style={{
              marginRight : "5px",
            }}
          />
        </label>
      </div>
    </div>
  );
};

export default CreateDao;
