"use client";
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { Box, TextField } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
dayjs.extend(relativeTime);
import React, { useState } from "react";
import WaveSurfer from "wavesurfer.js";
interface IProps {
  comments: ITrackComment[] | null;
  track: ITrackTop | null;
  wavesurfer: WaveSurfer | null;
}
const CommentTrack = (props: IProps) => {
  const router = useRouter();
  const hasMounted = useHasMounted();
  const { data: session } = useSession();
  const [yourComment, setYourComment] = useState("");
  const { comments, track, wavesurfer } = props;
  //formattime copy tu wavetrack
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };
  const handleJumpTrack = (moment: number) => {
    if (wavesurfer) {
      // lấy ra thời gian của tổng đoạn nhạc
      // xong dùng cái seekto để tua đến cái đoạn moment
      const duration = wavesurfer.getDuration();
      wavesurfer.seekTo(moment / duration); // func này nhận tham số là % => phải chia
      wavesurfer.play();
    }
  };
  const handleSubmit = async () => {
    const res = await sendRequest<IBackendRes<ITrackComment>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
      method: "POST",
      body: {
        content: yourComment,
        moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
        track: track?._id,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res.data) {
      setYourComment("");
      router.refresh();
    }
  };
  return (
    <div style={{ marginTop: "50px" }}>
      <TextField
        value={yourComment}
        onChange={(e) => setYourComment(e.target.value)}
        id="standard-basic"
        fullWidth
        label="Comments"
        variant="standard"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
      />
      <div
        style={{
          marginTop: "20px",
          display: "flex",
        }}
      >
        <div className="left" style={{ width: "200px" }}>
          <Image
            src={fetchDefaultImages(track?.uploader?.type!)}
            style={{ height: 150, width: 150 }}
            alt="anh"
            height={150}
            width={150}
          />
          <div>{track?.uploader?.email}</div>
        </div>
        <div className="right" style={{ width: "calc(100% - 200px)" }}>
          {comments?.map((comment) => {
            return (
              <Box
                key={comment._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "25px",
                    alignItems: "center",
                  }}
                >
                  <Image
                    src={fetchDefaultImages(comment.user.type)}
                    alt=""
                    height={40}
                    width={40}
                  />
                  <div>
                    <div style={{ fontSize: "13px" }}>
                      {comment?.user?.name ?? comment?.user?.email} at{" "}
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handleJumpTrack(comment.moment)}
                      >
                        {formatTime(comment.moment)}
                      </span>
                    </div>
                    <div>{comment.content}</div>
                  </div>
                </Box>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {hasMounted && dayjs(comment.createdAt).fromNow()}
                </div>
              </Box>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommentTrack;
