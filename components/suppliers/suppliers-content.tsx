"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";


import { EmptyState, SupplierGridCard } from "./suppliers-grid-cart";
import { Supplier, SuppliersApiResponse } from "@/types/company";
import { SuppliersFilters } from "@/types/filters";
import { SuppliersSearch } from "./suppliers-search";
import { SUPPLIERS_KEYS } from "@/lib/suppliers/suppliers-keys";
import { getAllSuppliers } from "@/lib/suppliers/suppliers.client";
import { useQuery } from "@tanstack/react-query";
import { PaginationType } from "@/types/api-response";
import { SupplierPagination } from "./supplier-pagination";
import { Separator } from "@/components/ui/separator";
import SuppliersLoading from "./card-skeleton";




function getFiltersFromParams(params: URLSearchParams): SuppliersFilters {


    return {
        search: params.get("search") || "",
        category_id: params.get("category_id") || "",
        manufacturer_id: params.get("manufacturer_id") || "",
        page: parseInt(params.get("page") || "1", 10),
        per_page: parseInt(params.get("per_page") || "15", 10),
    }
}

export function SuppliersContent() {
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<SuppliersFilters>(getFiltersFromParams(searchParams));

    const { data: fetchedData, isLoading, isFetching } = useQuery<SuppliersApiResponse>({
        queryKey: SUPPLIERS_KEYS.list(filters),
        queryFn: () => getAllSuppliers(filters),
    });


    const defaultPagination: PaginationType = {
        current_page: 1,
        per_page: 15,
        total: 19,
        last_page: 5,
        from: 1,
        to: 15,
    };

    const suppliersData: Supplier[] = fetchedData?.data ?? [];

    const pagination: PaginationType = fetchedData?.pagination ?? defaultPagination


    const hasActiveFilters =
        filters.search !== "" ||
        filters.category_id !== "all" ||
        filters.manufacturer_id !== "all"

    const onClearFilters = () => {
        setFilters({
            category_id: "all",
            manufacturer_id: "all",
            search: "",
        });
    };
    const onFilterChange = (key: keyof SuppliersFilters, value: string) => {
        setFilters({ ...filters, [key]: value });
    };
    if (isLoading || isFetching) {
        return <SuppliersLoading />
    }
    return (
        <div className="px-4 sm:px-6 lg:px-8 ">

            <div className="flex items-center justify-between">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-foreground">الموردين</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        تصفح واطلب المنتجات من موردين متعددين
                    </p>
                </div>
            </div>
            <SuppliersSearch onClearFilters={onClearFilters} hasActiveFilters={hasActiveFilters} filters={filters} onFilterChange={onFilterChange} />
            <div className="mt-6 min-h-[calc(53vh)]">
                {suppliersData.length === 0 ? (
                    <EmptyState hasFilters={hasActiveFilters} onClear={onClearFilters} />
                ) : (
                    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {suppliersData.map((supplier: Supplier) => (
                            <SupplierGridCard key={supplier.id} supplier={supplier} />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Pagination ────────────────────────────────────────────────── */}
            {suppliersData.length > 0 && (

                <div className="mt-6">
                    <Separator className="mb-4" />
                    <SupplierPagination pagination={pagination} />
                </div>
            )}
        </div>
    );
}
