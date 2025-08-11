"use client";

import * as React from "react";
import { Grid, Card, CardContent, Typography, Stack } from "@mui/material";

export default function DashboardPage() {
  const stats = [
    { label: "Tenants", value: 24 },
    { label: "Rooms", value: 12 },
    { label: "Occupied Rooms", value: 9 },
    { label: "Payments (This Month)", value: "$3,450" }
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((s) => (
        <Grid key={s.label} item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Stack>
                <Typography variant="overline" color="text.secondary">{s.label}</Typography>
                <Typography variant="h4" fontWeight={800}>{s.value}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
} 