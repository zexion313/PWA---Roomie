import * as React from "react";
import { Card, CardContent, Stack, Typography, Chip } from "@mui/material";

export default function TenantCard({
  name,
  phone,
  roomNumber,
  isAssigned
}: {
  name: string;
  phone?: string | null;
  roomNumber?: string | null;
  isAssigned: boolean;
}) {
  const roomLabel = isAssigned && roomNumber ? `Room ${roomNumber}` : "Unassigned";
  const roomColor = isAssigned ? "primary" : "default";

  return (
    <Card elevation={3}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight={700}>{name}</Typography>
            <Typography variant="body2" color="text.secondary">{phone || "—"}</Typography>
          </Stack>
          <Chip label={roomLabel} color={roomColor as any} variant={isAssigned ? "filled" : "outlined"} />
        </Stack>
      </CardContent>
    </Card>
  );
} 