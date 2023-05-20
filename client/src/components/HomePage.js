import React from "react";
import Feed from "./Feed";
import Topic from "./Topic";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to our site!</h1>
      <Feed feedId="6465714fda9100b04cb18aa1" />
      <Topic topicId="64663196ff7289dc14daf6cb" />
    </div>
  );
};

export default HomePage;
