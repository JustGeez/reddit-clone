import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Grid, IconButton, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { ReactElement } from "react";
import { Post } from "../API";
import Image from "next/image";

interface Props {
  post: Post;
}

function PostPreview({ post }: Props): ReactElement {
  return (
    <Paper elevation={3} sx={{ marginTop: 2, padding: 1 }}>
      <Grid container direction="row">
        {/** Upvote / votes / Downvote */}
        <Grid item xs={2}>
          <Grid
            container
            direction="column"
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{ paddingRight: 1 }}
          >
            <Grid item>
              <IconButton aria-label="vote up" color="inherit">
                <ArrowUpward />
              </IconButton>
            </Grid>
            <Grid item>
              <Box textAlign="center">
                <Typography variant="body1">
                  {(post.upvotes - post.downvotes).toString()}
                </Typography>
                <Typography variant="body2">votes</Typography>
              </Box>
            </Grid>
            <Grid item>
              <IconButton aria-label="vote down" color="inherit">
                <ArrowDownward />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        {/** Content Preview */}
        <Grid item xs={10}>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="body1">
                Posted by <strong>{post.owner}</strong> at{" "}
                <strong>{new Date(post.createdAt).toDateString()}</strong>
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant="h2">{post.title}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">{post.contents}</Typography>
            </Grid>

            {post.image && (
              <Grid item>
                <Image src={`/vercel.svg`} width={200} height={200} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default PostPreview;
