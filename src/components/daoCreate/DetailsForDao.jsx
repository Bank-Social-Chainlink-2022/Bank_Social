import React, { useContext } from "react";
import { DaoContext } from "../../context/DaoContext";

const DetailsForDao = () => {
  const { createDaoForm, setCreateDaoForm } = useContext(DaoContext);
  const handleFileSelected = (myEvent) => {
    const files = myEvent.target.files[0];
    setCreateDaoForm({ ...createDaoForm, image: files });
  };

  return (
    <div className="mt-8 mb-20">
      <div>
        <label className="text-lg text-white font-semibold">
          Image for DAO NFT :
          <input
            type="file"
            onChange={handleFileSelected}
            accept=".png, .jpeg, .jpg"
            className="ml-5"
          />
        </label>
      </div>
      <div className="mt-16">
        <label className="text-lg text-white font-semibold">
          Maximum Supply for NFT :
          <input
            type="text"
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            value={createDaoForm.nftNumber}
            onChange={(myEvent) =>
              setCreateDaoForm({
                ...createDaoForm,
                nftNumber: myEvent.target.value,
              })
            }
            className="ml-5 font-thin w-72 text-md text-black rounded-md"
            placeholder="   Number of NFTs to be minted"
          />
        </label>
      </div>
    </div>
  );
};

export default DetailsForDao;
