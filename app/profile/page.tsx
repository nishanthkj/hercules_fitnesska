"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
    interface Profile {
        email: string;
        role: string;
        name: string;
        phone?: string;
    }

    const [profile, setProfile] = useState<Profile | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        currentPassword: "",
        newPassword: "",
    });

    useEffect(() => {
        fetch("/api/auth/profile")
            .then((res) => res.text())
            .then((text) => {
                const data = text ? JSON.parse(text) : {};
                if (data?.profile) {
                    setProfile(data.profile);
                    setFormData((prev) => ({
                        ...prev,
                        name: data.profile.name,
                        phone: data.profile.phone || "",
                    }));
                } else {
                    toast.error(data.error || "Failed to fetch profile");
                }
            })
            .catch(() => toast.error("Something went wrong while fetching profile"));
    }, []);

    const handleSave = async () => {
        const res = await fetch("/api/auth/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        let data = null;
        try {
            const text = await res.text();
            data = text ? JSON.parse(text) : {};
        } catch {
            toast.error("Invalid server response");
            return;
        }

        if (!res.ok) {
            toast.error(data?.error || "Failed to update");
            return;
        }

        toast.success("Profile updated");
        setProfile(data.profile);
        setEditMode(false);
    };

    if (!profile) return <p className="text-center py-10">Loading...</p>;

    return (
        <div className="flex justify-center items-center py-10 px-4">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">My Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Email</label>
                        <Input value={profile.email} disabled />
                    </div>

                    <div>
                        <label className="text-sm text-muted-foreground">Role</label>
                        <Input value={profile.role} disabled />
                    </div>

                    <div>
                        <label className="text-sm text-muted-foreground">Name</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={!editMode}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-muted-foreground">Phone</label>
                        <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={!editMode}
                        />
                    </div>

                    {editMode && (
                        <>
                            <div>
                                <label className="text-sm text-muted-foreground">Current Password</label>
                                <Input
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-muted-foreground">New Password</label>
                                <Input
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end space-x-2">
                        {!editMode ? (
                            <Button onClick={() => setEditMode(true)}>Edit</Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                                <Button onClick={handleSave}>Save</Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
