"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"; // Import Button
import { jsPDF } from "jspdf";
//import { autoTable } from "jspdf-autotable";

//const doc = new jsPDF();

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
        .then((data) => setBill(data))
        .catch((error) => console.error("Error fetching bill:", error)); // Added error handling
    }
  }, [id]);

  const handlePrintPDF = async () => {
    if (bill) {
      try {
        const doc = new jsPDF();
  
        // Title
        doc.setFontSize(18);
        doc.text("Invoice: " + bill.invoiceNo, 10, 10);
  
        // Customer Info
        doc.setFontSize(12);
        doc.text(`Customer: ${bill.customerName}`, 10, 20);
        doc.text(`Branch: ${bill.branch || "N/A"}`, 10, 30);
        doc.text(`Location: ${bill.location || "N/A"}`, 10, 40);
        doc.text(`Paid: ${bill.paid ? "Yes" : "No"}`, 10, 50);
  
        // Manually creating a table
        let yPosition = 60;
        const tableHeaders = ["Model No", "Name", "MRP", "Special Price", "Qty", "Unit", "Total"];
        const tableData = bill.billedItems.map((item) => [
          item.modelNumber,
          item.name,
          `₹${item.mrp.toString()}`, // Convert number to string
          `₹${item.specialPrice.toString()}`, // Convert number to string
          item.quantity.toString(), // Convert number to string
          item.unit,
          `₹${item.total.toString()}`, // Convert number to string
        ]);
  
        // Table Header
        doc.setFontSize(10);
        tableHeaders.forEach((header, index) => {
          doc.text(header, 10 + index * 30, yPosition); // Adjusting positions for header columns
        });
  
        // Table Body
        yPosition += 10;
        tableData.forEach((row) => {
          row.forEach((cell, index) => {
            doc.text(cell, 10 + index * 30, yPosition); // Adjusting positions for table rows
          });
          yPosition += 10; // Move down after each row
        });
  
        // Summary Section
        yPosition += 10;
        doc.text(`Total Amount: ₹${bill.totalAmount.toString()}`, 10, yPosition); // Convert number to string
        doc.text(`GST (18%): ₹${bill.gstAmount.toString()}`, 10, yPosition + 10); // Convert number to string
        doc.text(`Net Amount: ₹${bill.netAmount.toString()}`, 10, yPosition + 20); // Convert number to string
  
        // Additional Info Section
        doc.text(`Delivery Terms: ${bill.deliveryTerms || "N/A"}`, 10, yPosition + 40);
        doc.text(`Payment Terms: ${bill.paymentTerms || "N/A"}`, 10, yPosition + 50);
        doc.text(`Warranty: ${bill.warranty || "N/A"}`, 10, yPosition + 60);
        doc.text(`Bank Details: ${bill.bankDetails || "N/A"}`, 10, yPosition + 70);
        doc.text(`Contact: ${bill.contactPerson} — ${bill.contactPhone}`, 10, yPosition + 80);
  
        // Save the generated PDF
        doc.save("bill.pdf");
  
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  };
  

  const handlePay = async () => {
    if (bill && !bill.paid) {
      try {
        const response = await fetch(`/api/bill/${bill.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paid: true }),
        });

        if (!response.ok) {
          throw new Error("Failed to mark as paid.");
        }

        // Update the local bill state to reflect the "paid" status
        setBill((prev) => prev ? { ...prev, paid: true } : null);
      } catch (error) {
        console.error("Error updating payment status:", error);
      }
    }
  };

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
      <div className="flex justify-end gap-4">
        <Button className="mt-4 p-4" onClick={handlePrintPDF}>Print Bill as PDF</Button>

        {!bill.paid ? (
          <Button className="mt-4 p-4" onClick={handlePay}>Pay Now</Button>
        ) : (
          <Button className="mt-4 p-4" disabled>Paid</Button>
        )}
      </div>
    </div>
  );
}
