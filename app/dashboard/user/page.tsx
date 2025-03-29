"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CreateBillPage() {
  const [invoiceNo, setInvoiceNo] = useState("");
  // Removed totalAmount state as it is not used
  const [items, setItems] = useState([{ name: "", price: 0, quantity: 1 }]);

  const addItem = () => {
    setItems([...items, { name: "", price: 0, quantity: 1 }]);
  };

  const createBill = async () => {
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    // Removed setTotalAmount as totalAmount state is no longer used

    const res = await fetch("/api/bill/create", {
      method: "POST",
      body: JSON.stringify({ invoiceNo, totalAmount: total, items }),
    });

    const data = await res.json();
    if (data.success) toast.success("Bill created!");
    else toast.error(data.error);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Bill</h1>
      <Input placeholder="Invoice No" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className="mb-4" />

      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-3 gap-2 mb-2">
          <Input placeholder="Item Name" value={item.name} onChange={e => {
            const i = [...items]; i[index].name = e.target.value; setItems(i);
          }} />
          <Input type="number" placeholder="Price" value={item.price} onChange={e => {
            const i = [...items]; i[index].price = parseFloat(e.target.value); setItems(i);
          }} />
          <Input type="number" placeholder="Qty" value={item.quantity} onChange={e => {
            const i = [...items]; i[index].quantity = parseInt(e.target.value); setItems(i);
          }} />
        </div>
      ))}

      <Button className="mb-2" variant="secondary" onClick={addItem}>+ Add Item</Button>
      <Button onClick={createBill}>Create Bill</Button>
    </div>
  );
}
