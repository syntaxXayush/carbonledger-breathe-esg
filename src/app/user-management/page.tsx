'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
    Users, UserPlus, Shield, Eye, BarChart2, MoreVertical,
    Search, Filter, Download, Mail, Building2, CheckCircle,
    XCircle, Clock, ChevronDown, X, AlertTriangle, Lock,
    Pencil, Trash2, RefreshCw, ArrowUpDown
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'Admin' | 'Analyst' | 'Viewer';
type UserStatus = 'Active' | 'Inactive' | 'Pending';

interface OrgAccess {
    orgId: string;
    orgName: string;
    role: Role;
}

interface ManagedUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
    status: UserStatus;
    orgs: OrgAccess[];
    lastLogin: string;
    invitedBy: string;
    joinedAt: string;
}

interface AuditEntry {
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    target: string;
    detail: string;
    type: 'invite' | 'role_change' | 'deactivate' | 'reactivate' | 'permission';
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const ORGS = [
    { id: 'meridian', name: 'Meridian Industrial Group' },
    { id: 'vantage', name: 'Vantage Energy Partners' },
    { id: 'solaris', name: 'Solaris Logistics Co.' },
];

const MOCK_USERS: ManagedUser[] = [
    {
        id: 'u1', name: 'Priya Nair', email: 'priya.nair@meridian.com',
        avatar: 'PN', status: 'Active',
        orgs: [{ orgId: 'meridian', orgName: 'Meridian Industrial Group', role: 'Admin' }, { orgId: 'vantage', orgName: 'Vantage Energy Partners', role: 'Analyst' }],
        lastLogin: '2026-05-27 14:32', invitedBy: 'System', joinedAt: '2025-01-10',
    },
    {
        id: 'u2', name: 'James Okafor', email: 'j.okafor@vantage.io',
        avatar: 'JO', status: 'Active',
        orgs: [{ orgId: 'vantage', orgName: 'Vantage Energy Partners', role: 'Analyst' }],
        lastLogin: '2026-05-26 09:15', invitedBy: 'Priya Nair', joinedAt: '2025-03-22',
    },
    {
        id: 'u3', name: 'Sofia Reyes', email: 'sofia.r@solaris.co',
        avatar: 'SR', status: 'Active',
        orgs: [{ orgId: 'solaris', orgName: 'Solaris Logistics Co.', role: 'Viewer' }, { orgId: 'meridian', orgName: 'Meridian Industrial Group', role: 'Viewer' }],
        lastLogin: '2026-05-25 16:44', invitedBy: 'Priya Nair', joinedAt: '2025-06-01',
    },
    {
        id: 'u4', name: 'Marcus Chen', email: 'm.chen@meridian.com',
        avatar: 'MC', status: 'Pending',
        orgs: [{ orgId: 'meridian', orgName: 'Meridian Industrial Group', role: 'Analyst' }],
        lastLogin: '—', invitedBy: 'Priya Nair', joinedAt: '2026-05-27',
    },
    {
        id: 'u5', name: 'Aisha Patel', email: 'aisha.p@vantage.io',
        avatar: 'AP', status: 'Inactive',
        orgs: [{ orgId: 'vantage', orgName: 'Vantage Energy Partners', role: 'Viewer' }],
        lastLogin: '2026-02-14 11:00', invitedBy: 'James Okafor', joinedAt: '2025-09-15',
    },
    {
        id: 'u6', name: 'Tom Eriksson', email: 't.eriksson@solaris.co',
        avatar: 'TE', status: 'Active',
        orgs: [{ orgId: 'solaris', orgName: 'Solaris Logistics Co.', role: 'Admin' }],
        lastLogin: '2026-05-27 08:02', invitedBy: 'System', joinedAt: '2025-02-28',
    },
];

const MOCK_AUDIT: AuditEntry[] = [
    { id: 'a1', timestamp: '2026-05-27 14:10', actor: 'Priya Nair', action: 'Invited user', target: 'Marcus Chen', detail: 'Assigned Analyst role in Meridian Industrial Group', type: 'invite' },
    { id: 'a2', timestamp: '2026-05-26 11:32', actor: 'Priya Nair', action: 'Role changed', target: 'James Okafor', detail: 'Viewer → Analyst in Vantage Energy Partners', type: 'role_change' },
    { id: 'a3', timestamp: '2026-05-25 09:00', actor: 'Tom Eriksson', action: 'Deactivated account', target: 'Aisha Patel', detail: 'Account suspended — offboarding request', type: 'deactivate' },
    { id: 'a4', timestamp: '2026-05-24 16:45', actor: 'Priya Nair', action: 'Permission updated', target: 'Sofia Reyes', detail: 'Added Viewer access to Meridian Industrial Group', type: 'permission' },
    { id: 'a5', timestamp: '2026-05-23 13:20', actor: 'System', action: 'Invited user', target: 'Tom Eriksson', detail: 'Assigned Admin role in Solaris Logistics Co.', type: 'invite' },
    { id: 'a6', timestamp: '2026-05-22 10:05', actor: 'Priya Nair', action: 'Role changed', target: 'Sofia Reyes', detail: 'Analyst → Viewer in Solaris Logistics Co.', type: 'role_change' },
    { id: 'a7', timestamp: '2026-05-20 08:30', actor: 'Tom Eriksson', action: 'Reactivated account', target: 'James Okafor', detail: 'Account restored after leave of absence', type: 'reactivate' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const ROLE_STYLES: Record<Role, string> = {
    Admin: 'text-alert bg-alert/10 border-alert/30',
    Analyst: 'text-primary bg-primary/10 border-primary/30',
    Viewer: 'text-muted-foreground bg-muted border-border',
};

const STATUS_STYLES: Record<UserStatus, string> = {
    Active: 'text-success bg-success/10 border-success/30',
    Inactive: 'text-muted-foreground bg-muted border-border',
    Pending: 'text-warning bg-warning/10 border-warning/30',
};

const STATUS_ICONS: Record<UserStatus, React.ReactNode> = {
    Active: <CheckCircle size={11} />,
    Inactive: <XCircle size={11} />,
    Pending: <Clock size={11} />,
};

const AUDIT_TYPE_STYLES: Record<AuditEntry['type'], string> = {
    invite: 'text-primary bg-primary/10 border-primary/30',
    role_change: 'text-scope2 bg-scope2/10 border-scope2/30',
    deactivate: 'text-alert bg-alert/10 border-alert/30',
    reactivate: 'text-success bg-success/10 border-success/30',
    permission: 'text-warning bg-warning/10 border-warning/30',
};

function RoleBadge({ role }: { role: Role }) {
    const icons: Record<Role, React.ReactNode> = {
        Admin: <Shield size={10} />,
        Analyst: <BarChart2 size={10} />,
        Viewer: <Eye size={10} />,
    };
    return (
        <span className={`inline-flex items-center gap-1 text-2xs font-medium px-1.5 py-0.5 rounded border ${ROLE_STYLES[role]}`}>
            {icons[role]}{role}
        </span>
    );
}

function StatusBadge({ status }: { status: UserStatus }) {
    return (
        <span className={`inline-flex items-center gap-1 text-2xs font-medium px-1.5 py-0.5 rounded border ${STATUS_STYLES[status]}`}>
            {STATUS_ICONS[status]}{status}
        </span>
    );
}

function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' }) {
    const s = size === 'sm' ? 'w-7 h-7 text-2xs' : 'w-9 h-9 text-xs';
    return (
        <div className={`${s} rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center font-semibold text-primary flex-shrink-0`}>
            {initials}
        </div>
    );
}

// ─── Invite Modal ──────────────────────────────────────────────────────────────

function InviteModal({ onClose }: { onClose: () => void }) {
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteOrg, setInviteOrg] = useState(ORGS[0].id);
    const [inviteRole, setInviteRole] = useState<Role>('Analyst');
    const [sent, setSent] = useState(false);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;
        setSent(true);
        setTimeout(onClose, 1400);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md card-elevated rounded-xl shadow-2xl animate-slide-up">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <UserPlus size={16} className="text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">Invite New User</h3>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {sent ? (
                    <div className="px-5 py-10 flex flex-col items-center gap-3 text-center">
                        <div className="w-12 h-12 rounded-full bg-success/10 border border-success/30 flex items-center justify-center">
                            <CheckCircle size={22} className="text-success" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">Invitation sent!</p>
                        <p className="text-2xs text-muted-foreground">An email was dispatched to <span className="text-foreground">{inviteEmail}</span></p>
                    </div>
                ) : (
                    <form onSubmit={handleSend} className="p-5 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Work Email</label>
                            <div className="relative">
                                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="colleague@company.com"
                                    className="w-full pl-8 pr-3.5 py-2.5 rounded-md border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Organisation</label>
                            <div className="relative">
                                <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <select
                                    value={inviteOrg}
                                    onChange={(e) => setInviteOrg(e.target.value)}
                                    className="w-full pl-8 pr-3.5 py-2.5 rounded-md border border-border bg-input text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none"
                                >
                                    {ORGS.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                                </select>
                                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['Admin', 'Analyst', 'Viewer'] as Role[]).map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setInviteRole(r)}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-md border text-xs font-medium transition-all ${inviteRole === r ? ROLE_STYLES[r] + ' border-opacity-100' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                    >
                                        {r === 'Admin' && <Shield size={14} />}
                                        {r === 'Analyst' && <BarChart2 size={14} />}
                                        {r === 'Viewer' && <Eye size={14} />}
                                        {r}
                                    </button>
                                ))}
                            </div>
                            <div className="p-3 rounded-md bg-muted border border-border text-2xs text-muted-foreground space-y-1">
                                {inviteRole === 'Admin' && <p><span className="text-alert font-medium">Admin:</span> Full access — invite users, manage roles, approve/reject records, export data.</p>}
                                {inviteRole === 'Analyst' && <p><span className="text-primary font-medium">Analyst:</span> Review and edit emission records, bulk approve/reject, view audit log.</p>}
                                {inviteRole === 'Viewer' && <p><span className="text-muted-foreground font-medium">Viewer:</span> Read-only access to dashboards and reports. Cannot edit or approve records.</p>}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                            <button type="button" onClick={onClose} className="flex-1 btn-ghost px-4 py-2 rounded-md text-sm font-medium">
                                Cancel
                            </button>
                            <button type="submit" className="flex-1 btn-primary px-4 py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-1.5">
                                <Mail size={13} />
                                Send Invite
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// ─── Edit Role Modal ───────────────────────────────────────────────────────────

