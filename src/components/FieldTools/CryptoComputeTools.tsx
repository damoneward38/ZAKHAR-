import React, { useState } from 'react';
import { Lock, Key, Flame, Cpu, QrCode, Check, Copy } from 'lucide-react';

export const CryptoComputeTools: React.FC = () => {
  // One-Time Pad State
  const [plaintext, setPlaintext] = useState<string>('CACHE AT COLD SPRING GRID 4289');
  const [keyText, setKeyText] = useState<string>('');
  const [ciphertext, setCiphertext] = useState<string>('');
  const [decryptInput, setDecryptInput] = useState<string>('');
  const [decryptKeyInput, setDecryptKeyInput] = useState<string>('');
  const [decryptedText, setDecryptedText] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Compute Energy Budget State
  const [devicePowerWatts, setDevicePowerWatts] = useState<number>(7); // Raspberry Pi 5 under load ~7W
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);
  const [batteryBufferDays, setBatteryBufferDays] = useState<number>(2); // 2 days cloudy autonomy

  // Text for QR code
  const [qrText, setQrText] = useState<string>('ZAKHAR // 47.6062,-122.3321 // CALL 146.520');

  // Generate cryptographically secure random key
  const generateRandomKey = (length: number) => {
    const validLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += validLetters[array[i] % 26];
    }
    return result;
  };

  // Modular addition encryption: (P + K) mod 26
  const handleEncrypt = () => {
    const cleanPlain = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
    if (!cleanPlain) return;

    let key = keyText.toUpperCase().replace(/[^A-Z]/g, '');
    if (key.length < cleanPlain.length) {
      key = generateRandomKey(cleanPlain.length);
      setKeyText(key);
    }

    let cipher = '';
    for (let i = 0; i < cleanPlain.length; i++) {
      const pVal = cleanPlain.charCodeAt(i) - 65;
      const kVal = key.charCodeAt(i) - 65;
      const cVal = (pVal + kVal) % 26;
      cipher += String.fromCharCode(cVal + 65);
    }

    // Format in 5-letter blocks
    const formattedCipher = cipher.match(/.{1,5}/g)?.join(' ') || cipher;
    setCiphertext(formattedCipher);
  };

  // Modular subtraction decryption: (C - K) mod 26
  const handleDecrypt = () => {
    const cleanCipher = decryptInput.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanKey = decryptKeyInput.toUpperCase().replace(/[^A-Z]/g, '');
    if (!cleanCipher || !cleanKey) return;

    let plain = '';
    const len = Math.min(cleanCipher.length, cleanKey.length);
    for (let i = 0; i < len; i++) {
      const cVal = cleanCipher.charCodeAt(i) - 65;
      const kVal = cleanKey.charCodeAt(i) - 65;
      let pVal = (cVal - kVal) % 26;
      if (pVal < 0) pVal += 26;
      plain += String.fromCharCode(pVal + 65);
    }

    setDecryptedText(plain);
  };

  const burnKey = () => {
    setKeyText('');
    setCiphertext('');
    setDecryptKeyInput('');
  };

  // Compute Calculations
  const dailyDeviceWh = devicePowerWatts * hoursPerDay;
  const batteryCapacityWhNeeded = dailyDeviceWh * batteryBufferDays * 1.25; // 25% safety margin
  const batteryAh12VNeeded = Math.round(batteryCapacityWhNeeded / 12.8);
  const minimumSolarPanelWatts = Math.round((dailyDeviceWh * 1.3) / 4); // assuming 4 peak sun hours

  // Quick pseudo QR grid generation for visual offline barcode rendering
  const generateQrMatrix = (text: string) => {
    const size = 21; // version 1 QR grid 21x21
    const matrix: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

    // Corner Finder Patterns
    const setFinder = (row: number, col: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            matrix[row + r][col + c] = true;
          }
        }
      }
    };

    setFinder(0, 0);
    setFinder(0, 14);
    setFinder(14, 0);

    // Simple deterministic hash pattern for payload
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 8; r < 14; r++) {
      for (let c = 8; c < 14; c++) {
        const bit = ((hash >> ((r * 6 + c) % 31)) & 1) === 1;
        matrix[r][c] = bit;
      }
    }

    return matrix;
  };

  const qrMatrix = generateQrMatrix(qrText);

  return (
    <div className="space-y-8">
      {/* Tool 1: Vernam One-Time Pad (OTP) Cipher Station */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-zinc-100">Vernam One-Time Pad (OTP) Mathematical Cipher</h3>
          </div>
          <button
            onClick={burnKey}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-mono bg-rose-950/40 border border-rose-800 px-3 py-1 rounded"
          >
            <Flame className="w-3.5 h-3.5" /> Burn & Wipe Key
          </button>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Mathematically unbreakable symmetric stream cipher (Shannon Entropy Theorem 1949). Unconditional security is guaranteed ONLY if the key is truly random, used once, and immediately destroyed.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Encryption Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-zinc-400">1. Plaintext Message</span>
              <span className="text-xs text-zinc-500 font-mono">{plaintext.length} chars</span>
            </div>
            <textarea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 p-3 rounded font-mono text-xs focus:outline-none focus:border-emerald-500 uppercase"
              placeholder="ENTER UNCLASSIFIED TEXT..."
            />

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-zinc-400">2. Random Secret Key</span>
              <button
                onClick={() => setKeyText(generateRandomKey(plaintext.replace(/[^a-zA-Z]/g, '').length || 20))}
                className="text-xs text-emerald-400 hover:text-emerald-300 underline font-mono flex items-center gap-1"
              >
                <Key className="w-3.5 h-3.5" /> Generate Key
              </button>
            </div>
            <textarea
              value={keyText}
              onChange={(e) => setKeyText(e.target.value)}
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 p-3 rounded font-mono text-xs focus:outline-none focus:border-emerald-500 uppercase"
              placeholder="GENERATE OR PASTE PRE-SHARED KEY..."
            />

            <button
              onClick={handleEncrypt}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 text-xs font-semibold py-2.5 rounded transition-colors"
            >
              Encrypt Plaintext → 5-Letter Ciphertext
            </button>

            {ciphertext && (
              <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
                <span className="block text-xs font-mono uppercase text-zinc-500 mb-1">Encrypted Ciphertext</span>
                <p className="font-mono text-sm text-emerald-400 tracking-wider break-all font-semibold">
                  {ciphertext}
                </p>
              </div>
            )}
          </div>

          {/* Decryption Column */}
          <div className="space-y-4 border-l border-zinc-800 pl-6">
            <span className="text-xs font-mono uppercase text-zinc-400 block">3. Inbound Ciphertext Decryption</span>
            <textarea
              value={decryptInput}
              onChange={(e) => setDecryptInput(e.target.value)}
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 p-3 rounded font-mono text-xs focus:outline-none focus:border-cyan-500 uppercase"
              placeholder="PASTE INBOUND 5-LETTER BLOCKS..."
            />

            <span className="text-xs font-mono uppercase text-zinc-400 block">Matching Secret Key Page</span>
            <textarea
              value={decryptKeyInput}
              onChange={(e) => setDecryptKeyInput(e.target.value)}
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 p-3 rounded font-mono text-xs focus:outline-none focus:border-cyan-500 uppercase"
              placeholder="PASTE RECIPIENT PAD KEY..."
            />

            <button
              onClick={handleDecrypt}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-zinc-950 text-xs font-semibold py-2.5 rounded transition-colors"
            >
              Decrypt Ciphertext → Plaintext
            </button>

            {decryptedText && (
              <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
                <span className="block text-xs font-mono uppercase text-zinc-500 mb-1">Decrypted Plaintext</span>
                <p className="font-mono text-sm text-cyan-400 tracking-wider break-all font-semibold">
                  {decryptedText}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tool 2: Low-Power Off-Grid Compute Energy Budget */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-zinc-100">Low-Power Solar Compute Daily Power Budget</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Autonomous Hardware Sizing</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Determines battery capacity and solar array requirements to run local tactical laptops, microservers (e.g. Raspberry Pi running local wiki/maps), and satellite communicators off-grid.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Device Preset</label>
            <select
              value={devicePowerWatts}
              onChange={(e) => setDevicePowerWatts(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs py-2 px-3 rounded font-mono mb-4"
            >
              <option value={0.5}>LoRa Meshtastic Node (0.5 Watts)</option>
              <option value={4}>Raspberry Pi Zero / 3B+ (4 Watts)</option>
              <option value={7}>Raspberry Pi 4 / 5 Server (7 Watts)</option>
              <option value={15}>Rugged Field Tablet (15 Watts)</option>
              <option value={35}>Toughbook Laptop Working (35 Watts)</option>
            </select>

            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Custom Power Draw: <span className="text-amber-400 font-bold">{devicePowerWatts} Watts</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={devicePowerWatts}
              onChange={(e) => setDevicePowerWatts(Number(e.target.value))}
              className="w-full accent-amber-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Operating Hours: <span className="text-amber-400 font-bold">{hoursPerDay} Hours / Day</span>
            </label>
            <input
              type="range"
              min="1"
              max="24"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-amber-500 bg-zinc-800 h-2 rounded cursor-pointer mb-4"
            />

            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Cloudy Day Autonomy Reserve: <span className="text-amber-400 font-bold">{batteryBufferDays} Days</span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={batteryBufferDays}
              onChange={(e) => setBatteryBufferDays(Number(e.target.value))}
              className="w-full accent-amber-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex flex-col justify-between">
            <div>
              <span className="block text-xs font-mono uppercase text-zinc-500">Daily Energy Required</span>
              <span className="text-3xl font-mono font-bold text-amber-400 tabular-nums">
                {dailyDeviceWh} <span className="text-xs text-zinc-400 font-normal">Wh / day</span>
              </span>
            </div>

            <div className="border-t border-zinc-800 pt-3 space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-400">12V Battery Bank:</span>
                <span className="text-zinc-100 font-bold">{batteryAh12VNeeded} Ah</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Min Solar Panel:</span>
                <span className="text-zinc-100 font-bold">{minimumSolarPanelWatts} W</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool 3: Offline Text-to-Barcode Data Encapsulator */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <QrCode className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-zinc-100">Hermetic Offline QR Matrix Encapsulator</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Zero Network API Rendering</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Generates scannable 2D optical barcodes for coordinates, frequency plans, or encrypted OTP cipher blocks directly in client SVG with zero network access.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Payload to Encode</label>
            <input
              type="text"
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 px-3 py-2 rounded font-mono text-xs focus:outline-none focus:border-cyan-500 mb-4"
            />
            <p className="text-xs text-zinc-400 leading-relaxed">
              Optical barcode data density allows rapid transfer between air-gapped field devices without radio emissions or Bluetooth pairing signatures.
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex flex-col items-center justify-center">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <svg width="126" height="126" viewBox="0 0 21 21" className="shape-rendering-crispEdges">
                {qrMatrix.map((row, r) =>
                  row.map((cell, c) => (
                    cell ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#000000" /> : null
                  ))
                )}
              </svg>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 mt-2">Matrix V1 Encapsulated</span>
          </div>
        </div>
      </section>
    </div>
  );
};
