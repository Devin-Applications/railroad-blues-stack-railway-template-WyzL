import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { getResourceListItems } from "~/models/resource.server";
import { requireUserId } from "~/session.server";

interface LoaderData {
  resources: Awaited<ReturnType<typeof getResourceListItems>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const resources = await getResourceListItems({ userId });
  return json<LoaderData>({ resources });
};

export default function ResourceIndexPage() {
  const { resources } = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>Resources</h1>
      <Link to="new">Create New Resource</Link>
      <ul>
        {resources.map((resource: { id: string; name: string }) => (
          <li key={resource.id}>
            <Link to={resource.id}>{resource.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
