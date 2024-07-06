import { json, redirect, ActionFunction } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";

import { createResource } from "~/models/resource.server";
import { requireUserId } from "~/session.server";

interface ActionData {
  errors?: {
    name?: string;
    description?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");

  if (typeof name !== "string" || name.length === 0) {
    return json<ActionData>(
      { errors: { name: "Name is required" } },
      { status: 400 }
    );
  }

  if (typeof description !== "string" || description.length === 0) {
    return json<ActionData>(
      { errors: { description: "Description is required" } },
      { status: 400 }
    );
  }

  await createResource({ name, description, userId });

  return redirect("/resources");
};

export default function NewResourcePage() {
  const actionData = useActionData<ActionData>();

  return (
    <Form method="post">
      <div>
        <label>
          Name:{" "}
          <input
            type="text"
            name="name"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-describedby="name-error"
          />
        </label>
        {actionData?.errors?.name && (
          <div id="name-error">{actionData.errors.name}</div>
        )}
      </div>
      <div>
        <label>
          Description:{" "}
          <textarea
            name="description"
            aria-invalid={actionData?.errors?.description ? true : undefined}
            aria-describedby="description-error"
          />
        </label>
        {actionData?.errors?.description && (
          <div id="description-error">{actionData.errors.description}</div>
        )}
      </div>
      <div>
        <button type="submit">
          Create Resource
        </button>
      </div>
    </Form>
  );
}
