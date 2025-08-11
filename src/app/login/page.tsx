"use client";

import * as React from "react";
import { Box, Card, CardContent, Container, Stack, TextField, Typography, Button, Link, Alert } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) router.replace("/dashboard");
    else setError("Invalid email or password.");
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <Card elevation={6} sx={{ width: "100%" }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <Typography variant="h5" fontWeight={700} textAlign="center">Sign in to Roomie</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button size="large" type="submit" disabled={loading}>{loading ? "Signing in…" : "Log in"}</Button>
                <Box sx={{ textAlign: "center" }}>
                  <Link href="#" underline="hover">Forgot password?</Link>
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
} 