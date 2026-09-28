import ProductDetailsContent from "@/components/pharmacist-products-details/product-details-content";




export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  
  return (
   <ProductDetailsContent productId={id} />
  );
}

