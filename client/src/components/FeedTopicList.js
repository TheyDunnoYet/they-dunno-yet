import React, { useEffect } from "react";
import { getFeeds } from "../redux/actions/feedActions";
import { getTopics } from "../redux/actions/topicActions";
import { connect } from "react-redux";
import { List, ListItem, ListItemText, Typography } from "@material-ui/core";

function FeedTopicList({
  feeds,
  topics,
  feedLoading,
  topicLoading,
  getFeeds,
  getTopics,
}) {
  useEffect(() => {
    getFeeds();
    getTopics();
  }, [getFeeds, getTopics]);

  if (feedLoading || topicLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <List>
      {feeds &&
        feeds.map((feed) => (
          <React.Fragment key={feed._id}>
            <ListItem>
              <ListItemText primary={feed.name} />
            </ListItem>
            {topics &&
              topics
                .filter((topic) => topic.feed === feed._id)
                .map((topic) => (
                  <ListItem key={topic._id} style={{ paddingLeft: "30px" }}>
                    <ListItemText
                      primary={topic.name}
                      secondary={topic.description}
                    />
                  </ListItem>
                ))}
          </React.Fragment>
        ))}
    </List>
  );
}

const mapStateToProps = (state) => ({
  feeds: state.feed.feeds,
  feedLoading: state.feed.loading,
  topics: state.topic.topics,
  topicLoading: state.topic.loading,
});

export default connect(mapStateToProps, { getFeeds, getTopics })(FeedTopicList);
