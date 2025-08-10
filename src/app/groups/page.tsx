import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import GroupList from "@/components/GroupList";

export default async function GroupsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  const groups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          userId: user.userId,
        },
      },
    },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              createdAt: true,
            },
          },
        },
      },
      llms: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 opacity-20 rounded-full filter blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-400 opacity-20 rounded-full filter blur-2xl animate-float-slow animation-delay-2000"></div>

      <div className="max-w-5xl mx-auto py-16 px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              👋 Hey, {user.username}!
            </h1>
            <p className="text-gray-600 mt-3 text-lg">
              Organize your world. Manage groups. Chat with intelligent
              assistants.
            </p>
          </div>
          <Link
            href="/groups/create"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transform transition duration-300"
          >
            + Create New Group
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              Your Groups
            </h2>
          </div>
          <div className="p-6">
            <GroupList groups={groups} />
          </div>
        </div>
      </div>
    </div>
  );
}
