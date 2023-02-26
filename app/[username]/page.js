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
      <div>{page && JSON.stringify(page)}</div>
    </div>
  );
}
