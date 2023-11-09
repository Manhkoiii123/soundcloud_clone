"use client";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
interface IProps {
  track: IShareTrack;
  playlist: IPlaylist;
}
const DeleteTrackInPlaylist = (props: IProps) => {
  const { data: session } = useSession();
  const { track, playlist } = props;
  const router = useRouter();
  const toast = useToast();
  const handleDelete = async () => {
    let tracks = playlist.tracks.filter((item) => item._id !== track._id);
    const trackIdArray = tracks.map((i) => i._id);
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
      method: "PATCH",
      body: {
        id: playlist._id,
        title: playlist.title,
        isPublic: playlist.isPublic,
        tracks: trackIdArray,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res.data) {
      toast.success("Xóa bài nhạc khỏi playlist thành công!");
      await sendRequest<IBackendRes<any>>({
        url: `/api/revalidate`,
        method: "POST",
        queryParams: {
          tag: "playlist-by-user",
          secret: "tranducmanh",
        },
      });
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };
  return (
    <div onClick={handleDelete} style={{ cursor: "pointer" }}>
      <DeleteIcon></DeleteIcon>
    </div>
  );
};

export default DeleteTrackInPlaylist;
