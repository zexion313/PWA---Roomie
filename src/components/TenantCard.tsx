import * as React from "react";

type Props = {
  name: string;
  phone?: string | null;
  roomNumber?: string | null;
  isAssigned: boolean;
};

export default function TenantCard({ name, phone, roomNumber, isAssigned }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-50/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-semibold text-slate-900">{name}</h3>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${isAssigned ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-600"}`}>
                {isAssigned && roomNumber ? `Room ${roomNumber}` : "Unassigned"}
              </span>
            </div>
            <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{phone || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 