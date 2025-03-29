"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface Item {
    id: string;
    name: string;
    modelNumber?: string;
    description?: string;
    price: number;
    specialPrice?: number;
    quantity: number;
    image?: string | null;
    billId: string;
}

export default function ItemsTable({
    items,
    handleDelete,
    openEditModal,
}: {
    items: Item[];
    handleDelete: (id: string) => void;
    openEditModal: (id: string) => void;
}) {
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<"name" | "price" | "quantity">("name");
    const [sortAsc, setSortAsc] = useState(true);
    const [page, setPage] = useState(1);
    const perPage = 5;

    const filtered = useMemo(() => {
        let result = items.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );

        result = result.sort((a, b) => {
            const valA = a[sortField];
            const valB = b[sortField];

            if (typeof valA === "string") {
                return sortAsc
                    ? valA.localeCompare(valB as string)
                    : (valB as string).localeCompare(valA);
            }

            return sortAsc ? valA - (valB as number) : (valB as number) - valA;
        });

        return result;
    }, [items, search, sortField, sortAsc]);

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
        const maxVisiblePages = 5;
        const half = Math.floor(maxVisiblePages / 2);
        let start = Math.max(1, page - half);
        const end = Math.min(totalPages, start + maxVisiblePages - 1);

        if (end - start < maxVisiblePages - 1) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <Card className="rounded-xl shadow-md border">
            <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex w-full md:w-auto flex-col md:flex-row items-center gap-4">
                    <CardTitle className="text-lg">Items</CardTitle>
                    <Input
                        placeholder="Search items..."
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
                    onClick={() => (window.location.href = "/dashboard/admin/add-item")}
                >
                    + Add Item
                </Button>
            </CardHeader>

            <CardContent className="overflow-x-auto px-4 pb-6">
                <table className="min-w-full text-sm text-left border-collapse rounded-md overflow-hidden">
                    <thead className="bg-muted text-muted-foreground text-center">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Model No.</th>
                            <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("name")}>
                                Name {getArrow("name")}
                            </th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("price")}>
                                Price {getArrow("price")}
                            </th>
                            <th className="px-4 py-3">Special Price</th>
                            <th className="px-4 py-3">Image</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length > 0 ? (
                            paginated.map((item) => (
                                <tr key={item.id} className="border-b text-center hover:bg-muted/50 transition-all">
                                    <td className="px-4 py-3 text-muted-foreground">{item.id.slice(0, 6)}...</td>
                                    <td className="px-4 py-3">{item.modelNumber || "N/A"}</td>
                                    <td className="px-4 py-3">{item.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.description || "N/A"}</td>
                                    <td className="px-4 py-3">₹{item.price}</td>
                                    <td className="px-4 py-3">{item.specialPrice ? `₹${item.specialPrice}` : "N/A"}</td>
                                    <td className="px-4 py-3">
                                        {/* Image preview */}
                                        <div className="w-14 h-14 overflow-hidden rounded-md mx-auto border">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt="Item Image"
                                                    width={56}
                                                    height={56}
                                                    unoptimized
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    No Image
                                                </div>
                                            )}
                                        </div>


                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="rounded-md"
                                                onClick={() => openEditModal(item.id)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="rounded-md"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center py-6 text-muted-foreground">
                                    No items found.
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
                    <div className="flex gap-2 items-center">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
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
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
