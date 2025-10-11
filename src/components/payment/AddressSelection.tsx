import { Address } from "@/lib/types/address";

interface AddressSelectionProps {
  addresses: Address[];
  selectedAddressId: string;
  onAddressChange: (addressId: string) => void;
}

export default function AddressSelection({
  addresses,
  selectedAddressId,
  onAddressChange
}: AddressSelectionProps) {
  const selectedAddress = addresses.find(a => a.addressId === selectedAddressId) ?? addresses[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-300 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Delivery Address</h2>
        <a href="/user#add-address" className="text-sm text-blue-600 hover:underline">
          + Add new address
        </a>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">No addresses found</div>
          <a
            href="/user#add-address"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Your First Address
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {addresses.map(addr => (
              <label
                key={addr.addressId}
                className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === addr.addressId}
                  onChange={() => onAddressChange(addr.addressId)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="font-medium flex items-center gap-2">
                      <span>{addr.addressType || 'Address'}</span>
                      {addr.isDefault && (
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                      {addr.addressId === selectedAddressId && (
                        <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">{addr.name} • {addr.phoneNumber}</div>
                    <div className="text-gray-600">
                      {addr.addressLine1}
                      {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                      <br />
                      {addr.city}, {addr.state} - {addr.postalCode}
                      <br />
                      {addr.country}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {selectedAddress && (
            <div className="mt-4 text-sm text-gray-600">
              Delivering to: <span className="font-medium text-gray-800">{selectedAddress.name}</span>, {selectedAddress.addressLine1}, {selectedAddress.city}
            </div>
          )}
        </>
      )}
    </div>
  );
}