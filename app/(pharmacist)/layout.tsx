import { Header } from "@/components/pharmacist-layout/header"
import { OfferDialog } from "@/components/pharmacist-offer/offer-dialog"

    export default function PharmacyLayout({
    children,
    }: {
    children: React.ReactNode
    }) {
    return (
        <div>
            <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto  py-6 ">{children}</main>
        </div>
        <OfferDialog />
        </div>
    )
    }