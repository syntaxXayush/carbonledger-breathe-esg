'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import OrgSwitcher from '@/components/OrgSwitcher';
import { LayoutDashboard, Upload, ClipboardList, ScrollText, Settings, ShieldCheck, ChevronLeft, ChevronRight, Bell, LogOut, User, Users, LogIn } from 'lucide-react';

interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: number;
    badgeType?: 'alert' | 'default';
}

const navItems: NavItem[] = [
    {
        id: 'nav-overview',
        label: 'Overview',
        href: '/',
        icon: <LayoutDashboard size={18} />,
    },
    {
        id: 'nav-ingestion',
        label: 'Ingestion',
        href: '/ingestion',
        icon: <Upload size={18} />,
        badge: 3,
        badgeType: 'default',
    },
    {
        id: 'nav-review-queue',
        label: 'Review Queue',
        href: '/review-queue',
        icon: <ClipboardList size={18} />,
        badge: 47,
        badgeType: 'alert',
    },
    {
        id: 'nav-audit-log',
        label: 'Audit Log',
        href: '/audit-log',
        icon: <ScrollText size={18} />,
    },
    {
        id: 'nav-user-management',
        label: 'User Management',
        href: '/user-management',
        icon: <Users size={18} />,
    },
    {
        id: 'nav-login',
        label: 'Login',
        href: '/login',
        icon: <LogIn size={18} />,
    },
    {
        id: 'nav-configuration',
        label: 'Configuration',
        href: '/configuration',
        icon: <Settings size={18} />,
    },
    {
        id: 'nav-admin',
        label: 'Admin',
        href: '/admin',
        icon: <ShieldCheck size={18} />,
    },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <aside
            className="relative flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out"
            style={{ width: collapsed ? '64px' : '240px', minHeight: '100vh' }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-border overflow-hidden">
                <AppLogo size={28} />
                {!collapsed && (
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-semibold text-foreground tracking-tight">
                            CarbonLedger
                        </span>
                        <span className="text-2xs text-muted-foreground mt-0.5 font-mono-nums">
                            Breathe ESG
                        </span>
                    </div>
                )}
            </div>

            {/* Org Switcher */}
            <OrgSwitcher collapsed={collapsed} />

            {/* Nav items */}
            <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">
                {collapsed && (
                    <div className="px-1 py-2">
                        <p className="text-2xs text-muted-foreground uppercase tracking-wider text-center">
                            ···
                        </p>
                    </div>
                )}

                {!collapsed && (
                    <p className="text-2xs text-muted-foreground uppercase tracking-wider px-3 pb-2 pt-1 font-medium">
                        Navigation
                    </p>
                )}

                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 relative group ${active ? 'nav-active' : 'nav-item'
                                } ${collapsed ? 'justify-center' : ''}`}
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            {!collapsed && (
                                <>
                                    <span className="flex-1 truncate">{item.label}</span>
                                    {item.badge !== undefined && (
                                        <span
                                            className={`text-2xs font-mono-nums font-semibold px-1.5 py-0.5 rounded-full ${item.badgeType === 'alert' ? 'bg-alert/20 text-alert' : 'bg-primary/20 text-primary'
                                                }`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                            {collapsed && item.badge !== undefined && (
                                <span
                                    className={`absolute top-1 right-1 w-2 h-2 rounded-full ${item.badgeType === 'alert' ? 'bg-alert' : 'bg-primary'
                                        }`}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="border-t border-border px-2 py-3 space-y-1">
                <button
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm nav-item"
                    title={collapsed ? 'Notifications' : undefined}
                >
                    <Bell size={16} className="flex-shrink-0" />
                    {!collapsed && <span className="flex-1 text-left">Alerts</span>}
                    {!collapsed && (
                        <span className="text-2xs font-mono-nums font-semibold px-1.5 py-0.5 rounded-full bg-alert/20 text-alert">
                            5
                        </span>
                    )}
                </button>

                <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-md ${collapsed ? 'justify-center' : ''}`}
                >
                    <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <User size={13} className="text-primary" />
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">
                                Priya Nair
                            </p>
                            <p className="text-2xs text-muted-foreground truncate">
                                Analyst
                            </p>
                        </div>
                    )}
                    {!collapsed && (
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <LogOut size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 z-10"
            >
                {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>
        </aside>
    );
}