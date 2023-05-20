import React from "react";

const Feed = ({ feed }) => {
  return (
    <div className="feed">
      <h3>{feed.title}</h3>
      <p>{feed.content}</p>
      {/* Add other feed details as required */}
    </div>
  );
};

export default Feed;
