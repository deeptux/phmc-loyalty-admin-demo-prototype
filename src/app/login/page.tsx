"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Label, TextField } from "@heroui/react";
import { useDemoAdminAuth } from "@/context/DemoAdminAuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, ready, login } = useDemoAdminAuth();
  const [email, setEmail] = useState("admin@phmc.demo");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email, password);
    if (!ok) {
      setError("Invalid credentials. Try admin@phmc.demo / demo123");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/brand/hospital-services.jpg)" }}
        />
        <div className="absolute inset-0 bg-phmc-primary/85" />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/logo-phmc.png"
              alt="PHMC"
              width={72}
              height={110}
              className="h-auto w-16 object-contain drop-shadow"
              priority
            />
            <div>
              <p className="text-xl font-extrabold">PHMC Privilege Admin</p>
              <p className="text-sm text-white/85">Perpetual Help Medical Center — Las Piñas</p>
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold leading-tight">
              Committed to excellence in member care
            </p>
            <p className="mt-3 max-w-md text-sm text-white/90">
              Demo admin portal aligned with the PHMC Privilege mobile experience — trust-first,
              care-forward, stakeholder-ready.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-phmc-surface-muted p-6">
        <Card className="w-full max-w-md border border-phmc-border p-6 shadow-lg">
          <Card.Header className="items-center text-center">
            <Image
              src="/brand/logo-phmc.png"
              alt="PHMC"
              width={56}
              height={86}
              className="mb-2 h-auto w-12 object-contain lg:hidden"
            />
            <Card.Title className="text-2xl text-phmc-primary">Sign in</Card.Title>
            <Card.Description>PHMC Privilege Admin — demo prototype</Card.Description>
          </Card.Header>
          <Card.Content>
            <form className="space-y-4" onSubmit={onSubmit}>
              <TextField isRequired>
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
              </TextField>
              <TextField isRequired>
                <Label>Password</Label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
              </TextField>
              {error ? <p className="text-sm text-phmc-danger">{error}</p> : null}
              <Button type="submit" variant="primary" className="w-full font-semibold">
                Sign in
              </Button>
            </form>
            <div className="mt-6 rounded-xl border border-phmc-border bg-phmc-surface-muted p-3 text-xs text-phmc-text-muted">
              <p className="font-semibold text-phmc-text">Demo accounts</p>
              <p>admin@phmc.demo · marketing@phmc.demo · support@phmc.demo</p>
              <p>Password: demo123</p>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
