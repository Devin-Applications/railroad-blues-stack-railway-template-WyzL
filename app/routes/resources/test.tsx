import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async () => {
  return json({ message: "Test route is working" });
};

export default function TestRoute() {
  const data = useLoaderData<{ message: string }>();

  return (
    <div>
      <h1>{data.message}</h1>
    </div>
  );
}
