import Link from "next/link";
import { Card } from "@heroui/react";

const links = [
  { href: "/benefits/privileges", title: "Privileges", desc: "Infographic-style privilege copy blocks" },
  { href: "/benefits/perks", title: "Perks", desc: "Partner perk collections" },
  { href: "/benefits/tiers", title: "Tiers", desc: "Membership tier definitions" },
];

export default function BenefitsIndexPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Benefits</h1>
      <p className="text-sm text-phmc-text-muted">Manage privilege content shown in the mobile app demo.</p>
      <div className="grid gap-4 md:grid-cols-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            <Card className="h-full p-4 transition hover:shadow-md">
              <Card.Title>{l.title}</Card.Title>
              <Card.Description>{l.desc}</Card.Description>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
