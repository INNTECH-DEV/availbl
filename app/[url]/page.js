import { redirect } from "next/navigation";

async function getPage(url) {
  const res = await fetch(`http://localhost:3000/api/page?url=${url}`);

  if (!res.ok) {
    redirect("/");
  }
  return res.json();
}

export default async function Page({ params }) {
  const page = await getPage(params.url);
  return (
    <div>
      <div>{page && page.name}</div>
    </div>
  );
}
