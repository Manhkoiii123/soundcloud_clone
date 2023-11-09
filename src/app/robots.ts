import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*", //cho phep all con bot đào dũ liệu
      allow: "/", //all đường link
      disallow: "/private/", //ko muốn đào
    },
    sitemap: "https://localhost:3000/sitemap.xml",
  };
}
