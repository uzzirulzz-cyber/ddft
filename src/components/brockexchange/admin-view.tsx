"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  CreditCard,
  BarChart3,
  Settings,
  Save,
  Coins,
  Wallet,
  MessageSquare,
  ShieldCheck,
  LogOut,
  Search,
  MoreVertical,
  Eye,
  Plus,
  Minus,
  Snowflake,
  Unlock,
  Bell,
  History,
  RefreshCw,
  Download,
  CheckCircle2,
  XCircle,
  Trophy,
  Activity,
  Clock,
  Send,
  Loader2,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { COINS } from "@/lib/market-data";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Section =
  | "dashboard" | "users" | "trades" | "payments"
  | "reports" | "settings" | "market" | "wallet" | "messaging" | "security";

const NAV: { id: Section; label: string; icon: any }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "trades", label: "Trades", icon: TrendingUp },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "market", label: "Market", icon: Coins },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "messaging", label: "Messaging", icon: MessageSquare },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "settings", label: "Settings", icon: Settings },
];

export function AdminView() {
  const { user, logout, navigate, apiFetch } = useAuth();
  const [section, setSection] = useState<Section>("dashboard");

  if (!user || user.role !== "SUPER_ADMIN") return null;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 border-r border-white/5 bg-[#02060f] flex-col">
        <div className="h-16 px-4 flex items-center border-b border-white/5">
          <Logo size={36} />
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map((n) => {
            const active = section === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setSection(n.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active ? "bg-[#ffd700]/15 text-[#ffed4e] border border-[#ffd700]/30" : "text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { logout(); navigate("home"); }}
            className="w-full text-red-400 justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-white/5 bx-glass flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="lg:hidden">
            <Logo size={32} />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-base font-semibold capitalize">{section}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-xs text-muted-foreground">Welcome,</span>
            <span className="text-sm font-semibold text-white">{user.name}</span>
            <Badge variant="outline" className="border-[#ffed4e]/40 text-[#ffed4e] text-[10px]">SUPER ADMIN</Badge>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="lg:hidden border-b border-white/5 overflow-x-auto">
          <div className="flex gap-1 p-2 min-w-max">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setSection(n.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap ${
                  section === n.id ? "bg-[#ffd700]/15 text-[#ffed4e]" : "text-muted-foreground"
                }`}
              >
                <n.icon className="h-3.5 w-3.5" />
                {n.label}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {section === "dashboard" && <DashboardSection apiFetch={apiFetch} />}
          {section === "users" && <UsersSection apiFetch={apiFetch} />}
          {section === "trades" && <TradesSection apiFetch={apiFetch} />}
          {section === "payments" && <PaymentsSection apiFetch={apiFetch} />}
          {section === "reports" && <ReportsSection apiFetch={apiFetch} />}
          {section === "settings" && <SettingsSection />}
          {section === "market" && <MarketSection apiFetch={apiFetch} />}
          {section === "wallet" && <WalletSection apiFetch={apiFetch} />}
          {section === "messaging" && <MessagingSection apiFetch={apiFetch} />}
          {section === "security" && <SecuritySection apiFetch={apiFetch} />}
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard section ────────────────────────────────────────
interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalAgents: number;
  totalTrades: number;
  activeTrades: number;
  revenue: number;
  totalDeposits: number;
  totalWithdrawals: number;
  todayDeposits: number;
  todayWithdrawals: number;
  winningTrades: number;
  losingTrades: number;
}

function DashboardSection({ apiFetch }: { apiFetch: any }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [series, setSeries] = useState<any[]>([]);
  const [coinVol, setCoinVol] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetResult, setResetResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
        setSeries(data.revenueSeries || []);
        setCoinVol(data.coinVolume || []);
      }
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
     
  }, []);

  const handleReset = async () => {
    setResetting(true);
    setResetResult(null);
    try {
      const res = await apiFetch("/api/admin/reset", {
        method: "POST",
        body: JSON.stringify({ confirm: "RESET_ALL_DATA" }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetResult({ type: "success", text: data.message || "Platform reset to zero successfully" });
        setShowReset(false);
        setResetConfirm("");
        setTimeout(() => { fetch(); window.location.reload(); }, 2000);
      } else {
        setResetResult({ type: "error", text: data.error || "Reset failed" });
      }
    } catch (e: any) {
      setResetResult({ type: "error", text: e.message });
    }
    setResetting(false);
  };

  const cards: { label: string; value: string | number; icon: any; color: string }[] = stats
    ? [
        { label: "Total Users", value: stats.totalUsers, icon: Users, color: "from-[#ffd700] to-[#f0c000]" },
        { label: "Active Users", value: stats.activeUsers, icon: Activity, color: "from-[#10b981] to-[#047857]" },
        { label: "Total Agents", value: stats.totalAgents, icon: ShieldCheck, color: "from-[#ffed4e] to-[#e6b800]" },
        { label: "Total Trades", value: stats.totalTrades, icon: TrendingUp, color: "from-[#f59e0b] to-[#b45309]" },
        { label: "Active Trades", value: stats.activeTrades, icon: Activity, color: "from-[#ffd700] to-[#f0c000]" },
        { label: "Revenue", value: `$${stats.revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: Wallet, color: "from-[#10b981] to-[#047857]" },
        { label: "Total Deposits", value: `$${stats.totalDeposits.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: CreditCard, color: "from-[#ffed4e] to-[#e6b800]" },
        { label: "Total Withdrawals", value: `$${stats.totalWithdrawals.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: CreditCard, color: "from-[#ef4444] to-[#991b1b]" },
        { label: "Today's Deposits", value: `$${stats.todayDeposits.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: CreditCard, color: "from-[#ffed4e] to-[#e6b800]" },
        { label: "Today's Withdrawals", value: `$${stats.todayWithdrawals.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: CreditCard, color: "from-[#ef4444] to-[#991b1b]" },
        { label: "Winning Trades", value: stats.winningTrades, icon: Trophy, color: "from-[#10b981] to-[#047857]" },
        { label: "Losing Trades", value: stats.losingTrades, icon: XCircle, color: "from-[#ef4444] to-[#991b1b]" },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Platform overview at a glance.</p>
        <Button size="sm" variant="outline" onClick={fetch} disabled={loading} className="border-white/10">
          <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bx-glass rounded-xl p-4 h-24 animate-pulse" />
            ))
          : cards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="bx-glass p-3 relative overflow-hidden border-white/5 h-full">
                  <div className={`absolute -top-4 -right-4 h-16 w-16 rounded-full bg-gradient-to-br ${c.color} opacity-20 blur-xl`} />
                  <div className="relative">
                    <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center mb-2`}>
                      <c.icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-lg font-bold">{c.value}</div>
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{c.label}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <Card className="bx-glass p-4 border-white/5">
          <h3 className="text-sm font-semibold mb-3">Revenue (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="admin-rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffd700" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#ffd700" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" stroke="#8896b3" fontSize={11} />
                <YAxis stroke="#8896b3" fontSize={11} />
                <RechartsTooltip
                  contentStyle={{ background: "#0a1322", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: any) => [`$${Number(v).toFixed(2)}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ffd700" strokeWidth={2} fill="url(#admin-rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bx-glass p-4 border-white/5">
          <h3 className="text-sm font-semibold mb-3">Top Coins by Volume</h3>
          <div className="space-y-2">
            {coinVol.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">No data yet.</p>
            ) : (
              coinVol.map((c) => (
                <div key={c.symbol} className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs">
                  <span className="font-semibold">{c.symbol}</span>
                  <Badge variant="outline" className="text-[10px] border-[#ffed4e]/40 text-[#ffed4e]">
                    {c.count} trades
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Reset Platform to Zero — Danger Zone */}
      <Card className="bx-glass p-4 border-red-500/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/15 shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-400">Danger Zone — Reset Dashboard to Zero</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Permanently delete ALL data (users, trades, transactions, messages, logs). Only default accounts (1 Super Admin + 5 Sub-Agents) will remain.
              </p>
            </div>
          </div>
          {!showReset ? (
            <Button variant="outline" size="sm" className="border-red-500/40 text-red-400 hover:bg-red-500/10 shrink-0" onClick={() => setShowReset(true)}>
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Reset to Zero
            </Button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder='Type "RESET"'
                value={resetConfirm}
                onChange={(e) => setResetConfirm(e.target.value)}
                className="h-8 w-24 px-2 text-xs rounded bg-white/5 border border-white/10"
                autoFocus
              />
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white h-8" disabled={resetConfirm !== "RESET" || resetting} onClick={handleReset}>
                {resetting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Reset Now"}
              </Button>
              <Button variant="outline" size="sm" className="h-8" onClick={() => { setShowReset(false); setResetConfirm(""); }}>Cancel</Button>
            </div>
          )}
        </div>
        {resetResult && (
          <div className={`mt-3 rounded-lg px-3 py-2 text-xs ${resetResult.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            {resetResult.text}
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── Users section ────────────────────────────────────────────
interface AdminUser {
  id: string;
  uid: string;
  email: string;
  name: string;
  role: string;
  status: string;
  balance: number;
  vipLevel: number;
  _count?: { trades: number };
  createdAt: string;
}

function UsersSection({ apiFetch }: { apiFetch: any }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionUser, setActionUser] = useState<AdminUser | null>(null);
  const [actionType, setActionType] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(query ? `/api/admin/users?q=${encodeURIComponent(query)}` : "/api/admin/users");
      const data = await res.json();
      if (res.ok) setUsers(data.users || []);
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300);
    return () => clearTimeout(t);
     
  }, [query]);

  const openAction = (u: AdminUser, action: string) => {
    setActionUser(u);
    setActionType(action);
    setAmount("");
  };

  const runAction = async () => {
    if (!actionUser) return;
    setProcessing(true);
    try {
      let res;
      if (actionType === "CREDIT" || actionType === "DEBIT" || actionType === "FREEZE_ACCOUNT" || actionType === "UNFREEZE_ACCOUNT") {
        res = await apiFetch("/api/admin/wallet", {
          method: "PATCH",
          body: JSON.stringify({
            action: actionType,
            targetUserId: actionUser.id,
            amount: amount ? Number(amount) : undefined,
          }),
        });
      } else if (actionType === "SEND_NOTIFICATION") {
        res = await apiFetch("/api/admin/notifications", {
          method: "POST",
          body: JSON.stringify({
            userId: actionUser.id,
            title: "Admin Message",
            body: amount || "You have a new message from the admin team.",
            type: "info",
          }),
        });
      } else {
        toast.info("Feature coming soon");
        setProcessing(false);
        setActionUser(null);
        return;
      }
      const data = await res.json();
      if (res.ok) {
        toast.success(`Action ${actionType} completed`);
        fetchUsers();
        setActionUser(null);
      } else {
        toast.error(data.error || "Failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setProcessing(false);
    }
  };

  const needsAmount = actionType === "CREDIT" || actionType === "DEBIT";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by UID, email, name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-white/5 border-white/10"
          />
        </div>
        <Button size="sm" variant="outline" onClick={fetchUsers} className="border-white/10">
          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
        </Button>
      </div>

      <div className="bx-glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-white/5 sticky top-0 bg-[#0a1322] z-10">
              <tr>
                <th className="text-left font-medium py-3 px-3">Name</th>
                <th className="text-left font-medium py-3 px-3 hidden sm:table-cell">UID</th>
                <th className="text-left font-medium py-3 px-3">Role</th>
                <th className="text-right font-medium py-3 px-3">Balance</th>
                <th className="text-right font-medium py-3 px-3 hidden sm:table-cell">Trades</th>
                <th className="text-center font-medium py-3 px-3">Status</th>
                <th className="text-right font-medium py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">No users.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 text-xs">
                    <td className="py-2 px-3">
                      <div className="font-medium text-white">{u.name}</div>
                      <div className="text-[10px] text-muted-foreground">{u.email}</div>
                    </td>
                    <td className="py-2 px-3 font-mono text-[10px] hidden sm:table-cell">{u.uid}</td>
                    <td className="py-2 px-3">
                      <Badge variant="outline" className="text-[10px] border-[#ffed4e]/40 text-[#ffed4e]">{u.role}</Badge>
                    </td>
                    <td className="py-2 px-3 text-right font-mono">${u.balance.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right hidden sm:table-cell">{u._count?.trades || 0}</td>
                    <td className="py-2 px-3 text-center">
                      <Badge variant="outline" className={`text-[10px] ${u.status === "ACTIVE" ? "border-emerald-400/40 text-emerald-400" : u.status === "FROZEN" ? "border-[#f59e0b]/40 text-[#f59e0b]" : "border-red-400/40 text-red-400"}`}>
                        {u.status}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-7 w-7">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-[#0a1322] border-white/10">
                          <DropdownMenuItem onClick={() => toast.info(`UID: ${u.uid}`)}>
                            <Eye className="mr-2 h-3.5 w-3.5" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAction(u, "CREDIT")}>
                            <Plus className="mr-2 h-3.5 w-3.5" /> Add Balance
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAction(u, "DEBIT")}>
                            <Minus className="mr-2 h-3.5 w-3.5" /> Deduct Balance
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAction(u, "FREEZE_ACCOUNT")}>
                            <Snowflake className="mr-2 h-3.5 w-3.5" /> Freeze Account
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAction(u, "UNFREEZE_ACCOUNT")}>
                            <Unlock className="mr-2 h-3.5 w-3.5" /> Unfreeze Account
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAction(u, "SEND_NOTIFICATION")}>
                            <Bell className="mr-2 h-3.5 w-3.5" /> Send Notification
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toast.info("Open History view")}>
                            <History className="mr-2 h-3.5 w-3.5" /> Trading History
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Login logs")}>
                            <Eye className="mr-2 h-3.5 w-3.5" /> Login History
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action dialog */}
      <Dialog open={!!actionUser} onOpenChange={(o) => !o && setActionUser(null)}>
        <DialogContent className="bx-glass border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {actionType === "CREDIT" && "Add Balance"}
              {actionType === "DEBIT" && "Deduct Balance"}
              {actionType === "FREEZE_ACCOUNT" && "Freeze Account"}
              {actionType === "UNFREEZE_ACCOUNT" && "Unfreeze Account"}
              {actionType === "SEND_NOTIFICATION" && "Send Notification"}
            </DialogTitle>
            <DialogDescription>
              {actionUser?.name} ({actionUser?.uid})
            </DialogDescription>
          </DialogHeader>
          {needsAmount && (
            <div className="space-y-1.5">
              <Label className="text-xs">Amount (USD)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/5 border-white/10"
                placeholder="100.00"
                autoFocus
              />
            </div>
          )}
          {actionType === "SEND_NOTIFICATION" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Message</Label>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/5 border-white/10"
                placeholder="Enter your message"
                autoFocus
              />
            </div>
          )}
          {(actionType === "FREEZE_ACCOUNT" || actionType === "UNFREEZE_ACCOUNT") && (
            <p className="text-xs text-muted-foreground">
              {actionType === "FREEZE_ACCOUNT"
                ? "The user will be unable to login or trade until unfrozen."
                : "The user account will be restored to active status."}
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionUser(null)} className="border-white/10">
              Cancel
            </Button>
            <Button onClick={runAction} disabled={processing} className="bx-blue-gradient text-white border-0">
              {processing ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Trades section ───────────────────────────────────────────
function TradesSection({ apiFetch }: { apiFetch: any }) {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [settingTrade, setSettingTrade] = useState<string | null>(null);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/trades${filter !== "ALL" ? `?status=${filter}` : ""}`);
      const data = await res.json();
      if (res.ok) setTrades(data.trades || []);
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [filter]);

  const setResult = async (tradeId: string, result: "WIN" | "LOSE") => {
    setSettingTrade(tradeId);
    try {
      const res = await apiFetch("/api/admin/trades/set-winlose", {
        method: "POST",
        body: JSON.stringify({ tradeId, result }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Trade ${tradeId} set to ${result}`);
        fetchTrades();
      } else {
        toast.error(data.error || "Failed to set result");
      }
    } catch (e: any) {
      toast.error(e.message);
    }
    setSettingTrade(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {["ALL", "ACTIVE", "SETTLED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              filter === f ? "bg-[#ffd700]/20 text-[#ffd700]" : "bg-white/5 text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "ALL" ? "All Trades" : f}
          </button>
        ))}
        <Button size="sm" variant="outline" onClick={fetchTrades} className="border-white/10 ml-auto">
          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bx-glass rounded-xl p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase">Total</p>
          <p className="text-xl font-bold text-[#ffd700]">{trades.length}</p>
        </div>
        <div className="bx-glass rounded-xl p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase">Wins</p>
          <p className="text-xl font-bold text-emerald-400">{trades.filter(t => t.result === "WIN").length}</p>
        </div>
        <div className="bx-glass rounded-xl p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase">Losses</p>
          <p className="text-xl font-bold text-red-400">{trades.filter(t => t.result === "LOSE").length}</p>
        </div>
      </div>

      <div className="bx-glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="text-muted-foreground border-b border-white/5 sticky top-0 bg-[#0a1322] z-10">
              <tr>
                <th className="text-left font-medium py-2 px-3">Trade ID</th>
                <th className="text-left font-medium py-2 px-3">User</th>
                <th className="text-left font-medium py-2 px-3">Pair</th>
                <th className="text-center font-medium py-2 px-3">Dir</th>
                <th className="text-right font-medium py-2 px-3">Amount</th>
                <th className="text-center font-medium py-2 px-3">Status</th>
                <th className="text-right font-medium py-2 px-3">P/L</th>
                <th className="text-center font-medium py-2 px-3">Admin Control</th>
                <th className="text-left font-medium py-2 px-3 hidden sm:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
              ) : trades.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">No trades.</td></tr>
              ) : (
                trades.map((t) => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 px-3 font-mono text-[10px]">{t.tradeId}</td>
                    <td className="py-2 px-3">
                      <div className="font-medium">{t.user?.name}</div>
                      <div className="text-[10px] text-muted-foreground">{t.user?.uid}</div>
                    </td>
                    <td className="py-2 px-3 font-semibold">{t.symbol}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={t.direction === "UP" ? "text-emerald-400" : "text-red-400"}>
                        {t.direction === "UP" ? "▲ UP" : "▼ DOWN"}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono">${t.amount.toFixed(2)}</td>
                    <td className="py-2 px-3 text-center">
                      <Badge variant="outline" className={`text-[10px] ${t.status === "ACTIVE" ? "border-[#ffed4e]/40 text-[#ffed4e]" : t.result === "WIN" ? "border-emerald-400/40 text-emerald-400" : "border-red-400/40 text-red-400"}`}>
                        {t.status === "ACTIVE" ? "Active" : t.result}
                      </Badge>
                    </td>
                    <td className={`py-2 px-3 text-right font-mono ${t.profit > 0 ? "text-emerald-400" : t.profit < 0 ? "text-red-400" : ""}`}>
                      {t.status === "SETTLED" ? `${t.profit >= 0 ? "+" : ""}$${t.profit.toFixed(2)}` : "—"}
                    </td>
                    {/* Admin Win/Lose control */}
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setResult(t.tradeId, "WIN")}
                          disabled={settingTrade === t.tradeId}
                          className="px-2 py-1 text-[10px] rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50 font-semibold"
                          title="Force settle as WIN"
                        >
                          {settingTrade === t.tradeId ? "..." : "SET WIN"}
                        </button>
                        <button
                          onClick={() => setResult(t.tradeId, "LOSE")}
                          disabled={settingTrade === t.tradeId}
                          className="px-2 py-1 text-[10px] rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 font-semibold"
                          title="Force settle as LOSE"
                        >
                          {settingTrade === t.tradeId ? "..." : "SET LOSE"}
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-[10px] text-muted-foreground hidden sm:table-cell">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info banner */}
      <div className="bx-glass rounded-xl p-4 border-l-2 border-[#ffd700]">
        <p className="text-xs text-muted-foreground">
          <strong className="text-[#ffd700]">Admin Control:</strong> Use "SET WIN" or "SET LOSE" buttons to manually settle any trade.
          This overrides the automatic settlement. The user's wallet balance will be updated immediately and they will receive a notification.
          If the trade was already settled, the previous result will be reversed before applying the new one.
        </p>
      </div>
    </div>
  );
}

// ─── Payments section ─────────────────────────────────────────
function PaymentsSection({ apiFetch }: { apiFetch: any }) {
  const [tab, setTab] = useState("deposits");
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const [dRes, wRes] = await Promise.all([
        apiFetch("/api/admin/deposits?status=PENDING"),
        apiFetch("/api/admin/withdrawals?status=PENDING"),
      ]);
      const dData = await dRes.json();
      const wData = await wRes.json();
      if (dRes.ok) setDeposits(dData.deposits || []);
      if (wRes.ok) setWithdrawals(wData.withdrawals || []);
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
     
  }, []);

  const handleAction = async (type: "deposit" | "withdrawal", id: string, action: "APPROVE" | "REJECT") => {
    const url = type === "deposit" ? "/api/admin/deposits" : "/api/admin/withdrawals";
    try {
      const res = await apiFetch(url, {
        method: "PATCH",
        body: JSON.stringify({ transactionId: id, action }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`${type} ${action.toLowerCase()}`);
        fetch();
      } else {
        toast.error(data.error || "Failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const renderRows = (items: any[], type: "deposit" | "withdrawal") => {
    if (loading) return <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</td></tr>;
    if (items.length === 0) return <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No pending {type}s.</td></tr>;
    return items.map((t) => (
      <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 text-xs">
        <td className="py-2 px-3 font-mono text-[10px]">{t.txId}</td>
        <td className="py-2 px-3">
          <div className="font-medium">{t.user?.name}</div>
          <div className="text-[10px] text-muted-foreground">{t.user?.uid}</div>
        </td>
        <td className="py-2 px-3 font-mono">${t.amount.toFixed(2)}</td>
        <td className="py-2 px-3">{t.method}</td>
        <td className="py-2 px-3">
          <Badge variant="outline" className="text-[10px] border-[#f59e0b]/40 text-[#f59e0b]">{t.status}</Badge>
        </td>
        <td className="py-2 px-3 text-right">
          <div className="flex gap-1 justify-end">
            <Button size="sm" onClick={() => handleAction(type, t.id, "APPROVE")} className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 h-7 text-[10px] px-2">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Approve
            </Button>
            <Button size="sm" onClick={() => handleAction(type, t.id, "REJECT")} className="bg-red-500 hover:bg-red-600 text-white border-0 h-7 text-[10px] px-2">
              <XCircle className="h-3 w-3 mr-1" /> Reject
            </Button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <div className="flex items-center justify-between mb-4">
        <TabsList className="bg-white/5">
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        </TabsList>
        <Button size="sm" variant="outline" onClick={fetch} className="border-white/10">
          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
        </Button>
      </div>
      <TabsContent value="deposits">
        <div className="bx-glass rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-white/5">
              <tr>
                <th className="text-left font-medium py-3 px-3">TxID</th>
                <th className="text-left font-medium py-3 px-3">User</th>
                <th className="text-left font-medium py-3 px-3">Amount</th>
                <th className="text-left font-medium py-3 px-3">Method</th>
                <th className="text-left font-medium py-3 px-3">Status</th>
                <th className="text-right font-medium py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>{renderRows(deposits, "deposit")}</tbody>
          </table>
        </div>
      </TabsContent>
      <TabsContent value="withdrawals">
        <div className="bx-glass rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-white/5">
              <tr>
                <th className="text-left font-medium py-3 px-3">TxID</th>
                <th className="text-left font-medium py-3 px-3">User</th>
                <th className="text-left font-medium py-3 px-3">Amount</th>
                <th className="text-left font-medium py-3 px-3">Method</th>
                <th className="text-left font-medium py-3 px-3">Status</th>
                <th className="text-right font-medium py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>{renderRows(withdrawals, "withdrawal")}</tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs>
  );
}

// ─── Reports section ──────────────────────────────────────────
function ReportsSection({ apiFetch }: { apiFetch: any }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [series, setSeries] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/admin/stats");
        const data = await res.json();
        if (res.ok) {
          setStats(data.stats);
          setSeries(data.revenueSeries || []);
        }
      } catch {
        /* noop */
      }
    })();
     
  }, []);

  const userGrowth = [
    { day: "Mon", users: 12 },
    { day: "Tue", users: 18 },
    { day: "Wed", users: 9 },
    { day: "Thu", users: 24 },
    { day: "Fri", users: 31 },
    { day: "Sat", users: 22 },
    { day: "Sun", users: 28 },
  ];

  const depVsWd = [
    { day: "Mon", deposits: 4200, withdrawals: 1800 },
    { day: "Tue", deposits: 3100, withdrawals: 2400 },
    { day: "Wed", deposits: 5400, withdrawals: 2900 },
    { day: "Thu", deposits: 6100, withdrawals: 3300 },
    { day: "Fri", deposits: 7200, withdrawals: 4100 },
    { day: "Sat", deposits: 4800, withdrawals: 3600 },
    { day: "Sun", deposits: 5500, withdrawals: 2900 },
  ];

  const tradeVolume = [
    { day: "Mon", volume: 240 },
    { day: "Tue", volume: 320 },
    { day: "Wed", volume: 280 },
    { day: "Thu", volume: 410 },
    { day: "Fri", volume: 520 },
    { day: "Sat", volume: 380 },
    { day: "Sun", volume: 460 },
  ];

  const exportCsv = (rows: any[], name: string) => {
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => r[h]).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${name}.csv downloaded`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => exportCsv(series, "revenue")} className="border-white/10">
          <Download className="h-3.5 w-3.5 mr-1" /> Revenue CSV
        </Button>
        <Button size="sm" variant="outline" onClick={() => exportCsv(userGrowth, "user-growth")} className="border-white/10">
          <Download className="h-3.5 w-3.5 mr-1" /> Users CSV
        </Button>
        <Button size="sm" variant="outline" onClick={() => exportCsv(depVsWd, "deposits-withdrawals")} className="border-white/10">
          <Download className="h-3.5 w-3.5 mr-1" /> Cashflow CSV
        </Button>
        <Button size="sm" variant="outline" onClick={() => exportCsv(tradeVolume, "trade-volume")} className="border-white/10">
          <Download className="h-3.5 w-3.5 mr-1" /> Volume CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bx-glass p-4 border-white/5">
          <h3 className="text-sm font-semibold mb-3">Revenue</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="rep-rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" stroke="#8896b3" fontSize={11} />
                <YAxis stroke="#8896b3" fontSize={11} />
                <RechartsTooltip contentStyle={{ background: "#0a1322", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#rep-rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bx-glass p-4 border-white/5">
          <h3 className="text-sm font-semibold mb-3">User Growth</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" stroke="#8896b3" fontSize={11} />
                <YAxis stroke="#8896b3" fontSize={11} />
                <RechartsTooltip contentStyle={{ background: "#0a1322", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="users" stroke="#ffd700" strokeWidth={2} dot={{ fill: "#ffd700", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bx-glass p-4 border-white/5">
          <h3 className="text-sm font-semibold mb-3">Deposits vs Withdrawals</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={depVsWd}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" stroke="#8896b3" fontSize={11} />
                <YAxis stroke="#8896b3" fontSize={11} />
                <RechartsTooltip contentStyle={{ background: "#0a1322", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="deposits" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="withdrawals" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bx-glass p-4 border-white/5">
          <h3 className="text-sm font-semibold mb-3">Trade Volume</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tradeVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" stroke="#8896b3" fontSize={11} />
                <YAxis stroke="#8896b3" fontSize={11} />
                <RechartsTooltip contentStyle={{ background: "#0a1322", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="volume" fill="#ffd700" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Settings section ─────────────────────────────────────────
function SettingsSection() {
  const [minTrade, setMinTrade] = useState("10");
  const [maxTrade, setMaxTrade] = useState("10000");
  const [payout30, setPayout30] = useState("20");
  const [payout60, setPayout60] = useState("30");
  const [payout120, setPayout120] = useState("50");

  return (
    <div className="max-w-2xl space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Settings saved (demo)");
        }}
        className="bx-glass rounded-xl p-5 sm:p-6 space-y-4"
      >
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Settings className="h-4 w-4 text-[#ffed4e]" /> Platform Settings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Min Trade Amount ($)</Label>
            <Input value={minTrade} onChange={(e) => setMinTrade(e.target.value)} className="bg-white/5 border-white/10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Max Trade Amount ($)</Label>
            <Input value={maxTrade} onChange={(e) => setMaxTrade(e.target.value)} className="bg-white/5 border-white/10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Payout 30s (%)</Label>
            <Input value={payout30} onChange={(e) => setPayout30(e.target.value)} className="bg-white/5 border-white/10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Payout 60s (%)</Label>
            <Input value={payout60} onChange={(e) => setPayout60(e.target.value)} className="bg-white/5 border-white/10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Payout 120s (%)</Label>
            <Input value={payout120} onChange={(e) => setPayout120(e.target.value)} className="bg-white/5 border-white/10" />
          </div>
        </div>
        <Button type="submit" className="bx-blue-gradient text-white border-0">
          <Save className="h-4 w-4 mr-1" /> Save Settings
        </Button>
      </form>
    </div>
  );
}

// ─── Market Management section ─────────────────────────────────
function MarketSection({ apiFetch }: { apiFetch: any }) {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use local COINS data + fetch trade volume per coin
    (async () => {
      try {
        const res = await apiFetch("/api/admin/trades");
        const data = await res.json();
        const trades = data.trades || [];
        // Count trades per symbol
        const counts: Record<string, number> = {};
        trades.forEach((t: any) => { counts[t.symbol] = (counts[t.symbol] || 0) + 1; });
        const coinData = COINS.map(c => ({
          ...c,
          tradeCount: counts[c.symbol] || 0,
          volume: (counts[c.symbol] || 0) * c.basePrice,
        }));
        setCoins(coinData);
      } catch { /* noop */ }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Market Management</h2>
      <p className="text-sm text-muted-foreground">All {COINS.length} supported cryptocurrencies + trade volume</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : coins.map((coin) => (
          <div key={coin.symbol} className="bx-glass rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-10 w-10 flex items-center justify-center rounded-full text-base font-bold shrink-0"
                style={{ background: `${coin.color}25`, color: coin.color }}>{coin.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold">{coin.symbol}</p>
                <p className="text-[10px] text-muted-foreground">{coin.name}</p>
              </div>
              <Badge variant="outline" className="text-[10px] border-emerald-400/30 text-emerald-400">Active</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-[9px] text-muted-foreground">Base Price</p>
                <p className="font-mono font-semibold">${coin.basePrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-[9px] text-muted-foreground">Trades</p>
                <p className="font-mono font-semibold">{coin.tradeCount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Wallet Management section ─────────────────────────────────
function WalletSection({ apiFetch }: { apiFetch: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/admin/wallet-summary");
        const d = await res.json();
        if (res.ok) setData(d);
      } catch { /* noop */ }
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!data) return <p className="text-muted-foreground">Failed to load</p>;

  const s = data.summary;
  const cards = [
    { label: "Total Customer Balance", value: `$${s.totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color: "text-[#ffd700]", icon: Wallet },
    { label: "Frozen Balance", value: `$${s.frozenBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color: "text-red-400", icon: ShieldCheck },
    { label: "Total Deposits", value: `$${s.totalDeposits.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color: "text-emerald-400", icon: CreditCard },
    { label: "Total Withdrawals", value: `$${s.totalWithdrawals.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color: "text-red-400", icon: CreditCard },
    { label: "Pending Deposits", value: String(s.pendingDeposits), color: "text-amber-400", icon: Clock },
    { label: "Pending Withdrawals", value: String(s.pendingWithdrawals), color: "text-amber-400", icon: Clock },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Wallet Management</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((c, i) => (
          <div key={i} className="bx-glass rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">{c.label}</p>
                <p className={`mt-1 text-lg font-bold ${c.color}`}>{c.value}</p>
              </div>
              <c.icon className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>

      <div className="bx-glass rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="font-semibold text-sm">Top 5 Users by Balance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 text-muted-foreground">
                <th className="text-left py-2 px-4">User</th>
                <th className="text-left py-2 px-4">UID</th>
                <th className="text-right py-2 px-4">Balance</th>
                <th className="text-center py-2 px-4">Tier</th>
                <th className="text-center py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.topUsers.map((u: any) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2 px-4">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-[10px] text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="py-2 px-4 font-mono text-[#ffd700]">{u.uid}</td>
                  <td className="py-2 px-4 text-right font-mono font-bold">${u.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  <td className="py-2 px-4 text-center">L{u.vipLevel}</td>
                  <td className="py-2 px-4 text-center">
                    <Badge variant="outline" className={`text-[9px] ${u.status === "ACTIVE" ? "border-emerald-400/30 text-emerald-400" : "border-red-400/30 text-red-400"}`}>
                      {u.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Messaging section (customer support conversations) ────────
function MessagingSection({ apiFetch }: { apiFetch: any }) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const loadConvs = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/conversations");
      const data = await res.json();
      if (res.ok) setConversations(data.conversations || []);
    } catch { /* noop */ }
    setLoading(false);
  }, [apiFetch]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/api/admin/conversations");
        const data = await res.json();
        if (!cancelled && res.ok) setConversations(data.conversations || []);
      } catch { /* noop */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [apiFetch]);

  const loadMessages = async (convId: string) => {
    try {
      const res = await apiFetch(`/api/messages/conversations/${convId}`);
      const data = await res.json();
      if (res.ok) {
        setSelectedConv(convId);
        setMessages(data.conversation?.messages || []);
      }
    } catch { /* noop */ }
  };

  // Poll for new messages every 3s
  useEffect(() => {
    if (!selectedConv) return;
    const id = setInterval(async () => {
      try {
        const res = await apiFetch(`/api/messages/conversations/${selectedConv}`);
        const data = await res.json();
        if (res.ok) setMessages(data.conversation?.messages || []);
      } catch { /* noop */ }
    }, 3000);
    return () => clearInterval(id);
  }, [selectedConv]);

  const sendReply = async () => {
    if (!reply.trim() || !selectedConv) return;
    setSending(true);
    try {
      await apiFetch("/api/messages/send", {
        method: "POST",
        body: JSON.stringify({ conversationId: selectedConv, body: reply }),
      });
      setReply("");
      loadMessages(selectedConv);
    } catch { /* noop */ }
    setSending(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Customer Support Messages</h2>
      <p className="text-sm text-muted-foreground">All customer conversations — respond in real-time</p>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 h-[70vh]">
        {/* Conversation list */}
        <div className="bx-glass rounded-xl overflow-hidden">
          <div className="p-3 border-b border-white/5">
            <p className="text-xs font-semibold">Conversations ({conversations.length})</p>
          </div>
          <div className="overflow-y-auto max-h-[60vh]">
            {loading ? (
              <p className="text-center py-8 text-muted-foreground text-sm">Loading...</p>
            ) : conversations.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground text-sm">No conversations</p>
            ) : conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => loadMessages(c.id)}
                className={`w-full text-left p-3 border-b border-white/5 transition-colors ${selectedConv === c.id ? "bg-[#ffd700]/10" : "hover:bg-white/5"}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">{c.customer?.name}</p>
                  <span className="text-[9px] text-muted-foreground">{c._count?.messages || 0} msgs</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{c.customer?.uid}</p>
                {c.messages?.[0] && <p className="text-[10px] text-muted-foreground truncate mt-1">{c.messages[0].body}</p>}
              </button>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        <div className="bx-glass rounded-xl flex flex-col">
          {selectedConv ? (
            <>
              <div className="p-3 border-b border-white/5 flex items-center justify-between">
                <p className="text-sm font-semibold">Conversation</p>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 bx-pulse-dot" /> Live
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[50vh]">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.senderId === conversations.find(c => c.id === selectedConv)?.customerId ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-xl px-3 py-2 ${m.senderId === conversations.find(c => c.id === selectedConv)?.customerId ? "bg-[#ffd700]/20 text-white" : "bg-white/5 text-[#cccccc]"}`}>
                      <p className="text-xs">{m.body}</p>
                      <p className="text-[9px] text-muted-foreground mt-1">{new Date(m.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No messages yet</p>}
              </div>
              <div className="p-3 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendReply()}
                  placeholder="Type your reply..."
                  className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm"
                />
                <Button size="sm" onClick={sendReply} disabled={sending || !reply.trim()} className="bx-blue-gradient text-black border-0">
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Security section (audit logs + login history) ─────────────
function SecuritySection({ apiFetch }: { apiFetch: any }) {
  const [tab, setTab] = useState<"audit" | "logins">("audit");
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loginLogs, setLoginLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [aRes, lRes] = await Promise.all([
          apiFetch("/api/admin/audit-logs"),
          apiFetch("/api/admin/login-logs"),
        ]);
        const aData = await aRes.json();
        const lData = await lRes.json();
        if (aRes.ok) setAuditLogs(aData.logs || []);
        if (lRes.ok) setLoginLogs(lData.logs || []);
      } catch { /* noop */ }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Security & Audit</h2>

      <div className="flex items-center gap-2">
        <button onClick={() => setTab("audit")} className={`px-3 py-1.5 text-xs rounded-md ${tab === "audit" ? "bg-[#ffd700]/20 text-[#ffd700]" : "bg-white/5 text-muted-foreground"}`}>Audit Logs</button>
        <button onClick={() => setTab("logins")} className={`px-3 py-1.5 text-xs rounded-md ${tab === "logins" ? "bg-[#ffd700]/20 text-[#ffd700]" : "bg-white/5 text-muted-foreground"}`}>Login History</button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : tab === "audit" ? (
        <div className="bx-glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-[#1a1a1a]">
                <tr className="border-b border-white/5 text-muted-foreground">
                  <th className="text-left py-2 px-3">Admin</th>
                  <th className="text-left py-2 px-3">Action</th>
                  <th className="text-left py-2 px-3">Target</th>
                  <th className="text-left py-2 px-3">IP</th>
                  <th className="text-left py-2 px-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No audit logs</td></tr>
                ) : auditLogs.map((l) => (
                  <tr key={l.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 px-3">
                      <p className="font-medium">{l.admin?.name || "—"}</p>
                      <p className="text-[9px] text-muted-foreground">{l.admin?.uid}</p>
                    </td>
                    <td className="py-2 px-3">
                      <Badge variant="outline" className="text-[9px] border-[#ffd700]/30 text-[#ffd700]">{l.action}</Badge>
                    </td>
                    <td className="py-2 px-3 text-[10px] text-muted-foreground">{l.targetType || "—"}: {l.targetId?.slice(0, 8) || "—"}</td>
                    <td className="py-2 px-3 text-[10px] text-muted-foreground">{l.ip}</td>
                    <td className="py-2 px-3 text-[10px] text-muted-foreground">{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bx-glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-[#1a1a1a]">
                <tr className="border-b border-white/5 text-muted-foreground">
                  <th className="text-left py-2 px-3">Email</th>
                  <th className="text-center py-2 px-3">Success</th>
                  <th className="text-left py-2 px-3">Reason</th>
                  <th className="text-left py-2 px-3">IP</th>
                  <th className="text-left py-2 px-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {loginLogs.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No login attempts</td></tr>
                ) : loginLogs.map((l) => (
                  <tr key={l.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 px-3 font-medium">{l.email}</td>
                    <td className="py-2 px-3 text-center">
                      {l.success ? <span className="text-emerald-400">✓</span> : <span className="text-red-400">✗</span>}
                    </td>
                    <td className="py-2 px-3 text-[10px] text-muted-foreground">{l.reason || "—"}</td>
                    <td className="py-2 px-3 text-[10px] text-muted-foreground">{l.ip}</td>
                    <td className="py-2 px-3 text-[10px] text-muted-foreground">{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminView;
