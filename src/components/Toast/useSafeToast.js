"use client";

import { useContext } from "react";
import { ToastContext } from "./toast.context";

export default function useSafeToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useSafeToast deve ser usado dentro de um ToastProvider"
    );
  }

  return context; // { showToast }
}
