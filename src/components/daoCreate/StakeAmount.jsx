import React, { useContext } from "react";
import { DaoContext } from "../../context/DaoContext";

const StakeAmount = () => {
  const { createDaoForm, setCreateDaoForm } = useContext(DaoContext);

  return (
    <div className="mt-10 mb-32">
      <label className="text-white font-semibold text-lg">
        Minimum Amount allowed to stake :
        <input
          type="text"
          value={createDaoForm.stakingAmount}
          onChange={(myEvent) =>
            setCreateDaoForm({
              ...createDaoForm,
              stakingAmount: myEvent.target.value,
            })
          }
          className="flex w-full mt-4 rounded-md text-black"
          onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          placeholder=" In USDC"
        />
      </label>
    </div>
  );
};

export default StakeAmount;
