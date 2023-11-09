import { Metadata } from "next";
import React from "react";
import Container from "@mui/material/Container";
import ClientSearch from "./component/client.search";
export const metadata: Metadata = {
  title: "Search your tracks",
  description: "This is a page search",
};

const SearchPage = () => {
  return (
    <Container sx={{ mt: 3 }}>
      <ClientSearch />
    </Container>
  );
};

export default SearchPage;
