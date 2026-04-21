import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import {
  Shield,
  Save,
  Check,
  X,
  Loader2,
  Eye,
  EyeOff,
  Globe,
  CreditCard,
  Mail,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertTriangle,
} from 'lucide-react';

// Types mirroring backend registry
interface ProviderKey {
  key: string;
  label: string;
  placeholder: string;
  isSecret: boolean;
  required?: boolean;
  value?: string;
  hasValue?: boolean;
}

interface Provider {
  provider: string;
  label: string;
  description: string;
  icon: string;
  isActive?: boolean;
  keys: ProviderKey[];
}

interface Category {
  category: string;
  label: string;
  icon: string;
  providers: Provider[];
}

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  ESIM_PROVIDER: <Globe className="w-5 h-5" />,
  PAYMENT: <CreditCard className="w-5 h-5" />,
  EMAIL: <Mail className="w-5 h-5" />,
};

export default function AdminSettingsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(
    new Set()
  );
  const [editState, setEditState] = useState<
    Record<string, Record<string, string>>
  >({});
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});
  const [savingProvider, setSavingProvider] = useState<string | null>(null);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<
    Record<string, { success: boolean; message: string }>
  >({});
  const [showSecrets, setShowSecrets] = useState<Set<string>>(new Set());
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  // Local fallback registry in case both API calls fail (e.g. migration not yet applied)
  const FALLBACK_REGISTRY: Category[] = [
    {
      category: 'ESIM_PROVIDER',
      label: 'Fournisseurs eSIM',
      icon: '🌐',
      providers: [
        {
          provider: 'AIRALO',
          label: 'Airalo',
          description: "Le plus grand fournisseur mondial d'eSIM.",
          icon: '✈️',
          keys: [
            {
              key: 'API_URL',
              label: "URL de l'API",
              placeholder: 'https://partners.airalo.com/v2',
              isSecret: false,
            },
            {
              key: 'CLIENT_ID',
              label: 'Client ID',
              placeholder: 'Votre Client ID',
              isSecret: true,
              required: true,
            },
            {
              key: 'CLIENT_SECRET',
              label: 'Client Secret',
              placeholder: 'Votre Client Secret',
              isSecret: true,
              required: true,
            },
            {
              key: 'MODE',
              label: 'Mode',
              placeholder: 'sandbox | production',
              isSecret: false,
            },
          ],
        },
        {
          provider: 'ESIMGO',
          label: 'eSIM.Go',
          description: "Plateforme B2B d'eSIM.",
          icon: '📡',
          keys: [
            {
              key: 'API_URL',
              label: "URL de l'API",
              placeholder: 'https://api.esim-go.com/v2',
              isSecret: false,
            },
            {
              key: 'API_KEY',
              label: 'Clé API',
              placeholder: 'Votre clé API',
              isSecret: true,
              required: true,
            },
          ],
        },
        {
          provider: 'SIMFONY',
          label: 'Simfony',
          description: 'Fournisseur eSIM alternatif.',
          icon: '📶',
          keys: [
            {
              key: 'API_URL',
              label: "URL de l'API",
              placeholder: 'https://api.simfony.com/v1',
              isSecret: false,
            },
            {
              key: 'API_KEY',
              label: 'Clé API',
              placeholder: 'Votre clé API',
              isSecret: true,
              required: true,
            },
            {
              key: 'API_SECRET',
              label: 'Secret API',
              placeholder: 'Votre secret',
              isSecret: true,
            },
          ],
        },
      ],
    },
    {
      category: 'PAYMENT',
      label: 'Passerelles de Paiement',
      icon: '💳',
      providers: [
        {
          provider: 'STRIPE',
          label: 'Stripe',
          description: 'Paiement par carte internationale.',
          icon: '💎',
          keys: [
            {
              key: 'SECRET_KEY',
              label: 'Clé Secrète',
              placeholder: 'sk_live_...',
              isSecret: true,
              required: true,
            },
            {
              key: 'PUBLISHABLE_KEY',
              label: 'Clé Publique',
              placeholder: 'pk_live_...',
              isSecret: false,
              required: true,
            },
            {
              key: 'WEBHOOK_SECRET',
              label: 'Webhook Secret',
              placeholder: 'whsec_...',
              isSecret: true,
            },
          ],
        },
        {
          provider: 'CIB',
          label: 'CIB (Carte Interbancaire)',
          description: 'Paiement par carte CIB algérienne.',
          icon: '🏦',
          keys: [
            {
              key: 'MERCHANT_ID',
              label: 'Merchant ID',
              placeholder: 'Votre Merchant ID',
              isSecret: false,
              required: true,
            },
            {
              key: 'TERMINAL_ID',
              label: 'Terminal ID',
              placeholder: 'Votre Terminal ID',
              isSecret: false,
            },
            {
              key: 'SECRET_KEY',
              label: 'Clé Secrète',
              placeholder: 'Votre clé secrète',
              isSecret: true,
              required: true,
            },
            {
              key: 'API_URL',
              label: "URL de l'API",
              placeholder: 'https://payment.cib.dz/api',
              isSecret: false,
            },
          ],
        },
        {
          provider: 'EDAHABIA',
          label: 'Edahabia (Algérie Poste)',
          description: 'Paiement via carte Edahabia.',
          icon: '📮',
          keys: [
            {
              key: 'MERCHANT_ID',
              label: 'Merchant ID',
              placeholder: 'Votre Merchant ID',
              isSecret: false,
              required: true,
            },
            {
              key: 'API_KEY',
              label: 'Clé API',
              placeholder: 'Votre clé API',
              isSecret: true,
              required: true,
            },
            {
              key: 'SECRET_KEY',
              label: 'Clé Secrète',
              placeholder: 'Votre clé secrète',
              isSecret: true,
              required: true,
            },
            {
              key: 'API_URL',
              label: "URL de l'API",
              placeholder: 'https://epay.poste.dz/api',
              isSecret: false,
            },
          ],
        },
      ],
    },
    {
      category: 'EMAIL',
      label: 'Email & Notifications',
      icon: '📧',
      providers: [
        {
          provider: 'SMTP',
          label: 'Serveur SMTP',
          description: "Configuration du serveur d'envoi d'emails.",
          icon: '✉️',
          keys: [
            {
              key: 'HOST',
              label: 'Hôte SMTP',
              placeholder: 'smtp.gmail.com',
              isSecret: false,
              required: true,
            },
            {
              key: 'PORT',
              label: 'Port',
              placeholder: '587',
              isSecret: false,
              required: true,
            },
            {
              key: 'USER',
              label: 'Utilisateur',
              placeholder: 'votre@email.com',
              isSecret: false,
              required: true,
            },
            {
              key: 'PASS',
              label: 'Mot de passe',
              placeholder: 'Mot de passe SMTP',
              isSecret: true,
              required: true,
            },
            {
              key: 'FROM',
              label: 'Email expéditeur',
              placeholder: 'noreply@soufsim.com',
              isSecret: false,
            },
            {
              key: 'SECURE',
              label: 'SSL/TLS (true/false)',
              placeholder: 'false',
              isSecret: false,
            },
          ],
        },
      ],
    },
  ];

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await api.get('/admin/settings');
      const data: Category[] = res.data.data;

      if (data && data.length > 0) {
        setCategories(data);
      } else {
        // API returned empty — use fallback
        setCategories(FALLBACK_REGISTRY);
      }

      // Initialize active states
      const actives: Record<string, boolean> = {};
      (data && data.length > 0 ? data : FALLBACK_REGISTRY).forEach((cat) =>
        cat.providers.forEach((prov) => {
          actives[`${cat.category}::${prov.provider}`] = prov.isActive || false;
        })
      );
      setActiveStates(actives);
    } catch (err: any) {
      console.error('Failed to fetch settings:', err);
      // Use fallback registry so the UI is always usable
      setCategories(FALLBACK_REGISTRY);
      setFetchError(
        "La base de données n'est pas encore prête. Vous pouvez configurer vos clés — elles seront sauvegardées dès que la migration sera appliquée."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (key: string) => {
    setExpandedProviders((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleSecret = (fieldKey: string) => {
    setShowSecrets((prev) => {
      const next = new Set(prev);
      if (next.has(fieldKey)) next.delete(fieldKey);
      else next.add(fieldKey);
      return next;
    });
  };

  const getEditValue = (
    category: string,
    provider: string,
    key: string
  ): string => {
    return editState[`${category}::${provider}`]?.[key] ?? '';
  };

  const setEditValue = (
    category: string,
    provider: string,
    key: string,
    value: string
  ) => {
    setEditState((prev) => ({
      ...prev,
      [`${category}::${provider}`]: {
        ...prev[`${category}::${provider}`],
        [key]: value,
      },
    }));
  };

  const handleSave = async (
    category: string,
    provider: string,
    keys: ProviderKey[]
  ) => {
    const provKey = `${category}::${provider}`;
    setSavingProvider(provKey);
    setSaveSuccess(null);

    try {
      const payload = keys
        .map((k) => ({
          key: k.key,
          value: getEditValue(category, provider, k.key),
        }))
        .filter((k) => k.value.trim() !== '');

      await api.put(`/admin/settings/${category}/${provider}`, {
        keys: payload,
        isActive: activeStates[provKey] ?? true,
      });

      setSaveSuccess(provKey);
      setTimeout(() => setSaveSuccess(null), 3000);

      // Clear edit fields and refresh
      setEditState((prev) => ({ ...prev, [provKey]: {} }));
      await fetchSettings();
    } catch (err: any) {
      console.error('Save failed:', err);
      setTestResults((prev) => ({
        ...prev,
        [provKey]: {
          success: false,
          message: err?.response?.data?.message || 'Erreur de sauvegarde',
        },
      }));
    } finally {
      setSavingProvider(null);
    }
  };

  const handleTest = async (category: string, provider: string) => {
    const provKey = `${category}::${provider}`;
    setTestingProvider(provKey);
    setTestResults((prev) => ({ ...prev, [provKey]: undefined as any }));

    try {
      const res = await api.post(
        `/admin/settings/test/${category}/${provider}`
      );
      setTestResults((prev) => ({ ...prev, [provKey]: res.data.data }));
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [provKey]: {
          success: false,
          message:
            err?.response?.data?.data?.message ||
            err?.response?.data?.message ||
            'Erreur de connexion',
        },
      }));
    } finally {
      setTestingProvider(null);
    }
  };

  const toggleActive = (category: string, provider: string) => {
    const provKey = `${category}::${provider}`;
    setActiveStates((prev) => ({ ...prev, [provKey]: !prev[provKey] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/25">
          <Shield className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Paramètres & Intégrations
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configurez vos fournisseurs eSIM, passerelles de paiement et serveur
            email.
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Zone Sécurisée</p>
          <p className="text-xs text-amber-700 mt-1">
            Les clés API sont chiffrées (AES-256-GCM) avant d'être stockées en
            base de données. Seul le Super Administrateur peut accéder à cette
            page. Les valeurs sensibles sont masquées.
          </p>
        </div>
      </div>

      {/* DB Error Banner */}
      {fetchError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <Loader2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0 animate-spin" />
          <div>
            <p className="text-sm font-semibold text-blue-800">
              Migration en cours
            </p>
            <p className="text-xs text-blue-700 mt-1">{fetchError}</p>
          </div>
        </div>
      )}

      {/* Categories */}
      {categories.map((cat) => (
        <div key={cat.category} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
              {categoryIcons[cat.category] || <Globe className="w-5 h-5" />}
            </div>
            <h2 className="text-lg font-bold text-slate-800">{cat.label}</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {cat.providers.map((prov) => {
              const provKey = `${cat.category}::${prov.provider}`;
              const isExpanded = expandedProviders.has(provKey);
              const isActive = activeStates[provKey] ?? false;
              const isSaving = savingProvider === provKey;
              const isTesting = testingProvider === provKey;
              const testResult = testResults[provKey];
              const isSaved = saveSuccess === provKey;
              const hasAnyValue = prov.keys.some((k) => k.hasValue);

              return (
                <motion.div
                  key={prov.provider}
                  layout
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isActive
                      ? 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                      : 'bg-slate-50 border-slate-200/60 opacity-75'
                  }`}
                >
                  {/* Provider Header */}
                  <button
                    onClick={() => toggleExpand(provKey)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{prov.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-800">
                            {prov.label}
                          </h3>
                          {hasAnyValue && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isActive
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {isActive ? 'Actif' : 'Inactif'}
                            </span>
                          )}
                          {!hasAnyValue && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-600">
                              Non configuré
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {prov.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-slate-100"
                      >
                        <div className="p-5 space-y-4">
                          {/* Active Toggle */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">
                              Fournisseur actif
                            </span>
                            <button
                              onClick={() =>
                                toggleActive(cat.category, prov.provider)
                              }
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                isActive ? 'bg-emerald-500' : 'bg-slate-300'
                              }`}
                            >
                              <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                  isActive ? 'translate-x-6' : ''
                                }`}
                              />
                            </button>
                          </div>

                          {/* Key Fields */}
                          <div className="space-y-3">
                            {prov.keys.map((keyDef) => {
                              const fieldId = `${provKey}::${keyDef.key}`;
                              const isSecretVisible = showSecrets.has(fieldId);
                              const editVal = getEditValue(
                                cat.category,
                                prov.provider,
                                keyDef.key
                              );

                              return (
                                <div key={keyDef.key}>
                                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
                                    {keyDef.label}
                                    {keyDef.required && (
                                      <span className="text-red-400">*</span>
                                    )}
                                  </label>
                                  <div className="relative">
                                    <input
                                      type={
                                        keyDef.isSecret && !isSecretVisible
                                          ? 'password'
                                          : 'text'
                                      }
                                      value={editVal}
                                      onChange={(e) =>
                                        setEditValue(
                                          cat.category,
                                          prov.provider,
                                          keyDef.key,
                                          e.target.value
                                        )
                                      }
                                      placeholder={
                                        keyDef.hasValue
                                          ? `Actuel: ${keyDef.value} (laisser vide pour conserver)`
                                          : keyDef.placeholder
                                      }
                                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-400"
                                    />
                                    {keyDef.isSecret && (
                                      <button
                                        type="button"
                                        onClick={() => toggleSecret(fieldId)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                      >
                                        {isSecretVisible ? (
                                          <EyeOff className="w-4 h-4" />
                                        ) : (
                                          <Eye className="w-4 h-4" />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Test Result */}
                          {testResult && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex items-start gap-2 p-3 rounded-xl text-sm ${
                                testResult.success
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}
                            >
                              {testResult.success ? (
                                <Check className="w-4 h-4 mt-0.5 shrink-0" />
                              ) : (
                                <X className="w-4 h-4 mt-0.5 shrink-0" />
                              )}
                              <span>{testResult.message}</span>
                            </motion.div>
                          )}

                          {/* Success message */}
                          {isSaved && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-2 p-3 rounded-xl text-sm bg-emerald-50 text-emerald-700 border border-emerald-200"
                            >
                              <Check className="w-4 h-4" />
                              <span>
                                Configuration sauvegardée avec succès !
                              </span>
                            </motion.div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 pt-2">
                            <button
                              onClick={() =>
                                handleSave(
                                  cat.category,
                                  prov.provider,
                                  prov.keys
                                )
                              }
                              disabled={isSaving}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
                            >
                              {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                            </button>

                            <button
                              onClick={() =>
                                handleTest(cat.category, prov.provider)
                              }
                              disabled={isTesting || !hasAnyValue}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200"
                            >
                              {isTesting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Zap className="w-4 h-4" />
                              )}
                              {isTesting
                                ? 'Test en cours...'
                                : 'Tester la connexion'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
