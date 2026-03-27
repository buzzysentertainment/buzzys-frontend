// src/utils/auth.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export async function adminLogin(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();

  // Save token for backend requests
  localStorage.setItem("adminToken", token);

  return token;
}

export function adminLogout() {
  localStorage.removeItem("adminToken");
}

export function getAdminToken() {
  return localStorage.getItem("adminToken");
}
