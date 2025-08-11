import { supabase } from "@/lib/supabaseClient";
import type { Tenant } from "@/types";

export type TenantInsert = {
  name: string;
  phone?: string | null;
  address?: string | null;
};

export type TenantUpdate = TenantInsert;

export async function listTenants(): Promise<Tenant[]> {
  const { data, error } = await supabase
    .from("tenants")
    .select("id, name, phone, address")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone ?? null,
    address: row.address ?? null,
    room: null,
    isAssigned: false
  }));
}

export async function createTenant(input: TenantInsert, ownerId: string): Promise<void> {
  const payload = { ...input, owner_id: ownerId };
  const { error } = await supabase.from("tenants").insert(payload);
  if (error) throw error;
}

export async function updateTenant(id: string, input: TenantUpdate): Promise<void> {
  const { error } = await supabase.from("tenants").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteTenant(id: string): Promise<void> {
  const { error } = await supabase.from("tenants").delete().eq("id", id);
  if (error) throw error;
} 