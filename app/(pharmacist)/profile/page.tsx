"use client";

import { useState } from "react";
import { Package, ShoppingBag, DollarSign, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pharmacistProfile } from "@/lib/data";
import { logoutAction } from "@/lib/api/auth";	
import { useRouter } from "next/navigation";
const stats = [
  {
    label: "إجمالي الطلبات",
    value: pharmacistProfile.totalOrders,
    icon: ShoppingBag,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "المنتجات المشتراة",
    value: pharmacistProfile.totalProducts.toLocaleString(),
    icon: Package,
    color: "bg-secondary/10 text-secondary",
  },
  {
    label: "إجمالي المبلغ المدفوع",
    value: `$${pharmacistProfile.totalSpent.toLocaleString()}`,
    icon: DollarSign,
    color: "bg-success/10 text-success",
  },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState(pharmacistProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const handleLogout=async()=>{
    const isLogout=await logoutAction();
    if(isLogout.success)
      router.push("/login")
  }
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  
  return (
    <div className="space-y-6 px-4 lg:px-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">الملف الشخصي</h1>
        <p className="text-sm text-muted-foreground mt-1">
          عرض إحصائيات صيدليتك وإدارة ملفك الشخصي
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            معلومات الصيدلية
          </CardTitle>
          <CardDescription>تحديث بيانات صيدليتك</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">اسم الصيدلية</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner">اسم المالك</Label>
              <Input
                id="owner"
                value={profile.owner}
                onChange={(e) =>
                  setProfile({ ...profile, owner: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">الموقع</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">رقم الترخيص</Label>
              <Input
                id="license"
                value={profile.license}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
          <div className="flex justify-start">
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving
                ? "جاري الحفظ..."
                : saved
                  ? "تم الحفظ!"
                  : "حفظ التغييرات"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>الحساب</CardTitle>
        </CardHeader>
        <div className="flex justify-start mr-4">
          <Button
            className="bg-red-500 hover:bg-red-600 text-white "
            onClick={handleLogout}
          >
            تسجيل الخروج
          </Button>
        </div>
      </Card>
    </div>
  );
}
