"use client";

import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from "@mui/material";
import dayjs from "dayjs";

export type PaymentFormValues = { tenant: string; room: string | null; amount: number; paidAt: string; note?: string | null };

export default function PaymentFormDialog({
  open,
  mode,
  initialValues,
  onClose,
  onSave
}: {
  open: boolean;
  mode: "add" | "edit";
  initialValues?: PaymentFormValues;
  onClose: () => void;
  onSave: (values: PaymentFormValues) => void;
}) {
  const [values, setValues] = React.useState<PaymentFormValues>(
    initialValues || { tenant: "", room: null, amount: 0, paidAt: dayjs().format("YYYY-MM-DD"), note: "" }
  );

  React.useEffect(() => {
    setValues(initialValues || { tenant: "", room: null, amount: 0, paidAt: dayjs().format("YYYY-MM-DD"), note: "" });
  }, [initialValues, open]);

  const valid = values.tenant.trim().length > 0 && values.amount > 0 && !!values.paidAt;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "add" ? "Add Payment" : "Edit Payment"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Tenant" value={values.tenant} onChange={(e) => setValues(v => ({ ...v, tenant: e.target.value }))} required />
          <TextField label="Room (optional)" value={values.room || ""} onChange={(e) => setValues(v => ({ ...v, room: e.target.value || null }))} />
          <TextField label="Amount" type="number" inputProps={{ min: 0 }} value={values.amount} onChange={(e) => setValues(v => ({ ...v, amount: Number(e.target.value) }))} required />
          <TextField label="Date" type="date" value={values.paidAt} onChange={(e) => setValues(v => ({ ...v, paidAt: e.target.value }))} InputLabelProps={{ shrink: true }} required />
          <TextField label="Note" value={values.note || ""} onChange={(e) => setValues(v => ({ ...v, note: e.target.value }))} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={() => onSave(values)} disabled={!valid} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
} 