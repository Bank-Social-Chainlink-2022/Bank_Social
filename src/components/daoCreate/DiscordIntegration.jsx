import React, { useContext } from "react";
import { DaoContext } from "../../context/DaoContext";

const DiscordIntegration = () => {
  const { formData, setFormData } = useContext(DaoContext);
  return (
    <div className="mt-10 mb-16">
      <label className="text-white font-semibold text-lg">
        Paste Invite Link :
        <input
          type="text"
          value={formData.DiscordLink}
          onChange={(myEvent) =>
            setFormData({ ...formData, DiscordLink: myEvent.target.value })
          }
          className="flex w-full mt-4 rounded-md text-black"
        />
        {/* Select Channel
        <select>
          <option value="grapefruit">Grapefruit</option>
          <option value="lime">Lime</option>
          <option  value="coconut">
            Coconut
          </option>
          <option value="mango">Mango</option>
        </select> */}
      </label>
    </div>
  );
};

export default DiscordIntegration;
