'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Leaf, ChevronDown, Lock, Mail, Building2, ArrowRight, ShieldCheck } from 'lucide-react';

const ORGS = [
    { id: 'meridian', name: 'Meridian Industrial Group', role: 'Admin', industry: 'Manufacturing' },
    { id: 'vantage', name: 'Vantage Energy Partners', role: 'Analyst', industry: 'Energy' },
    { id: 'solaris', name: 'Solaris Logistics Co.', role: 'Viewer', industry: 'Logistics' },
];

const ROLE_COLORS: Record<string, string> = {
    Admin: 'text-alert bg-alert/10 border-alert/30',
    Analyst: 'text-primary bg-primary/10 border-primary/30',
    Viewer: 'text-muted-foreground bg-muted border-border',
};

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState(ORGS[0]);
    const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email address';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1800);
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left panel — branding */}
            <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #0d1117 0%, #0a1a18 40%, #071512 100%)' }}>
                {/* Decorative grid */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                {/* Glow */}
                <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
                    style={{ background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)' }} />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8 blur-3xl"
                    style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <Leaf size={18} className="text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground tracking-tight">CarbonLedger</p>
                        <p className="text-2xs text-muted-foreground font-mono">Breathe ESG</p>
                    </div>
                </div>

                {/* Center content */}
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-2xs text-primary font-medium">
                            <ShieldCheck size={11} />
                            ISO 14064 · GHG Protocol · TCFD Aligned
                        </div>
                        <h1 className="text-4xl font-bold text-foreground leading-tight tracking-tight">
                            Enterprise Carbon<br />
                            <span className="text-primary">Intelligence Platform</span>
                        </h1>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                            Multi-source emissions ingestion, Scope 1/2/3 categorization, analyst review workflows, and audit-locked reporting — all in one platform.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { value: '3.2M', label: 'tCO₂e tracked', color: 'text-scope1' },
                            { value: '99.4%', label: 'Data accuracy', color: 'text-primary' },
                            { value: '47', label: 'Orgs onboarded', color: 'text-scope2' },
                        ].map((stat) => (
                            <div key={stat.label} className="card-elevated p-4 space-y-1">
                                <p className={`text-xl font-bold font-mono-nums ${stat.color}`}>{stat.value}</p>
                                <p className="text-2xs text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div className="relative z-10">
                    <p className="text-2xs text-muted-foreground">
                        © 2026 CarbonLedger · SOC 2 Type II · GDPR Compliant
                    </p>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-[400px] space-y-8 animate-fade-in">
                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                            <Leaf size={16} className="text-primary" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">CarbonLedger</p>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">Sign in</h2>
                        <p className="text-sm text-muted-foreground">Access your organisation's ESG workspace</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {/* Org selector */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <Building2 size={11} />
                                Organisation
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-md border border-border bg-input text-sm text-foreground hover:border-primary/50 transition-colors focus:outline-none focus:ring-1 focus:ring-primary/50"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-6 h-6 rounded bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                            <Building2 size={11} className="text-primary" />
                                        </div>
                                        <div className="min-w-0 text-left">
                                            <p className="text-sm font-medium text-foreground truncate">{selectedOrg.name}</p>
                                            <p className="text-2xs text-muted-foreground">{selectedOrg.industry}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                        <span className={`text-2xs font-medium px-1.5 py-0.5 rounded border ${ROLE_COLORS[selectedOrg.role]}`}>
                                            {selectedOrg.role}
                                        </span>
                                        <ChevronDown size={14} className={`text-muted-foreground transition-transform ${orgDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>

                                {orgDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 rounded-md border border-border bg-card shadow-xl z-50 overflow-hidden animate-slide-down">
                                        {ORGS.map((org) => (
                                            <button
                                                key={org.id}
                                                type="button"
                                                onClick={() => { setSelectedOrg(org); setOrgDropdownOpen(false); }}
                                                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-muted transition-colors ${selectedOrg.id === org.id ? 'bg-primary/5' : ''}`}
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${selectedOrg.id === org.id ? 'bg-primary/20 border border-primary/30' : 'bg-muted border border-border'}`}>
                                                        <Building2 size={11} className={selectedOrg.id === org.id ? 'text-primary' : 'text-muted-foreground'} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-foreground truncate">{org.name}</p>
                                                        <p className="text-2xs text-muted-foreground">{org.industry}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-2xs font-medium px-1.5 py-0.5 rounded border flex-shrink-0 ml-2 ${ROLE_COLORS[org.role]}`}>
                                                    {org.role}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <Mail size={11} />
                                Work Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
                                    placeholder="analyst@company.com"
                                    className={`w-full px-3.5 py-2.5 rounded-md border bg-input text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 transition-colors ${errors.email ? 'border-alert focus:ring-alert/50' : 'border-border focus:border-primary/50 focus:ring-primary/50'}`}
                                />
                            </div>
                            {errors.email && <p className="text-2xs text-alert flex items-center gap-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                    <Lock size={11} />
                                    Password
                                </label>
                                <button type="button" className="text-2xs text-primary hover:text-accent transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: undefined })); }}
                                    placeholder="••••••••"
                                    className={`w-full px-3.5 py-2.5 pr-10 rounded-md border bg-input text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 transition-colors ${errors.password ? 'border-alert focus:ring-alert/50' : 'border-border focus:border-primary/50 focus:ring-primary/50'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-2xs text-alert">{errors.password}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                                    Authenticating…
                                </>
                            ) : (
                                <>
                                    Sign in to {selectedOrg.name.split(' ')[0]}
                                    <ArrowRight size={15} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-2xs text-muted-foreground">or continue with SSO</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    <button
                        type="button"
                        className="w-full btn-ghost flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium"
                    >
                        <ShieldCheck size={15} />
                        Single Sign-On (SAML 2.0)
                    </button>

                    <p className="text-center text-2xs text-muted-foreground">
                        Need access?{' '}
                        <Link href="/user-management" className="text-primary hover:text-accent transition-colors font-medium">
                            Contact your administrator
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
