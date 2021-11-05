import { Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { Comment } from "../API";

interface Props {
  comment: Comment;
}

export const CommentView = ({ comment }: Props) => {
  console.log(comment);

  return (
    <Paper sx={{ width: "100%", minHeight: 120 }}>
      <Grid container spacing={1} direction="column">
        <Grid item>
          <Typography variant="body1">
            <strong>{comment.owner}</strong> - {new Date(comment.createdAt).toDateString()}
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant="body2">{comment.content}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
