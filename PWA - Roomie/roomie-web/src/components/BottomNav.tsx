"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PaymentsIcon from "@mui/icons-material/Payments";
import SettingsIcon from "@mui/icons-material/Settings";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", value: "/dashboard", icon: <DashboardIcon /> },
  { label: "Tenants", value: "/tenants", icon: <PeopleAltIcon /> },
  { label: "Rooms", value: "/rooms", icon: <MeetingRoomIcon /> },
  { label: "Payments", value: "/payments", icon: <PaymentsIcon /> },
  { label: "Settings", value: "/settings", icon: <SettingsIcon /> }
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const current = "/" + (pathname.split("/")[1] || "");

  return (
    <Paper elevation={8} sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        showLabels
        value={current}
        onChange={(e: React.SyntheticEvent, newValue: string) => {
          if (typeof newValue === "string" && newValue !== current) {
            router.push(newValue);
          }
        }}
      >
        {NAV_ITEMS.map((item) => (
          <BottomNavigationAction key={item.value} label={item.label} value={item.value} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
} 