function EditRoleModal({ user, onClose }: { user: ManagedUser; onClose: () => void }) {
    const [orgRoles, setOrgRoles] = useState<OrgAccess[]>(user.orgs);
    const [saved, setSaved] = useState(false);

    const updateRole = (orgId: string, role: Role) => {
        setOrgRoles((prev) => prev.map((o) => o.orgId === orgId ? { ...o, role } : o));
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(onClose, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md card-elevated rounded-xl shadow-2xl animate-slide-up">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Pencil size={15} className="text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">Edit Roles — {user.name}</h3>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={16} /></button>
                </div>

                {saved ? (
                    <div className="px-5 py-10 flex flex-col items-center gap-3 text-center">
                        <div className="w-12 h-12 rounded-full bg-success/10 border border-success/30 flex items-center justify-center">
                            <CheckCircle size={22} className="text-success" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">Roles updated</p>
                    </div>
                ) : (
                    <div className="p-5 space-y-4">
                        {orgRoles.map((oa) => (
                            <div key={oa.orgId} className="space-y-2">
                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                    <Building2 size={11} />{oa.orgName}
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['Admin', 'Analyst', 'Viewer'] as Role[]).map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => updateRole(oa.orgId, r)}
                                            className={`py-2 rounded-md border text-xs font-medium transition-all ${oa.role === r ? ROLE_STYLES[r] : 'border-border text-muted-foreground hover:bg-muted'}`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-2 pt-1">
                            <button type="button" onClick={onClose} className="flex-1 btn-ghost px-4 py-2 rounded-md text-sm font-medium">Cancel</button>
                            <button type="button" onClick={handleSave} className="flex-1 btn-primary px-4 py-2 rounded-md text-sm font-semibold">Save Changes</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function UserManagementPage() {
    const [users, setUsers] = useState<ManagedUser[]>(MOCK_USERS);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<UserStatus | 'All'>('All');
    const [activeTab, setActiveTab] = useState<'users' | 'audit'>('users');
    const [showInvite, setShowInvite] = useState(false);
    const [editUser, setEditUser] = useState<ManagedUser | null>(null);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [auditSearch, setAuditSearch] = useState('');

    const toggleStatus = (userId: string) => {
        setUsers((prev) => prev.map((u) => u.id === userId
            ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
            : u
        ));
        setMenuOpen(null);
    };

    const filteredUsers = users.filter((u) => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || u.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const filteredAudit = MOCK_AUDIT.filter((a) =>
        a.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
        a.target.toLowerCase().includes(auditSearch.toLowerCase()) ||
        a.action.toLowerCase().includes(auditSearch.toLowerCase())
    );

    const stats = {
        total: users.length,
        active: users.filter((u) => u.status === 'Active').length,
        pending: users.filter((u) => u.status === 'Pending').length,
        inactive: users.filter((u) => u.status === 'Inactive').length,
    };

    return (
        <AppLayout>
            <div className="flex-1 flex flex-col min-h-0 overflow-auto bg-background">
                <div className="max-w-7xl mx-auto w-full px-6 py-6 space-y-6">

                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                                <Users size={20} className="text-primary" />
                                User Management
                            </h1>
                            <p className="text-sm text-muted-foreground">Manage access, roles, and permissions across all organisations</p>
                        </div>
                        <button
                            onClick={() => setShowInvite(true)}
                            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold flex-shrink-0"
                        >
                            <UserPlus size={15} />
                            Invite User
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { label: 'Total Users', value: stats.total, icon: <Users size={14} />, color: 'text-foreground' },
                            { label: 'Active', value: stats.active, icon: <CheckCircle size={14} />, color: 'text-success' },
                            { label: 'Pending Invite', value: stats.pending, icon: <Clock size={14} />, color: 'text-warning' },
                            { label: 'Deactivated', value: stats.inactive, icon: <XCircle size={14} />, color: 'text-muted-foreground' },
                        ].map((s) => (
                            <div key={s.label} className="card-elevated p-4 flex items-center gap-3">
                                <div className={`${s.color} opacity-70`}>{s.icon}</div>
                                <div>
                                    <p className={`text-xl font-bold font-mono-nums ${s.color}`}>{s.value}</p>
                                    <p className="text-2xs text-muted-foreground">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 border-b border-border">
                        {[
                            { key: 'users', label: 'Users', icon: <Users size={13} /> },
                            { key: 'audit', label: 'Access Audit Trail', icon: <Lock size={13} /> },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as 'users' | 'audit')}
                                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === tab.key
                                        ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {tab.icon}{tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="space-y-4">
                            {/* Toolbar */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by name or email…"
                                        className="w-full pl-8 pr-3.5 py-2 rounded-md border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Filter size={13} className="text-muted-foreground" />
                                    {(['All', 'Active', 'Pending', 'Inactive'] as const).map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setStatusFilter(s)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${statusFilter === s
                                                    ? 'bg-primary/10 text-primary border-primary/30' : 'border-border text-muted-foreground hover:bg-muted'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Table */}
                            <div className="card-elevated overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border bg-muted/30">
                                                <th className="text-left px-4 py-3 text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                    <div className="flex items-center gap-1">User <ArrowUpDown size={10} /></div>
                                                </th>
                                                <th className="text-left px-4 py-3 text-2xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                                <th className="text-left px-4 py-3 text-2xs font-semibold text-muted-foreground uppercase tracking-wider">Org Access & Roles</th>
                                                <th className="text-left px-4 py-3 text-2xs font-semibold text-muted-foreground uppercase tracking-wider">Last Login</th>
                                                <th className="text-left px-4 py-3 text-2xs font-semibold text-muted-foreground uppercase tracking-wider">Invited By</th>
                                                <th className="px-4 py-3 w-10" />
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {filteredUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar initials={user.avatar} />
                                                            <div>
                                                                <p className="text-sm font-medium text-foreground">{user.name}</p>
                                                                <p className="text-2xs text-muted-foreground">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <StatusBadge status={user.status} />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {user.orgs.map((oa) => (
                                                                <div key={oa.orgId} className="flex items-center gap-1">
                                                                    <span className="text-2xs text-muted-foreground">{oa.orgName.split(' ')[0]}</span>
                                                                    <RoleBadge role={oa.role} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-xs font-mono-nums text-muted-foreground">{user.lastLogin}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-xs text-muted-foreground">{user.invitedBy}</span>
                                                    </td>
                                                    <td className="px-4 py-3 relative">
                                                        <button
                                                            onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                                                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                                        >
                                                            <MoreVertical size={14} />
                                                        </button>
                                                        {menuOpen === user.id && (
                                                            <div className="absolute right-4 top-full mt-1 w-44 card-elevated rounded-md shadow-xl z-20 overflow-hidden animate-slide-down">
                                                                <button
                                                                    onClick={() => { setEditUser(user); setMenuOpen(null); }}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors"
                                                                >
                                                                    <Pencil size={12} className="text-primary" />
                                                                    Edit Roles
                                                                </button>
                                                                <button
                                                                    onClick={() => toggleStatus(user.id)}
                                                                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors ${user.status === 'Active' ? 'text-alert' : 'text-success'}`}
                                                                >
                                                                    {user.status === 'Active'
                                                                        ? <><Trash2 size={12} />Deactivate Account</>
                                                                        : <><RefreshCw size={12} />Reactivate Account</>
                                                                    }
                                                                </button>
                                                                {user.status === 'Pending' && (
                                                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-muted transition-colors">
                                                                        <Mail size={12} />
                                                                        Resend Invite
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {filteredUsers.length === 0 && (
                                        <div className="py-12 text-center text-muted-foreground text-sm">
                                            No users match your search criteria.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Role permissions legend */}
                            <div className="card-elevated p-4">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <Shield size={12} />
                                    Role Permissions Matrix
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {[
                                        {
                                            role: 'Admin' as Role,
                                            perms: ['Invite & deactivate users', 'Assign roles per org', 'Approve/reject records', 'Export audit logs', 'Configure emission factors'],
                                        },
                                        {
                                            role: 'Analyst' as Role,
                                            perms: ['Review & edit records', 'Bulk approve/reject', 'View audit log', 'Export filtered data', 'Flag anomalies'],
                                        },
                                        {
                                            role: 'Viewer' as Role,
                                            perms: ['View dashboards', 'View reports', 'Read-only record access', 'No edit permissions', 'No export access'],
                                        },
                                    ].map(({ role, perms }) => (
                                        <div key={role} className={`p-3 rounded-md border ${ROLE_STYLES[role]} bg-opacity-5`}>
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <RoleBadge role={role} />
                                            </div>
                                            <ul className="space-y-1">
                                                {perms.map((p) => (
                                                    <li key={p} className="text-2xs text-muted-foreground flex items-center gap-1.5">
                                                        <CheckCircle size={9} className="flex-shrink-0 opacity-60" />{p}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Audit Trail Tab */}
                    {activeTab === 'audit' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1 max-w-sm">
                                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={auditSearch}
                                        onChange={(e) => setAuditSearch(e.target.value)}
                                        placeholder="Search audit trail…"
                                        className="w-full pl-8 pr-3.5 py-2 rounded-md border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                                    />
                                </div>
                                <button className="btn-ghost flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium">
                                    <Download size={13} />
                                    Export CSV
                                </button>
                            </div>

                            <div className="card-elevated overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border bg-muted/30">
                                                <th className="text-left px-4 py-3 text-2xs font-semibold text-muted-foreground uppercase tracking-wider">Timestamp</th>
                                                <th className="text-left px-4 py-3 text-2xs font-semibold text-muted-foreground uppercase tracking-wider">Actor</th>
                                                <th className="text-left px-4 py-3 text-2xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                                                <th className="text-left px-4 py-3 text-2xs font-semibold text-muted-foreground uppercase tracking-wider">Target User</th>
                                                <th className="text-left px-4 py-3 text-2xs font-semibold text-muted-foreground uppercase tracking-wider">Detail</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {filteredAudit.map((entry) => (
                                                <tr key={entry.id} className="hover:bg-muted/20 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <span className="text-xs font-mono-nums text-muted-foreground whitespace-nowrap">{entry.timestamp}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar initials={entry.actor.split(' ').map((n) => n[0]).join('')} size="sm" />
                                                            <span className="text-xs font-medium text-foreground">{entry.actor}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center text-2xs font-medium px-1.5 py-0.5 rounded border ${AUDIT_TYPE_STYLES[entry.type]}`}>
                                                            {entry.action}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-xs text-foreground">{entry.target}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-xs text-muted-foreground">{entry.detail}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {filteredAudit.length === 0 && (
                                        <div className="py-12 text-center text-muted-foreground text-sm">No audit entries match your search.</div>
                                    )}
                                </div>
                            </div>

                            {/* Warning banner */}
                            <div className="flex items-start gap-3 p-3 rounded-md border border-warning/20 bg-warning/5">
                                <AlertTriangle size={14} className="text-warning flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-muted-foreground">
                                    Access audit trail is <span className="text-warning font-medium">immutable</span> — all entries are write-once and cannot be edited or deleted. Records are retained for 7 years per GDPR Article 30 requirements.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
            {editUser && <EditRoleModal user={editUser} onClose={() => setEditUser(null)} />}

            {/* Close menus on outside click */}
            {menuOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
            )}
        </AppLayout>
    );
}
