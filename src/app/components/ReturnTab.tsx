import { useState, useRef } from "react";
import { returnRefundData, ReturnRefundItem, ReturnReason } from "./data";
import { formatRupiah, StatusBadge } from "./DashboardTab";
import { Lang, tr } from "./i18n";
import {
  ArrowLeft, Plus, X, Upload, FileText, Image, Video,
  CreditCard, ChevronRight, AlertCircle, CheckCircle2, Clock, XCircle,
} from "lucide-react";

const REASONS: ReturnReason[] = [
  "Barang Rusak / Damaged",
  "Barang Salah / Wrong Item",
  "Item Kurang / Missing Item",
  "Kualitas Tidak Sesuai / Quality Issue",
  "Lainnya / Other",
];

const STATUS_MAP: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  "Menunggu Review": { bg: "#fef3c7", color: "#d97706", icon: <Clock className="w-3 h-3" /> },
  "Diproses": { bg: "#dbeafe", color: "#2563eb", icon: <AlertCircle className="w-3 h-3" /> },
  "Disetujui": { bg: "#d1fae5", color: "#059669", icon: <CheckCircle2 className="w-3 h-3" /> },
  "Ditolak": { bg: "#fee2e2", color: "#dc2626", icon: <XCircle className="w-3 h-3" /> },
};

function ReturnStatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { bg: "#f3f4f6", color: "#6b7280", icon: null };
  return (
    <span className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: s.bg, color: s.color, fontSize: "0.7rem", fontWeight: 700 }}>
      {s.icon} {status}
    </span>
  );
}

