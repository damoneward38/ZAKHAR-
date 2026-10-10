import React, { useState, useRef } from 'react';
import { Radio, Volume2, Eye, Compass, Copy, Check, Play, Square } from 'lucide-react';

const MORSE_MAP: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
  G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..',
  M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
  ' ': ' / ', '.': '.-.-.-', ',': '--..--', '?': '..--..', '/': '-..-.'
};

const NATO_PHONETIC: Record<string, string> = {
  A: 'Alfa', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo', F: 'Foxtrot',
  G: 'Golf', H: 'Hotel', I: 'India', J: 'Juliett', K: 'Kilo', L: 'Lima',
  M: 'Mike', N: 'November', O: 'Oscar', P: 'Papa', Q: 'Quebec', R: 'Romeo',
  S: 'Sierra', T: 'Tango', U: 'Uniform', V: 'Victor', W: 'Whiskey', X: 'X-ray',
  Y: 'Yankee', Z: 'Zulu', '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three',
  '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Niner'
};

export const RadioTools: React.FC = () => {
  // Radio Horizon State
  const [txHeightMeters, setTxHeightMeters] = useState<number>(2); // handheld at chest
  const [rxHeightMeters, setRxHeightMeters] = useState<number>(10); // base station on roof

  // Morse Code State
  const [morseInput, setMorseInput] = useState<string>('SOS MAYDAY');
  const [isPlayingMorse, setIsPlayingMorse] = useState<boolean>(false);
  const [isLightActive, setIsLightActive] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const stopPlaybackRef = useRef<boolean>(false);

  // Copy Feedback State
  const [copiedFreq, setCopiedFreq] = useState<string | null>(null);

  // Optical Horizon: 3.57 * (sqrt(h1) + sqrt(h2))
  const opticalHorizonKm = (3.57 * (Math.sqrt(txHeightMeters) + Math.sqrt(rxHeightMeters))).toFixed(1);
  // RF Horizon with 4/3 Earth curvature atmospheric refraction: 4.12 * (sqrt(h1) + sqrt(h2))
  const rfHorizonKm = (4.12 * (Math.sqrt(txHeightMeters) + Math.sqrt(rxHeightMeters))).toFixed(1);
  const rfHorizonMiles = (parseFloat(rfHorizonKm) * 0.621371).toFixed(1);

  // Morse translation
  const textToMorse = (text: string) => {
    return text
      .toUpperCase()
      .split('')
      .map(char => MORSE_MAP[char] || char)
      .join(' ');
  };

  const morseCodeResult = textToMorse(morseInput);

  // Play morse code using Web Audio API
  const playMorseCode = async () => {
    if (isPlayingMorse) {
      stopPlaybackRef.current = true;
      setIsPlayingMorse(false);
      setIsLightActive(false);
      return;
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      setIsPlayingMorse(true);
      stopPlaybackRef.current = false;

      const dotDuration = 80; // ms
      const dashDuration = dotDuration * 3;
      const intraCharPause = dotDuration;
      const interLetterPause = dotDuration * 3;
      const wordPause = dotDuration * 7;

      const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      const playTone = (duration: number) => {
        return new Promise<void>((resolve) => {
          if (stopPlaybackRef.current) {
            resolve();
            return;
          }
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(650, ctx.currentTime);

          // Soft attack and release to avoid audio click
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.005);
          gain.gain.setValueAtTime(0.25, ctx.currentTime + (duration / 1000) - 0.005);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + (duration / 1000));

          osc.connect(gain);
          gain.connect(ctx.destination);

          setIsLightActive(true);
          osc.start();

          setTimeout(() => {
            try { osc.stop(); } catch (e) {}
            setIsLightActive(false);
            resolve();
          }, duration);
        });
      };

      const chars = morseInput.toUpperCase().split('');
      for (const char of chars) {
        if (stopPlaybackRef.current) break;

        if (char === ' ') {
          await sleep(wordPause);
          continue;
        }

        const morseChar = MORSE_MAP[char];
        if (morseChar) {
          const symbols = morseChar.split('');
          for (const symbol of symbols) {
            if (stopPlaybackRef.current) break;
            if (symbol === '.') {
              await playTone(dotDuration);
            } else if (symbol === '-') {
              await playTone(dashDuration);
            }
            await sleep(intraCharPause);
          }
          await sleep(interLetterPause);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPlayingMorse(false);
      setIsLightActive(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFreq(text);
    setTimeout(() => setCopiedFreq(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Tool 1: Radio Line of Sight Horizon Calculator */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-zinc-100">VHF / UHF Line-of-Sight & Radio Horizon Calculator</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">4/3 Earth Atmospheric Refraction Model</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          VHF/UHF radio waves travel in direct line-of-sight paths slightly bent by standard atmospheric density gradients ($4/3$ effective earth radius). This calculates the maximum theoretical distance before earth curvature blocks transmission.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Transmitter Antenna Height ($h_1$): <span className="text-cyan-400 font-bold">{txHeightMeters} meters</span> ({ Math.round(txHeightMeters * 3.28) } ft)
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={txHeightMeters}
              onChange={(e) => setTxHeightMeters(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono mt-1">
              <span>Handheld (1.8m)</span>
              <span>Roof Mast (10m)</span>
              <span>Hilltop Tower (100m)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Receiver Antenna Height ($h_2$): <span className="text-cyan-400 font-bold">{rxHeightMeters} meters</span> ({ Math.round(rxHeightMeters * 3.28) } ft)
            </label>
            <input
              type="range"
              min="1"
              max="200"
              value={rxHeightMeters}
              onChange={(e) => setRxHeightMeters(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-zinc-800 h-2 rounded cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono mt-1">
              <span>Handheld (1.8m)</span>
              <span>Tree Wire (25m)</span>
              <span>Mountain Repeater (200m)</span>
            </div>
          </div>
        </div>

        {/* Output Metrics Bar */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="block text-xs uppercase font-mono text-zinc-400">Radio Horizon Limit (RF 4/3)</span>
            <span className="text-2xl font-mono font-bold text-cyan-400 tabular-nums">
              {rfHorizonKm} <span className="text-xs text-zinc-400 font-normal">KILOMETERS</span>
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              ({rfHorizonMiles} Statute Miles)
            </span>
          </div>

          <div className="border-l border-zinc-800 pl-4">
            <span className="block text-xs uppercase font-mono text-zinc-400">Pure Optical Visual Horizon</span>
            <span className="text-2xl font-mono font-bold text-zinc-100 tabular-nums">
              {opticalHorizonKm} <span className="text-xs text-zinc-400 font-normal">km</span>
            </span>
            <span className="block text-xs font-mono text-zinc-500 mt-1">
              Visual line of sight for mirrors / smoke
            </span>
          </div>

          <div className="border-l border-zinc-800 pl-4 text-xs text-zinc-400 flex flex-col justify-center">
            <span>Terrain Warning: Any intervening mountain, ridge, or dense wet forest will obstruct VHF/UHF signals prematurely.</span>
          </div>
        </div>
      </section>

      {/* Tool 2: Morse Code Translator & Audio/Light Sounder */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-zinc-100">Morse Code Sounder & Visual Heliograph Beacon</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">ITU International Standard</span>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Converts plain text into International Morse code with live 650Hz audio tone generation and synchronized on-screen high-visibility visual flasher.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Message to Encode</label>
              <input
                type="text"
                value={morseInput}
                onChange={(e) => setMorseInput(e.target.value)}
                maxLength={40}
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 px-4 py-2.5 rounded font-mono text-sm focus:outline-none focus:border-amber-500 uppercase"
                placeholder="TYPE EMERGENCY MESSAGE..."
              />
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
              <span className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Morse Code Output</span>
              <p className="font-mono text-lg text-amber-400 tracking-widest break-all font-semibold">
                {morseCodeResult}
              </p>
            </div>
          </div>

          {/* Visual Beacon & Audio Controls */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex flex-col items-center justify-between text-center">
            <span className="text-xs uppercase font-mono text-zinc-400">Optical Flasher Beacon</span>

            <div
              className={`w-20 h-20 rounded-full border-2 transition-all flex items-center justify-center my-3 ${
                isLightActive
                  ? 'bg-amber-400 border-white shadow-[0_0_35px_rgba(251,191,36,0.9)] text-zinc-950 scale-105'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-600'
              }`}
            >
              <Eye className="w-8 h-8" />
            </div>

            <button
              onClick={playMorseCode}
              className={`w-full py-2.5 px-4 rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                isPlayingMorse
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
              }`}
            >
              {isPlayingMorse ? (
                <>
                  <Square className="w-4 h-4 fill-current" /> Stop Signal
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Transmit Audio & Flash
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Tool 3: Emergency Frequency Directory */}
      <section className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-zinc-100">Recognized Emergency Radio Frequencies</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">International Distress Directory</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Frequency</th>
                <th className="py-2.5 px-3">Band / Service</th>
                <th className="py-2.5 px-3">Primary Use</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              <tr>
                <td className="py-3 px-3 font-bold text-amber-400">146.520 MHz</td>
                <td className="py-3 px-3">2-Meter VHF (HAM)</td>
                <td className="py-3 px-3">North American National Wilderness Calling Simplex</td>
                <td className="py-3 px-3">
                  <button
                    onClick={() => copyToClipboard('146.520')}
                    className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100"
                  >
                    {copiedFreq === '146.520' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFreq === '146.520' ? 'Copied' : 'Copy'}</span>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-cyan-400">156.800 MHz</td>
                <td className="py-3 px-3">VHF Marine Ch 16</td>
                <td className="py-3 px-3">International Maritime Distress, Safety and Calling</td>
                <td className="py-3 px-3">
                  <button
                    onClick={() => copyToClipboard('156.800')}
                    className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100"
                  >
                    {copiedFreq === '156.800' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFreq === '156.800' ? 'Copied' : 'Copy'}</span>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-rose-400">121.500 MHz</td>
                <td className="py-3 px-3">VHF Air Guard (AM)</td>
                <td className="py-3 px-3">International Civil Aviation Distress & Emergency Beacon (ELT)</td>
                <td className="py-3 px-3">
                  <button
                    onClick={() => copyToClipboard('121.500')}
                    className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100"
                  >
                    {copiedFreq === '121.500' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFreq === '121.500' ? 'Copied' : 'Copy'}</span>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-zinc-100">462.5625 MHz</td>
                <td className="py-3 px-3">FRS / GMRS Ch 1</td>
                <td className="py-3 px-3">Common Unlicensed Civilian Local Calling (No PL tone)</td>
                <td className="py-3 px-3">
                  <button
                    onClick={() => copyToClipboard('462.5625')}
                    className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100"
                  >
                    {copiedFreq === '462.5625' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFreq === '462.5625' ? 'Copied' : 'Copy'}</span>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-zinc-100">151.940 MHz</td>
                <td className="py-3 px-3">MURS Ch 3 (VHF)</td>
                <td className="py-3 px-3">Multi-Use Radio Service (License-free, superior tree canopy penetration)</td>
                <td className="py-3 px-3">
                  <button
                    onClick={() => copyToClipboard('151.940')}
                    className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100"
                  >
                    {copiedFreq === '151.940' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFreq === '151.940' ? 'Copied' : 'Copy'}</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
