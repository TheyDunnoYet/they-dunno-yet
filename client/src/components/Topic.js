import React, { useState, useEffect } from "react";
import { fetchTopic } from "../api/topic";

function Topic({ topicId }) {
  const [topic, setTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTopic = async () => {
      try {
        const data = await fetchTopic(topicId);
        setTopic(data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };
    getTopic();
  }, [topicId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>{topic.name}</h2>
      <p>{topic.description}</p>
    </div>
  );
}

export default Topic;
