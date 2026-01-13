"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, Tag, WalletMinimal } from "lucide-react";
import { SalesChart } from "@/components/sales-chart";
import { TopProductsTable } from "@/components/top-products-table";
import { formatSYP } from "@/lib/format";

export function DashboardContent() {
  const dummyStats = {
    revenue: {
      title: "إجمالي المبيعات",
      value: formatSYP(231132),
      trend: "+12.5%",
      trendUp: true,
    },
    ordersCount: {
      title: "إجمالي الطلبات",
      value: 483,
      trend: "+12.5%",
      trendUp: true,
    },

    productsCount: {
      title: "عدد المنتجات",
      value: 342,
      trend: "+8 هذا الشهر",
      trendUp: true,
    },
    notActive: {
      title: "المنتجات الغير متوفرة",
      value: 23,
      trend: "الكمية = 0",
      trendUp: false,
    },
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          لوحة التحكم
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
          نظرة عامة على أداء المتجر والمبيعات
        </p>
      </div>
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {dummyStats.productsCount.title}
            </CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {dummyStats.productsCount.value}
            </div>
            <p className="text-xs text-muted-foreground">نشط في الكتالوج</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {dummyStats.ordersCount.title}
            </CardTitle>
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {dummyStats.ordersCount.value}
            </div>
            <p className="text-xs text-muted-foreground">طوال الوقت</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(var(--accent-amber))]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {dummyStats.notActive.title}
            </CardTitle>
            <Tag className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {dummyStats.notActive.value}
            </div>
            <p className="text-xs text-muted-foreground">الكمية = 0</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {dummyStats.revenue.title}
            </CardTitle>
            <WalletMinimal className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {dummyStats.revenue.value}
            </div>
            <p className="text-xs text-muted-foreground">طوال الوقت</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 sm:gap-6 flex-col">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">المبيعات</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground">
              إجمالي المبيعات خلال الأشهر الماضية
            </p>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>

        {/* Top Products Table */}
        <TopProductsTable />
      </div>
    </div>
  );
}
