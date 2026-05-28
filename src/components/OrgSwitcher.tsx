'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Building2, ShieldCheck, BarChart2, Eye } from 'lucide-react';

export type OrgRole = 'Admin' | 'Analyst' | 'Viewer';

export interface Organization {
    id: string;
    name: string;
    shortName: string;
    industry: string;
    role: OrgRole;
    color: string;
}

const ORGANIZATIONS: Organization[] = [
    {
        id: 'tenant-001',
        name: 'Meridian Industrial Group',
        shortName: 'MIG',
        industry: 'Manufacturing',
        role: 'Analyst',
        color: 'bg-teal-500',
    },
    {
        id: 'tenant-002',
        name: 'Vantage Energy Partners',
        shortName: 'VEP',
        industry: 'Energy & Utilities',
        role: 'Admin',
        color: 'bg-amber-500',
    },
    {
        id: 'tenant-003',
        name: 'Solaris Logistics Co.',
        shortName: 'SLC',
        industry: 'Logistics',
        role: 'Viewer',
        color: 'bg-blue-500',
    },
];

const ROLE_META: Record<OrgRole, { icon: React.ReactNode; color: string; label: string; description: string }> = {
    Admin: {
        icon: <ShieldCheck size={11} />,
        color: 'text-amber-400 bg-amber-400/15 border-amber-400/30',
        label: 'Admin',
        description: 'Full access — manage users, config, and all data',
    },
    Analyst: {
        icon: <BarChart2 size={11} />,
        color: 'text-teal-400 bg-teal-400/15 border-teal-400/30',
        label: 'Analyst',
        description: 'Review, approve, reject, and correct records',
    },
    Viewer: {
        icon: <Eye size={11} />,
        color: 'text-blue-400 bg-blue-400/15 border-blue-400/30',
        label: 'Viewer',
        description: 'Read-only access to dashboards and reports',
    },
};

interface OrgSwitcherProps {
    collapsed?: boolean;
}

export default function OrgSwitcher({ collapsed = false }: OrgSwitcherProps) {
    const [activeOrgId, setActiveOrgId] = useState<string>(ORGANIZATIONS[0].id);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const activeOrg = ORGANIZATIONS.find((o) => o.id === activeOrgId) ?? ORGANIZATIONS[0];
    const roleMeta = ROLE_META[activeOrg.role];

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (collapsed) {
        return (
            <div className="mx-2 mb-1">
                <button
                    onClick={() => setOpen(!open)}
                    title={activeOrg.name}
                    className="w-full flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
                >
                    <div className={`w-7 h-7 rounded-md ${activeOrg.color} flex items-center justify-center`}>
                        <span className="text-2xs font-bold text-white leading-none">{activeOrg.shortName.slice(0, 2)}</span>
                    </div>
                </button>
            </div>
        );
    }

    return (
        <div ref={ref} className="mx-3 mt-3 mb-1 relative">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md bg-muted border border-border hover:border-primary/40 hover:bg-muted/80 transition-all duration-150 group"
            >
                {/* Org avatar */}
                <div className={`w-7 h-7 rounded-md ${activeOrg.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-2xs font-bold text-white leading-none">{activeOrg.shortName.slice(0, 2)}</span>
                </div>

                {/* Org info */}
                <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-semibold text-foreground truncate leading-tight">{activeOrg.name}</p>
                    <p className="text-2xs text-muted-foreground truncate leading-tight">{activeOrg.industry}</p>
                </div>

                {/* Role badge + chevron */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`inline-flex items-center gap-1 text-2xs font-semibold px-1.5 py-0.5 rounded border ${roleMeta.color}`}>
                        {roleMeta.icon}
                        {activeOrg.role}
                    </span>
                    <ChevronDown
                        size={12}
                        className={`text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-lg border border-border bg-card shadow-xl shadow-black/30 overflow-hidden">
                    {/* Header */}
                    <div className="px-3 py-2 border-b border-border bg-muted/50">
                        <p className="text-2xs text-muted-foreground uppercase tracking-wider font-medium">Switch Organization</p>
                    </div>

                    {/* Org list */}
                    <div className="py-1">
                        {ORGANIZATIONS.map((org) => {
                            const meta = ROLE_META[org.role];
                            const isActive = org.id === activeOrgId;
                            return (
                                <button
                                    key={org.id}
                                    onClick={() => { setActiveOrgId(org.id); setOpen(false); }}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${isActive ? 'bg-primary/10' : 'hover:bg-muted'
                                        }`}
                                >
                                    <div className={`w-7 h-7 rounded-md ${org.color} flex items-center justify-center flex-shrink-0`}>
                                        <span className="text-2xs font-bold text-white leading-none">{org.shortName.slice(0, 2)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-foreground truncate">{org.name}</p>
                                        <p className="text-2xs text-muted-foreground truncate">{org.industry}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <span className={`inline-flex items-center gap-1 text-2xs font-semibold px-1.5 py-0.5 rounded border ${meta.color}`}>
                                            {meta.icon}
                                            {org.role}
                                        </span>
                                        {isActive && <Check size={12} className="text-primary" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Role legend */}
                    <div className="border-t border-border bg-muted/30 px-3 py-2.5 space-y-1.5">
                        <p className="text-2xs text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Role Permissions</p>
                        {(Object.entries(ROLE_META) as [OrgRole, typeof ROLE_META[OrgRole]][]).map(([role, meta]) => (
                            <div key={role} className="flex items-start gap-2">
                                <span className={`inline-flex items-center gap-1 text-2xs font-semibold px-1.5 py-0.5 rounded border flex-shrink-0 mt-0.5 ${meta.color}`}>
                                    {meta.icon}
                                    {meta.label}
                                </span>
                                <p className="text-2xs text-muted-foreground leading-relaxed">{meta.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Manage orgs link */}
                    <div className="border-t border-border px-3 py-2">
                        <button className="w-full flex items-center gap-2 text-2xs text-muted-foreground hover:text-foreground transition-colors">
                            <Building2 size={11} />
                            <span>Manage organizations</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
