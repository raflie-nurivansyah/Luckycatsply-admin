/* MARKER-MAKE-KIT-INVOKED */
import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { DashboardTab } from "./components/DashboardTab";
import { BuyerTab } from "./components/BuyerTab";
import { SellerTab } from "./components/SellerTab";
import { ShipTab } from "./components/ShipTab";
import { MarketingTab } from "./components/MarketingTab";
import { ChatTab } from "./components/ChatTab";
import { ReturnTab } from "./components/ReturnTab";
import { HistoryTab } from "./components/HistoryTab";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Lang, tr } from "./components/i18n";
import logoImg from "../imports/WhatsApp_Image_2026-06-04_at_7.23.48_PM-modified.png";
import {
  LayoutDashboard, ShoppingCart, Store, Truck, Megaphone,
  MessageSquare, RotateCcw, History,
  LogOut, ChevronDown, X, Menu,
} from "lucide-react";

type UserRole = "admin" | "buyer_admin" | "seller_admin" | "marketing_admin";
type Tab = "dashboard" | "buyer" | "seller" | "ship" | "marketing" | "chat" | "return" | "history";

const ROLE_LABELS: Record<UserRole, { id: string; en: string }> = {
  admin:           { id: "Super Admin",     en: "Super Admin" },
  buyer_admin:     { id: "Admin Buyer",     en: "Buyer Admin" },
  seller_admin:    { id: "Admin Seller",    en: "Seller Admin" },
  marketing_admin: { id: "Admin Marketing", en: "Marketing Admin" },
};

const ROLE_AVATARS: Record<UserRole, string> = {
  admin: "SA", buyer_admin: "AB", seller_admin: "AS", marketing_admin: "MK",
};

function getAllLabels(lang: Lang) {
  return {
    dashboard: tr("dashboard", lang),
    buyer:     tr("buyer", lang),
    seller:    tr("seller", lang),
    ship:      tr("productToShip", lang),
    marketing: tr("marketing", lang),
    chat:      lang === "id" ? "Chat" : "Chat",
    return:    lang === "id" ? "Return & Refund" : "Return & Refund",
    history:   lang === "id" ? "Riwayat Transaksi" : "History",
  };
}

interface NavItem { id: Tab; icon: React.ReactNode; roles: UserRole[] }

const NAV_CONFIG: NavItem[] = [
  { id: "dashboard", icon: <LayoutDashboard className="w-4 h-4" />, roles: ["admin","buyer_admin","seller_admin","marketing_admin"] },
  { id: "buyer",     icon: <ShoppingCart className="w-4 h-4" />,    roles: ["admin","buyer_admin"] },
  { id: "seller",    icon: <Store className="w-4 h-4" />,           roles: ["admin","seller_admin"] },
  { id: "ship",      icon: <Truck className="w-4 h-4" />,           roles: ["admin","buyer_admin"] },
  { id: "marketing", icon: <Megaphone className="w-4 h-4" />,       roles: ["admin","marketing_admin"] },
  { id: "chat",      icon: <MessageSquare className="w-4 h-4" />,   roles: ["admin","buyer_admin","seller_admin"] },
  { id: "return",    icon: <RotateCcw className="w-4 h-4" />,       roles: ["admin","buyer_admin"] },
  { id: "history",   icon: <History className="w-4 h-4" />,         roles: ["admin"] },
];

