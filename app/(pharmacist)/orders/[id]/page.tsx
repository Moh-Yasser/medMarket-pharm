import { OrderDetailsContent } from "@/components/pharmacist-orders/order-details-content";


export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  
  return (
   <OrderDetailsContent orderId={id} />
  );
}

