"use client";

import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from "@mui/material";
import type { Tenant } from "@/types";

export type TenantFormValues = Pick<Tenant, "name" | "phone" | "address">;

export default function TenantFormDialog({
  open,
  mode,
  initialValues,
  onClose,
  onSave
}: {
  open: boolean;
  mode: "add" | "edit";
  initialValues?: TenantFormValues;
  onClose: () => void;
  onSave: (values: TenantFormValues) => void;
}) {
  const [values, setValues] = React.useState<TenantFormValues>(initialValues || { name: "", phone: "", address: "" });

  React.useEffect(() => {
    setValues(initialValues || { name: "", phone: "", address: "" });
  }, [initialValues, open]);

  const valid = values.name.trim().length > 0 && values.address?.toString().trim().length! > 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "add" ? "Add Tenant" : "Edit Tenant"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Full Name" value={values.name} onChange={(e) => setValues(v => ({ ...v, name: e.target.value }))} required />
          <TextField label="Phone" value={values.phone || ""} onChange={(e) => setValues(v => ({ ...v, phone: e.target.value }))} />
          <TextField label="Address" value={values.address || ""} onChange={(e) => setValues(v => ({ ...v, address: e.target.value }))} required />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={() => onSave(values)} disabled={!valid} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
} 