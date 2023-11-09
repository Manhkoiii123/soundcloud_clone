"use client";
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWavesurfer } from "@/utils/customHook";
import { WaveSurferOptions } from "wavesurfer.js";
import "./wave.scss";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { Tooltip } from "@mui/material";
import { useTrackContext } from "@/lib/track.wrapper";
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import CommentTrack from "./comment.track";
import LikeTrack from "./like.track";
import Image from "next/image";

interface IProps {
  track: ITrackTop | null;
  comments: ITrackComment[] | null;
}
const WaveTrack = (props: IProps) => {
  const { track, comments } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<string>("0:00");
  const [duration, setDuration] = useState<string>("0:00");
  const searchParams = useSearchParams();
  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const fileName = searchParams.get("audio");
  const router = useRouter();
  const firstRiewRef = useRef(true);
  const optionsMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
    let gradient, progressGradient;
    if (typeof window !== "undefined") {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      // Define the waveform gradient
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
      gradient.addColorStop(0, "#656666"); // Top color
      gradient.addColorStop((canvas.height * 0.7) / canvas.height, "#656666"); // Top color
      gradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#B1B1B1"
      ); // Bottom color
      gradient.addColorStop(1, "#B1B1B1"); // Bottom color

      // Define the progress gradient
      progressGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height * 1.35
      );
      progressGradient.addColorStop(0, "#EE772F"); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7) / canvas.height,
        "#EB4926"
      ); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#F6B094"
      ); // Bottom color
      progressGradient.addColorStop(1, "#F6B094"); // Bottom color
    }
    return {
      waveColor: gradient,
      progressColor: progressGradient,
      barWidth: 3, //2px
      height: 100,
      url: `/api?audio=${fileName}`,
    };
  }, []);

  const wavesurfer = useWavesurfer(containerRef, optionsMemo);

  useEffect(() => {
    if (!wavesurfer) return;

    setIsPlaying(false);

    const hover = hoverRef.current!;
    const waveform = containerRef.current!;
    waveform.addEventListener(
      "pointermove",
      (e) => (hover.style.width = `${e.offsetX}px`)
    );
    const subscriptions = [
      wavesurfer.on("play", () => setIsPlaying(true)),
      wavesurfer.on("pause", () => setIsPlaying(false)),
      wavesurfer.on("decode", (duration) => {
        // ko dùng được cách này do khi đó thì gaio diện ko render lại=> state
        // vẫn dùng ref được do là quên ch gắn ref cho cái div ở dưới lúc return
        // durationRef.current = formatTime(duration);
        setDuration(formatTime(duration));
      }),
      wavesurfer.on("timeupdate", (currentTime) => {
        // timeRef.current = formatTime(currentTime);
        setTime(formatTime(currentTime));
      }),
      //khi nhấn lên cái thanh như kiểu tua => tự chạy
      wavesurfer.once("interaction", () => {
        wavesurfer.play();
      }),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  const onPlayClick = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
    }
  }, [wavesurfer]);
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const calcLeft = (moment: number) => {
    const hardCodeDuration = wavesurfer?.getDuration() ?? 0;
    const percent = (moment / hardCodeDuration) * 100;
    return `${percent}%`;
  };

  useEffect(() => {
    // footer đang chạy thì cái ws dừng
    if (wavesurfer && currentTrack.isPlaying) {
      wavesurfer.pause();
    }
  }, [currentTrack]);
  useEffect(() => {
    //lúc đầu vào ko có ct thì sẽ lấy cái ws luôn dán xuống cái footer
    if (track?._id && !currentTrack?._id) {
      setCurrentTrack({ ...track, isPlaying: false });
    }
  }, [track]);

  const handleIncreaseView = async () => {
    if (firstRiewRef.current) {
      await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/increase-view`,
        method: "POST",
        body: {
          trackId: track?._id,
        },
      });
      //clear cache datacache
      // có thể truyền dưới prop từ track/slug xuống là ok => để ko lộ cái secret
      //cách 2 là ko truyền secret nữa nhưng bên trong cái api thì phải check thêm 1 cái nữa
      await sendRequest<IBackendRes<any>>({
        url: `/api/revalidate`,
        method: "POST",
        queryParams: {
          tag: "track-by-id",
          secret: "tranducmanh",
        },
      });
      //router cache
      router.refresh();
      firstRiewRef.current = false;
    }
  };
  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          display: "flex",
          gap: 15,
          padding: 20,
          height: 400,
          background:
            "linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)",
        }}
      >
        <div
          className="left"
          style={{
            width: "75%",
            height: "calc(100% - 10px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div className="info" style={{ display: "flex" }}>
            <div>
              <div
                onClick={() => {
                  onPlayClick();
                  handleIncreaseView();
                  if (track && wavesurfer) {
                    //khi chạy cái ws thì auto cái footer sẽ phải dừng lại
                    setCurrentTrack({
                      ...currentTrack,
                      isPlaying: false,
                    });
                  }
                }}
                style={{
                  borderRadius: "50%",
                  background: "#f50",
                  height: "50px",
                  width: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {isPlaying === true ? (
                  <PauseIcon sx={{ fontSize: 30, color: "white" }} />
                ) : (
                  <PlayArrowIcon sx={{ fontSize: 30, color: "white" }} />
                )}
              </div>
            </div>
            <div style={{ marginLeft: 20 }}>
              <div
                style={{
                  padding: "0 5px",
                  background: "#333",
                  fontSize: 30,
                  width: "fit-content",
                  color: "white",
                }}
              >
                {track?.title}
              </div>
              <div
                style={{
                  padding: "0 5px",
                  marginTop: 10,
                  background: "#333",
                  fontSize: 20,
                  width: "fit-content",
                  color: "white",
                }}
              >
                {track?.description}
              </div>
            </div>
          </div>
          <div ref={containerRef} className="wave-form-container">
            <div className="time">{time}</div>
            <div className="duration">{duration}</div>
            <div ref={hoverRef} className="hover-wave"></div>
            <div
              className="overlay"
              style={{
                position: "absolute",
                height: "30px",
                width: "100%",
                bottom: "0",
                backdropFilter: "brightness(0.5)",
              }}
            ></div>
            <div className="comments" style={{ position: "relative" }}>
              {comments &&
                comments.map((item) => {
                  return (
                    <Tooltip key={item._id} title={item.content} arrow>
                      <Image
                        //để di chuột vào ảnh thì cái hover vẫn đúng
                        // dựa vào cái ở trên (khi xử lí cái hover)
                        onPointerMove={(e) => {
                          const hover = hoverRef.current!;
                          hover.style.width = calcLeft(item.moment);
                        }}
                        key={item._id}
                        style={{
                          position: "absolute",
                          top: "71px",
                          left: calcLeft(item.moment),
                          zIndex: 20,
                        }}
                        src={fetchDefaultImages(item.user.type)}
                        alt=""
                        height={20}
                        width={20}
                      />
                    </Tooltip>
                  );
                })}
            </div>
          </div>
        </div>
        <div
          className="right"
          style={{
            width: "25%",
            padding: 15,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#ccc",
              width: 250,
              height: 250,
            }}
          >
            <Image
              width={250}
              height={250}
              style={{ objectFit: "cover" }}
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
              alt=""
            />
          </div>
        </div>
      </div>

      <div>
        <LikeTrack track={track} />
      </div>

      <div>
        <CommentTrack
          comments={comments}
          track={track}
          wavesurfer={wavesurfer}
        />
      </div>
    </div>
  );
};
export default WaveTrack;
