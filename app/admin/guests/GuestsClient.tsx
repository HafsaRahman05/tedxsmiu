"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SortableTableRow, { persistSortableOrder } from "@/components/admin/SortableTableRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GuestProfile {
  id: string;
  guestName: string;
  guestType: string;
  roleTitle: string;
  organizationHeading: string | null;
  bioDetails: string | null;
  imageUrl: string | null;
  eventYear: number;
  sortOrder: number | null;
  status: string;
  createdAt: Date | string;
}

interface GuestsClientProps {
  initialGuests: GuestProfile[];
}

const emptyForm = {
  guestName: "",
  guestType: "VIP Guest",
  roleTitle: "",
  organizationHeading: "",
  bioDetails: "",
  imageUrl: "",
  eventYear: 2026,
  status: "ACTIVE",
};

export default function GuestsClient({ initialGuests }: GuestsClientProps) {
  const router = useRouter();
  const [guestsList, setGuestsList] = useState(initialGuests);
  const [editingGuest, setEditingGuest] = useState<GuestProfile | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const openCreateModal = () => {
    setEditingGuest(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (guest: GuestProfile) => {
    setEditingGuest(guest);
    setForm({
      guestName: guest.guestName,
      guestType: guest.guestType || "VIP Guest",
      roleTitle: guest.roleTitle,
      organizationHeading: guest.organizationHeading || "",
      bioDetails: guest.bioDetails || "",
      imageUrl: guest.imageUrl || "",
      eventYear: guest.eventYear || 2026,
      status: guest.status || "ACTIVE",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      ...form,
      organizationHeading: form.organizationHeading || null,
      bioDetails: form.bioDetails || null,
      imageUrl: form.imageUrl || null,
      eventYear: Number(form.eventYear),
    };

    try {
      const response = await fetch(
        editingGuest ? `/api/guests/${editingGuest.id}` : "/api/guests",
        {
          method: editingGuest ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save guest");

      if (editingGuest) {
        setGuestsList((current) =>
          current.map((guest) => (guest.id === editingGuest.id ? data : guest)),
        );
        toast.success("Guest profile updated");
      } else {
        setGuestsList((current) => [data, ...current]);
        toast.success("Guest profile added");
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save guest");
    }
  };

  const handleDelete = async (guest: GuestProfile) => {
    if (!confirm(`Remove ${guest.guestName} from the guest profiles?`)) return;

    try {
      const response = await fetch(`/api/guests/${guest.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete guest");
      setGuestsList((current) => current.filter((item) => item.id !== guest.id));
      toast.success("Guest profile removed");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete guest");
    }
  };

  const saveOrder = async (ids: string[]) => {
    const previousGuests = guestsList;
    const positions = new Map(ids.map((id, index) => [id, index]));
    setGuestsList((current) =>
      current
        .map((guest) => ({
          ...guest,
          sortOrder: ids.length - (positions.get(guest.id) ?? ids.length),
        }))
        .sort((first, second) =>
          (positions.get(first.id) ?? Number.MAX_SAFE_INTEGER) -
          (positions.get(second.id) ?? Number.MAX_SAFE_INTEGER),
        ),
    );
    setIsSavingOrder(true);

    try {
      await persistSortableOrder("guests", ids);
      toast.success("Guest display order saved");
      router.refresh();
    } catch (error) {
      setGuestsList(previousGuests);
      toast.error(error instanceof Error ? error.message : "Unable to save guest order");
    } finally {
      setIsSavingOrder(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-4xl font-black uppercase text-foreground">
            Guest Profiles
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage guest appearances and drag profiles to change their order on the website.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-none px-5 py-5 font-mono text-xs font-bold uppercase tracking-[0.15em]"
        >
          <Plus className="h-4 w-4" />
          Add Guest
        </Button>
      </div>

      <div className="overflow-x-auto rounded-none border border-border bg-card">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-10" aria-label="Reorder" />
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Photo</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Guest</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Guest Type / Role</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Year</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="text-right font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {guestsList.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={7} className="h-24 text-center font-mono text-sm text-muted-foreground">
                  No guest profiles yet.
                </TableCell>
              </TableRow>
            ) : (
              guestsList.map((guest) => (
                <SortableTableRow
                  key={guest.id}
                  id={guest.id}
                  ids={guestsList.map((item) => item.id)}
                  onReorder={saveOrder}
                  disabled={isSavingOrder}
                  className="border-border transition-colors hover:bg-secondary/20"
                >
                  <TableCell>
                    {guest.imageUrl ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border bg-background">
                        <Image src={guest.imageUrl} alt={guest.guestName} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border font-mono text-[9px] text-muted-foreground">
                        N/A
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-display text-base font-black uppercase text-foreground">{guest.guestName}</div>
                    {guest.organizationHeading && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{guest.organizationHeading}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-xs font-bold uppercase text-primary">{guest.guestType}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{guest.roleTitle}</p>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{guest.eventYear}</TableCell>
                  <TableCell>
                    <span className={`border px-2 py-1 font-mono text-[10px] font-bold uppercase ${
                      guest.status === "ACTIVE"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : "border-border bg-secondary text-muted-foreground"
                    }`}>
                      {guest.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(guest)}
                        className="h-8 w-8 rounded-none"
                        title="Edit guest"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(guest)}
                        className="h-8 w-8 rounded-none hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                        title="Delete guest"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </SortableTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-xl space-y-6 border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-display text-xl font-black uppercase">
                {editingGuest ? "Edit Guest" : "Add Guest"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="guest-name">Name</Label>
                  <Input id="guest-name" required minLength={2} value={form.guestName} onChange={(event) => setForm({ ...form, guestName: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest-role">Role / title</Label>
                  <Input id="guest-role" required minLength={2} value={form.roleTitle} onChange={(event) => setForm({ ...form, roleTitle: event.target.value })} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="guest-type">Guest type</Label>
                  <select id="guest-type" value={form.guestType} onChange={(event) => setForm({ ...form, guestType: event.target.value })} className="h-10 w-full border border-input bg-background px-3 text-sm">
                    <option>Chief Guest</option>
                    <option>Special Guest</option>
                    <option>VIP Guest</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest-year">Event year</Label>
                  <Input id="guest-year" type="number" min={1900} max={2200} required value={form.eventYear} onChange={(event) => setForm({ ...form, eventYear: Number(event.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest-organization">Organization</Label>
                <Input id="guest-organization" value={form.organizationHeading} onChange={(event) => setForm({ ...form, organizationHeading: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest-image">Image URL</Label>
                <Input id="guest-image" type="url" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest-bio">Bio</Label>
                <textarea id="guest-bio" rows={4} value={form.bioDetails} onChange={(event) => setForm({ ...form, bioDetails: event.target.value })} className="w-full border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest-status">Status</Label>
                <select id="guest-status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="h-10 w-full border border-input bg-background px-3 text-sm">
                  <option value="ACTIVE">Active — visible on website</option>
                  <option value="INACTIVE">Inactive — hidden on website</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">{editingGuest ? "Save Guest" : "Add Guest"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
