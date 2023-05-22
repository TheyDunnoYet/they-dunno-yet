import React, { useState, useEffect } from "react";
import { fetchMarketplace } from "../api/marketplace";

function Marketplace({ marketplaceId }) {
  const [marketplace, setMarketplace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMarketplace = async () => {
      try {
        const data = await fetchMarketplace(marketplaceId);
        setMarketplace(data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };
    getMarketplace();
  }, [marketplaceId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>{marketplace.name}</h2>
      <p>{marketplace.acronym}</p>
      <p>{marketplace.blockchain}</p>
    </div>
  );
}

export default Marketplace;
