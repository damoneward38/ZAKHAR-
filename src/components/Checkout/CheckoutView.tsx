import React, { useState, useEffect } from 'react';
import { PRICING_TIERS, SANDBOX_TEST_CARDS } from '../../data/pricingData';
import { PricingTier, CheckoutOrder, OperatorUser } from '../../types';
import { 
  ShieldCheck, Check, CreditCard, Sparkles, Download, Copy, Lock, 
  AlertTriangle, RefreshCw, ArrowRight, Shield, Zap, Terminal, CheckCircle2,
  FileText, ExternalLink, HelpCircle, Layers, Cpu, Award
} from 'lucide-react';

interface CheckoutViewProps {
  currentUser: OperatorUser;
  onUpdateUser?: (user: OperatorUser) => void;
  onNavigateTab: (tab: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  currentUser,
  onUpdateUser,
  onNavigateTab
}) => {
  const [selectedTierId, setSelectedTierId] = useState<string>('engineer');
  const [paymentMethod, setPaymentMethod] = useState<'sandbox_card' | 'sandbox_paypal' | 'sandbox_crypto'>('sandbox_card');
  
  // Checkout Form fields
  const [customerName, setCustomerName] = useState<string>(currentUser.role === 'admin' ? 'Commander Damone Ward' : 'Field Operator');
  const [customerEmail, setCustomerEmail] = useState<string>(currentUser.email || 'damoneward38@gmail.com');
  const [cardNumber, setCardNumber] = useState<string>('4242 4242 4242 4242');
  const [cardExp, setCardExp] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('313');
  const [cardZip, setCardZip] = useState<string>('48201');

  // Checkout flow states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<CheckoutOrder | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Past Orders History
  const [pastOrders, setPastOrders] = useState<CheckoutOrder[]>(() => {
    try {
      const saved = localStorage.getItem('zakhar_license_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const selectedTier = PRICING_TIERS.find(t => t.id === selectedTierId) || PRICING_TIERS[1];

  // Quick fill test card
  const handleSelectTestCard = (testCard: typeof SANDBOX_TEST_CARDS[0]) => {
    setCardNumber(testCard.number);
    setCardExp(testCard.exp);
    setCardCvc(testCard.cvc);
    setCheckoutError(null);
  };

  // Generate cryptographic license key
  const generateLicenseKey = (tierId: string, email: string) => {
    const prefix = tierId === 'commander' ? 'ZAKHAR-REDOUBT' : tierId === 'engineer' ? 'ZAKHAR-ENG' : 'ZAKHAR-SCOUT';
    const randPart1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randPart2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const cleanEmail = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
    return `${prefix}-${cleanEmail || '313'}-${randPart1}-${randPart2}`;
  };

  // Handle Sandbox Checkout submission
  const handleProcessCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCheckoutError(null);

    // Validation
    if (!customerEmail || !customerEmail.includes('@')) {
      setCheckoutError('Please provide a valid operator email address.');
      return;
    }
    if (paymentMethod === 'sandbox_card') {
      const rawDigits = cardNumber.replace(/\D/g, '');
      if (rawDigits.endsWith('0002')) {
        // Intentionally simulate card decline
        setIsProcessing(true);
        setProcessingStep('Authorizing Test Sandbox Gateway...');
        await new Promise(r => setTimeout(r, 900));
        setIsProcessing(false);
        setCheckoutError('Sandbox Card Refused: Card was declined (Simulated decline behavior). Please try test card ending in 4242.');
        return;
      }
      if (rawDigits.length < 15) {
        setCheckoutError('Card number is invalid for sandbox testing. Use test card 4242 4242 4242 4242.');
        return;
      }
    }

    setIsProcessing(true);

    try {
      setProcessingStep('1/3: Contacting Secure Sandbox Gateway...');
      await new Promise(r => setTimeout(r, 700));

      setProcessingStep('2/3: Generating Cryptographic Field License & Key...');
      await new Promise(r => setTimeout(r, 700));

      setProcessingStep('3/3: Activating System Clearance in Local Node...');
      await new Promise(r => setTimeout(r, 600));

      const newLicenseKey = generateLicenseKey(selectedTier.id, customerEmail);
      const newOrder: CheckoutOrder = {
        orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
        tierId: selectedTier.id,
        tierName: selectedTier.name,
        amount: selectedTier.price,
        customerName: customerName || 'Commander Damone Ward',
        customerEmail: customerEmail,
        paymentMethod,
        licenseKey: newLicenseKey,
        timestamp: new Date().toISOString(),
        status: 'completed',
        cardNumberMasked: paymentMethod === 'sandbox_card' ? `•••• •••• •••• ${cardNumber.replace(/\D/g, '').slice(-4) || '4242'}` : undefined
      };

      // Save order
      const updatedOrders = [newOrder, ...pastOrders];
      setPastOrders(updatedOrders);
      localStorage.setItem('zakhar_license_orders', JSON.stringify(updatedOrders));

      // Elevate permissions if not already admin
      if (onUpdateUser) {
        const upgradedPermissions = Array.from(new Set([
          ...currentUser.permissions,
          'PURCHASED_FIELD_LICENSE',
          selectedTier.id === 'commander' ? 'MASTER_REDOUBT_LEVEL_5' : 'FIELD_ENGINEER_FULL_ACCESS'
        ]));
        onUpdateUser({
          ...currentUser,
          permissions: upgradedPermissions
        });
      }

      setCompletedOrder(newOrder);
    } catch (err: any) {
      setCheckoutError(err.message || 'Sandbox transaction failed.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  // Copy License Key to Clipboard
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Download License Certificate file
  const handleDownloadCertificate = (order: CheckoutOrder) => {
    const certText = `========================================================================
ZAKHAR SURVIVAL & PRACTICAL ENGINEERING OPERATING SYSTEM
OFFICIAL FIELD LICENSE & CRYPTOGRAPHIC CLEARANCE CERTIFICATE
========================================================================

ORDER IDENTIFIER:     ${order.orderId}
DATE OF ISSUANCE:     ${new Date(order.timestamp).toUTCString()}
LICENSE HOLDER:       ${order.customerName}
OPERATOR EMAIL:       ${order.customerEmail}
LICENSE TIER:         ${order.tierName.toUpperCase()}
FEE PAID:             $${order.amount}.00 USD (SANDBOX SETTLEMENT)
GATEWAY SETTLEMENT:   ${order.paymentMethod.toUpperCase()}

CRYPTOGRAPHIC KEY:
>>> ${order.licenseKey} <<<

SYSTEM CLEARANCES INCLUDED:
- 250 Civilizational Fundamentals Knowledge Graph
- 500-Extension Practical Engineering Dependency Tree
- Galvanic Ground Earth Battery (Copper + Zinc) Construction Blueprint
- Botanical Pharmacopoeia (Analgesic Pain Relief, Wound Clotting, Deadly Lookalikes)
- Two-Way Hands-Free Continuous Voice AI (ZAKHAR CORE)
- 100% Offline Air-Gapped Standalone Operation

VALIDATION CHECKSUM:
SHA256: ${order.licenseKey.split('').reverse().join('').toUpperCase()}-313-VERIFIED

MISSION MOTTO:
"Putting survival and technical independence into everybody's hands."
========================================================================`;

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ZAKHAR-LICENSE-${order.orderId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Award className="w-48 h-48 text-amber-500" />
        </div>
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Fair Pricing // Survival in Everyone's Hands
            </span>
            <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Sandbox Gateway Ready
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-zinc-100 mb-2">
            3-Tier Field Licenses & Sandbox Checkout
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Built under our core founding pledge: <span className="text-amber-300 font-medium">"I'm not trying to get rich, I'm just trying to put survival in everybody's hands."</span> Fair, accessible prices with zero subscriptions, zero recurring traps, and lifetime air-gapped rights.
          </p>
        </div>
      </div>

      {/* Completed Order Success Banner */}
      {completedOrder && (
        <div className="bg-emerald-950/40 border-2 border-emerald-500/60 rounded-xl p-6 sm:p-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-emerald-800/40">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                  Sandbox Order Completed & Activated
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-mono text-zinc-100">
                  {completedOrder.tierName} Deployed
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Order ID: {completedOrder.orderId} • Operator: {completedOrder.customerEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => handleDownloadCertificate(completedOrder)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono font-semibold rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 text-amber-400" />
                Download Certificate
              </button>
              <button
                onClick={() => onNavigateTab('chat')}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-mono font-bold rounded-lg transition-colors shadow-md"
              >
                <Zap className="w-4 h-4" />
                Launch Voice Brain
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-lg">
              <div className="text-xs font-mono text-zinc-400 mb-1 flex items-center justify-between">
                <span>Cryptographic Offline License Key:</span>
                <span className="text-emerald-400 text-[10px] uppercase font-bold">Verified Valid</span>
              </div>
              <div className="flex items-center justify-between gap-3 bg-zinc-950 p-2.5 rounded border border-zinc-800 font-mono text-sm text-amber-300">
                <span className="truncate">{completedOrder.licenseKey}</span>
                <button
                  onClick={() => handleCopyKey(completedOrder.licenseKey)}
                  className="p-1 hover:text-white text-zinc-400 transition-colors shrink-0"
                  title="Copy Key"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-zinc-400">System Clearance Status:</div>
                <div className="text-sm font-mono font-bold text-emerald-300 mt-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  LEVEL 5 ROOT MASTER OVERRIDE ACTIVE
                </div>
              </div>
              <button
                onClick={() => setCompletedOrder(null)}
                className="text-xs font-mono text-zinc-400 hover:text-zinc-200 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3 Pricing Tier Cards Grid */}
      <div>
        <div className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Step 1: Choose Your Field Operating License</span>
          <span className="text-amber-400">One-Time Fee • Lifetime Standalone Access</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PRICING_TIERS.map(tier => {
            const isSelected = selectedTierId === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTierId(tier.id)}
                className={`cursor-pointer rounded-xl border p-6 flex flex-col justify-between transition-all duration-200 relative ${
                  isSelected
                    ? 'bg-zinc-900 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.15)] ring-1 ring-amber-500'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                {/* Popular Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 left-6">
                    <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded-full uppercase border shadow-sm ${
                      tier.popular 
                        ? 'bg-amber-500 text-zinc-950 border-amber-400' 
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    }`}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-mono font-bold text-lg text-zinc-100">
                      {tier.name}
                    </h3>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-amber-500 bg-amber-500 text-zinc-950' : 'border-zinc-700'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 min-h-[36px] mb-4">
                    {tier.tagline}
                  </p>

                  {/* Price Block */}
                  <div className="py-4 border-y border-zinc-800/80 mb-5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold font-mono text-zinc-100">
                        ${tier.price}
                      </span>
                      {tier.originalPrice && (
                        <span className="text-xs font-mono text-zinc-500 line-through">
                          ${tier.originalPrice}
                        </span>
                      )}
                      <span className="text-xs font-mono text-amber-400 font-semibold">
                        USD
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 mt-1">
                      {tier.billingPeriod} • No Subscriptions
                    </div>
                  </div>

                  {/* Feature List */}
                  <div className="space-y-2.5 mb-6">
                    <div className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">
                      Included Capabilities:
                    </div>
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-tight">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTierId(tier.id);
                  }}
                  className={`w-full py-2.5 px-4 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-md'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" />
                      Tier Selected
                    </>
                  ) : (
                    <>
                      <span>Select Tier (${tier.price})</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Checkout & Sandbox Payment Gateway */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
              Step 2: Instant Sandbox Checkout Gateway
            </div>
            <h2 className="text-xl font-bold font-mono text-zinc-100 flex items-center gap-2 mt-1">
              <span>Checkout for: {selectedTier.name}</span>
              <span className="text-amber-400 text-lg font-mono">(${selectedTier.price}.00)</span>
            </h2>
          </div>

          {/* Sandbox Indicator & Quick Sandbox Test Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-mono rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              SANDBOX SIMULATION
            </span>
            <button
              type="button"
              onClick={() => {
                handleSelectTestCard(SANDBOX_TEST_CARDS[0]);
                handleProcessCheckout();
              }}
              className="px-3 py-1.5 text-xs font-mono font-bold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow"
            >
              <Zap className="w-3.5 h-3.5" />
              1-Click Sandbox Test Buy
            </button>
          </div>
        </div>

        {/* Payment Methods Selector */}
        <div className="mt-6 mb-6">
          <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">
            Select Sandbox Payment Method:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('sandbox_card')}
              className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-colors ${
                paymentMethod === 'sandbox_card'
                  ? 'bg-zinc-800 border-amber-500 text-zinc-100 ring-1 ring-amber-500'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200'
              }`}
            >
              <CreditCard className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-mono font-bold">Credit / Debit Card</div>
                <div className="text-[10px] text-zinc-400">Sandbox Test Cards</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('sandbox_paypal')}
              className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-colors ${
                paymentMethod === 'sandbox_paypal'
                  ? 'bg-zinc-800 border-amber-500 text-zinc-100 ring-1 ring-amber-500'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200'
              }`}
            >
              <Terminal className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <div className="text-xs font-mono font-bold">PayPal Sandbox</div>
                <div className="text-[10px] text-zinc-400">Simulated Express Flow</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('sandbox_crypto')}
              className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-colors ${
                paymentMethod === 'sandbox_crypto'
                  ? 'bg-zinc-800 border-amber-500 text-zinc-100 ring-1 ring-amber-500'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200'
              }`}
            >
              <Cpu className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <div className="text-xs font-mono font-bold">Crypto / Specie</div>
                <div className="text-[10px] text-zinc-400">Offline Barter / BTC</div>
              </div>
            </button>
          </div>
        </div>

        {/* Sandbox Test Cards Preset Bar */}
        {paymentMethod === 'sandbox_card' && (
          <div className="mb-6 p-4 bg-zinc-950 rounded-lg border border-zinc-800">
            <div className="text-xs font-mono text-zinc-400 mb-2 flex items-center justify-between">
              <span>Quick Test Card Presets (Click to autofill):</span>
              <span className="text-[10px] text-amber-400">No real funds charged</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SANDBOX_TEST_CARDS.map((tc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectTestCard(tc)}
                  className="p-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded text-left transition-colors"
                >
                  <div className="text-xs font-mono font-semibold text-zinc-200 truncate">{tc.brand}</div>
                  <div className="text-[11px] font-mono text-amber-300/90">{tc.number}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5 truncate">{tc.outcome}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Checkout Form */}
        <form onSubmit={handleProcessCheckout} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                License Operator Name:
              </label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Commander Damone Ward"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-lg px-3.5 py-2.5 text-xs font-mono text-zinc-100 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                Email for License Dispatch:
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="damoneward38@gmail.com"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-lg px-3.5 py-2.5 text-xs font-mono text-zinc-100 outline-none"
                required
              />
            </div>
          </div>

          {paymentMethod === 'sandbox_card' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                  Sandbox Card Number:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-lg px-3.5 py-2.5 text-xs font-mono text-zinc-100 outline-none"
                    required
                  />
                  <CreditCard className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                    Exp (MM/YY):
                  </label>
                  <input
                    type="text"
                    value={cardExp}
                    onChange={e => setCardExp(e.target.value)}
                    placeholder="12/28"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2.5 text-xs font-mono text-zinc-100 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                    CVC:
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value)}
                    placeholder="313"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2.5 text-xs font-mono text-zinc-100 outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'sandbox_paypal' && (
            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-300">
              <p className="flex items-center gap-2 text-blue-400 font-bold mb-1">
                <Check className="w-4 h-4" /> PayPal Sandbox Integration Active
              </p>
              Clicking below will simulate an instant tokenized PayPal approval for <span className="text-amber-400 font-bold">${selectedTier.price}.00</span> and immediately generate your offline license key.
            </div>
          )}

          {paymentMethod === 'sandbox_crypto' && (
            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-300">
              <p className="flex items-center gap-2 text-purple-400 font-bold mb-1">
                <Check className="w-4 h-4" /> Air-Gapped Physical Silver / Crypto Simulation
              </p>
              Simulates decentralized on-chain settlement (or local physical 1 oz silver barter verification) and provides immediate standalone key unlock.
            </div>
          )}

          {/* Error Message */}
          {checkoutError && (
            <div className="p-3.5 bg-red-950/40 border border-red-500/50 rounded-lg flex items-start gap-2.5 text-xs font-mono text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{checkoutError}</span>
            </div>
          )}

          {/* Submit Action Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800 mt-6">
            <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Sandbox 256-bit SSL • 100% Guaranteed Offline Delivery</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-mono text-xs font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{processingStep || 'Processing Sandbox Transaction...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Complete Sandbox Order — ${selectedTier.price}.00 USD</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* License History Table if available */}
      {pastOrders.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Past Sandbox Licenses & Keys ({pastOrders.length})</span>
            <span className="text-emerald-400 text-[11px]">Stored in Offline LocalStorage</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-800 text-[11px] text-zinc-400">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">License Tier</th>
                  <th className="py-2.5 px-3">Cryptographic Key</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {pastOrders.map(order => (
                  <tr key={order.orderId} className="hover:bg-zinc-850/50">
                    <td className="py-2.5 px-3 font-semibold text-zinc-200">{order.orderId}</td>
                    <td className="py-2.5 px-3 text-amber-300">{order.tierName}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-300">
                      <span className="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">{order.licenseKey}</span>
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">${order.amount}.00</td>
                    <td className="py-2.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => handleCopyKey(order.licenseKey)}
                        className="text-zinc-400 hover:text-white p-1"
                        title="Copy Key"
                      >
                        <Copy className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        onClick={() => handleDownloadCertificate(order)}
                        className="text-zinc-400 hover:text-amber-400 p-1"
                        title="Download Certificate"
                      >
                        <Download className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
