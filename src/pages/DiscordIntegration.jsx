import React from "react";

const DiscordIntegration = ({formData, setFormData}) => {
  return (
    <div>
      <label>
        Paste Invite Link
        <input type="text" value={formData.DiscordLink} onChange={(myEvent) => setFormData({...formData, DiscordLink: myEvent.target.value})} />
        Select Channel
        <select>
          <option value="grapefruit">Grapefruit</option>
          <option value="lime">Lime</option>
          <option  value="coconut">
            Coconut
          </option>
          <option value="mango">Mango</option>
        </select>
      </label>
    </div>
  );
};

export default DiscordIntegration;
