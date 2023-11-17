import WaveTrack from "@/components/track/wave.track";
import Container from "@mui/material/Container";
import { sendRequest } from "@/utils/api";
import type { Metadata, ResolvingMetadata } from "next";
type Props = {
  params: { slug: string }; // là cái [slug]
  searchParams: { [key: string]: string | string[] | undefined }; //là cái đường link sau dấu ?
};
// export async function generateStaticParams() {
//   return [
//     { slug: "song-cho-het-doi-thanh-xuan-651ee67edd020b13e60fd4b1.html" },
//     { slug: "rolling-down-651ee67edd020b13e60fd4ab.html" },
//     { slug: "sau-con-mua-651ee67edd020b13e60fd4ae.html" },
//   ];
// }
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  //const slug = params.slug; //chính là cái id bài nhạc
  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = (temp[0]?.split("-") ?? []) as string[];
  const id = temp1[temp1.length - 1];
  // fetch thoong tin bài track dựa vào id trên url
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
  });

  return {
    title: res.data?.title,
    description: res.data?.description,
    openGraph: {
      title: "Tran Duc Manh",
      description: "SoundCloud Clone web",
      type: "website",
      images: [
        `https://raw.githubusercontent.com/hoidanit/images-hosting/master/eric.png`,
      ],
    },
  };
}

const DetailTrackPage = async (props: any) => {
  const { params } = props;
  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = (temp[0]?.split("-") ?? []) as string[];
  const id = temp1[temp1.length - 1];
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
    nextOption: {
      next: { tags: ["track-by-id"] },
    },
  });
  const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 100,
      trackId: id,
      sort: "-createdAt",
    },
  });
  return (
    <Container>
      <div>
        <WaveTrack
          track={res?.data ?? null}
          comments={res1?.data?.result ?? null}
        />
      </div>
    </Container>
  );
};
export default DetailTrackPage;
