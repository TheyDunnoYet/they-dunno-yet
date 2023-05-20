import React, { useState } from "react";
import { createTopic } from "../api/topic";
import { connect } from "react-redux";
import {
  Button,
  TextField,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";

function TopicForm({ user, feeds }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [feed, setFeed] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user && user.role === "Admin" && feed !== "") {
      try {
        await createTopic({ name, description, feed });
        setName("");
        setDescription("");
        setFeed("");
      } catch (error) {
        console.error(error);
      }
    } else if (feed === "") {
      console.error("No feed selected");
    }
  };

  if (user && user.role === "Admin") {
    return (
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Paper elevation={3}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={4}
                margin="normal"
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Feed</InputLabel>
                <Select value={feed} onChange={(e) => setFeed(e.target.value)}>
                  <MenuItem value="">
                    <em>Select a feed...</em>
                  </MenuItem>
                  {feeds.map((feed) => (
                    <MenuItem key={feed._id} value={feed._id}>
                      {feed.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" color="primary" type="submit">
                Create Topic
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  feeds: state.feed.feeds,
});

export default connect(mapStateToProps)(TopicForm);
