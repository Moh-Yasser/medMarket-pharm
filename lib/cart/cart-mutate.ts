import {  CartApiResponse } from "@/types/orders_cart"



export  function removeCartItemMutation(old: CartApiResponse | undefined,itemId: number,SupplierId: number) {
    if (!old) return old;
    return {
        ...old,
        data: {
            ...old.data,
            itemsBySupplier: old.data.itemsBySupplier.map((IBS) =>{ 
                if(IBS.supplier.id === SupplierId){
                   return {
                    ...IBS,
                    items: IBS.items.filter((item) => item.id !== itemId)
                   }
                }
                return IBS;
            })
        }
    }
}


export  function updateCartItemMutation(old: CartApiResponse| undefined,itemId: number,SupplierId: number,quantity: number) {
    if (!old) return old;
    return {
        ...old,
        data: {
            ...old.data,
            itemsBySupplier: old.data.itemsBySupplier.map((IBS) =>{ 
                if(IBS.supplier.id === SupplierId){
                   return {
                    ...IBS,
                    items: IBS.items.map((item) => {
                       
                        if(item.product.id === itemId){
                            
                            return { ...item, quantity: quantity }
                        }
                        return item;
                    })
                   }
                }
                return IBS;
            })
        }
    }
}