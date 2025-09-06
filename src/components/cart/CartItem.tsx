import Image from 'next/image';
import { CartItem as CartItemType } from '@/lib/types/cart';
import CustomButton from '@/components/ui/CustomButton';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  return (
    <div className="flex gap-4 border-b border-gray-200 py-4">
      <div className="relative h-24 w-24 flex-shrink-0">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.productName}
            fill
            className="object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium text-gray-900">{item.productName}</h3>
          <p className="text-lg font-medium text-gray-900">
            ₹{item.totalCurrentPrice.toFixed(2)}
          </p>
        </div>
        
        <div className="mt-1 flex items-center gap-4">
          {/* <p className="text-sm text-gray-500">
            {item.color} | {item.size}
          </p> */}
          <p className="text-sm text-gray-500">{item.brand}</p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CustomButton 
              label="-"
              loading={false}
              onClick={() => {}}
            //   className="px-2 py-1 border border-gray-300 rounded-md"
            />
            <span className="mx-2">{item.quantity}</span>
            <CustomButton
              label="+"
              loading={false}
              onClick={() => {}}
            //   className="px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>

          <CustomButton
            label="Remove"
            loading={false}
            onClick={() => {}}
            // className="text-red-600 hover:text-red-800"
          />
        </div>

        {/* {item.discountOnProduct > 0 && (
          <div className="mt-1">
            <span className="text-sm text-gray-500 line-through mr-2">
              ₹{item.price.toFixed(2)}
            </span>
            <span className="text-sm text-green-600">
              {item.discountOnProduct}% off
            </span>
          </div>
        )} */}
      </div>
    </div>
  );
};
