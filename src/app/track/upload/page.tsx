import UploadTabs from "@/components/track/upload.tabs";
import { Container } from "@mui/material";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Upload Page",
  description: "Upload",
};
const UploadPage = () => {
  return (
    <Container>
      <UploadTabs />
    </Container>
  );
};
export default UploadPage;
