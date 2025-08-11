"use client";

import * as React from "react";
import { AppBar, Toolbar, Typography, Container, IconButton, Menu, MenuItem } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import BottomNav from "./BottomNav";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "@/contexts/AuthContext";

function getTitleFromPath(pathname: string): string {
  const first = "/" + (pathname.split("/")[1] || "");
  switch (first) {
    case "/tenants":
      return "Tenants";
    case "/rooms":
      return "Rooms";
    case "/payments":
      return "Payments";
    case "/settings":
      return "Settings";
    case "/dashboard":
      return "Dashboard";
    case "/login":
      return "Login";
    default:
      return "Roomie";
  }
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const title = getTitleFromPath(pathname);
  const isLogin = pathname === "/login";

  React.useEffect(() => {
    if (!isLogin && !isAuthenticated) {
      router.replace("/login");
    }
    if (isLogin && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLogin, router]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  if (isLogin) {
    return <Container component="main" sx={{ pt: 6, pb: 4 }}>{children}</Container>;
  }

  return (
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {isAuthenticated && (
            <>
              <IconButton color="inherit" onClick={handleMenu} aria-label="account menu">
                <AccountCircleIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <MenuItem onClick={() => { handleClose(); router.push("/settings"); }}>Settings</MenuItem>
                <MenuItem onClick={() => { handleClose(); logout(); router.replace("/login"); }}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ pt: 2, pb: "var(--app-bottom-nav-height)" }}>
        {children}
      </Container>
      <BottomNav />
    </>
  );
} 