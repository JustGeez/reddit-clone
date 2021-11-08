import { Button, Grid, TextField } from "@mui/material";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Comment, CreateCommentInput, CreateCommentMutation } from "../API";
import { API } from "aws-amplify";
import { createComment } from "../graphql/mutations";

interface IFormInput {
  comment: string;
}

interface Props {
  postId: string;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const CommentForm = ({ postId, setComments }: Props) => {
  /** State */

  /** Hooks */
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  /** Functions */
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    // Create new comment object
    const createCommentInput: CreateCommentInput = {
      postID: postId,
      content: data.comment,
    };

    // Add comment mutation
    const createNewComment = (await API.graphql({
      query: createComment,
      variables: { input: createCommentInput },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    })) as { data: CreateCommentMutation };

    setComments((comments) => [...comments, createNewComment.data.createComment as Comment]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            id="comment"
            label="Comment"
            type="text"
            error={errors.comment ? true : false}
            helperText={errors.comment ? errors.comment.message : null}
            {...register("comment", {
              required: { value: true, message: "Please enter a comment" },
              maxLength: {
                value: 255,
                message: "Please enter a comment shorter than 255 chars",
              },
            })}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth size="large">
            Post
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CommentForm;
