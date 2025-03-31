"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner"; // For showing toast notifications
import { useRouter } from "next/navigation"; // For navigation

interface Bill {
  id: string;
  invoiceNo: string;
  customerName: string;
  totalAmount: number;
  gstAmount: number;
  netAmount: number;
  paid: boolean;
  date: string;
}

export default function UserDashboard() {
  const [bills, setBills] = useState<Bill[]>([]); // Store the list of user bills
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter(); // For navigation

  // Fetch all bills associated with the logged-in user
  const fetchBills = async () => {
    setLoading(true); // Start loading while fetching bills

    const res = await fetch("/api/bill/list"); // Fetch bills from the backend

    const data = await res.json();
    if (data.bills) {
      setBills(data.bills || []); // Update bills state with fetched data
    } else {
      toast.error("Failed to fetch bills.");
    }
    setLoading(false); // Stop loading
  };

  // Redirect to the "Add Bill" page
  const handleAddBill = () => {
    router.push("/bill/create"); // Navigate to the /bill/create route
  };

  useEffect(() => {
    fetchBills(); // Fetch the user's bills when the component mounts
  }, []); // The empty array ensures this runs only once when the component is mounted

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <h2 className="font-bold text-lg">Total Bills</h2>
          <p className="text-xl">{bills.length}</p>
        </div>
        <div className="card">
          <h2 className="font-bold text-lg">Total Amount</h2>
          <p className="text-xl">₹{bills.reduce((sum, bill) => sum + bill.totalAmount, 0)}</p>
        </div>
        <div className="card">
          <h2 className="font-bold text-lg">Paid / Unpaid</h2>
          <p className="text-xl">{bills.filter((bill) => bill.paid).length} / {bills.filter((bill) => !bill.paid).length}</p>
        </div>
      </div>

      {/* Add Bill Button */}
      <div className="mb-4">
        <button
          onClick={handleAddBill}
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Bill
        </button>
      </div>

      {/* Display All Bills Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Your Bills</h2>
        {loading ? (
          <p>Loading bills...</p>
        ) : bills.length > 0 ? (
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="p-2 border">Invoice No</th>
                <th className="p-2 border">Customer Name</th>
                <th className="p-2 border">Total Amount</th>
                <th className="p-2 border">Paid Status</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id} className="border-b">
                  <td className="p-2 border">{bill.invoiceNo}</td>
                  <td className="p-2 border">{bill.customerName}</td>
                  <td className="p-2 border">₹{bill.totalAmount}</td>
                  <td className="p-2 border">{bill.paid ? "Paid" : "Unpaid"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bills found.</p>
        )}
      </div>
    </div>
  );
}
