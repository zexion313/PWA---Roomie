"use client";

import * as React from "react";
import { Grid, Card, CardContent, Stack, Typography, Chip, Button, Snackbar, Alert } from "@mui/material";
import RoomFormDialog, { RoomFormValues } from "@/components/RoomFormDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Room } from "@/types";

const INITIAL_ROOMS: Room[] = [
  { id: "r1", number: "101", capacity: 2, occupants: 1 },
  { id: "r2", number: "102", capacity: 1, occupants: 1 },
  { id: "r3", number: "201", capacity: 3, occupants: 2 }
];

export default function RoomsPage() {
  const [rooms, setRooms] = React.useState<Room[]>(INITIAL_ROOMS);
  const [toast, setToast] = React.useState<string | null>(null);

  const [openForm, setOpenForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"add" | "edit">("add");
  const [editingRoom, setEditingRoom] = React.useState<Room | null>(null);

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deletingRoom, setDeletingRoom] = React.useState<Room | null>(null);

  const handleAdd = () => { setFormMode("add"); setEditingRoom(null); setOpenForm(true); };
  const handleEdit = (r: Room) => { setFormMode("edit"); setEditingRoom(r); setOpenForm(true); };
  const handleDelete = (r: Room) => { setDeletingRoom(r); setConfirmOpen(true); };

  const handleSave = (values: RoomFormValues) => {
    if (formMode === "add") {
      const newRoom: Room = { id: crypto.randomUUID(), number: values.number, capacity: values.capacity, occupants: 0 };
      setRooms(prev => [newRoom, ...prev]);
      setToast("Room added");
    } else if (editingRoom) {
      setRooms(prev => prev.map(r => r.id === editingRoom.id ? { ...r, number: values.number, capacity: values.capacity } : r));
      setToast("Room updated");
    }
    setOpenForm(false);
  };

  const confirmDelete = () => {
    if (!deletingRoom) return;
    setRooms(prev => prev.filter(r => r.id !== deletingRoom.id));
    setToast("Room deleted");
    setConfirmOpen(false);
  };

  return (
    <>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={handleAdd}>Add Room</Button>
      </Stack>
      <Grid container spacing={2}>
        {rooms.map((room) => {
          const occupancyLabel = `${room.occupants}/${room.capacity}`;
          const isFull = room.occupants >= room.capacity;
          return (
            <Grid key={room.id} item xs={12} sm={6} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6">Room {room.number}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={`Capacity ${room.capacity}`} size="small" />
                      <Chip label={`Occupancy ${occupancyLabel}`} color={isFull ? "warning" : "success"} size="small" />
                      <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
                        <Button size="small" variant="outlined" onClick={() => handleEdit(room)}>Edit</Button>
                        <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(room)}>Delete</Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <RoomFormDialog
        open={openForm}
        mode={formMode}
        initialValues={editingRoom ? { number: editingRoom.number, capacity: editingRoom.capacity } : undefined}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Room"
        message={`Are you sure you want to delete room ${deletingRoom?.number}? This cannot be undone.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast(null)}>
        <Alert severity="success" variant="filled">{toast}</Alert>
      </Snackbar>
    </>
  );
} 