"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button, Input, Label, TextField } from "@heroui/react";
import type { LoyaltyMember, MemberStatus, MemberTier } from "@phmc/demo-data";
import { MemberAvatar } from "@/components/members/MemberAvatar";
import { MemberStatusChip, MemberTierChip } from "@/components/StatusChips";
import { MAX_MEMBER_AVATAR_BYTES } from "@/lib/member-avatars";
import { formatDate, formatDateTime } from "@/lib/utils";

const WORKSPACE_ID = "admin-workspace";
const AVATAR_COLORS = ["#7c3aed", "#2563eb", "#059669", "#db2777", "#0891b2", "#006837", "#d97706"];
const TIERS: MemberTier[] = ["Silver", "Gold", "Platinum"];
const STATUSES: MemberStatus[] = ["active", "pending", "inactive"];

type Mode = "view" | "edit" | "create";

type Props = {
  member: LoyaltyMember | null;
  mode: Mode;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<LoyaltyMember> & { id?: string }) => void;
  onDelete?: (id: string) => void;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tier: MemberTier;
  status: MemberStatus;
  campus: string;
  pointsBalance: string;
  notes: string;
};

function emptyForm(): FormState {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    tier: "Silver",
    status: "pending",
    campus: "Las Piñas Main",
    pointsBalance: "0",
    notes: "",
  };
}

function memberToForm(member: LoyaltyMember): FormState {
  return {
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    phone: member.phone,
    tier: member.tier,
    status: member.status,
    campus: member.campus,
    pointsBalance: String(member.pointsBalance),
    notes: member.notes ?? "",
  };
}

