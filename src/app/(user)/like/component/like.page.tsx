"use client";
import React from "react";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Link from "next/link";
import { convertSlugUrl } from "@/utils/api";
interface IProps {
  likeTrack: ITrackTop[];
}
const TrackLikePage = (props: IProps) => {
  const { likeTrack } = props;
  return (
    <Grid
      container
      rowSpacing={1}
      columns={{ xs: 4, sm: 8, md: 12 }}
      sx={{
        mt: "20px",
      }}
    >
      {likeTrack?.map((item: ITrackTop) => {
        return (
          <Grid item md={3} xs={4} sx={{ mt: 5 }}>
            <Image
              alt=""
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item?.imgUrl}`}
              width={200}
              height={200}
            />
            <Link
              href={`/track/${convertSlugUrl(item?.title)}-${
                item._id
              }.html?audio=${item.trackUrl}`}
              style={{ textDecoration: "none", color: "unset" }}
            >
              <h4>{item.title}</h4>
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TrackLikePage;
