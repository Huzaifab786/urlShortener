"use client";

import { Check, Copy, Loader2, Archive, ArchiveRestore, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCreateLinkModal } from "@/components/dashboard/create-link-provider";
import { LinksPagination } from "@/components/dashboard/links-pagination";
import { LinksToolbar } from "@/components/dashboard/links-toolbar";
import { Sparkline } from "@/components/dashboard/sparkline";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteLink, setLinkArchived } from "@/lib/actions/links";
import type { LinksFilter } from "@/lib/data/links";
import {
  absoluteShortUrl,
  formatShortUrl,
  tagLabel,
  type DashboardLink,
} from "@/lib/dashboard/types";
import type { LinkTag } from "@/types/database";
import { cn } from "@/lib/utils";

const TAG_STYLES: Record<LinkTag, string> = {
  social: "bg-blue-50 text-blue-700",
  email: "bg-violet-50 text-violet-700",
  marketing: "bg-amber-50 text-amber-800",
  personal: "bg-emerald-50 text-emerald-700",
  other: "bg-gray-100 text-gray-600",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncate(url: string, max = 42) {
  if (url.length <= max) return url;
  return `${url.slice(0, max - 1)}…`;
}

function CopyShortUrl({ shortCode }: { shortCode: string }) {
  const [copied, setCopied] = useState(false);
  const value = absoluteShortUrl(shortCode);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1 font-mono text-sm text-primary hover:underline"
      title="Copy short URL"
    >
      {formatShortUrl(shortCode)}
      {copied ? (
        <Check className="size-3.5 shrink-0" />
      ) : (
        <Copy className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  );
}

export function LinksTable({
  links,
  page,
  pageSize,
  totalCount,
  filter,
  q,
  queryString,
}: {
  links: DashboardLink[];
  page: number;
  pageSize: number;
  totalCount: number;
  filter: LinksFilter;
  q: string;
  queryString: string;
}) {
  const router = useRouter();
  const { openEditLink } = useCreateLinkModal();
  const [pendingDelete, setPendingDelete] = useState<DashboardLink | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [archivingId, setArchivingId] = useState<string | null>(null);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError(null);

    const result = await deleteLink(pendingDelete.id);
    setDeleting(false);

    if (!result.success) {
      setDeleteError(result.error ?? "Unable to delete link");
      return;
    }

    setPendingDelete(null);
    router.refresh();
  }

  async function toggleArchive(link: DashboardLink) {
    setArchivingId(link.id);
    await setLinkArchived(link.id, !link.is_archived);
    setArchivingId(null);
    router.refresh();
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <LinksToolbar currentFilter={filter} />
        {links.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            No links match this filter
            {q.trim() ? ` for “${q.trim()}”` : ""}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-background">
                  {[
                    "Name",
                    "Short URL",
                    "Original URL",
                    "Clicks",
                    "Created",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className={cn(
                        "px-4 py-3 text-[13px] font-medium text-muted-foreground",
                        heading === "Actions" && "text-right"
                      )}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {links.map((link) => {
                  const label =
                    link.title?.trim() ||
                    truncate(link.original_url, 36) ||
                    link.short_code;
                  const tag = tagLabel(link.tag);

                  return (
                    <tr
                      key={link.id}
                      className="group bg-card transition-colors hover:bg-secondary/60"
                    >
                      <td className="px-4 py-4 align-top">
                        <div
                          className={cn(
                            "text-sm font-medium text-foreground",
                            link.is_archived && "text-muted-foreground"
                          )}
                        >
                          {label}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          {tag && link.tag && (
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
                                TAG_STYLES[link.tag]
                              )}
                            >
                              {tag}
                            </span>
                          )}
                          {link.is_archived && (
                            <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-600">
                              Archived
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <CopyShortUrl shortCode={link.short_code} />
                      </td>
                      <td className="max-w-[200px] px-4 py-4 align-top">
                        <div
                          className="truncate text-sm text-muted-foreground"
                          title={link.original_url}
                        >
                          {truncate(link.original_url)}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex items-center gap-2.5">
                          <span className="min-w-[2ch] font-mono text-sm tabular-nums text-foreground">
                            {link.click_count.toLocaleString()}
                          </span>
                          <Sparkline data={link.clicks_7d} />
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(link.created_at)}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                          <ActionCopyButton shortCode={link.short_code} />
                          <button
                            type="button"
                            className="rounded p-1 text-muted-foreground hover:text-primary"
                            title="Edit"
                            onClick={() =>
                              openEditLink({
                                id: link.id,
                                original_url: link.original_url,
                                short_code: link.short_code,
                                title: link.title,
                              })
                            }
                          >
                            <Pencil className="size-5" />
                          </button>
                          <button
                            type="button"
                            className="rounded p-1 text-muted-foreground hover:text-primary disabled:opacity-50"
                            title={
                              link.is_archived ? "Unarchive" : "Archive"
                            }
                            disabled={archivingId === link.id}
                            onClick={() => void toggleArchive(link)}
                          >
                            {archivingId === link.id ? (
                              <Loader2 className="size-5 animate-spin" />
                            ) : link.is_archived ? (
                              <ArchiveRestore className="size-5" />
                            ) : (
                              <Archive className="size-5" />
                            )}
                          </button>
                          <button
                            type="button"
                            className="rounded p-1 text-muted-foreground hover:text-destructive"
                            title="Delete"
                            onClick={() => {
                              setDeleteError(null);
                              setPendingDelete(link);
                            }}
                          >
                            <Trash2 className="size-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <LinksPagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          queryString={queryString}
        />
      </div>

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setPendingDelete(null);
            setDeleteError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this link?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes{" "}
              <span className="font-mono text-foreground">
                {pendingDelete
                  ? formatShortUrl(pendingDelete.short_code)
                  : "this link"}
              </span>{" "}
              and its click history. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p className="text-sm text-destructive" role="alert">
              {deleteError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ActionCopyButton({ shortCode }: { shortCode: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(absoluteShortUrl(shortCode));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded p-1 text-muted-foreground hover:text-primary"
      title={copied ? "Copied!" : "Copy"}
    >
      {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
    </button>
  );
}