export default function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("id");

  if (!userRole) {
    return (
      <LoginPage
        onLogin={(role) => {
          setUserRole(role);
          setActiveTab("dashboard");
        }}
      />
    );
  }

  const labels = getAllLabels(lang);
  const visibleNav = NAV_CONFIG.filter((n) => n.roles.includes(userRole));
  const roleLabel = ROLE_LABELS[userRole][lang];

  const handleLogout = () => { setUserRole(null); setProfileOpen(false); setSidebarOpen(false); };
  const goBack = () => setActiveTab("dashboard");

  // Navigate function used by DashboardTab — now supports "history"
  const navigate = (tab: "buyer" | "seller" | "history") => setActiveTab(tab);

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab onNavigate={navigate} userRole={userRole} lang={lang} />;
      case "buyer":     return <BuyerTab lang={lang} onBack={goBack} />;
      case "seller":    return <SellerTab lang={lang} onBack={goBack} />;
      case "ship":      return <ShipTab lang={lang} onBack={goBack} />;
      case "marketing": return <MarketingTab lang={lang} onBack={goBack} />;
      case "chat":      return <ChatTab lang={lang} onBack={goBack} />;
      case "return":    return <ReturnTab lang={lang} onBack={goBack} />;
      case "history":   return <HistoryTab lang={lang} onBack={goBack} />;
      default:          return <DashboardTab onNavigate={navigate} userRole={userRole} lang={lang} />;
    }
  };

  const currentTabLabel = labels[activeTab] ?? labels.dashboard;

  // Unread count for chat badge
  const chatUnread = 3; // mock — replace with real count from data

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f4f6fb" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-40 flex flex-col"
        style={{
          width: 230,
          background: "#1e2a4a",
          flexShrink: 0,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
        }}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2.5">
            <ImageWithFallback src={logoImg} alt="Luckycatsply Logo"
              style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            <div>
              <p style={{ color: "#e2e8f0", fontWeight: 800, fontSize: "0.85rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}>Luckycatsply</p>
              <p style={{ color: "#475569", fontSize: "0.6rem" }}>{tr("adminPanel", lang)}</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4 }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <p style={{ fontSize: "0.58rem", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 8px", marginBottom: 8 }}>
            Menu
          </p>
          {visibleNav.map((item) => {
            const isActive = activeTab === item.id;
            const isChat = item.id === "chat";
            return (
              <button key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: isActive ? "rgba(59,130,246,0.18)" : "transparent",
                  color: isActive ? "#60a5fa" : "#94a3b8",
                  border: isActive ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  position: "relative",
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span style={{ color: isActive ? "#60a5fa" : "#64748b" }}>{item.icon}</span>
                {labels[item.id]}
                {isChat && chatUnread > 0 && (
                  <span style={{ marginLeft: "auto", background: "#2563eb", color: "#fff", fontSize: "0.58rem", fontWeight: 700, borderRadius: 99, padding: "1px 6px" }}>
                    {chatUnread}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Language toggle */}
        <div className="px-3 pb-2">
          <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
            {(["id", "en"] as Lang[]).map((l) => (
              <button key={l} onClick={() => setLang(l)}
                style={{ flex: 1, padding: "6px 0", background: lang === l ? "rgba(59,130,246,0.25)" : "transparent", color: lang === l ? "#60a5fa" : "#64748b", fontSize: "0.72rem", fontWeight: 700, border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Profile */}
        <div className="px-3 pb-4 relative">
          <button onClick={() => setProfileOpen(!profileOpen)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontSize: "0.62rem", fontWeight: 700 }}>{ROLE_AVATARS[userRole]}</span>
            </div>
            <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
              <p style={{ color: "#e2e8f0", fontSize: "0.78rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{roleLabel}</p>
              <p style={{ color: "#64748b", fontSize: "0.62rem" }}>{userRole.replace("_admin", "")}</p>
            </div>
            <ChevronDown style={{ width: 14, height: 14, color: "#64748b", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} />
          </button>

          {profileOpen && (
            <div style={{ position: "absolute", bottom: "100%", left: 12, right: 12, marginBottom: 8, borderRadius: 12, overflow: "hidden", background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 -8px 24px rgba(0,0,0,0.3)" }}>
              <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <p style={{ color: "#e2e8f0", fontSize: "0.8rem", fontWeight: 600 }}>{roleLabel}</p>
                <p style={{ color: "#64748b", fontSize: "0.68rem" }}>{tr("activeAccount", lang)}</p>
              </div>
              <button onClick={handleLogout}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: "0.85rem", fontWeight: 500, transition: "background 0.15s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.1)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "none")}>
                <LogOut className="w-4 h-4" /> {tr("logout", lang)}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col min-w-0 overflow-hidden" style={{ flex: 1 }}>
        {/* Topbar */}
        <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 16px", background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.06)", height: 56, flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "#f3f4f6", border: "none", cursor: "pointer", padding: "7px 8px", borderRadius: 8 }}>
            <Menu className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ImageWithFallback src={logoImg} alt="Luckycatsply"
              style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} />
            <p style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1a1d2e", letterSpacing: "-0.01em" }}>
              {currentTabLabel}
            </p>
          </div>
          <div style={{ flex: 1 }} />
          {/* Language toggle */}
          <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1.5px solid #e5e7eb" }}>
            {(["id", "en"] as Lang[]).map((l) => (
              <button key={l} onClick={() => setLang(l)}
                style={{ padding: "4px 10px", background: lang === l ? "#1e2a4a" : "transparent", color: lang === l ? "#fff" : "#6b7280", fontSize: "0.7rem", fontWeight: 700, border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {l}
              </button>
            ))}
          </div>
          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: "0.58rem", fontWeight: 700 }}>{ROLE_AVATARS[userRole]}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto" style={{ padding: "16px", paddingBottom: 32 }}
          onClick={() => profileOpen && setProfileOpen(false)}>
          {renderTab()}
        </main>
      </div>
    </div>
  );
}
