"use client";

import * as React from "react";
import TenantCard from "@/components/TenantCard";
import { Button, Chip, InputAdornment, Snackbar, Alert, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TenantFormDialog, { TenantFormValues } from "@/components/TenantFormDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Tenant } from "@/types";
import { listTenants, createTenant, updateTenant, deleteTenant } from "@/lib/tenants";
import { useAuth } from "@/contexts/AuthContext";

export default function TenantsPage() {
  const { userId } = useAuth();
  const [tenants, setTenants] = React.useState<Tenant[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);

  const [openForm, setOpenForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"add" | "edit">("add");
  const [editingTenant, setEditingTenant] = React.useState<Tenant | null>(null);

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deletingTenant, setDeletingTenant] = React.useState<Tenant | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await listTenants();
      setTenants(data);
    } catch (err) {
      console.error(err);
      setToast("Failed to load tenants");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tenants;
    return tenants.filter(t =>
      t.name.toLowerCase().includes(q) ||
      (t.phone && t.phone.toLowerCase().includes(q)) ||
      (t.room && t.room.toLowerCase().includes(q))
    );
  }, [query, tenants]);

  const handleAdd = () => { setFormMode("add"); setEditingTenant(null); setOpenForm(true); };
  const handleEdit = (t: Tenant) => { setFormMode("edit"); setEditingTenant(t); setOpenForm(true); };
  const handleDelete = (t: Tenant) => { setDeletingTenant(t); setConfirmOpen(true); };

  const handleSave = async (values: TenantFormValues) => {
    try {
      if (formMode === "add") {
        if (!userId) throw new Error("Not authenticated");
        await createTenant({ name: values.name, phone: values.phone || null, address: values.address || null }, userId);
        setToast("Tenant added");
      } else if (editingTenant) {
        await updateTenant(editingTenant.id, { name: values.name, phone: values.phone || null, address: values.address || null });
        setToast("Tenant updated");
      }
      await refresh();
    } catch (err) {
      console.error(err);
      setToast("Save failed");
    } finally {
      setOpenForm(false);
    }
  };

  const confirmDelete = async () => {
    try {
      if (!deletingTenant) return;
      await deleteTenant(deletingTenant.id);
      setToast("Tenant deleted");
      await refresh();
    } catch (err) {
      console.error(err);
      setToast("Delete failed");
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-sm">
          <TextField
            size="small"
            placeholder="Search tenants"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{ startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )}}
          />
        </div>
        <div className="flex-1" />
        <Button variant="contained" onClick={handleAdd} disabled={!userId}>Add Tenant</Button>
      </div>

      {query && (
        <div>
          <Chip label={`Results: ${filtered.length}`} size="small" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
          ))
        ) : (
          filtered.map((t) => (
            <div key={t.id} className="space-y-2">
              <TenantCard name={t.name} phone={t.phone} roomNumber={t.room} isAssigned={t.isAssigned} />
              <div className="flex items-center justify-end gap-2">
                <Button size="small" variant="outlined" onClick={() => handleEdit(t)} disabled={!userId}>Edit</Button>
                <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(t)} disabled={!userId}>Delete</Button>
              </div>
            </div>
          ))
        )}
      </div>

      <TenantFormDialog
        open={openForm}
        mode={formMode}
        initialValues={editingTenant ? { name: editingTenant.name, phone: editingTenant.phone || "", address: editingTenant.address || "" } : undefined}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Tenant"
        message={`Are you sure you want to delete ${deletingTenant?.name}? This cannot be undone.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast(null)}>
        <Alert severity={toast?.includes("failed") ? "error" : "success"} variant="filled">{toast}</Alert>
      </Snackbar>
    </div>
  );
} 