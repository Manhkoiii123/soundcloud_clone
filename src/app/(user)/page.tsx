import MainSlider from "@/components/main/main.slider";
import { Container } from "@mui/material";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Home Page",
  description: "Home",
};
export default async function HomePage() {
  const session = await getServerSession(authOptions);
  // console.log(">>>> check session server : ", session);
  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: { category: "CHILL", limit: 10 },
  });
  const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: { category: "WORKOUT", limit: 10 },
  });
  const party = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: { category: "PARTY", limit: 10 },
  });
  return (
    <Container>
      <MainSlider title="Top Chills" data={chills?.data ? chills.data : []} />
      <MainSlider
        title="Top Workouts"
        data={workouts?.data ? workouts.data : []}
      />
      <MainSlider title="Top Party" data={party?.data ?? []} />
    </Container>
  );
}
