"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";  // Correct for App Router

type Item = {
  id: string;
  name: string;
  modelNumber: string;
  price: number;
  specialPrice: number;
  image?: string | null;
};

type SelectedItem = {
  id: string;
  quantity: number;
};

export default function CreateBillPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [search, setSearch] = useState("");
  const [itemIndex, setItemIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);  // Track if we're on the client-side

  const [form, setForm] = useState({
    invoiceNo: "",
    customerName: "",
    to: "",
    address: "",
    branch: "",
    location: "",
    refNumber: "",
    deliveryTerms: "",
    paymentTerms: "",
    warranty: "",
    bankDetails: "",
    contactPerson: "",
    contactPhone: "",
    paid: false,
    gstAmount: 0, // 👈 Allow editable GST
  });

  const router = useRouter();  // Using useRouter from next/navigation for App Router

  // Ensure the hook only runs on the client-side
  useEffect(() => {
    setIsClient(true);  // Only set to true after the component mounts (client-side)
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch("/api/item/list");
      const data = await res.json();
      setItems(data.items || []);
      setFilteredItems(data.items || []);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.modelNumber.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredItems(filtered);
    setItemIndex(0);
  }, [search, items]);

  const updateQuantity = (id: string, change: number) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        const newQty = existing.quantity + change;
        if (newQty <= 0) return prev.filter((i) => i.id !== id);
        return prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i));
      } else {
        return [...prev, { id, quantity: 1 }];
      }
    });
  };

  const calculateTotals = () => {
    return selectedItems.reduce(
      (acc, sel) => {
        const item = items.find((i) => i.id === sel.id);
        if (!item) return acc;
        const total = item.specialPrice * sel.quantity;
        acc.total += total;
        return acc;
      },
      { total: 0 }
    );
  };

  const { total } = calculateTotals();
  const gst = form.gstAmount || 0;
  const net = +(total + gst).toFixed(2);

  const handleSubmit = async () => {
    if (!form.invoiceNo || !form.customerName || selectedItems.length === 0) {
      toast.error("Fill required fields and add at least one item.");
      return;
    }

    const res = await fetch("/api/bill/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, selectedItems }),
    });

    if (res.ok) {
      toast.success("✅ Bill created!");
      const createdBill = await res.json(); // Assuming your API returns the created bill data
      const billId = createdBill.id; // Get the ID of the newly created bill

      // Navigate to the newly created bill page
      router.push(`/bill/${billId}`);
      setForm({
        invoiceNo: "",
        customerName: "",
        to: "",
        address: "",
        branch: "",
        location: "",
        refNumber: "",
        deliveryTerms: "",
        paymentTerms: "",
        warranty: "",
        bankDetails: "",
        contactPerson: "",
        contactPhone: "",
        paid: false,
        gstAmount: 0,
      });
      setSelectedItems([]);
    } else {
      toast.error("❌ Failed to create bill");
    }
  };

  const currentItem = filteredItems[itemIndex];

  if (!isClient) return null;  // Ensure nothing is rendered before client-side mount

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Bill</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Invoice No *" value={form.invoiceNo} onChange={(e) => setForm({ ...form, invoiceNo: e.target.value })} />
            <Input placeholder="Ref No" value={form.refNumber} onChange={(e) => setForm({ ...form, refNumber: e.target.value })} />
            <Input placeholder="Customer Name *" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
            <Input placeholder="To" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
            <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <Input placeholder="Branch" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
            <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input placeholder="Contact Person" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
            <Input placeholder="Phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
          </div>

          <Textarea placeholder="Delivery Terms" value={form.deliveryTerms} onChange={(e) => setForm({ ...form, deliveryTerms: e.target.value })} />
          <Textarea placeholder="Payment Terms" value={form.paymentTerms} onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })} />
          <Textarea placeholder="Warranty" value={form.warranty} onChange={(e) => setForm({ ...form, warranty: e.target.value })} />
          <Textarea placeholder="Bank Details" value={form.bankDetails} onChange={(e) => setForm({ ...form, bankDetails: e.target.value })} />

          {/* GST Input */}
          <div>
            <Input
              type="number"
              placeholder="GST Amount"
              value={form.gstAmount}
              onChange={(e) => setForm({ ...form, gstAmount: parseFloat(e.target.value) || 0 })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Suggested GST (18%): ₹{(total * 0.18).toFixed(2)}
            </p>
          </div>

          {/* Item Search */}
          <div className="mt-4">
            <Input placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {/* Item Display */}
          {currentItem ? (
            <>
              <div className="mt-4 border p-4 rounded-lg flex gap-4 items-center">
                {currentItem.image?.startsWith("/") ? (
                  <Image src={currentItem.image} alt="Item" width={64} height={64} />
                ) : currentItem.image ? (
                  <Image
                    src={currentItem.image}
                    alt="Item"
                    width={64}
                    height={64}
                    unoptimized
                    className="rounded-md border object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center border rounded-md text-xs text-muted-foreground">
                    No Image
                  </div>
                )}

                <div className="flex-1">
                  <div className="font-semibold">{currentItem.name} ({currentItem.modelNumber})</div>
                  <div className="text-sm text-muted-foreground">₹{currentItem.specialPrice} / unit</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(currentItem.id, -1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div>{selectedItems.find((i) => i.id === currentItem.id)?.quantity ?? 0}</div>
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(currentItem.id, 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <Button size="sm" variant="outline" onClick={() => setItemIndex((i) => Math.max(0, i - 1))} disabled={itemIndex === 0}>
                  Prev
                </Button>
                <span className="text-sm text-muted-foreground">{itemIndex + 1} of {filteredItems.length}</span>
                <Button size="sm" variant="outline" onClick={() => setItemIndex((i) => Math.min(filteredItems.length - 1, i + 1))} disabled={itemIndex === filteredItems.length - 1}>
                  Next
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground mt-4">No items match your search.</p>
          )}

          {/* Preview */}
          {selectedItems.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-2">🧾 Selected Items</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {selectedItems.map((sel) => {
                  const item = items.find((i) => i.id === sel.id);
                  if (!item) return null;
                  return (
                    <li key={sel.id} className="flex justify-between border-b pb-1">
                      <span>{item.name} ({item.modelNumber}) × {sel.quantity}</span>
                      <span>₹{item.specialPrice * sel.quantity}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 font-medium">
                Subtotal: ₹{total} | GST: ₹{gst} | Net: ₹{net}
              </div>
            </div>
          )}

          <Button className="mt-4" onClick={handleSubmit}>Submit Bill</Button>
        </CardContent>
      </Card>
    </div>
  );
}
