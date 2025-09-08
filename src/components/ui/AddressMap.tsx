"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

interface Props {
  onSelectAddress: (
    address: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      pincode?: string;
      country?: string;
    },
    lat: number,
    lng: number
  ) => void;
}

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ✅ This hook recenters the map whenever coords change
function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 15); // zoom to 15 when recentering
  }, [coords, map]);
  return null;
}

function LocationMarker({ onSelectAddress }: Props) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click: async (e) => {
      setPosition(e.latlng);

      // Reverse geocode from Nominatim
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
        );
        const data = await res.json();

        const address = data.address || {};

        onSelectAddress(
          {
            addressLine1: address.road || "",
            addressLine2: address.suburb || "",
            city: address.city || address.town || address.village || "",
            state: address.state || "",
            pincode: address.postcode || "",
            country: address.country || "",
          },
          e.latlng.lat,
          e.latlng.lng
        );
      } catch (error) {
        console.error("Error fetching reverse geocode:", error);
      }
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function AddressMap({ onSelectAddress }: Props) {
  const [currentPos, setCurrentPos] = useState<[number, number]>([20.5937, 78.9629]); // default India

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentPos([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.warn("Geolocation error:", err);
        }
      );
    }
  }, []);

  return (
    <MapContainer
      center={currentPos}
      zoom={5}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* 👇 Recenter when geolocation is updated */}
      <RecenterMap coords={currentPos} />
      <LocationMarker onSelectAddress={onSelectAddress} />
    </MapContainer>
  );
}
