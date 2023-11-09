"use client";
import { useDropzone, FileWithPath } from "react-dropzone";
import "./theme.css";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function InputFileUpload() {
  return (
    <Button
      onClick={(e) => e.preventDefault()}
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput type="file" />
    </Button>
  );
}
interface IProps {
  setValue: (v: number) => void;
  setTrackUpload: any;
  trackUpload: any;
}
const Step1 = (props: IProps) => {
  const { trackUpload } = props;
  // lấy session người dùng ra
  const { data: session } = useSession();
  // const [percent, setPercent] = useState(0);
  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      if (acceptedFiles && acceptedFiles[0]) {
        props.setValue(1);

        const audio = acceptedFiles[0];
        // console.log(audio);
        const formData = new FormData();
        formData.append("fileUpload", audio);

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
                target_type: "tracks",
                delay: 5000,
              },
              onUploadProgress: (progressEvent) => {
                let percentCompleted = Math.floor(
                  (progressEvent.loaded * 100) / progressEvent.total!
                );
                // setPercent(percentCompleted);
                props.setTrackUpload({
                  ...trackUpload,
                  fileName: acceptedFiles[0].name,
                  percent: percentCompleted,
                });
                // console.log("check percentCompleted", percentCompleted);
              },
            }
          );
          props.setTrackUpload((prev: any) => ({
            ...prev,
            // lưu lại tên file nhạc
            uploadedTrackName: res.data.data.fileName,
          }));
        } catch (error) {
          console.log(error);
        }
      }
      //phải có dep là session để khi lấy được session sẽ chạy lại 1 lần
      //nếu mà để yên là cái []thì nó chỉ chạy 1 lần duy nhất khi ses là unde
    },
    [session]
  );
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      audio: [".mp3", ".m4a", "wav"],
    },
  });

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <InputFileUpload />
        <p>Click or Drag/Drop to upload file</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
};
export default Step1;
