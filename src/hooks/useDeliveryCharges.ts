import { useState, useEffect } from "react";
import axios from "axios";
import { Product } from "@/lib/types/product";
import { CartResponse } from "@/lib/types/cart";
import { Address } from "@/lib/types/address";
import { DelhiveryCostResponse } from "@/lib/types/delhivary";
import { useToastActions } from "@/hooks/useToastActions";
import { buildUniqueDeliveryRequests } from "@/lib/utils/payment.utils";

export function useDeliveryCharges(
  cart: CartResponse | null,
  singleProduct: Product | null,
  selectedAddress: Address | undefined
) {
  const [delhiveryCharges, setDelhiveryCharges] = useState<number[]>([]);
  const { showError } = useToastActions();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const handleDeliveryCalculation = async () => {
      // Exit if no items or no selected address
      if ((!cart?.items?.length && !singleProduct) || !selectedAddress) return;

      try {
        const destination = selectedAddress.addressId.split("-")[0];
        const uniqueRequests = buildUniqueDeliveryRequests(
          cart?.items || null,
          singleProduct,
          destination
        );

        console.log("Final unique requests:", uniqueRequests);
        
        // Send API calls only for unique requests
        const results = await Promise.all(
          uniqueRequests.map(async (req) => {
            const res = await axios.post<DelhiveryCostResponse>(
              `${baseUrl}/api/delhivary/shipment/coast`,
              {
                origin: req.origin,
                destination,
                length: req.length,
                breadth: req.breadth,
                height: req.height,
                weight: req.weight,
              }
            );
            return res.data.data[0].total_amount / 2;
          })
        );
        
        console.log("Delhivery individual results:", results);
        console.log("Delhivery charges array:", results);
        setDelhiveryCharges(results);
      } catch (err: unknown) {
        if (err instanceof Error) {
          showError('Delivery cost calculation failed', err.message, 4000);
        } else {
          showError('Delivery cost calculation failed', 'Try again later', 4000);
        }
      }
    };

    handleDeliveryCalculation();
  }, [cart, singleProduct, selectedAddress, baseUrl, showError]);

  return delhiveryCharges;
}