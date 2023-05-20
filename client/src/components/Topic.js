import React from "react";

const Topic = ({ topic }) => {
  return (
    <div className="topic">
      <h3>{topic.name}</h3>
      <p>{topic.description}</p>
      {/* Add other topic details as required */}
    </div>
  );
};

export default Topic;
