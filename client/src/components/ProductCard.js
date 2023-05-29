import React from "react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

const tagColors = ["bg-slate-200"];

const ProductCard = ({ product }) => {
  const { _id, title, tagline, images, tags, upvotes } = product;

  const [isUpvoted, setIsUpvoted] = React.useState(false);

  const handleUpvote = () => {
    setIsUpvoted(!isUpvoted);
  };

  const tagElements = [];

  for (const key in tags) {
    if (tags.hasOwnProperty(key)) {
      const tag = tags[key];
      if (tag && tag.name) {
        const color = tagColors[tagElements.length % tagColors.length];
        tagElements.push(
          <span
            key={tag._id}
            className={`inline-block text-xs ${color} px-2 py-1 rounded-full mr-2 mt-2 ${
              key === "topic" ? "sm:block hidden" : ""
            }`}
          >
            {key === "blockchain" || key === "marketplace"
              ? tag.acronym
              : tag.name}
          </span>
        );
      }
    }
  }

  return (
    <div className="flex bg-white shadow rounded-md p-6 my-4 items-center">
      <div className="flex-none">
        <img
          className="w-24 h-24 object-cover rounded-md"
          src={images[0]}
          alt={title}
        />
      </div>
      <div className="flex-grow ml-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-500 mb-2">{tagline}</p>
        <div className="flex flex-wrap">{tagElements}</div>
      </div>
      <div className="flex-none ml-4">
        <button
          className={`${
            isUpvoted ? "border-red-500" : "border-gray-300"
          } border border-l border-gray-300 rounded-md p-2 bg-white transition-all duration-300 ease-in-out sm:bg-transparent w-auto h-auto sm:w-24 sm:h-24`}
          onClick={handleUpvote}
        >
          <div className="flex flex-col items-center justify-center">
            <ChevronUpIcon
              className={`h-6 w-6 ${
                isUpvoted ? "text-red-500" : "text-gray-500"
              } transition-all duration-300 ease-in-out`}
            />
            <span
              className={`text-gray-500 ${
                isUpvoted ? "text-red-500" : ""
              } transition-all duration-300 ease-in-out`}
            >
              {upvotes.length}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
