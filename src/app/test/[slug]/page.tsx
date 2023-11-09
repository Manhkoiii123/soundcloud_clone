import Container from "@mui/material/Container";

export async function generateStaticParams() {
  return [{ slug: "1" }, { slug: "12" }, { slug: "123" }];
}
const TestSlug = ({ params }: any) => {
  const { slug } = params;
  return <Container sx={{ mt: 5 }}>Test slug = {slug}</Container>;
};
export default TestSlug;
