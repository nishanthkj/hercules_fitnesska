"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import imageCompression from 'browser-image-compression';

// Define the form data interface
interface FormData {
  modelNumber: string;
  name: string;
  description: string;
  price: string;
  specialPrice: string;
  quantity: string;
  image: string | null;
  billId: string;
}

export default function AddItemPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    modelNumber: "",
    name: "",
    description: "",
    price: "",
    specialPrice: "",
    quantity: "1",
    image: null,
    billId: "default-bill-id", // Set a default value
  });

  // Show message
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000); // Auto-hide after 5 seconds
  };

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "file") {
      return; // Handled by handleImageChange
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image upload
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      // Compress image to below 200KB
      const options = {
        maxSizeMB: 0.2, // 0.2 MB = 200 KB
        maxWidthOrHeight: 800, // optional resizing
        useWebWorker: true,
      };
  
      const compressedFile = await imageCompression(file, options);
  
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (result && typeof result === 'string') {
          const base64String = result.split(',')[1];
          setFormData({
            ...formData,
            image: base64String,
          });
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Image compression error:", error);
      showMessage("Failed to compress image", "error");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!formData.modelNumber || !formData.name || !formData.price || !formData.specialPrice) {
      showMessage("Please fill in all required fields", "error");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/item/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to create item");
      }

      showMessage("Item added successfully!", "success");
      router.push("/dashboard/admin"); // Navigate to items list
    } catch (error) {
      console.error("Error adding item:", error);
      showMessage(
        error instanceof Error ? error.message : "Failed to add item. Please try again.", 
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Item</h1>
      
      {/* Display message */}
      {message && (
        <Alert variant={message.type === "success" ? "default" : "destructive"} className="mb-6">
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Model Number */}
              <div className="space-y-2">
                <Label htmlFor="modelNumber" className="text-sm font-medium">
                  Model Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="modelNumber"
                  name="modelNumber"
                  value={formData.modelNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              
              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Regular Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              {/* Special Price */}
              <div className="space-y-2">
                <Label htmlFor="specialPrice" className="text-sm font-medium">
                  Special Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="specialPrice"
                  name="specialPrice"
                  type="number"
                  value={formData.specialPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              
              {/* Image Upload */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="image" className="text-sm font-medium">
                  Image
                </Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional. Maximum size: 5MB
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Item"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}