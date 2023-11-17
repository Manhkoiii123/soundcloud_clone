
import { sendRequest } from "@/utils/api";

import Container from "@mui/material/Container";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import TrackLikePage from "./component/like.page";
import { authOptions } from "@/app/api/auth/auth.options";
export const metadata: Metadata = {
  title: "ManhTd Like Page",
  description: "Like page",
};

const LikePage = async () => {
  const session = await getServerSession(authOptions);
  // console.log(session);
  const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["liked-by-user"] },
    },
  });
  const likeTrack = res.data?.result ?? [];
  return (
    <Container>
      <TrackLikePage likeTrack={likeTrack} />
    </Container>
  );
};
export default LikePage;
