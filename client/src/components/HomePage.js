import React from "react";
// import Feed from "./Feed";
// import Topic from "./Topic";
import FeedForm from "./FeedForm";
import TopicForm from "./TopicForm";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to our site!</h1>
      {/* <Feed feedId="6465714fda9100b04cb18aa1" />
      <Topic topicId="64663196ff7289dc14daf6cb" /> */}
      <FeedForm />
      <TopicForm />
    </div>
  );
};

export default HomePage;
