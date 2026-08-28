import { useState } from 'react'
import { User as UserIcon, Bell, Shield, Palette, KeyRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/common/Toast'

type Tab = 'profile' | 'notifications' | 'security' | 'appearance'

export default function Settings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [tab, setTab] = useState<Tab>('profile')

  const tabs: { id: Tab; label: string; icon: typeof UserIcon }[] = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]

  const [name, setName] = useState(user?.name ?? 'Krishna Kumar')
  const [email] = useState(user?.email ?? '')
  const [department] = useState(user?.department ?? '')
  const [notifPrefs, setNotifPrefs] = useState({
    documentProcessing: true,
    knowledgeGaps: true,
    securityAlerts: true,
    weeklyDigest: false,
  })

  const save = (section: string) => toast('success', `${section} saved successfully`)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title text-2xl font-bold">Settings</h1>
        <p className="page-subtitle">Manage your account preferences and workspace configuration.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="card p-3">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  tab === t.id ? 'bg-brand-blue/10 text-brand-blue' : 'text-muted hover:bg-surface-muted'
                }`}
              >
                <t.icon className="h-[18px] w-[18px]" />
                {t.label}
              </button>
            ))}
          </div>
          <div className="mt-4 card flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
              <Shield className="h-5 w-5" />
            </div>
            <div className="text-xs text-muted">
              <p className="font-semibold text-green-700 dark:text-green-400">Account secure</p>
              <p>Protected by RBAC</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="card p-6">
            {tab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-ink">{name}</p>
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize text-brand-blue border-brand-blue/30 bg-brand-blue/10">
                      {user?.role ?? 'employee'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Full Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input value={email} disabled className="input bg-surface-muted text-faint" />
                  </div>
                  <div>
                    <label className="label">Department</label>
                    <input value={department} disabled className="input bg-surface-muted text-faint" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={() => save('Profile')} className="btn-primary">Save Changes</button>
                </div>
              </div>
            )}

            {tab === 'notifications' && (
              <div className="space-y-4">
                {[
                  { key: 'documentProcessing' as const, label: 'Document Processing Complete', desc: 'Get notified when an uploaded document is processed' },
                  { key: 'knowledgeGaps' as const, label: 'Knowledge Gap Detected', desc: 'Alert when a frequent question has no answer' },
                  { key: 'securityAlerts' as const, label: 'Security Alerts', desc: 'Unauthorized access attempts and security events' },
                  { key: 'weeklyDigest' as const, label: 'Weekly Digest', desc: 'Weekly summary of your knowledge activity' },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-ink">{n.label}</p>
                      <p className="text-xs text-muted">{n.desc}</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={notifPrefs[n.key]}
                      onClick={() => setNotifPrefs({ ...notifPrefs, [n.key]: !notifPrefs[n.key] })}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition ${notifPrefs[n.key] ? 'bg-brand-blue' : 'bg-surface-soft'}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow transition-all ${notifPrefs[n.key] ? 'left-[22px]' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button onClick={() => save('Notification preferences')} className="btn-primary">Save Preferences</button>
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div className="space-y-5">
                <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/60 px-4 py-3 dark:border-green-500/20 dark:bg-green-500/10">
                  <Shield className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" />
                  <div className="text-sm text-green-800 dark:text-green-400">
                    <p className="font-semibold">Password &amp; Security</p>
                    <p className="mt-0.5 text-green-700 dark:text-green-400">Your account uses enterprise single sign-on with multi-factor authentication.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="label">New Password</label>
                    <input type="password" placeholder="Enter a new password" className="input" />
                  </div>
                  <div>
                    <label className="label">Confirm New Password</label>
                    <input type="password" placeholder="Confirm your new password" className="input" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={() => save('Security settings')} className="btn-primary">
                    <KeyRound className="h-4 w-4" /> Update Password
                  </button>
                </div>
              </div>
            )}

            {tab === 'appearance' && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-ink">Theme</p>
                  <p className="text-xs text-muted">Sentinel AI uses a light enterprise theme for clarity.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {['Enterprise Light', 'Corporate Dark', 'Calm Contrast'].map((t, i) => (
                    <button
                      key={t}
                      onClick={() => toast('info', `${t} theme is not available in this build`)}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-6 text-sm font-medium transition ${
                        i === 0 ? 'border-brand-blue/40 bg-brand-blue/10 text-brand-blue' : 'border-line text-muted hover:border-line'
                      }`}
                    >
                      <Palette className="h-4 w-4" />
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
