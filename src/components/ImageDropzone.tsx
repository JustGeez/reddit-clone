import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import NextImage from "next/image";
import { Paper } from "@mui/material";

interface Props {}

const ImageDropzone = (props: Props) => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
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
    <Paper sx={{ bgcolor: "rgba(225,225,225,0.35)", padding: 1 }}>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>{thumbs}</aside>
    </Paper>
  );
};

export default ImageDropzone;
