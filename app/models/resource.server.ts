import type { User, Resource } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Resource } from "@prisma/client";

export function getResource({
  id,
  userId,
}: Pick<Resource, "id"> & {
  userId: User["id"];
}) {
  return prisma.resource.findFirst({
    select: { id: true, name: true, description: true },
    where: { id, userId },
  });
}

export function getResourceListItems({ userId }: { userId: User["id"] }) {
  return prisma.resource.findMany({
    where: { userId },
    select: { id: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createResource({
  name,
  description,
  userId,
}: Pick<Resource, "name" | "description"> & {
  userId: User["id"];
}) {
  return prisma.resource.create({
    data: {
      name,
      description,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function updateResource({
  id,
  name,
  description,
  userId,
}: Pick<Resource, "id" | "name" | "description"> & {
  userId: User["id"];
}) {
  return prisma.resource.updateMany({
    where: { id, userId },
    data: {
      name,
      description,
    },
  });
}

export function deleteResource({
  id,
  userId,
}: Pick<Resource, "id"> & { userId: User["id"] }) {
  return prisma.resource.deleteMany({
    where: { id, userId },
  });
}
