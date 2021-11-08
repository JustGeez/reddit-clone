import { Container } from "@mui/material";
import { withSSRContext } from "aws-amplify";
import { GetStaticPaths, GetStaticProps } from "next";
import React, { useState } from "react";

import { Comment, GetPostQuery, ListPostsQuery, Post } from "../../API";
import CommentForm from "../../components/CommentForm";
import { CommentView } from "../../components/CommentView";
import Layout from "../../components/Layout";
import PostPreview from "../../components/PostPreview";
import { getPost, listPosts } from "../../graphql/queries";
interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  /** State */
  const [comments, setComments] = useState<Comment[]>(post.comments.items as Comment[]);

  /** Hooks */

  /** Functions */

  return (
    <Layout>
      <Container maxWidth="md">
        <PostPreview post={post} />
        <br />
        <CommentForm postId={post.id} setComments={setComments} />
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
