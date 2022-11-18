import React, { useContext } from "react";
import { DaoContext } from "../../context/DaoContext";

const DiscordIntegration = () => {
  const { createDaoForm, setCreateDaoForm } = useContext(DaoContext);
  return (
    <div className="mt-10 mb-16">
      <label className="text-white font-semibold text-lg">
        Paste Invite Link :
        <input
          type="text"
          value={createDaoForm.DiscordLink}
          onChange={(myEvent) =>
            setCreateDaoForm({
              ...createDaoForm,
              DiscordLink: myEvent.target.value,
            })
          }
          className="flex w-full mt-4 rounded-md text-black"
        />
      </label>
    </div>
  );
};

export default DiscordIntegration;
