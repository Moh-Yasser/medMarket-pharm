import { Badge } from "../ui/badge"
import { CheckCircle, ShieldCheck } from "lucide-react"
import { MapPin } from "lucide-react"

import { Supplier } from "@/types/company"

export function SupplierInfo({supplier}:{supplier:Supplier}) { 

    return(
<div className="rounded-xl border-2 shadow-sm border-accent bg-card p-6  sm:mb-6">
<div className="flex flex-col gap-6 md:flex-row">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-primary">
          <div className="flex h-full w-full flex-col items-center justify-center text-card">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.3"/>
              <path d="M19 13v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 7v10M8 11h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/80">{supplier.name}</span>
          </div>
          <div className="absolute -bottom-1 -start-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#22c55e] text-white ring-2 ring-card">
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>

            <div className="flex-1">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground" >{supplier.name}</h1>
                <Badge className="bg-blue-50 text-primary border-none font-semibold text-xs uppercase tracking-wider" dir="ltr">
                  {supplier.phone}
                </Badge>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">         
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  معتمد 
                </span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                   {supplier.address}
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {supplier.description}
              </p>
            </div>
          </div>
        </div>
        </div>
        </div>
    )}