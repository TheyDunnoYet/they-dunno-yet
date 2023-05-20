import React from "react";

const UserProfile = ({ user }) => {
  return (
    <div className="user-profile">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {/* Add other user details as required */}
    </div>
  );
};

export default UserProfile;
