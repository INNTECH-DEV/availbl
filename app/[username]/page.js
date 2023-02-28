import { Gallery } from "@/components/templates/template1/Gallery";
import { Hero } from "@/components/templates/template1/Hero";
import { Layout } from "@/components/templates/template1/Layout";
import { redirect } from "next/navigation";

async function getPage(username) {
  const res = await fetch(
    `http://localhost:3000/api/page?username=${username}`
  );

  if (!res.ok) {
    redirect("/");
  }
  return res.json();
}

export default async function Page({ params }) {
  const page = await getPage(params.username);
  return (
    <div>
      <Layout page={page} />
      <Hero page={page} />
      <Gallery page={page} />
    </div>
  );
}
