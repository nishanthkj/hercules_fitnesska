"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BilledItem {
  id: string;
  modelNumber: string;
  name: string;
  description?: string;
  mrp: number;
  specialPrice: number;
  quantity: number;
  total: number;
  unit: string;
}

interface Bill {
  id: string;
  invoiceNo: string;
  refNumber?: string;
  customerName: string;
  branch?: string;
  location?: string;
  totalAmount: number;
  gstAmount: number;
  netAmount: number;
  paid: boolean;
  billedItems: BilledItem[];
  deliveryTerms?: string;
  paymentTerms?: string;
  warranty?: string;
  bankDetails?: string;
  contactPerson?: string;
  contactPhone?: string;
}

export default function BillDetailPage() {
  const { id } = useParams();
  const [bill, setBill] = useState<Bill | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/bill/${id}`)
        .then((res) => res.json())
        .then((data) => setBill(data));
    }
  }, [id]);

  if (!bill) return <div className="p-6 text-center">Loading bill details...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice: {bill.invoiceNo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Ref No:</strong> {bill.refNumber}</p>
          <p><strong>Customer:</strong> {bill.customerName}</p>
          <p><strong>Branch:</strong> {bill.branch || "N/A"}</p>
          <p><strong>Location:</strong> {bill.location || "N/A"}</p>
          <p><strong>Paid:</strong> {bill.paid ? "Yes" : "No"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="p-2 border">Model No.</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">MRP</th>
                <th className="p-2 border">Special Price</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Unit</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {bill.billedItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2 border">{item.modelNumber}</td>
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">₹{item.mrp.toFixed(2)}</td>
                  <td className="p-2 border">₹{item.specialPrice.toFixed(2)}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">{item.unit}</td>
                  <td className="p-2 border">₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Total Amount:</strong> ₹{bill.totalAmount.toFixed(2)}</p>
          <p><strong>GST (18%):</strong> ₹{bill.gstAmount.toFixed(2)}</p>
          <p><strong>Net Amount:</strong> ₹{bill.netAmount.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Delivery Terms:</strong> {bill.deliveryTerms || "N/A"}</p>
          <p><strong>Payment Terms:</strong> {bill.paymentTerms || "N/A"}</p>
          <p><strong>Warranty:</strong> {bill.warranty || "N/A"}</p>
          <Separator />
          <p><strong>Bank Details:</strong> {bill.bankDetails || "N/A"}</p>
          <p><strong>Contact:</strong> {bill.contactPerson} — {bill.contactPhone}</p>
        </CardContent>
      </Card>
    </div>
  );
}
