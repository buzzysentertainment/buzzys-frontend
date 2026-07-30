// ------------------------------------------------------------
// mileage.js — Centralized mileage logic for Buzzy's Inflatables
// ------------------------------------------------------------

import axios from "axios";

// ⭐ Business address (origin for all deliveries)
export const BUSINESS_ADDRESS = "69 Thompson Road SE, Silver Creek, GA 30173";

// ⭐ Round miles safely
export function roundMiles(value) {
  return Math.round(Number(value) || 0);
}

// ⭐ Owner's mileage pricing rules
export function calculateMileageFee(miles) {
  if (miles <= 10) return 0;       // First 10 miles free
  if (miles <= 20) return 10;      // 11–20 miles = $10
  if (miles <= 30) return 20;      // 21–30 miles = $20
  if (miles <= 40) return 27;      // 31–40 miles = $27
  return 27 + (miles - 40) * 3;    // 41+ miles = $27 + $3/mile
}

// ⭐ Fetch distance from backend and return miles + fee
export async function getDistanceAndFee({ address, city, state, zip }) {
  if (!address || !city || !state || !zip) {
    return { miles: 0, fee: 0 };
  }

  try {
    const res = await axios.post(
      "https://buzzys-backend.onrender.com/utils/distance",
      {
        origin: BUSINESS_ADDRESS,
        destination: `${address}, ${city}, ${state} ${zip}`
      }
    );

    const miles = roundMiles(res.data.distance);
    const fee = calculateMileageFee(miles);

    return { miles, fee };
  } catch (err) {
    console.error("Distance API error:", err);
    return { miles: 0, fee: 0 };
  }
}
