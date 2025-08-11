"use client";

import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from "@mui/material";

export type RoomFormValues = { number: string; capacity: number };

export default function RoomFormDialog({
  open,
  mode,
  initialValues,
  onClose,
  onSave
}: {
  open: boolean;
  mode: "add" | "edit";
  initialValues?: RoomFormValues;
  onClose: () => void;
  onSave: (values: RoomFormValues) => void;
}) {
  const [values, setValues] = React.useState<RoomFormValues>(initialValues || { number: "", capacity: 1 });

  React.useEffect(() => {
    setValues(initialValues || { number: "", capacity: 1 });
  }, [initialValues, open]);

  const valid = values.number.trim().length > 0 && values.capacity > 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{mode === "add" ? "Add Room" : "Edit Room"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Room Number" value={values.number} onChange={(e) => setValues(v => ({ ...v, number: e.target.value }))} required />
          <TextField label="Capacity" type="number" inputProps={{ min: 1 }} value={values.capacity} onChange={(e) => setValues(v => ({ ...v, capacity: Number(e.target.value) }))} required />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={() => onSave(values)} disabled={!valid} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
} 