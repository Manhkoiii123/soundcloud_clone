"use client";
import AppBar from "@mui/material/AppBar";
import { Container } from "@mui/material";
import "react-h5-audio-player/lib/styles.css";
import AudioPlayer from "react-h5-audio-player";
import { useHasMounted } from "@/utils/customHook";
import { useContext, useRef, useEffect } from "react";
import { TrackContext } from "@/lib/track.wrapper";
const AppFooter = () => {
  const hasMounted = useHasMounted();
  const playerRef = useRef(null);
  //chưa mounted
  const { currentTrack, setCurrentTrack } = useContext(
    TrackContext
  ) as ITrackContext;

  useEffect(() => {
    //@ts-ignore
    if (currentTrack?.isPlaying) {
      //@ts-ignore
      //in ra duoc cai html roi audio
      // console.log(playerRef.current.audio.current);
      playerRef?.current?.audio?.current.play();
    } else {
      //@ts-ignore
      playerRef?.current?.audio?.current.pause();
    }
  }, [currentTrack]);
  if (!hasMounted) return <></>;
  return (
    <>
      {currentTrack._id && (
        <div style={{ marginTop: 50 }}>
          <AppBar
            position="fixed"
            sx={{ top: "auto", bottom: 0, background: "#f2f2f2" }}
          >
            <Container
              disableGutters
              sx={{
                display: "flex",
                gap: 10,
                ".rhap_main": {
                  gap: "30px",
                },
              }}
            >
              <AudioPlayer
                ref={playerRef}
                layout="horizontal-reverse"
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
                volume={0.5}
                style={{
                  boxShadow: "unset",
                  background: "#f2f2f2",
                }}
                onPlay={() => {
                  setCurrentTrack({ ...currentTrack, isPlaying: true });
                }}
                onPause={() => {
                  setCurrentTrack({ ...currentTrack, isPlaying: false });
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  justifyContent: "center",
                  minWidth: 100,
                  width: "220px",
                }}
              >
                <div
                  style={{
                    color: "#ccc",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentTrack.description}
                </div>
                <div
                  style={{
                    color: "black",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentTrack.title}
                </div>
              </div>
            </Container>
          </AppBar>
        </div>
      )}
    </>
  );
};
export default AppFooter;
