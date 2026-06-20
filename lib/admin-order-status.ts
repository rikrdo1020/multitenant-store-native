import type { OrderStatus } from "@/types";

export interface AdminOrderStatusDisplay {
  label: string;
  badgeClassName: string;
  textClassName: string;
  dotClassName: string;
}

export const ADMIN_ORDER_STATUS_DISPLAY: Record<OrderStatus, AdminOrderStatusDisplay> = {
  pending: {
    label: "Pendiente",
    badgeClassName: "border-amber-200 bg-amber-50",
    textClassName: "text-amber-800",
    dotClassName: "bg-amber-500",
  },
  paid: {
    label: "Pagado",
    badgeClassName: "border-emerald-200 bg-emerald-50",
    textClassName: "text-emerald-800",
    dotClassName: "bg-emerald-500",
  },
  processing: {
    label: "Preparando",
    badgeClassName: "border-sky-200 bg-sky-50",
    textClassName: "text-sky-800",
    dotClassName: "bg-sky-500",
  },
  ready: {
    label: "Preparado",
    badgeClassName: "border-indigo-200 bg-indigo-50",
    textClassName: "text-indigo-800",
    dotClassName: "bg-indigo-500",
  },
  shipped: {
    label: "Enviado",
    badgeClassName: "border-blue-200 bg-blue-50",
    textClassName: "text-blue-800",
    dotClassName: "bg-blue-500",
  },
  delivered: {
    label: "Entregado",
    badgeClassName: "border-emerald-200 bg-emerald-50",
    textClassName: "text-emerald-800",
    dotClassName: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelado",
    badgeClassName: "border-red-200 bg-red-50",
    textClassName: "text-red-800",
    dotClassName: "bg-red-500",
  },
  failed: {
    label: "Fallido",
    badgeClassName: "border-neutral-300 bg-neutral-100",
    textClassName: "text-neutral-700",
    dotClassName: "bg-neutral-500",
  },
  rejected: {
    label: "Rechazado",
    badgeClassName: "border-orange-200 bg-orange-50",
    textClassName: "text-orange-800",
    dotClassName: "bg-orange-500",
  },
  expired: {
    label: "Expirado",
    badgeClassName: "border-slate-200 bg-slate-50",
    textClassName: "text-slate-600",
    dotClassName: "bg-slate-400",
  },
};
