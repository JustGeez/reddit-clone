import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Grid, IconButton, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { ReactElement, useEffect, useState } from "react";
import {
  CreateVoteInput,
  CreateVoteMutation,
  Post,
  UpdateVoteInput,
  UpdateVoteMutation,
} from "../API";
import Image from "next/image";
import { ButtonBase } from "@mui/material";
import { useRouter } from "next/router";
import Storage from "@aws-amplify/storage";
import API from "@aws-amplify/api";
import { createVote, updateVote } from "../graphql/mutations";
import { useUser } from "../context/AuthContext";

interface Props {
  post: Post;
}

function PostPreview({ post }: Props): ReactElement {
  /** State */
  const [postImage, setPostImage] = useState<string | undefined>(undefined);
  const [existingVote, setExistingVote] = useState<string | undefined>(undefined);
  const [existingVoteId, setExistingVoteId] = useState<string | undefined>(undefined);
  const [upvotes, setUpvotes] = useState<number>(
    post.votes.items ? post.votes.items.filter((v) => v.vote === "upvote").length : 0
  );
  const [downvotes, setDownvotes] = useState<number>(
    post.votes.items ? post.votes.items.filter((v) => v.vote === "downvote").length : 0
  );

  /** Hooks */
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const tryFindVote = post.votes.items?.find((v) => v.owner === user.getUsername());

      if (tryFindVote) {
        setExistingVote(tryFindVote.vote);
        setExistingVoteId(tryFindVote.id);
      }
    }
  }, [user]);

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

  const addVote = async (voteType: string) => {
    if (existingVote && existingVote != voteType) {
      const updateVoteInput: UpdateVoteInput = {
        id: existingVoteId,
        vote: voteType,
        postID: post.id,
      };

      try {
        const updateThisVote = (await API.graphql({
          query: updateVote,
          variables: { input: updateVoteInput },
          authMode: "AMAZON_COGNITO_USER_POOLS",
        })) as { data: UpdateVoteMutation };

        if (voteType === "upvote") {
          setUpvotes(upvotes + 1);
          setDownvotes(downvotes - 1);
        }

        if (voteType === "downvote") {
          setDownvotes(downvotes + 1);
          setUpvotes(upvotes - 1);
        }

        setExistingVote(voteType);
        setExistingVoteId(updateThisVote.data.updateVote.id);
        console.log("Updated vote: ", updateThisVote);
      } catch (error) {
        console.error(error);
      }
    }

    if (!existingVote) {
      const createVoteInput: CreateVoteInput = {
        vote: voteType,
        postID: post.id,
      };

      try {
        const createNewVote = (await API.graphql({
          query: createVote,
          variables: { input: createVoteInput },
          authMode: "AMAZON_COGNITO_USER_POOLS",
        })) as { data: CreateVoteMutation };

        console.log("Vote created!", createNewVote);

        if (createNewVote.data.createVote.vote === "downvote") {
          setDownvotes(downvotes + 1);
        }

        if (createNewVote.data.createVote.vote === "upvote") {
          setUpvotes(upvotes + 1);
        }

        setExistingVote(voteType);
        setExistingVoteId(createNewVote.data.createVote.id);
      } catch (error) {
        console.error("Cannot create vote: ", error);
      }
    }
  };

  console.log(post);
  console.log("upvotes: ", upvotes);
  console.log("downvotes: ", downvotes);

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
              <IconButton aria-label="vote up" color="inherit" onClick={() => addVote("upvote")}>
                <ArrowUpward />
              </IconButton>
            </Grid>
            <Grid item>
              <Box textAlign="center">
                <Typography variant="body1">{upvotes - downvotes}</Typography>
                <Typography variant="body2">votes</Typography>
              </Box>
            </Grid>
            <Grid item>
              <IconButton
                aria-label="vote down"
                color="inherit"
                onClick={() => addVote("downvote")}
              >
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

              {post.image && postImage && (
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
