"use client";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
const DeletePlaylist = (props: any) => {
  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();
  const { id } = props;
  const handleDeletePlaylist = async (playlistId: string) => {
    const res2 = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/${playlistId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res2.data) {
      toast.success("Xóa Thành Công Playlist");
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
      toast.error(res2.message);
    }
  };
  return (
    <div
      style={{ display: "flex", alignItems: "center" }}
      onClick={() => handleDeletePlaylist(id)}
    >
      <DeleteIcon />
    </div>
  );
};

export default DeletePlaylist;
