"use client";
import { convertSlugUrl, sendRequest } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";

const ClientSearch = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [tracks, setTracks] = useState<ITrackTop[]>([]);
  const fetchData = async (query: string) => {
    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop[]>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
      method: "POST",
      body: {
        current: 1,
        pageSize: 10,
        title: query,
      },
    });
    if (res.data?.result) {
      //@ts-ignore
      setTracks(res.data.result);
    }
  };
  useEffect(() => {
    document.title = `"${query}" trên ManhTD`;
    if (query) {
      fetchData(query);
    }
  }, [query]);

  return (
    <div>
      {!query || !tracks.length ? (
        <div>Không tồn tại kết quả tìm kiếm</div>
      ) : (
        <Box>
          <div>
            Kết quả tìm kiếm cho từ khóa : <b>{query}</b>
          </div>
          <Divider sx={{ my: 2 }}></Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {tracks.map((track) => {
              return (
                <div key={track._id}>
                  <Box sx={{ display: "flex", width: "100%", gap: "20px" }}>
                    <Image
                      alt=""
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                      width={50}
                      height={50}
                    />
                    <Typography>
                      <Link
                        href={`/track/${convertSlugUrl(track?.title)}-${
                          track._id
                        }.html?audio=${track.trackUrl}`}
                        style={{ textDecoration: "none", color: "unset" }}
                      >
                        <h4>{track.title}</h4>
                      </Link>
                    </Typography>
                  </Box>
                </div>
              );
            })}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default ClientSearch;
