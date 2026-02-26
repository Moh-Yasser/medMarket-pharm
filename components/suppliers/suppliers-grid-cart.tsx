import { cn } from "@/lib/utils";
import { Supplier } from "@/types/company";
import { ArrowLeft, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-sky-600",
  "from-fuchsia-500 to-purple-600",
  "from-lime-500 to-emerald-600",
  "from-sky-400 to-blue-600",
  "from-orange-500 to-red-500",
];

function getGradient(id: number) {
  return GRADIENTS[id % GRADIENTS.length];
}


export function SupplierGridCard({ supplier }: { supplier: Supplier }) {
    return (
      <Link
        href={`/suppliers/${supplier.id}`}
        className="block h-full"
      >
        <div className="group flex h-full flex-col items-center rounded-2xl border bg-card p-6 text-center transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br text-base font-bold text-white shadow-sm",
              getGradient(supplier.id)
            )}
          >
            {supplier.name[0]}
          </div>
          <h3 className="mt-4 font-semibold text-foreground text-[15px] leading-snug">
            {supplier.name}
          </h3>
          <span className="mt-1.5 inline-flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
          </span>
          <span className=" inline-flex items-center gap-1 text-xs text-muted-foreground">
            {supplier.address}
          </span>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80 line-clamp-2">
            {supplier.description}
          </p>
          <div className="mt-auto pt-4 w-full ">
            <span className="text-black bg-muted w-full rounded-md p-2 inline-flex justify-center items-center gap-1 text-xs font-medium group-hover:text-primary group-hover:bg-muted/80 transition-opacity duration-200 hover:cursor-pointer">
              عرض المنتجات
              <ArrowLeft className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    );
  }
  
  




  
  export function EmptyState({
    hasFilters,
    onClear,
  }: {
    hasFilters: boolean;
    onClear: () => void;
  }) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Search className="h-6 w-6 text-muted-foreground/50" />
        </div>
        <p className="mt-4 text-lg  text-muted-foreground">
          لم يتم العثور على موردين
        </p>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 text-xs hover:cursor-pointer border "
            onClick={onClear}
          >
            مسح الفلاتر
          </Button>
        )}
      </div>
    );
  }