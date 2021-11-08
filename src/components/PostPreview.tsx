import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Grid, IconButton, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { ReactElement, useEffect, useState } from "react";
import { Post } from "../API";
import Image from "next/image";
import { ButtonBase } from "@mui/material";
import { useRouter } from "next/router";
import Storage from "@aws-amplify/storage";

interface Props {
  post: Post;
}

function PostPreview({ post }: Props): ReactElement {
  /** State */
  const [postImage, setPostImage] = useState<string | undefined>(undefined);

  /** Hooks */
  const router = useRouter();

  useEffect(() => {
    const getImageFromStorage = async () => {
      try {
        const signedURL = await Storage.get(post.image);
        setPostImage(signedURL);
      } catch (error) {}
    };

    getImageFromStorage();
  }, []);

  /** Component functions */
  const handlePostClick = (id: string) => {
    router.push(`/post/${id}`);
  };

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
          <ButtonBase onClick={() => handlePostClick(post.id)}>
            <Grid container direction="column" alignItems="flex-start">
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

              {postImage && (
                <Grid item>
                  <Image src={postImage} width={350} height={350} />
                </Grid>
              )}
            </Grid>
          </ButtonBase>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default PostPreview;
