import { Button, Container, Grid, TextField } from "@mui/material";
import { withSSRContext, API } from "aws-amplify";
import { GetStaticPaths, GetStaticProps } from "next";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Comment,
  CreateCommentInput,
  CreateCommentMutation,
  GetPostQuery,
  ListPostsQuery,
  Post,
} from "../../API";
import { CommentView } from "../../components/CommentView";
import Layout from "../../components/Layout";
import PostPreview from "../../components/PostPreview";
import { createComment } from "../../graphql/mutations";
import { getPost, listPosts } from "../../graphql/queries";

interface IFormInput {
  comment: string;
}
interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  /** State */
  const [comments, setComments] = useState<Comment[]>(post.comments.items as Comment[]);

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
      postID: post.id,
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
    <Layout>
      <Container maxWidth="md">
        <PostPreview post={post} />
        <br />
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
        <br />
        {/* TODO: Sort comments by created date */}
        {comments
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map((comment) => (
            <CommentView comment={comment} key={comment.id} />
          ))}
      </Container>
    </Layout>
  );
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const SSR = withSSRContext();

  const response = (await SSR.API.graphql({
    query: getPost,
    variables: {
      id: params.id,
    },
  })) as { data: GetPostQuery; errors: any[] };

  return {
    props: {
      post: response.data.getPost as Post,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export const getStaticPaths: GetStaticPaths = async () => {
  const SSR = withSSRContext();
  const response = (await SSR.API.graphql({ query: listPosts })) as {
    data: ListPostsQuery;
    errors: any[];
  };

  const paths = response.data.listPosts.items.map((post) => ({ params: { id: post.id } }));

  return { paths, fallback: "blocking" };
};

export default Post;
