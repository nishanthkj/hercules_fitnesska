"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  itemId: string;
  refresh: () => void;
}

export function EditItemDialog({ open, onClose, itemId, refresh }: Props) {
  interface Item {
    name: string;
    description?: string;
    price: number;
    specialPrice?: number;
    modelNumber?: string;
    image?: string; // base64 string without prefix
  }

  const [item, setItem] = useState<Item | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && itemId) {
      fetch(`/api/item/${itemId}`)
        .then((res) => res.json())
        .then((data) => {
          const base64 = data.image?.startsWith("data:") ? data.image : `data:image/jpeg;base64,${data.image}`;
          setItem({ ...data, image: data.image?.split(",")?.[1] }); // Strip prefix if exists
          setImagePreview(base64);
        });
    }
  }, [open, itemId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result?.toString();
      const base64 = result?.split(",")[1];
      setImagePreview(result || null);
      if (item && base64) {
        setItem({ ...item, image: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await fetch(`/api/item/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Item updated successfully");
      refresh();
      onClose();
    } else {
      toast.error("Failed to update item");
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={item.name}
            onChange={(e) => setItem({ ...item, name: e.target.value })}
            placeholder="Name"
          />
          <Textarea
            value={item.description || ""}
            onChange={(e) => setItem({ ...item, description: e.target.value })}
            placeholder="Description"
          />
          <Input
            type="number"
            value={item.price}
            onChange={(e) => setItem({ ...item, price: parseFloat(e.target.value) })}
            placeholder="Price"
          />
          <Input
            type="number"
            value={item.specialPrice || ""}
            onChange={(e) => setItem({ ...item, specialPrice: parseFloat(e.target.value) })}
            placeholder="Special Price"
          />
          <Input
            value={item.modelNumber || ""}
            onChange={(e) => setItem({ ...item, modelNumber: e.target.value })}
            placeholder="Model Number"
          />

          {/* Image section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Image</label>
            <div className="w-32 h-32 overflow-hidden rounded-md border flex items-center justify-center bg-white">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="text-muted-foreground text-sm">No Image</div>
              )}
            </div>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <Button className="w-full" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
