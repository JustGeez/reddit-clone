import Storage from "@aws-amplify/storage";
import { Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ImageDropzone from "../components/ImageDropzone";
import { v4 as uuidv4 } from "uuid";
import Layout from "../components/Layout";
import API from "@aws-amplify/api";
import { CreatePostInput, CreatePostMutation } from "../API";
import { createPost } from "../graphql/mutations";
import router from "next/router";

interface Props {}

interface IFormInput {
  title: string;
  content: string;
  image?: string;
}

const Create = (props: Props) => {
  /** State */
  const [file, setFile] = useState<File>();

  /** Hooks */
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  /** Functions */
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (file) {
      // user uploaded file
      console.log(file);

      // Send request to upload to s3
      try {
        const imagePath = uuidv4();

        await Storage.put(imagePath, file, { contentType: file.type });
        console.log("File upload to s3 success");

        const createNewPostInput: CreatePostInput = {
          title: data.title,
          contents: data.content,
          image: imagePath,
          upvotes: 0,
          downvotes: 0,
        };

        const createNewPost = (await API.graphql({
          query: createPost,
          variables: { input: createNewPostInput },
          authMode: "AMAZON_COGNITO_USER_POOLS",
        })) as { data: CreatePostMutation };

        console.log("New post created: ", createNewPost);

        router.push(`/post/${createNewPost.data.createPost.id}`);
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ display: "grid", placeContent: "center", height: "100vh" }}>
        <Paper sx={{ padding: 2, minWidth: "350px", width: "50vw" }}>
          <Typography variant="h2">Create post</Typography>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  type="text"
                  variant="outlined"
                  id="title"
                  label="Post title"
                  error={errors.title ? true : false}
                  helperText={errors.title ? errors.title.message : null}
                  {...register("title", {
                    required: { value: true, message: "Please enter a title" },
                    minLength: { value: 3, message: "Please enter a longer title" },
                    maxLength: { value: 50, message: "Please enter a shorter title" },
                  })}
                  fullWidth
                />
              </Grid>

              <Grid item>
                <TextField
                  type="text"
                  variant="outlined"
                  id="content"
                  label="Post content"
                  multiline
                  minRows={5}
                  error={errors.content ? true : false}
                  helperText={errors.content ? errors.content.message : null}
                  {...register("content", {
                    required: { value: true, message: "Please enter post content" },
                    minLength: { value: 10, message: "Please enter a longer content" },
                    maxLength: { value: 500, message: "Please enter a shorter content" },
                  })}
                  fullWidth
                />
              </Grid>

              <Grid item>
                <ImageDropzone file={file} setFile={setFile} />
              </Grid>

              <Grid item>
                <Button type="submit" variant="contained" fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Create;
