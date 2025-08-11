"use client";

import * as React from "react";
import { Stack, Button, List, ListItem, ListItemText, Typography, Chip, IconButton, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PaymentFormDialog, { PaymentFormValues } from "@/components/PaymentFormDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Payment } from "@/types";

const INITIAL_PAYMENTS: Payment[] = [
  { id: "p1", tenant: "John Doe", room: "101", amount: 1500, paidAt: "2024-05-01", note: "May rent" },
  { id: "p2", tenant: "Jane Smith", room: null, amount: 500, paidAt: "2024-05-03", note: "Advance" }
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount);
}

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<Payment[]>(INITIAL_PAYMENTS);
  const [toast, setToast] = React.useState<string | null>(null);

  const [openForm, setOpenForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"add" | "edit">("add");
  const [editingPayment, setEditingPayment] = React.useState<Payment | null>(null);

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deletingPayment, setDeletingPayment] = React.useState<Payment | null>(null);

  const handleAdd = () => { setFormMode("add"); setEditingPayment(null); setOpenForm(true); };
  const handleEdit = (p: Payment) => { setFormMode("edit"); setEditingPayment(p); setOpenForm(true); };
  const handleDelete = (p: Payment) => { setDeletingPayment(p); setConfirmOpen(true); };

  const handleSave = (values: PaymentFormValues) => {
    if (formMode === "add") {
      const newPayment: Payment = { id: crypto.randomUUID(), tenant: values.tenant, room: values.room, amount: values.amount, paidAt: values.paidAt, note: values.note };
      setPayments(prev => [newPayment, ...prev]);
      setToast("Payment added");
    } else if (editingPayment) {
      setPayments(prev => prev.map(p => p.id === editingPayment.id ? { ...p, ...values } : p));
      setToast("Payment updated");
    }
    setOpenForm(false);
  };

  const confirmDelete = () => {
    if (!deletingPayment) return;
    setPayments(prev => prev.filter(p => p.id !== deletingPayment.id));
    setToast("Payment deleted");
    setConfirmOpen(false);
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button variant="contained" onClick={handleAdd}>Add Payment</Button>
      </Stack>
      <List>
        {payments.map((p) => (
          <ListItem key={p.id} divider secondaryAction={
            <Stack direction="row" spacing={1}>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(p)}><EditIcon /></IconButton>
              <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleDelete(p)}><DeleteIcon /></IconButton>
            </Stack>
          }>
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography fontWeight={700}>{formatCurrency(p.amount)}</Typography>
                  {p.room ? <Chip label={`Room ${p.room}`} size="small" /> : null}
                </Stack>
              }
              secondary={`${p.tenant} • ${new Date(p.paidAt).toLocaleDateString()}${p.note ? " • " + p.note : ""}`}
            />
          </ListItem>
        ))}
      </List>

      <PaymentFormDialog
        open={openForm}
        mode={formMode}
        initialValues={editingPayment ? { tenant: editingPayment.tenant, room: editingPayment.room, amount: editingPayment.amount, paidAt: editingPayment.paidAt, note: editingPayment.note || "" } : undefined}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Payment"
        message={`Are you sure you want to delete this payment? This cannot be undone.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast(null)}>
        <Alert severity="success" variant="filled">{toast}</Alert>
      </Snackbar>
    </Stack>
  );
} 