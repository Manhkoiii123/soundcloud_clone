import Container from "@mui/material/Container";
import Box from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";

import NewPlaylist from "./components/new.playlist";
import AddPlaylistTrack from "./components/add.playlist.track";
import { Fragment } from "react";
import CurrentTrack from "./components/current.track";
import type { Metadata } from "next";
import DeletePlaylist from "./components/delete.playlist";
import DeleteTrackInPlaylist from "./components/delete.track.playlist";
import { authOptions } from "@/app/api/auth/auth.options";

export const metadata: Metadata = {
  title: "Playlist bạn đã tạo",
  description: "miêu tả thôi mà",
};

const PlaylistPage = async () => {
  const session = await getServerSession(authOptions);
  // console.log(session);
  const res = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["playlist-by-user"] },
    },
  });
  const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  const playlists = res?.data?.result ?? [];
  const playlistByUser = playlists.filter(
    (item) => item.user._id === session?.user._id
  );
  const tracks = res1?.data?.result ?? [];

  return (
    <Container sx={{ mt: 3, p: 3, background: "#f3f6f9", borderRadius: "3px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Danh sách phát</h3>
        <div style={{ display: "flex", gap: "20px" }}>
          <NewPlaylist />
          <AddPlaylistTrack playlists={playlistByUser} tracks={tracks} />
        </div>
      </Box>
      <Divider variant="middle" />
      <Box sx={{ mt: 3 }}>
        {playlistByUser?.map((playlist: IPlaylist) => {
          return (
            <Accordion key={playlist._id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  sx={{
                    fontSize: "20px",
                    color: "#ccc",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <DeletePlaylist id={playlist._id} />
                  {playlist.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {playlist?.tracks?.map((track: IShareTrack, index: number) => {
                  return (
                    <Fragment key={track._id}>
                      {index === 0 && <Divider />}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <DeleteTrackInPlaylist
                          playlist={playlist}
                          track={track}
                        />
                        <CurrentTrack track={track} />
                      </Box>
                      <Divider />
                    </Fragment>
                  );
                })}
                {playlist?.tracks?.length === 0 && <span>No data.</span>}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Container>
  );
};

export default PlaylistPage;
