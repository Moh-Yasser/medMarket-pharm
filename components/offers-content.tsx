"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit2, Trash2, Power, PowerOff } from "lucide-react"
import { CreateOfferDialog } from "@/components/create-offer-dialog"

type OfferType = "percentage" | "fixed"
type OfferStatus = "active" | "scheduled" | "expired"

type Offer = {
  id: number
  name: string
  type: OfferType
  value: number
  startDate: string
  endDate: string
  status: OfferStatus
  products: string[]
}

const initialOffers: Offer[] = [
  {
    id: 1,
    name: "خصم الشتاء",
    type: "percentage",
    value: 20,
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    status: "active",
    products: ["باراسيتامول", "أموكسيسيلين", "إيبوبروفين"],
  },
  {
    id: 2,
    name: "عرض رأس السنة",
    type: "fixed",
    value: 50,
    startDate: "2025-01-01",
    endDate: "2025-01-07",
    status: "scheduled",
    products: ["فيتامين د", "أسبرين"],
  },
  {
    id: 3,
    name: "خصم الصيف",
    type: "percentage",
    value: 15,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    status: "expired",
    products: ["محلول معقم", "شاش طبي"],
  },
]

export function OffersContent() {
  const [offers, setOffers] = useState<Offer[]>(initialOffers)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleToggleStatus = (id: number) => {
    setOffers(
      offers.map((offer) =>
        offer.id === id
          ? {
              ...offer,
              status: offer.status === "active" ? "expired" : "active",
            }
          : offer,
      ),
    )
  }

  const handleDeleteOffer = (id: number) => {
    setOffers(offers.filter((offer) => offer.id !== id))
  }

  const getStatusColor = (status: OfferStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "scheduled":
        return "bg-blue-100 text-blue-700"
      case "expired":
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusLabel = (status: OfferStatus) => {
    switch (status) {
      case "active":
        return "نشط"
      case "scheduled":
        return "مجدول"
      case "expired":
        return "منتهي"
    }
  }

  const getOffersByStatus = (status: OfferStatus) => offers.filter((offer) => offer.status === status)

  const OfferCard = ({ offer }: { offer: Offer }) => (
    <Card key={offer.id} className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-semibold">{offer.name}</h3>
            <Badge className={getStatusColor(offer.status)}>{getStatusLabel(offer.status)}</Badge>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
            <p>{offer.type === "percentage" ? `خصم ${offer.value}%` : `خصم ${offer.value}ل.س`}</p>
            <p>
              من {new Date(offer.startDate).toLocaleDateString("ar-SA")} إلى{" "}
              {new Date(offer.endDate).toLocaleDateString("ar-SA")}
            </p>
            <p className="font-medium text-foreground mt-2">المنتجات: {offer.products.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 text-primary hover:text-primary hover:bg-primary/10"
          >
            <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 sm:h-8 sm:w-8 ${
              offer.status === "active"
                ? "text-amber-600 hover:text-amber-600 hover:bg-amber-50"
                : "text-green-600 hover:text-green-600 hover:bg-green-50"
            }`}
            onClick={() => handleToggleStatus(offer.id)}
          >
            {offer.status === "active" ? (
              <PowerOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <Power className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => handleDeleteOffer(offer.id)}
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {offer.products.slice(0, 3).map((product, idx) => (
          <Badge key={idx} variant="outline" className="text-xs">
            {product}
          </Badge>
        ))}
        {offer.products.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{offer.products.length - 3}
          </Badge>
        )}
      </div>
    </Card>
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">العروض</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">إدارة العروض والخصومات على المنتجات</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          إنشاء عرض
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="active" className="gap-2 text-sm whitespace-nowrap">
            نشطة
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
              {getOffersByStatus("active").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="gap-2 text-sm whitespace-nowrap">
            مجدولة
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
              {getOffersByStatus("scheduled").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="expired" className="gap-2 text-sm whitespace-nowrap">
            منتهية
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
              {getOffersByStatus("expired").length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-4 sm:mt-6">
          {getOffersByStatus("active").length === 0 ? (
            <Card className="p-8 sm:p-12">
              <div className="text-center text-sm sm:text-base text-muted-foreground">لا توجد عروض نشطة حالياً</div>
            </Card>
          ) : (
            getOffersByStatus("active").map((offer) => <OfferCard key={offer.id} offer={offer} />)
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4 mt-4 sm:mt-6">
          {getOffersByStatus("scheduled").length === 0 ? (
            <Card className="p-8 sm:p-12">
              <div className="text-center text-sm sm:text-base text-muted-foreground">لا توجد عروض مجدولة</div>
            </Card>
          ) : (
            getOffersByStatus("scheduled").map((offer) => <OfferCard key={offer.id} offer={offer} />)
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4 mt-4 sm:mt-6">
          {getOffersByStatus("expired").length === 0 ? (
            <Card className="p-8 sm:p-12">
              <div className="text-center text-sm sm:text-base text-muted-foreground">لا توجد عروض منتهية</div>
            </Card>
          ) : (
            getOffersByStatus("expired").map((offer) => <OfferCard key={offer.id} offer={offer} />)
          )}
        </TabsContent>
      </Tabs>

      <CreateOfferDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