// Detail modal for an existing return
function ReturnDetailModal({ item, onClose }: { item: ReturnRefundItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white w-full sm:max-w-2xl overflow-y-auto" style={{ borderRadius: "1.5rem 1.5rem 0 0", maxHeight: "92vh", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
        <div className="flex items-center gap-3 px-5 py-4 sticky top-0 bg-white" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", zIndex: 10 }}>
          <button onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "#f3f4f6", border: "none", cursor: "pointer", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }}>
            <ArrowLeft className="w-4 h-4" /> Kembali / Back
          </button>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#1a1d2e" }}>Return & Refund — {item.id}</h3>
            <p style={{ fontSize: "0.72rem", color: "#6b7280" }}>{item.submittedAt} · {item.orderId}</p>
          </div>
          <ReturnStatusBadge status={item.status} />
        </div>
        <div className="px-5 py-5 space-y-5">
          {/* Order info */}
          <div className="rounded-xl p-4 space-y-2" style={{ background: "#f8fafc", border: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Customer · Order ID</p>
                <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1a1d2e" }}>{item.customerName} — {item.orderId}</p>
              </div>
              <p style={{ fontSize: "1rem", fontWeight: 800, color: "#dc2626" }}>{formatRupiah(item.totalPrice)}</p>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#374151" }}>{item.itemName}</p>
          </div>
          {/* Reason */}
          <section>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: 8 }}>Alasan Return / Return Reason</p>
            <div className="rounded-xl px-4 py-3" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
              <p style={{ fontSize: "0.85rem", color: "#dc2626", fontWeight: 600 }}>{item.reason}</p>
            </div>
          </section>
          {/* Description */}
          <section>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: 8 }}>Deskripsi / Description</p>
            <div className="rounded-xl px-4 py-3" style={{ background: "#f8fafc", border: "1px solid rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: "0.85rem", color: "#374151", lineHeight: 1.6 }}>{item.description}</p>
            </div>
          </section>
          {/* Photos */}
          <section>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: 8 }}>Foto Item / Item Photos ({item.photos.length})</p>
            {item.photos.length > 0 ? (
              <div className="flex gap-3 flex-wrap">
                {item.photos.map((p, i) => (
                  <img key={i} src={p} alt="" className="rounded-xl object-cover" style={{ width: 100, height: 100, border: "1px solid rgba(0,0,0,0.08)" }} />
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "0.82rem", color: "#9ca3af" }}>Tidak ada foto</p>
            )}
          </section>
          {/* Video */}
          <section>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: 8 }}>Video Unboxing</p>
            {item.videoProof ? (
              <div className="rounded-xl px-4 py-3 flex items-center gap-2" style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
                <Video className="w-4 h-4" style={{ color: "#16a34a" }} />
                <span style={{ fontSize: "0.82rem", color: "#16a34a" }}>Video tersedia</span>
              </div>
            ) : (
              <p style={{ fontSize: "0.82rem", color: "#9ca3af" }}>Tidak ada video</p>
            )}
          </section>
          {/* Payment proof */}
          <section>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: 8 }}>Bukti Pembayaran / Payment Proof</p>
            {item.paymentProof ? (
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.08)", maxWidth: 240 }}>
                <img src={item.paymentProof} alt="Bukti pembayaran" className="w-full object-cover" style={{ maxHeight: 280 }} />
              </div>
            ) : (
              <p style={{ fontSize: "0.82rem", color: "#9ca3af" }}>Tidak ada bukti pembayaran</p>
            )}
          </section>
          {/* Admin action */}
          <section className="flex gap-3">
            <button className="flex-1 py-2.5 rounded-xl" style={{ background: "#d1fae5", color: "#059669", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer" }}>
              ✓ Setujui Refund
            </button>
            <button className="flex-1 py-2.5 rounded-xl" style={{ background: "#fee2e2", color: "#dc2626", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer" }}>
              ✕ Tolak
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

// Form to submit a new return request
function NewReturnForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (item: ReturnRefundItem) => void }) {
  const [orderId, setOrderId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [itemName, setItemName] = useState("");
  const [reason, setReason] = useState<ReturnReason>(REASONS[0]);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const proofRef = useRef<HTMLInputElement>(null);

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 10 - photos.length;
    files.slice(0, remaining).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handlePaymentProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPaymentProofUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: `REF-${Date.now()}`,
      orderId, customerName, itemName, reason, description,
      photos, videoProof: videoName, paymentProof: paymentProofUrl,
      status: "Menunggu Review",
      submittedAt: new Date().toISOString().split("T")[0],
      totalPrice: 0,
    });
    onClose();
  };

  const inputStyle = { border: "1.5px solid #e5e7eb", fontSize: "0.88rem", background: "#f9fafb", color: "#1a1d2e", outline: "none" };
  const focusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => (e.target.style.borderColor = "#2563eb");
  const blurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => (e.target.style.borderColor = "#e5e7eb");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white w-full sm:max-w-xl overflow-y-auto" style={{ borderRadius: "1.5rem 1.5rem 0 0", maxHeight: "92vh", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
        <div className="flex items-center gap-3 px-5 py-4 sticky top-0 bg-white" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", zIndex: 10 }}>
          <button onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "#f3f4f6", border: "none", cursor: "pointer", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }}>
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <h3 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#1a1d2e", flex: 1 }}>Ajukan Return & Refund</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
          {/* Order ID */}
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>No. Order <span style={{ color: "#dc2626" }}>*</span></label>
            <input required value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="e.g. ORD-001"
              className="w-full px-3 py-2.5 rounded-lg" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
          </div>
          {/* Customer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Nama Customer *</label>
              <input required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Nama customer"
                className="w-full px-3 py-2.5 rounded-lg" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
            </div>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Nama Barang *</label>
              <input required value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Nama barang"
                className="w-full px-3 py-2.5 rounded-lg" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
            </div>
          </div>
          {/* Reason */}
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Alasan Return / Return Reason *</label>
            <div className="flex flex-wrap gap-2">
              {REASONS.map((r) => (
                <button key={r} type="button" onClick={() => setReason(r)}
                  className="px-3 py-1.5 rounded-lg text-left"
                  style={{ background: reason === r ? "#fee2e2" : "#f3f4f6", color: reason === r ? "#dc2626" : "#374151", fontSize: "0.78rem", fontWeight: 600, border: `1.5px solid ${reason === r ? "#fca5a5" : "transparent"}`, cursor: "pointer" }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          {/* Description */}
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Deskripsi *</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
              placeholder="Jelaskan kondisi barang dan alasan return secara detail..."
              className="w-full px-3 py-2.5 rounded-lg resize-none"
              style={inputStyle as any} onFocus={focusHandler} onBlur={blurHandler} />
          </div>
          {/* Photos */}
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
              Foto Item ({photos.length}/10) — Maks. 10 foto
            </label>
            <div className="flex flex-wrap gap-3">
              {photos.map((p, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={p} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)" }} />
                  <button type="button" onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                    style={{ position: "absolute", top: -6, right: -6, background: "#dc2626", border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <X className="w-2.5 h-2.5" style={{ color: "#fff" }} />
                  </button>
                </div>
              ))}
              {photos.length < 10 && (
                <button type="button" onClick={() => photoRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-xl"
                  style={{ width: 80, height: 80, border: "2px dashed #d1d5db", background: "#f9fafb", cursor: "pointer" }}>
                  <Image className="w-4 h-4" style={{ color: "#9ca3af" }} />
                  <span style={{ fontSize: "0.58rem", color: "#9ca3af", marginTop: 3 }}>Tambah</span>
                </button>
              )}
            </div>
            <input ref={photoRef} type="file" accept="image/*" multiple onChange={handlePhotos} style={{ display: "none" }} />
          </div>
          {/* Video unboxing */}
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Video Unboxing</label>
            <button type="button" onClick={() => videoRef.current?.click()}
              className="flex items-center gap-2 px-4 py-3 rounded-xl w-full"
              style={{ border: "2px dashed #d1d5db", background: videoName ? "#f0fdf4" : "#f9fafb", cursor: "pointer" }}>
              <Video className="w-4 h-4" style={{ color: videoName ? "#16a34a" : "#9ca3af" }} />
              <span style={{ fontSize: "0.82rem", color: videoName ? "#16a34a" : "#9ca3af" }}>
                {videoName ? videoName : "Upload video unboxing (.mp4, .mov, .avi)"}
              </span>
            </button>
            <input ref={videoRef} type="file" accept="video/*"
              onChange={(e) => setVideoName(e.target.files?.[0]?.name ?? null)} style={{ display: "none" }} />
          </div>
          {/* Payment proof */}
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Bukti Pembayaran / Payment Proof</label>
            <button type="button" onClick={() => proofRef.current?.click()}
              className="flex items-center gap-2 px-4 py-3 rounded-xl w-full"
              style={{ border: "2px dashed #d1d5db", background: paymentProofUrl ? "#eff6ff" : "#f9fafb", cursor: "pointer", position: "relative", overflow: "hidden" }}>
              {paymentProofUrl ? (
                <>
                  <img src={paymentProofUrl} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
                  <span style={{ fontSize: "0.82rem", color: "#2563eb" }}>Bukti terlampir — klik untuk ganti</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" style={{ color: "#9ca3af" }} />
                  <span style={{ fontSize: "0.82rem", color: "#9ca3af" }}>Upload screenshot bukti pembayaran</span>
                </>
              )}
            </button>
            <input ref={proofRef} type="file" accept="image/*" onChange={handlePaymentProof} style={{ display: "none" }} />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl"
            style={{ background: "#dc2626", color: "#fff", fontWeight: 700, fontSize: "0.92rem", border: "none", cursor: "pointer" }}>
            Ajukan Return & Refund
          </button>
        </form>
      </div>
    </div>
  );
}

export function ReturnTab({ lang, onBack }: { lang: Lang; onBack?: () => void }) {
  const [returns, setReturns] = useState<ReturnRefundItem[]>(returnRefundData);
  const [selected, setSelected] = useState<ReturnRefundItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>("Semua");

  const statusFilters = ["Semua", "Menunggu Review", "Diproses", "Disetujui", "Ditolak"];
  const filtered = returns.filter((r) => filter === "Semua" || r.status === filter);

  return (
    <div className="space-y-5">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "#f3f4f6", border: "none", cursor: "pointer", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali — Dashboard
        </button>
      )}

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a1d2e" }}>Return & Refund</h2>
          <p style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: 2 }}>Kelola pengajuan return dan refund dari customer</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg"
          style={{ background: "#dc2626", color: "#fff", fontSize: "0.82rem", fontWeight: 600, border: "none", cursor: "pointer" }}>
          <Plus className="w-4 h-4" /> Ajukan Return Baru
        </button>
      </div>

      {/* Summary */}
      <div className="flex gap-3 flex-wrap">
        {statusFilters.slice(1).map((s) => {
          const count = returns.filter((r) => r.status === s).length;
          const st = STATUS_MAP[s];
          return (
            <div key={s} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: st.bg, border: `1px solid ${st.color}40` }}>
              <span style={{ color: st.color }}>{st.icon}</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: st.color }}>{s}: {count}</span>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className="px-3 py-1.5 rounded-full"
            style={{ background: filter === s ? "#dc2626" : "#f3f4f6", color: filter === s ? "#fff" : "#374151", fontSize: "0.75rem", fontWeight: 600, border: "none", cursor: "pointer" }}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div className="admin-table-wrapper">
          <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", minWidth: 780 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["ID", "Order ID", "Customer", "Nama Barang", "Alasan", "Nilai", "Tanggal", "Status", "Aksi"].map((h, hi) => (
                  <th key={h} className={hi === 8 ? "sticky-col" : ""}
                    style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.68rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid rgba(0,0,0,0.06)", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f9fafb")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}>
                  <td style={{ padding: "11px 14px", fontSize: "0.72rem", color: "#6b7280", fontFamily: "monospace", whiteSpace: "nowrap" }}>{item.id}</td>
                  <td style={{ padding: "11px 14px", fontSize: "0.75rem", color: "#6b7280", fontFamily: "monospace" }}>{item.orderId}</td>
                  <td style={{ padding: "11px 14px", fontSize: "0.85rem", color: "#1a1d2e", fontWeight: 600, whiteSpace: "nowrap" }}>{item.customerName}</td>
                  <td style={{ padding: "11px 14px", fontSize: "0.82rem", color: "#374151" }}>{item.itemName}</td>
                  <td style={{ padding: "11px 14px", fontSize: "0.75rem", color: "#dc2626", maxWidth: 160 }}>
                    <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.reason}</span>
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: "0.85rem", color: "#1a1d2e", fontWeight: 700, whiteSpace: "nowrap" }}>{formatRupiah(item.totalPrice)}</td>
                  <td style={{ padding: "11px 14px", fontSize: "0.75rem", color: "#6b7280", whiteSpace: "nowrap" }}>{item.submittedAt}</td>
                  <td style={{ padding: "11px 14px" }}><ReturnStatusBadge status={item.status} /></td>
                  <td className="sticky-col" style={{ padding: "11px 14px" }}>
                    <button onClick={() => setSelected(item)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap"
                      style={{ background: "#fee2e2", color: "#dc2626", fontSize: "0.72rem", fontWeight: 700, border: "none", cursor: "pointer" }}>
                      Detail <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>Tidak ada pengajuan return</p>
          </div>
        )}
      </div>

      {selected && <ReturnDetailModal item={selected} onClose={() => setSelected(null)} />}
      {showForm && (
        <NewReturnForm
          onClose={() => setShowForm(false)}
          onSubmit={(item) => { setReturns((prev) => [item, ...prev]); }}
        />
      )}
    </div>
  );
}
