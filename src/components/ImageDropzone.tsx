import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import NextImage from "next/image";
import { ButtonBase, Paper } from "@mui/material";
import { Box } from "@mui/system";

interface Props {}

const ImageDropzone = (props: Props) => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <NextImage src={file.preview} width={450} height={300} />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <ButtonBase sx={{ width: "100%" }}>
      <Paper sx={{ bgcolor: "rgba(225,225,225,0.35)", padding: 1, width: "100%" }}>
        <Box
          {...getRootProps({ className: "dropzone" })}
          sx={{ border: "2px dotted white", borderRadius: 1, padding: 1 }}
        >
          <input {...getInputProps()} />
          <p>Drag &amp; drop some files here, or click to select files</p>
        </Box>
        <aside>{thumbs}</aside>
      </Paper>
    </ButtonBase>
  );
};

export default ImageDropzone;
