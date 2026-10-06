"use client";

import { FormEvent, useEffect, useState } from "react";
import { MenuDots } from "@/components/MenuDots";
import { Modal } from "@/components/Modal";
import { PostCard } from "@/components/PostCard";
import type { FeedPost, PostLink } from "@/lib/news";

type EditablePost = FeedPost & { mine?: boolean };

const empty = { id: "", title: "", image: "", body: "", links: [] as PostLink[] };

export function NewsPanel() {
  const [posts, setPosts] = useState<EditablePost[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function reload() {
    const response = await fetch("/api/admin/posts");
    const data = await response.json();
    if (data.ok) setPosts(data.posts || []);
    else setMessage(data.message || "Não foi possível ler as notícias.");
  }

  useEffect(() => {
    reload().catch(() => setMessage("Não foi possível ler as notícias."));
  }, []);

  function startNew() {
    setEditing(false);
    setForm(empty);
    setMessage("");
    setOpen(true);
  }

  function edit(post: EditablePost) {
    setEditing(true);
    setMessage("");
    setForm({ id: post.id, title: post.title, image: post.image, body: post.body, links: post.links });
    setOpen(true);
  }

  async function upload(file: File) {
    setUploading(true);
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await response.json();
    setUploading(false);
    if (!data.ok) {
      setMessage(data.message || "Não foi possível enviar a imagem.");
      return;
    }
    setForm((current) => ({ ...current, image: data.image }));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        links: form.links.filter((link) => link.label.trim() && link.href.trim())
      })
    });
    const data = await response.json();
    setLoading(false);
    setMessage(data.message || "Não foi possível salvar.");
    if (data.ok) {
      setOpen(false);
      setForm(empty);
      reload().catch(() => undefined);
    }
  }

  async function remove(post: EditablePost) {
    const response = await fetch(`/api/admin/posts?id=${encodeURIComponent(post.id)}`, { method: "DELETE" });
    const data = await response.json();
    setMessage(data.message || "");
    if (data.ok) reload().catch(() => undefined);
  }

  const input = "mt-1 w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3 font-normal";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/70">O feed usa o mesmo card da página de notícias. Só o autor edita o próprio post.</p>
        <button type="button" className="rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black" onClick={startNew}>Nova notícia</button>
      </div>
      {message && !open ? <p className="text-sm text-yellow-100">{message}</p> : null}
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            menu={post.mine ? (
              <MenuDots
                items={[
                  { id: "edit", label: "Editar", onSelect: () => edit(post) },
                  { id: "delete", label: "Retirar", danger: true, onSelect: () => remove(post) }
                ]}
              />
            ) : undefined}
          />
        ))}
      </div>
      {open ? (
        <Modal title={editing ? `Editar ${form.title}` : "Nova notícia"} onClose={() => setOpen(false)}>
          <form onSubmit={save} className="space-y-3">
            <label className="block text-sm font-semibold">ID
              <input required maxLength={40} value={form.id} onChange={(event) => setForm({ ...form, id: event.target.value })} placeholder="aviso-wipe" className={input} readOnly={editing} />
            </label>
            <label className="block text-sm font-semibold">Título
              <input required maxLength={80} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className={input} />
            </label>
            <label className="block text-sm font-semibold">Imagem
              <input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="https://... ou /imagens/arquivo.png" className={input} />
            </label>
            <label className="block text-sm font-semibold text-white/80">Ou envie um arquivo
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="mt-1 block w-full text-sm" onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) upload(file).catch(() => setMessage("Não foi possível enviar a imagem."));
              }} />
            </label>
            {uploading ? <p className="text-sm text-white/70">Enviando imagem...</p> : null}
            {form.image ? <img src={form.image} alt="" className="h-32 w-full rounded-xl object-cover" /> : null}
            <label className="block text-sm font-semibold">Texto
              <textarea required maxLength={4000} value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} className={`${input} min-h-36 whitespace-pre-wrap`} />
            </label>
            <p className="text-sm text-white/60">A quebra de linha do texto é mantida. No card, o que passar da altura rola para baixo, sem abrir a página para o lado.</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Links</span>
                <button type="button" className="text-sm font-bold text-yellow-400" onClick={() => setForm({ ...form, links: [...form.links, { label: "", href: "" }].slice(0, 6) })}>Adicionar link</button>
              </div>
              {form.links.map((link, index) => (
                <div key={index} className="grid gap-2 sm:grid-cols-2">
                  <input value={link.label} maxLength={40} onChange={(event) => {
                    const links = [...form.links];
                    links[index] = { ...link, label: event.target.value };
                    setForm({ ...form, links });
                  }} placeholder="Texto do link" className={input} />
                  <input value={link.href} onChange={(event) => {
                    const links = [...form.links];
                    links[index] = { ...link, href: event.target.value };
                    setForm({ ...form, links });
                  }} placeholder="https://..." className={input} />
                </div>
              ))}
            </div>
            <button disabled={loading || uploading} className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black">{loading ? "Salvando..." : "Publicar"}</button>
            {message ? <p className="text-sm text-yellow-100">{message}</p> : null}
          </form>
        </Modal>
      ) : null}
    </div>
  );
}
