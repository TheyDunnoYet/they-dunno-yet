const topicReducer = (state = [], action) => {
  switch (action.type) {
    case "CREATE_TOPIC":
      return [...state, action.payload];
    default:
      return state;
  }
};

export default topicReducer;
