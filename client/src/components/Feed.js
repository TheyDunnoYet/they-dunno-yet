import React, { useState, useEffect } from "react";
import { fetchFeed } from "../api/feed";

function Feed({ feedId }) {
  const [feed, setFeed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFeed = async () => {
      try {
        const data = await fetchFeed(feedId);
        setFeed(data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };
    getFeed();
  }, [feedId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>{feed.name}</h2>
      <h2>{feed.description}</h2>
    </div>
  );
}

export default Feed;
