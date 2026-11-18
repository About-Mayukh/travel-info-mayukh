/**
 * Price and travel cost calculations for WanderSpot
 */

// Estimated fuel, vehicle wear and highway toll cost per kilometer for private road driving in India
export const DRIVING_RATE_PER_KM = 11; // ₹11 / km

/**
 * Calculates total ticket price for adults and children
 * @param {number} adults 
 * @param {number} children 
 * @param {number} adultPrice 
 * @param {number} childPrice 
 * @returns {number}
 */
export function calculateTicketPrice(adults = 1, children = 0, adultPrice = 0, childPrice = 0) {
  const safeAdults = Math.max(0, parseInt(adults, 10) || 0);
  const safeChildren = Math.max(0, parseInt(children, 10) || 0);
  const safeAdultPrice = parseFloat(adultPrice) || 0;
  const safeChildPrice = parseFloat(childPrice) || 0;

  return (safeAdults * safeAdultPrice) + (safeChildren * safeChildPrice);
}

/**
 * Calculates estimated driving travel cost based on distance in km
 * @param {number} distanceKm 
 * @param {number} ratePerKm 
 * @returns {number}
 */
export function calculateTravelCost(distanceKm = 0, ratePerKm = DRIVING_RATE_PER_KM) {
  const safeDistance = Math.max(0, parseFloat(distanceKm) || 0);
  return Math.round(safeDistance * ratePerKm);
}

/**
 * Calculates grand total budget (Tickets + Estimated Driving Cost)
 * @param {Object} params
 * @param {number} params.adults
 * @param {number} params.children
 * @param {number} params.adultPrice
 * @param {number} params.childPrice
 * @param {number} params.distanceKm
 * @returns {{ ticketPrice: number, travelCost: number, grandTotal: number }}
 */
export function calculateTotalEstimate({ adults = 1, children = 0, adultPrice = 0, childPrice = 0, distanceKm = 0 }) {
  const ticketPrice = calculateTicketPrice(adults, children, adultPrice, childPrice);
  const travelCost = calculateTravelCost(distanceKm);
  return {
    ticketPrice,
    travelCost,
    grandTotal: ticketPrice + travelCost
  };
}
