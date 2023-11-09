import React, { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Chip from "@mui/material/Chip";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/api";
interface Iprops {
  track: ITrackTop | null;
}
const LikeTrack = (props: Iprops) => {
  const { track } = props;
  const { data: session } = useSession();
  const router = useRouter();
  const [trackLikes, setTrackLikes] = useState<ITrackLike[] | null>(null);
  const fetchData = async () => {
    if (session?.access_token) {
      const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "GET",
        queryParams: {
          current: 1,
          pageSize: 100,
          sort: "-createdAt",
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (res?.data?.result) {
        setTrackLikes(res?.data?.result);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);
  const handleLikeTrack = async () => {
    await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
      method: "POST",
      body: {
        track: track?._id,
        quantity: trackLikes?.some((t) => t._id === track?._id) ? -1 : 1,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    await sendRequest<IBackendRes<any>>({
      url: `/api/revalidate`,
      method: "POST",
      queryParams: {
        tag: "track-by-id",
        secret: "tranducmanh",
      },
    });
    await sendRequest<IBackendRes<any>>({
      url: `/api/revalidate`,
      method: "POST",
      queryParams: {
        tag: "liked-by-user",
        secret: "tranducmanh",
      },
    });
    fetchData();
    router.refresh();
  };

  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Chip
          onClick={() => handleLikeTrack()}
          sx={{ borderRadius: "5px" }}
          label="Like"
          size="medium"
          icon={<FavoriteIcon />}
          variant="outlined"
          clickable
          color={
            trackLikes?.some((t) => t._id === track?._id) ? "error" : "default"
          }
        />
      </div>
      <div style={{ display: "flex", gap: "15px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#999",
            fontSize: "14px",
          }}
        >
          <PlayArrowIcon />
          {track?.countPlay}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#999",
            fontSize: "14px",
          }}
        >
          <FavoriteIcon />
          {track?.countLike}
        </div>
      </div>
    </div>
  );
};

export default LikeTrack;
