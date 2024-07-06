import { prisma } from "~/db.server";

export type { Resource } from "@prisma/client";

export function getResource({
  id,
}: Pick<Resource, "id">) {
  return prisma.resource.findFirst({
    select: { id: true, name: true, description: true },
    where: { id },
  });
}

export function getResourceListItems() {
  return prisma.resource.findMany({
    select: { id: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createResource({
  name,
  description,
}: Pick<Resource, "name" | "description">) {
  return prisma.resource.create({
    data: {
      name,
      description,
    },
  });
}

export function updateResource({
  id,
  name,
  description,
}: Pick<Resource, "id" | "name" | "description">) {
  return prisma.resource.update({
    where: { id },
    data: {
      name,
      description,
    },
  });
}

export function deleteResource({
  id,
}: Pick<Resource, "id">) {
  return prisma.resource.delete({
    where: { id },
  });
}
