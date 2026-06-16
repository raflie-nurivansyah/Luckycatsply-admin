import { useState } from "react";
import { buyerOrders, buyerChatThreads, BuyerOrder } from "./data";
import { StatusBadge, formatRupiah } from "./DashboardTab";
import { Lang, tr } from "./i18n";
import { ChatSection } from "./ChatSection";
import { X, Package, MapPin, User, CreditCard, FileText, Truck, Image, ChevronRight, ArrowLeft, MessageSquare, List } from "lucide-react";

function DetailModal({ order, onClose, lang }: { order: BuyerOrder; onClose: () => void; lang: Lang }) {
  const shippingSteps = ["Menunggu", "Diproses", "Dikirim", "Tiba", "Selesai"];
  const currentStep = shippingSteps.indexOf(order.shippingStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white w-full sm:max-w-2xl overflow-y-auto" style={{ borderRadius: "1.5rem 1.5rem 0 0", maxHeight: "92vh", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
        <div className="flex items-center gap-3 px-5 py-4 sticky top-0 bg-white" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", zIndex: 10 }}>
          <button onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "#f3f4f6", border: "none", cursor: "pointer", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }}>
            <ArrowLeft className="w-4 h-4" /> {tr("back", lang)}
          </button>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#1a1d2e" }}>{tr("orderDetail", lang)} — {order.id}</h3>
            <p style={{ fontSize: "0.72rem", color: "#6b7280" }}>{order.orderDate}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2" style={{ background: "#f3f4f6", border: "none", cursor: "pointer" }}>
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>
        <div className="px-5 py-5 space-y-5">
          {/* Customer */}
          <section>
            <div className="flex items-center gap-2 mb-2"><User className="w-4 h-4" style={{ color: "#2563eb" }} /><h4 style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>{tr("customerInfo", lang)}</h4></div>
            <div className="rounded-xl p-3 space-y-1.5" style={{ background: "#f8fafc", border: "1px solid rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1a1d2e" }}>{order.customerName}</p>
              <div className="flex gap-1.5"><MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#9ca3af" }} /><p style={{ fontSize: "0.8rem", color: "#6b7280" }}>{order.address}</p></div>
            </div>
          </section>
          {/* Item detail */}
          <section>
            <div className="flex items-center gap-2 mb-2"><Package className="w-4 h-4" style={{ color: "#2563eb" }} /><h4 style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>{tr("itemDetail", lang)}</h4></div>
            <div className="grid grid-cols-2 gap-2">
              {[["Nama Barang / Item Name", order.itemName], ["Jenis / Type", order.itemType], ["Ukuran / Size", order.size], ["Jumlah / Qty", `${order.quantity} pcs`], ["Total", formatRupiah(order.totalPrice)]].map(([label, val]) => (
                <div key={label} className="rounded-lg px-3 py-2.5" style={{ background: "#f8fafc", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <p style={{ fontSize: "0.65rem", color: "#9ca3af", fontWeight: 500 }}>{label}</p>
                  <p style={{ fontSize: "0.85rem", color: "#1a1d2e", fontWeight: 600, marginTop: 2 }}>{val}</p>
                </div>
              ))}
            </div>
          </section>
          {/* Photos */}
          <section>
            <div className="flex items-center gap-2 mb-2"><Image className="w-4 h-4" style={{ color: "#2563eb" }} /><h4 style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>{tr("itemPhotos", lang)}</h4></div>
            <div className="flex gap-3 flex-wrap">
              {order.itemPhotos.map((p, i) => <img key={i} src={p} alt="" className="rounded-xl object-cover" style={{ width: 100, height: 100, border: "1px solid rgba(0,0,0,0.08)" }} />)}
            </div>
          </section>
          {/* Payment */}
          <section>
            <div className="flex items-center gap-2 mb-2"><CreditCard className="w-4 h-4" style={{ color: "#2563eb" }} /><h4 style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>{tr("paymentProof", lang)} — {order.paymentMethod === "QR" ? tr("notaQR", lang) : tr("transferReceipt", lang)}</h4></div>
            {order.paymentProof
              ? <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.08)", maxWidth: 240 }}><img src={order.paymentProof} alt="Bukti pembayaran" className="w-full object-cover" style={{ maxHeight: 300 }} /><div className="px-3 py-1.5" style={{ background: "#f8fafc", borderTop: "1px solid rgba(0,0,0,0.06)" }}><p style={{ fontSize: "0.68rem", color: "#6b7280" }}>{order.paymentMethod === "QR" ? tr("screenshotQR", lang) : tr("screenshotTransfer", lang)}</p></div></div>
              : <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{tr("noPaymentProof", lang)}</p>}
          </section>
          {/* Notes */}
          {order.notes && order.notes !== "-" && (
            <section>
              <div className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4" style={{ color: "#2563eb" }} /><h4 style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>{tr("customerNotes", lang)}</h4></div>
              <div className="rounded-xl px-3 py-2.5" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}><p style={{ fontSize: "0.82rem", color: "#92400e" }}>{order.notes}</p></div>
            </section>
          )}
          {/* Shipping */}
          <section>
            <div className="flex items-center gap-2 mb-3"><Truck className="w-4 h-4" style={{ color: "#2563eb" }} /><h4 style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>{tr("shippingProgress", lang)}</h4></div>
            <div className="flex items-center gap-1 mb-3"><span style={{ fontSize: "0.78rem", color: "#6b7280" }}>{order.shippingService}</span><span style={{ color: "#d1d5db" }}>·</span><span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#374151" }}>{order.tracking !== "-" ? order.tracking : tr("noResi", lang)}</span></div>
            <div className="flex items-center">
              {shippingSteps.map((step, i) => {
                const done = i <= currentStep; const active = i === currentStep;
                return (
                  <div key={step} className="flex items-center" style={{ flex: i < shippingSteps.length - 1 ? 1 : "none" }}>
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: done ? "#2563eb" : "#e5e7eb", border: active ? "3px solid #93c5fd" : "none" }}>
                        {done && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                      <p style={{ fontSize: "0.58rem", color: done ? "#2563eb" : "#9ca3af", marginTop: 3, fontWeight: active ? 700 : 400, whiteSpace: "nowrap" }}>{step}</p>
                    </div>
                    {i < shippingSteps.length - 1 && <div style={{ flex: 1, height: 2, background: i < currentStep ? "#2563eb" : "#e5e7eb", margin: "0 2px", marginTop: -14 }} />}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function BuyerTab({ lang, onBack }: { lang: Lang; onBack?: () => void }) {
  const [activeSection, setActiveSection] = useState<"orders" | "chat">("orders");
  const [selectedOrder, setSelectedOrder] = useState<BuyerOrder | null>(null);
  const [search, setSearch] = useState("");

  const filtered = buyerOrders.filter(
    (o) => o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.itemName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
  );

  const COLS = [
    { key: "id", label: tr("orderID", lang), w: 90 },
    { key: "customer", label: tr("customer", lang), w: 130 },
    { key: "address", label: tr("address", lang), w: 160 },
    { key: "item", label: tr("itemName", lang), w: 130 },
    { key: "type", label: tr("type", lang), w: 80 },
    { key: "size", label: tr("size", lang), w: 70 },
    { key: "qty", label: tr("qty", lang), w: 50 },
    { key: "payment", label: tr("paymentVia", lang), w: 90 },
    { key: "notes", label: tr("notes", lang), w: 110 },
    { key: "tracking", label: tr("tracking", lang), w: 120 },
    { key: "date", label: tr("orderDate", lang), w: 90 },
    { key: "status", label: tr("status", lang), w: 90 },
    { key: "action", label: tr("action", lang), w: 80 },
  ];

  return (
    <div className="space-y-4">
      {/* Back button */}
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "#f3f4f6", border: "none", cursor: "pointer", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }}>
          <ArrowLeft className="w-3.5 h-3.5" /> {tr("back", lang)} — Dashboard
        </button>
      )}
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a1d2e" }}>{tr("buyerManagement", lang)}</h2>
          <p style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: 2 }}>{tr("buyerSubtitle", lang)}</p>
        </div>
        {/* Section toggle */}
        <div className="flex rounded-xl overflow-hidden" style={{ border: "1.5px solid #e5e7eb" }}>
          <button onClick={() => setActiveSection("orders")} className="flex items-center gap-1.5 px-3 py-2"
            style={{ background: activeSection === "orders" ? "#1e2a4a" : "#fff", color: activeSection === "orders" ? "#fff" : "#6b7280", fontSize: "0.8rem", fontWeight: 600, border: "none", cursor: "pointer" }}>
            <List className="w-3.5 h-3.5" /> {tr("orders", lang)}
          </button>
          <button onClick={() => setActiveSection("chat")} className="flex items-center gap-1.5 px-3 py-2"
            style={{ background: activeSection === "chat" ? "#1e2a4a" : "#fff", color: activeSection === "chat" ? "#fff" : "#6b7280", fontSize: "0.8rem", fontWeight: 600, border: "none", cursor: "pointer" }}>
            <MessageSquare className="w-3.5 h-3.5" /> {tr("chat", lang)}
            {buyerChatThreads.reduce((a, t) => a + t.unread, 0) > 0 && (
              <span style={{ background: "#2563eb", color: "#fff", fontSize: "0.58rem", fontWeight: 700, borderRadius: 99, padding: "0 5px", marginLeft: 2 }}>
                {buyerChatThreads.reduce((a, t) => a + t.unread, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeSection === "chat" ? (
        <ChatSection threads={buyerChatThreads} type="buyer" lang={lang} />
      ) : (
        <>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tr("search", lang)}
            className="rounded-lg px-3 py-2 outline-none w-full sm:w-64"
            style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", background: "#fff", color: "#1a1d2e" }}
            onFocus={(e) => (e.target.style.borderColor = "#2563eb")} onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} />

          <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {COLS.map((col) => (
                      <th key={col.key} style={{ padding: "10px 12px", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid rgba(0,0,0,0.06)", whiteSpace: "nowrap", minWidth: col.w }}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, i) => (
                    <tr key={order.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f9fafb")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}>
                      <td style={{ padding: "11px 12px", fontSize: "0.7rem", color: "#6b7280", fontFamily: "monospace", whiteSpace: "nowrap" }}>{order.id}</td>
                      <td style={{ padding: "11px 12px", fontSize: "0.82rem", color: "#1a1d2e", fontWeight: 600, whiteSpace: "nowrap" }}>{order.customerName}</td>
                      <td style={{ padding: "11px 12px", fontSize: "0.72rem", color: "#6b7280", maxWidth: 160 }}>
                        <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{order.address}</span>
                      </td>
                      <td style={{ padding: "11px 12px", fontSize: "0.82rem", color: "#374151", whiteSpace: "nowrap" }}>{order.itemName}</td>
                      <td style={{ padding: "11px 12px" }}><span className="px-2 py-0.5 rounded-full" style={{ background: "#e0e7ff", color: "#3730a3", fontSize: "0.65rem", fontWeight: 600, whiteSpace: "nowrap" }}>{order.itemType}</span></td>
                      <td style={{ padding: "11px 12px", fontSize: "0.82rem", color: "#374151", fontFamily: "monospace" }}>{order.size}</td>
                      <td style={{ padding: "11px 12px", fontSize: "0.82rem", color: "#374151", textAlign: "center" }}>{order.quantity}</td>
                      <td style={{ padding: "11px 12px" }}><span className="px-2 py-0.5 rounded-full" style={{ background: order.paymentMethod === "QR" ? "#fef3c7" : "#d1fae5", color: order.paymentMethod === "QR" ? "#d97706" : "#059669", fontSize: "0.65rem", fontWeight: 600, whiteSpace: "nowrap" }}>{order.paymentMethod}</span></td>
                      <td style={{ padding: "11px 12px", fontSize: "0.72rem", color: "#6b7280", maxWidth: 110 }}>
                        <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{order.notes || "–"}</span>
                      </td>
                      <td style={{ padding: "11px 12px", fontSize: "0.7rem", color: "#374151", whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 600 }}>{order.shippingService}</div>
                        <div style={{ color: "#9ca3af", fontSize: "0.65rem", fontFamily: "monospace" }}>{order.tracking !== "-" ? order.tracking : tr("noResiShort", lang)}</div>
                      </td>
                      <td style={{ padding: "11px 12px", fontSize: "0.72rem", color: "#6b7280", whiteSpace: "nowrap" }}>{order.orderDate}</td>
                      <td style={{ padding: "11px 12px" }}><StatusBadge status={order.shippingStatus} /></td>
                      <td style={{ padding: "11px 12px", position: "sticky", right: 0, background: "#fff", boxShadow: "-3px 0 8px rgba(0,0,0,0.06)" }}>
                        <button onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap"
                          style={{ background: "#dbeafe", color: "#2563eb", fontSize: "0.72rem", fontWeight: 700, border: "none", cursor: "pointer" }}>
                          {tr("showDetails", lang)} <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <div className="py-12 text-center"><p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>{tr("noData", lang)}</p></div>}
          </div>
        </>
      )}

      {selectedOrder && <DetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} lang={lang} />}
    </div>
  );
}
