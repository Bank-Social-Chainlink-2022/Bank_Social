import React from "react";

const DetailsForDao = () => {
  const handleFileSelected = (myEvent) => {
    const files = Array.from(myEvent.target.files);
    console.log("files:", files);
  };
  return (
    <div className="mt-6 mb-14">
      <div>
        <label className="text-lg text-white font-semibold">
          Logo :
          <input
            type="file"
            onChange={handleFileSelected}
            accept=".png, .jpeg, .jpg"
            className="ml-5"
          />
        </label>
      </div>
      <div className="mt-8">
        <label className="text-lg text-white font-semibold">
          Header :
          <input
            type="file"
            onChange={handleFileSelected}
            accept=".png, .jpeg, .jpg"
            className="ml-5"
          />
        </label>
      </div>
    </div>
  );
};

export default DetailsForDao;
