import { json, LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { getResource, updateResource } from "~/models/resource.server";
import { requireUserId } from "~/session.server";

interface LoaderData {
  resource: Awaited<ReturnType<typeof getResource>>;
}

export const loader: LoaderFunction = async ({ params }) => {
  const resource = await getResource({ id: params.resourceId });
  if (!resource) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ resource });
};

interface ActionData {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    description: string | undefined;
  };
  fields?: {
    name: string;
    description: string;
  };
}

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const name = form.get("name");
  const description = form.get("description");

  if (typeof name !== "string" || typeof description !== "string") {
    return badRequest({
      formError: "Form not submitted correctly.",
    });
  }

  const fields = { name, description };
  const fieldErrors = {
    name: name.length < 3 ? "Name must be at least 3 characters long" : undefined,
    description: description.length < 10 ? "Description must be at least 10 characters long" : undefined,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  await updateResource({ id: params.resourceId, name, description });

  return redirect(`/resources/${params.resourceId}`);
};

export default function EditResourcePage() {
  const { resource } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <h1>Edit Resource</h1>
      <Form method="post">
        <div>
          <label>
            Name: <input type="text" name="name" defaultValue={resource.name} />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className="form-error">{actionData.fieldErrors.name}</p>
          ) : null}
        </div>
        <div>
          <label>
            Description: <textarea name="description" defaultValue={resource.description} />
          </label>
          {actionData?.fieldErrors?.description ? (
            <p className="form-error">{actionData.fieldErrors.description}</p>
          ) : null}
        </div>
        {actionData?.formError ? (
          <p className="form-error">{actionData.formError}</p>
        ) : null}
        <button type="submit">Save</button>
      </Form>
    </div>
  );
}
