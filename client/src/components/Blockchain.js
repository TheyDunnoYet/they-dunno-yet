import React, { useState, useEffect } from "react";
import { fetchBlockchain } from "../api/blockchain";

function Blockchain({ blockchainId }) {
  const [blockchain, setBlockchain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBlockchain = async () => {
      try {
        const data = await fetchBlockchain(blockchainId);
        setBlockchain(data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };
    getBlockchain();
  }, [blockchainId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>{blockchain.name}</h2>
      <h2>{blockchain.acronym}</h2>
    </div>
  );
}

export default Blockchain;
