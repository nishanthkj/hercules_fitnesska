"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/types"; // Make sure this path points to your type definition

export default function UsersTable({
  users,
  bills,
  openEdit,
  handleDelete,
}: {
  users: User[];
  bills: { userId: string }[];
  openEdit: (user: User) => void;
  handleDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"name" | "email" | "role" | "bills">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = useMemo(() => {
    let result = users.filter((u) =>
      `${u.name ?? ""} ${u.email ?? ""}`.toLowerCase().includes(search.toLowerCase())
    );

    result = result.sort((a, b) => {
      const billCountA = bills.filter((b) => b.userId === a.id).length;
      const billCountB = bills.filter((b) => b.userId === a.id).length;

      let valA: string | number = "";
      let valB: string | number = "";

      switch (sortField) {
        case "name":
          valA = a.name || "";
          valB = b.name || "";
          break;
        case "email":
          valA = a.email || "";
          valB = b.email || "";
          break;
        case "role":
          valA = a.role || "";
          valB = b.role || "";
          break;
        case "bills":
          valA = billCountA;
          valB = billCountB;
          break;
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return sortAsc ? +valA - +valB : +valB - +valA;
    });

    return result;
  }, [users, search, sortField, sortAsc, bills]);

  const totalPages = Math.ceil(filtered.length / perPage);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getArrow = (field: typeof sortField) =>
    sortField === field ? (sortAsc ? "↑" : "↓") : "";

  const getPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let start = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    const end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Card className="rounded-xl shadow-sm border">
      <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex w-full md:w-auto flex-col md:flex-row items-center gap-4">
          <CardTitle className="text-lg">Users</CardTitle>
          <Input
            placeholder="Search users..."
            className="max-w-xs rounded-md"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Button
          className="rounded-md"
          onClick={() => (window.location.href = "/dashboard/admin/add")}
        >
          + Add User
        </Button>
      </CardHeader>

      <CardContent className="overflow-x-auto px-4 pb-6">
        <table className="w-full text-sm text-left border-collapse rounded-md overflow-hidden shadow-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th
                className="px-6 py-3 text-left cursor-pointer rounded-tl-md"
                onClick={() => handleSort("name")}
              >
                Name {getArrow("name")}
              </th>
              <th
                className="px-6 py-3 text-left cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email {getArrow("email")}
              </th>
              <th
                className="px-6 py-3 text-left cursor-pointer"
                onClick={() => handleSort("role")}
              >
                Role {getArrow("role")}
              </th>
              <th
                className="px-6 py-3 text-left cursor-pointer"
                onClick={() => handleSort("bills")}
              >
                Bills {getArrow("bills")}
              </th>
              <th className="px-6 py-3 text-left rounded-tr-md">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((user) => {
                const billCount = bills.filter((b) => b.userId === user.id).length;
                return (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-muted/50 transition-all duration-150"
                  >
                    <td className="px-6 py-3">{user.name || "N/A"}</td>
                    <td className="px-6 py-3">{user.email || "N/A"}</td>
                    <td className="px-6 py-3">{user.role}</td>
                    <td className="px-6 py-3">{billCount}</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-md"
                          onClick={() => openEdit(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-md"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground rounded-b-md"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Prev
            </Button>
            {getPagination().map((pg) => (
              <Button
                key={pg}
                variant={pg === page ? "default" : "outline"}
                size="sm"
                className="rounded-md"
                onClick={() => setPage(pg)}
              >
                {pg}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