export function MemberProfileDrawer({
  member,
  mode,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [editing, setEditing] = useState(mode === "edit" || mode === "create");
  const [form, setForm] = useState<FormState>(emptyForm());
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPortalEl(document.getElementById(WORKSPACE_ID));
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setVisible(false);
      setClosing(false);
      return;
    }
    setClosing(false);
    setEditing(mode === "edit" || mode === "create");
    if (member && mode !== "create") {
      setForm(memberToForm(member));
      setAvatarUrl(member.avatarUrl);
    } else if (mode === "create") {
      setForm(emptyForm());
      setAvatarUrl(undefined);
    }
    setAvatarUploadError(null);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen, member, mode]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setVisible(false);
    window.setTimeout(() => {
      onClose();
      setClosing(false);
    }, 280);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  const isCreate = mode === "create";
  const displayMember = member;
  const previewMember: Pick<LoyaltyMember, "firstName" | "lastName" | "avatarColor" | "avatarUrl"> =
    {
      firstName: form.firstName || (isCreate ? "New" : member?.firstName ?? ""),
      lastName: form.lastName || (isCreate ? "Member" : member?.lastName ?? ""),
      avatarColor: member?.avatarColor ?? AVATAR_COLORS[0],
      avatarUrl,
    };

  const handleAvatarFile = (file: File | undefined) => {
    if (!file) return;
    setAvatarUploadError(null);
    if (!file.type.startsWith("image/")) {
      setAvatarUploadError("Please choose an image file (JPG, PNG, or WebP).");
      return;
    }
    if (file.size > MAX_MEMBER_AVATAR_BYTES) {
      setAvatarUploadError("Image must be under 300 KB for this demo store.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setAvatarUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const pointsBalance = Number(form.pointsBalance) || 0;
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      tier: form.tier,
      status: form.status,
      campus: form.campus.trim(),
      pointsBalance,
      pointsLifetime: isCreate ? pointsBalance : (member?.pointsLifetime ?? pointsBalance),
      joinedAt: isCreate ? new Date().toISOString().slice(0, 10) : member!.joinedAt,
      avatarColor: isCreate
        ? AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
        : member!.avatarColor,
      avatarUrl,
      cardsLinked: isCreate ? 0 : member!.cardsLinked,
      vouchersRedeemed: isCreate ? 0 : member!.vouchersRedeemed,
      notes: form.notes.trim() || undefined,
      id: member?.id,
    };
    onSave(payload);
    handleClose();
  };

  if ((!isOpen && !closing) || !portalEl) return null;

  const panelOpen = visible && !closing;

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close profile drawer"
        className={`absolute inset-0 z-40 bg-black/25 transition-opacity duration-300 ${
          panelOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div className="pointer-events-none absolute inset-0 z-50 flex justify-end">
        <aside
          role="dialog"
          aria-modal="true"
          aria-label={isCreate ? "Add member" : "Member profile"}
          className={`pointer-events-auto relative flex h-full w-full max-w-xl flex-col border-l border-phmc-border bg-white shadow-2xl transition-transform duration-300 ease-out ${
            panelOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            type="button"
            aria-label="Close profile (slide right)"
            onClick={handleClose}
            className="absolute left-0 top-1/2 z-30 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-phmc-border bg-white text-phmc-primary shadow-lg transition hover:border-phmc-primary/40 hover:bg-phmc-surface-muted"
          >
            <ChevronRightIcon className="h-5 w-5" strokeWidth={2.5} />
          </button>

          <header className="border-b border-phmc-border bg-phmc-surface-muted/50 px-5 py-4">
            <div className="flex w-full items-start gap-4">
              {editing || (displayMember && !isCreate) ? (
                <MemberAvatar member={editing ? previewMember : displayMember!} size="xl" />
              ) : (
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-phmc-primary/15 text-2xl font-bold text-phmc-primary">
                  +
                </span>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-extrabold text-phmc-text">
                  {isCreate
                    ? "Add member"
                    : `${displayMember?.firstName} ${displayMember?.lastName}`}
                </h2>
                {!isCreate && displayMember ? (
                  <>
                    <p className="mt-0.5 text-sm text-phmc-text-muted">{displayMember.memberNumber}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <MemberTierChip tier={displayMember.tier} />
                      <MemberStatusChip status={displayMember.status} />
                    </div>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-phmc-text-muted">
                    Create a demo loyalty member record
                  </p>
                )}
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {editing ? (
              <div className="space-y-4 ml-4">
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-phmc-border bg-phmc-surface-muted/40 p-3">
                  <MemberAvatar member={previewMember} size="lg" />
                  <div className="min-w-0 flex-1">
                    <Label className="mb-1 block text-xs">Profile photo</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onPress={() => fileRef.current?.click()}
                      >
                        Upload photo
                      </Button>
                      {avatarUrl ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onPress={() => {
                            setAvatarUrl(undefined);
                            setAvatarUploadError(null);
                          }}
                        >
                          Remove
                        </Button>
                      ) : null}
                    </div>
                    {avatarUploadError ? (
                      <p className="mt-1 text-xs text-red-600">{avatarUploadError}</p>
                    ) : (
                      <p className="mt-1 text-xs text-phmc-text-muted">
                        Without a photo, initials on a color badge are shown.
                      </p>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleAvatarFile(e.target.files?.[0])}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField>
                    <Label>First name</Label>
                    <Input
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    />
                  </TextField>
                  <TextField>
                    <Label>Last name</Label>
                    <Input
                      value={form.lastName}
                      onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    />
                  </TextField>
                </div>
                <TextField>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </TextField>
                <TextField>
                  <Label>Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </TextField>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1 block">Tier</Label>
                    <select
                      className="w-full rounded-lg border border-phmc-border p-2 text-sm"
                      value={form.tier}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, tier: e.target.value as MemberTier }))
                      }
                    >
                      {TIERS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="mb-1 block">Status</Label>
                    <select
                      className="w-full rounded-lg border border-phmc-border p-2 text-sm capitalize"
                      value={form.status}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, status: e.target.value as MemberStatus }))
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <TextField>
                  <Label>Campus</Label>
                  <Input
                    value={form.campus}
                    onChange={(e) => setForm((f) => ({ ...f, campus: e.target.value }))}
                  />
                </TextField>
                <TextField>
                  <Label>Points balance</Label>
                  <Input
                    type="number"
                    value={form.pointsBalance}
                    onChange={(e) => setForm((f) => ({ ...f, pointsBalance: e.target.value }))}
                  />
                </TextField>
                <TextField>
                  <Label>Notes</Label>
                  <Input
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                </TextField>
              </div>
            ) : displayMember ? (
              <div className="space-y-6 ml-4">
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-phmc-text-muted">
                    Contact
                  </h3>
                  <dl className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-phmc-text-muted">Email</dt>
                      <dd className="text-right font-medium">{displayMember.email}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-phmc-text-muted">Phone</dt>
                      <dd className="text-right font-medium">{displayMember.phone}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-phmc-text-muted">Campus</dt>
                      <dd className="text-right font-medium">{displayMember.campus}</dd>
                    </div>
                  </dl>
                </section>

                <section>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-phmc-text-muted">
                    Membership
                  </h3>
                  <dl className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-phmc-text-muted">Joined</dt>
                      <dd className="font-medium">{formatDate(displayMember.joinedAt)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-phmc-text-muted">Last active</dt>
                      <dd className="font-medium">{formatDateTime(displayMember.lastActiveAt)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-phmc-text-muted">Points balance</dt>
                      <dd className="font-bold text-phmc-primary">
                        {displayMember.pointsBalance.toLocaleString()} pts
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-phmc-text-muted">Lifetime points</dt>
                      <dd className="font-medium">
                        {displayMember.pointsLifetime.toLocaleString()} pts
                      </dd>
                    </div>
                  </dl>
                </section>

                <section>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-phmc-text-muted">
                    Activity summary
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-phmc-border bg-phmc-surface-muted/50 p-3 text-center">
                      <p className="text-2xl font-extrabold text-phmc-text">
                        {displayMember.cardsLinked}
                      </p>
                      <p className="text-xs text-phmc-text-muted">Cards linked</p>
                    </div>
                    <div className="rounded-xl border border-phmc-border bg-phmc-surface-muted/50 p-3 text-center">
                      <p className="text-2xl font-extrabold text-phmc-text">
                        {displayMember.vouchersRedeemed}
                      </p>
                      <p className="text-xs text-phmc-text-muted">Vouchers redeemed</p>
                    </div>
                  </div>
                </section>

                {displayMember.notes ? (
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-phmc-text-muted">
                      Notes
                    </h3>
                    <p className="mt-2 rounded-xl border border-phmc-border bg-white p-3 text-sm text-phmc-text-muted">
                      {displayMember.notes}
                    </p>
                  </section>
                ) : null}
              </div>
            ) : null}
          </div>

          <footer className="flex flex-wrap gap-2 border-t border-phmc-border px-5 py-4 pb-15">
            {editing ? (
              <>
                <Button variant="ghost" onPress={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onPress={handleSave}
                  isDisabled={!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()}
                >
                  {isCreate ? "Create member" : "Save changes"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onPress={handleClose}>
                  Close
                </Button>
                <Button
                  variant="secondary"
                  onPress={() => {
                    if (displayMember) setForm(memberToForm(displayMember));
                    setEditing(true);
                  }}
                >
                  Edit
                </Button>
                {displayMember && onDelete ? (
                  <Button variant="danger-soft" onPress={() => onDelete(displayMember.id)}>
                    Delete
                  </Button>
                ) : null}
              </>
            )}
          </footer>
        </aside>
      </div>
    </>,
    portalEl
  );
}
