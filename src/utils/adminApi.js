// src/utils/adminApi.js
import axios from "axios";
import { getAdminToken } from "./auth";

const API = axios.create({
  baseURL: "https://buzzys-backend.onrender.com",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -----------------------------
// BOOKINGS
// -----------------------------
export function fetchAllBookings() {
  return API.get("/admin/bookings");
}
export function backfillBookingMileage() {
  return API.post("/admin/bookings/backfill-mileage");
}
export function createBooking(data) {
	return API.post("/admin/bookings", data);
}

export function updateBookingDetails(id, data) {
  return API.put(`/admin/bookings/${id}`, data);
}
/**
 * FIXED: Re-added /admin/ prefix to stop the 404 errors.
 * Updates the 'contractStatus' field seen in your Firestore screenshot.
 */
export function updateBookingStatus(id, status) {
  return API.put(`/admin/bookings/${id}`, { 
  status: status,
  contractStatus: status });
}

/**
 * FIXED: Re-added /admin/ prefix to stop the 404 errors.
 * Adds the 'adminNote' field directly to the Firestore document.
 */
export function addAdminNote(id, note) {
  return API.put(`/admin/bookings/${id}`, { 
    adminNote: note,
    note: note // redundancy for backend logic
  });
}

export function deleteBookingById(id) {
  return API.delete(`/admin/bookings/${id}`);
}

export function fetchBookingsByItem(item) {
  return API.get(`/admin/bookings/item/${item}`);
}

export function fetchBookingsByStatus(status) {
  return API.get(`/admin/bookings?status=${status}`);
}

export const sortBookingsNewestFirst = (bookings) => {
	return [...bookings].sort((a, b) => {
	  const dateA = new Date(a.createdAt || a.eventDate || a.date || 0);
	  const dateB = new Date(b.createdAt || b.eventDate || b.date || 0);
	  return dateB - dateA; // Newest (largest timestamp) first
	});
  };	
  export function fetchBookingsByDate(date) {
	return API.get(`/admin/bookings/date/${date}`);
  }
// -----------------------------
// CALENDAR
// -----------------------------
export function fetchCalendarEvents() {
  return API.get("/admin/calendar");
}

// -----------------------------
// THEME SETTINGS
// -----------------------------
export const getThemeSettings = () => API.get("/admin/theme");
export const updateThemeSettings = (data) =>
  API.post("/admin/theme/update", data);

// -----------------------------
// HOMEPAGE SETTINGS
// -----------------------------
export const getHomepageSettings = () => API.get("/admin/homepage");
export const updateHomepageSettings = (data) =>
  API.post("/admin/homepage/update", data);

// -----------------------------
// PRICING SETTINGS
// -----------------------------
export const getPricingSettings = () => API.get("/admin/pricing");
export const updatePricingSettings = (data) =>
  API.put("/admin/pricing", data);

// -----------------------------
// BOOKING RULES
// -----------------------------
export const getBookingRules = () => API.get("/admin/booking-rules");
export const updateBookingRules = (data) =>
  API.post("/admin/booking-rules/update", data);

// -----------------------------
// BUSINESS INFO
// -----------------------------
export const getBusinessInfo = () => API.get("/admin/business-info");
export const updateBusinessInfo = (data) =>
  API.post("/admin/business-info/update", data);

// -----------------------------
// PROMOTIONS SETTINGS
// -----------------------------
export const getPromotionsSettings = () => 
  API.get("/admin/settings/promotions");

export const updatePromotionsSettings = (data) =>
  API.put("/admin/settings/promotions", data);

// -----------------------------
// MEDIA MANAGER
// -----------------------------
export const getMediaLibrary = () => API.get("/admin/media");

export const uploadMediaFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/admin/media/upload", formData);
};

export const deleteMediaFile = (id) =>
  API.delete(`/admin/media/${id}`);

export const renameMediaFile = (id, name) =>
  API.post(`/admin/media/${id}/rename`, { name });

// -----------------------------
// ADMIN ACCOUNT
// -----------------------------
export const getAdminAccount = () => API.get("/admin/account");

export const updateAdminAccount = (data) =>
  API.post("/admin/account/update", data);

// -----------------------------
// SPEED OPTIMIZATION: Keep-Alive
// -----------------------------
export const startKeepAlive = () => {
  setInterval(() => {
    API.get("/admin/account").catch(() => {
      /* ignore errors, just wake it up */
    });
  }, 300000); 
};
