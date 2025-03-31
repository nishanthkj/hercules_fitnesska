"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // Correct import

type Bill = {
  id: string;
  invoiceNo: string;
  customerName: string;
  totalAmount: number;
  paid: boolean;
  createdAt: string;
};

export default function ViewAllBillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch("/api/bill/list"); // Fetching bills
        const data = await res.json();
        setBills(data.bills || []);
      } catch (error) {
        console.error("Error fetching bills", error);
      }
    };
    fetchBills();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">All Bills</h1>
      <Link href="/bill/create">
        <Button className="mb-4">Create New Bill</Button>
      </Link>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Invoice No</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill.id}>
              <TableCell>{bill.invoiceNo}</TableCell>
              <TableCell>{bill.customerName}</TableCell>
              <TableCell>₹{bill.totalAmount}</TableCell>
              <TableCell>{bill.paid ? "Paid" : "Pending"}</TableCell>
              <TableCell>{new Date(bill.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Link href={`/bill/${bill.id}`}>
                  <Button variant="link">View</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
