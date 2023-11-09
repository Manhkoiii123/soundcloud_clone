import { sendRequest } from "@/utils/api";
import * as React from "react";
import Grid from "@mui/material/Grid";
import ProfileTracks from "@/components/header/profile.tracks";
import { Container } from "@mui/material";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Profile Page",
  description: "Profile",
};
const ProfilePage = async ({ params }: { params: { slug: string } }) => {
  const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop[]>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=10`,
    method: "POST",
    body: {
      id: params.slug,
    },
    nextOption: {
      next: { tags: ["track-by-profile"] },
    },
  });
  // console.log(">> check tracks", tracks);
  const data = tracks?.data?.result ?? [];
  return (
    <Container sx={{ my: 5 }}>
      <Grid container spacing={5}>
        {data.map((item: any, index: number) => {
          return (
            <Grid key={index} item xs={6}>
              <ProfileTracks data={item} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default ProfilePage;
