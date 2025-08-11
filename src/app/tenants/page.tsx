"use client";

import * as React from "react";
import { Box, Button, Grid, Stack, TextField, InputAdornment, Chip, Snackbar, Alert } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TenantCard from "@/components/TenantCard";
import TenantFormDialog, { TenantFormValues } from "@/components/TenantFormDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Tenant } from "@/types";

const INITIAL_TENANTS: Tenant[] = [
  { id: "1", name: "John Doe", phone: "0948 930 8315", address: "123 Main St", room: "101", isAssigned: true },
  { id: "2", name: "Jane Smith", phone: "—", address: "-", room: null, isAssigned: false },
  { id: "3", name: "Carlos Rivera", phone: "0921 555 4421", address: "45 Oak Ave", room: "102", isAssigned: true }
];

export default function TenantsPage() {
  const [tenants, setTenants] = React.useState<Tenant[]>(INITIAL_TENANTS);
  const [query, setQuery] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);

  const [openForm, setOpenForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"add" | "edit">("add");
  const [editingTenant, setEditingTenant] = React.useState<Tenant | null>(null);

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deletingTenant, setDeletingTenant] = React.useState<Tenant | null>(null);

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

  const handleSave = (values: TenantFormValues) => {
    if (formMode === "add") {
      const newTenant: Tenant = { id: crypto.randomUUID(), name: values.name, phone: values.phone || null, address: values.address || null, room: null, isAssigned: false };
      setTenants(prev => [newTenant, ...prev]);
      setToast("Tenant added");
    } else if (editingTenant) {
      setTenants(prev => prev.map(t => t.id === editingTenant.id ? { ...t, name: values.name, phone: values.phone || null, address: values.address || null } : t));
      setToast("Tenant updated");
    }
    setOpenForm(false);
  };

  const confirmDelete = () => {
    if (!deletingTenant) return;
    setTenants(prev => prev.filter(t => t.id !== deletingTenant.id));
    setToast("Tenant deleted");
    setConfirmOpen(false);
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
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
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" onClick={handleAdd}>Add Tenant</Button>
      </Stack>

      {query && (
        <Stack direction="row" spacing={1}>
          <Chip label={`Results: ${filtered.length}`} size="small" />
        </Stack>
      )}

      <Grid container spacing={2}>
        {filtered.map((t) => (
          <Grid key={t.id} item xs={12}>
            <Stack spacing={1}>
              <TenantCard name={t.name} phone={t.phone} roomNumber={t.room} isAssigned={t.isAssigned} />
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button size="small" variant="outlined" onClick={() => handleEdit(t)}>Edit</Button>
                <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(t)}>Delete</Button>
              </Stack>
            </Stack>
          </Grid>
        ))}
      </Grid>

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
        <Alert severity="success" variant="filled">{toast}</Alert>
      </Snackbar>
    </Stack>
  );
} 