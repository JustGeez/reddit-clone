import React from "react";
import { useDropzone } from "react-dropzone";
import { ButtonBase, Paper } from "@mui/material";
import { Box } from "@mui/system";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

interface Props {
  file: File;
  setFile: React.Dispatch<React.SetStateAction<File>>;
}

const ImageDropzone = ({ file, setFile }: Props) => {
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  let thumbs: ReactJSXElement;

  if (file) {
    thumbs = (
      <div key={file.name}>
        <div>
          <img src={URL.createObjectURL(file)} width="100%" height="auto" />
        </div>
      </div>
    );
  }

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
