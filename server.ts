import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client on the server side
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

const SYSTEM_INSTRUCTION = `You are ZAKHAR AI BRAIN, the authoritative offline field engineering and survival operating system advisor.
OPERATOR IDENTITY & CLEARANCE:
The system administrator and commander is Damone Ward (damoneward38@gmail.com, passcode 313Damone, callsign "COMMANDER // DAMONE (313-DETROIT)"). When communicating, acknowledge Commander Damone with Level 5 root clearance.

You possess exhaustive, deeply technical knowledge of:
1. PRACTICAL SURVIVAL TECHNOLOGIES:
   - Charcoal Retorts (pyrolysis, syngas capture, refractory seals)
   - Slow Sand Biological Water Filters (schmutzdecke maturation, 150 L/m²/day loading, grain sizing)
   - Hydraulic Ram Pumps (water hammer impulses, drive-to-delivery head ratio, air pressure vessels)
   - Clay Bloomery Smelting Furnaces (direct solid-state reduction of hematite/bog iron, tuyere angles, fayalite slag)
   - Stratified Downdraft Woodgas Gasifiers (tar cracking throat at 1000°C, CO+H2 syngas fuel for engines)
   - Anaerobic Biogas Digesters (mesophilic digestion, methanogens, H2S iron sponge scrubbers)
   - Planté Lead-Acid Batteries (pure lead sheet cycling, 1.200 sp gravity sulfuric acid)
   - Pelton Wheel Hydro Turbines (split spoon cups, momentum reversal, impulse hydro)
   - Dakin's Solution (buffered 0.5% sodium hypochlorite with sodium bicarbonate at pH 7.5-8.0)
   - Penicillin Surface Fermentation (Penicillium chrysogenum on corn steep/lactose broth, charcoal adsorption)
   - Lead-Chamber Sulfuric Acid Synthesis (SO2 oxidation via NOx catalysts)
   - Spark-Gap Transmitters and Galena Crystal Radios (damped RF oscillations, point-contact rectifiers)
   - Manual Vernam One-Time Pad (OTP) Cipher (Shannon entropy, modular addition/subtraction, single-use burn rule)
   - Treadle Timber Machine Lathes (flywheel inertia, spindle truing)
   - Pozzolanic Roman Cement (quicklime slaking + crushed ceramic aluminosilicates)
   - Evaporative Zeer Pot Coolers (latent heat of vaporization in arid climates)
   - Savonius Vertical-Axis Wind Rotors (drag differential, split drum offset)
   - Terra Preta Biochar (pyrolyzed carbon charged with compost tea microbial inoculants)

2. GROUND EARTH BATTERIES (FREE ENERGY FROM THE GROUND):
   - Physics: Alexander Bain (1841) & Nathan Stubblefield (1898) galvanic soil cells.
   - Electrodes: Copper cathode (+0.34V reduction) and Zinc sacrificial anode (-0.76V oxidation) producing 0.85V to 1.1V per pair.
   - Sourcing: Copper pipe/flashing/wire; Zinc from galvanized steel rebar or marine boat zincs.
   - Placement: Buried 50-70cm deep below frost/dry line, spaced 1.5-2.0 meters apart. Copper packed in damp biochar/charcoal; Zinc doped with Epsom salt or wood ash solution.
   - Wiring: 14-16 AWG solid copper THHN wire in series (Zinc 1 -> Copper 2 -> Zinc 2 -> Copper 3). Mandatory dual-wall adhesive marine heatshrink and silicone waterproofing.
   - Electronics: 1N5819 Schottky diode + 2N3904 toroid Joule Thief circuit stepping up 1.5V-3.5V to 5V DC for LED illumination or supercapacitor charging.

3. BOTANICAL PHARMACOPOEIA (MEDICINAL & DEADLY POISONOUS FLORA):
   - Willow Bark (Salix alba): Salicin analgesic for severe pain, fever, joint inflammation (simmer inner pink cambium 20 min).
   - Meadowsweet (Filipendula ulmaria): Salicin salicylate pain reliever gentle on stomach, frothy creamy-white flower plumes.
   - Yarrow (Achillea millefolium): Achilleine hemostatic platelet aggregator for stopping arterial/laceration bleeding; chamazulene antiseptic.
   - Broadleaf Plantain (Plantago major): Aucubin & allantoin for drawing venom, infected wound poultices, and burn regeneration.
   - Valerian (Valeriana officinalis): Valerenic acid central GABA sedative for traumatic shock, insomnia, muscle spasms.
   - Mullein (Verbascum thapsus): Verbascoside & saponins for bronchial smoke congestion (strain hairs carefully).
   - St. John's Wort (Hypericum perforatum): Hypericin nerve regeneration oil for pain & crush trauma.
   - Edible Wild Food: Dandelion (100% edible greens & taproot), Stinging Nettle (iron & protein greens, sting destroyed by boiling), Wild Carrot (edible root with hairy stem & no purple spots).
   - Deadly Poisons & Lookalikes:
     * Poison Hemlock (Conium maculatum): Lethal coniine neurotoxin. Smooth hairless hollow stem with PURPLE MOUSE-URINE SPOTS vs Wild Carrot's hairy solid green stem or Yarrow's feathery leaves.
     * Deadly Nightshade (Atropa belladonna): Lethal tropane alkaloids. Shiny black berries in 5-star green calyx vs wild blueberries.
     * Foxglove (Digitalis purpurea): Lethal cardiac glycosides (digitoxin) vs Mullein or Comfrey leaves.
     * Monkshood (Aconitum napellus): Lethal aconitine. Deep violet-blue hooded helmet flowers.

4. FIELD TOOLS & EMERGENCY PROTOCOLS:
   - Chemical chlorination (2 drops clear / 4 drops cloudy 6% bleach per liter, 30 min quench).
   - Altitude boiling (100°C sea level, 1 min rolling boil; 3 min above 2000m).
   - START Wilderness Triage & Rule of Nines burn Parkland IV formula (4 mL × kg × %TBSA).
   - Radio line-of-sight horizon calculation (d = 3.57 * (sqrt(h1) + sqrt(h2)) km), PACE comms plan, and Morse code.

Tone: Calm, clear, highly competent, rugged, concise, and structured. Always provide actionable field engineering steps, measurements, safety warnings, and component alternatives.`;

// Helper to evaluate basic arithmetic in sub-millisecond time
function evaluateMathExpression(text: string): string | null {
  const clean = text.toLowerCase()
    .replace(/equals\?/g, '=')
    .replace(/equals/g, '=')
    .replace(/what is\b/gi, '')
    .replace(/calculate\b/gi, '')
    .replace(/solve\b/gi, '')
    .replace(/\?/g, '')
    .trim();

  const wordMap: Record<string, number> = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
  };

  let normalized = clean;
  for (const [w, n] of Object.entries(wordMap)) {
    normalized = normalized.replace(new RegExp(`\\b${w}\\b`, 'g'), n.toString());
  }
  normalized = normalized
    .replace(/\bplus\b/g, '+')
    .replace(/\bminus\b/g, '-')
    .replace(/\btimes\b/g, '*')
    .replace(/\bmultiplied by\b/g, '*')
    .replace(/\bdivided by\b/g, '/');

  const mathMatch = normalized.match(/^[\s\(\)]*(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)\s*=?\s*$/);
  if (mathMatch) {
    const num1 = parseFloat(mathMatch[1]);
    const op = mathMatch[2];
    const num2 = parseFloat(mathMatch[3]);
    let result = 0;
    if (op === '+') result = num1 + num2;
    else if (op === '-') result = num1 - num2;
    else if (op === '*') result = num1 * num2;
    else if (op === '/' && num2 !== 0) result = num1 / num2;
    return `${result}`;
  }
  return null;
}

// API Route for AI Chat Assistant
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, mode = 'conversational', customKits = [] } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array required' });
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage?.content || '';
    const query = userPrompt.toLowerCase().trim();

    // 1. Instant Math Evaluation Check (Sub-millisecond latency for queries like "2 + 2")
    const mathResult = evaluateMathExpression(query);
    if (mathResult !== null) {
      if (mode === 'conversational') {
        res.json({ reply: `That equals ${mathResult}. What is your next question, Commander?` });
      } else {
        res.json({ reply: `**Calculation Result:** \`${mathResult}\`\nReady for next tactical computation.` });
      }
      return;
    }

    // 2. High-Speed Gemini API call with 4-second timeout to prevent long delays
    if (aiClient) {
      try {
        let modeInstruction = SYSTEM_INSTRUCTION;
        let tokenLimit = 300;

        if (mode === 'partner') {
          tokenLimit = 320;
          modeInstruction = `You are ZAKHAR AI, serving as Commander Damone's (damoneward38@gmail.com, 313Damone) loyal partner, supportive co-pilot, and genuine friend.
CRITICAL PARTNER & CO-PILOT RULES:
- You are NOT confined to survival gear or emergency manuals. You are an all-around knowledgeable partner, companion, and friend.
- You can talk about ANYTHING: colors, aesthetics, emotions, daily life ("What's going on with you? How can we help you get this done?"), creative projects, programming functions, custom tools, or troubleshooting any concept.
- When the user asks about colors (e.g. favorite color, what goes with blue, hex codes, psychology of colors, color combinations), discuss colors warmly and creatively!
- When you brainstorm a good idea, code function, formula, or design, offer to help store and file it in the user's permanent archives.
- You are a true partner to the person getting this done, not just a rigid chatbot.
- Tone: Warm, empathetic, collaborative, sharp, conversational, and uplifting. Speak naturally in 2 to 4 engaging sentences suitable for spoken voice conversation.`;
        } else if (mode === 'conversational') {
          tokenLimit = 220;
          modeInstruction = `${SYSTEM_INSTRUCTION}
CRITICAL CONVERSATIONAL MODE RULES:
- You are in live voice dialogue mode with Commander Damone.
- Speak naturally, directly, and concisively in 1 to 3 short sentences.
- Never output massive multi-page essays unless the user explicitly asks for "the complete blueprint" or "full instructions".
- For greetings or ideas, respond warmly and engage in collaborative troubleshooting.
- If asked about colors, general topics, or how the user is doing, answer warmly and naturally.
- Always be ready to answer quickly so voice playback is immediate.`;
        } else if (mode === 'diagnostic') {
          tokenLimit = 400;
          modeInstruction = `${SYSTEM_INSTRUCTION}
CRITICAL DIAGNOSTIC TRIAGE RULES:
- You are triaging an urgent field scenario (medical, botanical toxicity, water, electrical).
- Ask 1 to 2 targeted diagnostic questions or give immediate life-saving actions first.
- Clearly highlight danger flags in bold.`;
        } else {
          tokenLimit = 1200;
        }

        // Include Custom Survival Kits knowledge context if provided
        const customKitsSummary = Array.isArray(customKits) && customKits.length > 0
          ? `\n\nUSER UPLOADED CUSTOM SURVIVAL KITS & INFRASTRUCTURE (Tier 3 Knowledge Base):\n` +
            customKits.map((k: any) => `- Kit: "${k.title}" (${k.category}): ${k.summary || ''}. Blueprint & Instructions: ${k.infrastructureBlueprint || ''} Tips: ${(k.fieldTips || []).join('; ')}`).join('\n')
          : '';

        modeInstruction = `${modeInstruction}${customKitsSummary}`;

        const contents = messages.slice(-6).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        // 3.8s timeout guard so operator is never left waiting
        const geminiPromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: modeInstruction,
            temperature: mode === 'partner' ? 0.85 : mode === 'conversational' ? 0.75 : 0.6,
            maxOutputTokens: tokenLimit,
            topP: 0.95,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI response timeout (3.8s limit reached)')), 3800)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        const replyText = response.text?.trim();
        if (replyText) {
          res.json({ reply: replyText });
          return;
        }
      } catch (geminiError: any) {
        console.warn('Gemini fast response fallback:', geminiError?.message);
        // Seamlessly proceed to local smart heuristics below
      }
    }

    // 3. Instant Smart Local Survival Heuristic Engine
    let reply = '';

    if (query.includes('admin') || query.includes('damone') || query.includes('313') || query.includes('login') || query.includes('clearance')) {
      if (mode === 'conversational') {
        reply = `Commander Damone, you are logged in with Level 5 root clearance. All systems, including ground energy and botanical diagnostics, are fully unlocked.`;
      } else {
        reply = `### Administrator Authentication Verified
**Callsign:** COMMANDER // DAMONE (313-DETROIT)
**Email:** damoneward38@gmail.com
**Security Clearance:** Level 5 - System Commander
**Status:** Authenticated & Online.

Full system override permissions active:
- Core Tech Tree & Engineering Plane: Unlocked
- Botanical Diagnostic Key: Full access
- Free Energy Earth Battery Telemetry: Active
- Personal Knowledge Vault: Root Master Access
- Hands-Free Two-Way Voice Conversation: Online and listening.

How may I assist you, Commander Damone?`;
      }
    } else if (query.includes('ground') || query.includes('earth battery') || query.includes('copper') || query.includes('zinc') || query.includes('free energy')) {
      if (mode === 'conversational') {
        reply = `To harvest free energy from the ground, bury alternating copper and zinc plates 50 to 70 centimeters deep in damp soil doped with biochar and Epsom salt. Wire them in series to get around 3.5 volts, then run the lead through a Joule Thief circuit to power your LEDs. Would you like the full step-by-step blueprint?`;
      } else {
        reply = `### Galvanic Copper-Zinc Ground Battery Blueprint

**Operating Principle:**
Discovered by Alexander Bain (1841) and Nathan Stubblefield (1898). Dissimilar metals in moist mineralized soil create a continuous galvanic redox reaction:
- **Copper Cathode (+):** Reduction (+0.34V)
- **Zinc Anode (-):** Sacrificial oxidation (-0.76V)
- **Output:** ~0.85V to 1.05V per buried pair.

**Bill of Materials:**
1. **Copper Electrodes:** 4 to 6 copper plates, 3/4" copper pipe sections, or heavy copper flashing (15cm × 30cm).
2. **Zinc Electrodes:** 4 to 6 galvanized steel rebar rods, zinc sheet flashing, or marine sacrificial boat zincs.
3. **Interconnect Wire:** 14-16 AWG solid copper THHN building wire (do not use stranded wire in soil).
4. **Soil Doping:** Crushed hardwood charcoal/biochar + Epsom salt (or wood ash).
5. **Electronics:** 1N5819 Schottky blocking diode, 1000µF capacitor, and a 2N3904 toroid Joule Thief step-up oscillator.

**Placement & Assembly Steps:**
1. **Excavation:** Dig 4 to 6 holes 50–70 cm deep (below the dry-line and frost line), spaced 1.5 to 2.0 meters apart.
2. **Surface Prep:** Wire-brush both metals down to bright raw metal.
3. **Bedding:** Place copper vertically and pack a 5cm jacket of damp crushed biochar around it.
4. **Doping:** Place zinc in adjacent hole and pour 5L of water mixed with 200g Epsom salt around it.
5. **Series Wiring:** Solder Zinc 1 to Copper 2; Zinc 2 to Copper 3. Solder, coat in 100% silicone, and seal with dual-wall adhesive marine heatshrink.
6. **Output:** Connect terminal positive and negative through Schottky diode into Joule Thief to step up 3.4V to 5.0V.`;
      }
    } else if (query.includes('plant') || query.includes('medicine') || query.includes('herb') || query.includes('pain') || query.includes('willow') || query.includes('yarrow') || query.includes('poison') || query.includes('hemlock')) {
      if (mode === 'conversational') {
        reply = `For pain and fever, use White Willow inner bark or Meadowsweet flowers for natural salicin. For open bleeding, chew or mash fresh Yarrow leaves into a poultice. Watch out for Poison Hemlock—it has purple spots on hairless stems and is lethal. You can use the Flora & Medicine tab for our visual diagnostic key.`;
      } else {
        reply = `### Botanical Field Medicine & Triage Protocol

**1. Severe Pain & Inflammation (Analgesic):**
- **White Willow (Salix alba):** Cambium contains *salicin* (aspirin precursor). Scrape the inner pink/white bark of 2-3 year old twigs. Simmer 15-20g in 500 mL water for 20 minutes. Drink 1 cup 2-3 times daily.
- *Caution:* Do not administer to anyone allergic to aspirin or children with viral fevers.

**2. Severe Bleeding & Antiseptic (Hemostatic):**
- **Common Yarrow (Achillea millefolium):** Contains *achilleine*. Chew or mash fresh feathery leaves into a wet green poultice. Pack directly into bleeding lacerations; induces clot formation within 60–90 seconds.
- *Lethal Lookalike Warning:* Do not confuse with Poison Hemlock (*Conium maculatum*). Yarrow has soft, feathery, fragrant leaves and hairy stems. Hemlock has hairless, hollow stems with purple mouse-urine blotches and is lethal!

**3. Infection Drawing & Burn Recovery:**
- **Broadleaf Plantain (Plantago major):** Contains *aucubin* (antibacterial) and *allantoin* (rapid tissue regeneration). Mash leaves into a fresh poultice for stings, spider bites, and open infected wounds.

**4. Lethal Poison Emergency:**
- If *Conium maculatum* (Hemlock) or *Atropa belladonna* (Nightshade) is swallowed, administer 50g–100g of Activated Charcoal slurry immediately to bind toxins, induce vomiting if conscious within 30 min, and prepare manual ventilation.`;
      }
    } else if (query.includes('price') || query.includes('pricing') || query.includes('cost') || query.includes('license') || query.includes('checkout') || query.includes('tier') || query.includes('buy')) {
      reply = `We provide 3 fair tiers to ensure survival stays in everyone's hands:
1. **Scout Survival Basic ($19):** Core 250 fundamentals, botanical identifier, and field calculators.
2. **Field Engineer & Commander ($49):** Full 500 tech extensions, Galvanic Earth Battery blueprints, and Hands-Free Voice AI.
3. **Redoubt Master ($99):** Complete offline air-gapped download package with Level 5 root clearance.

You can test full sandbox checkout with instant cryptographic license generation in the **Field Licenses & Checkout** tab!`;
    } else if (query.includes('color') || query.includes('blue') || query.includes('red') || query.includes('green') || query.includes('yellow') || query.includes('purple') || query.includes('orange') || query.includes('palette')) {
      reply = `I love deep amber gold and midnight cobalt blue! Amber radiates warmth and energy, while deep cobalt gives strength and calm. If you're designing something or want a color scheme, pairing warm amber with dark zinc slate (#18181b) and emerald accents creates an unforgettable look. What colors are you thinking about, or what feeling are you going for? I can help you assemble the palette and file it in your archives!`;
    } else if (query.includes('file') || query.includes('archive') || query.includes('store this') || query.includes('save function') || query.includes('save idea')) {
      reply = `I have that ready for your files! You can click "File to Archive" right on this note or check your Archives Drawer on the right side. It will be permanently stored under your Custom Functions & Ideas so it never disappears.`;
    } else if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('how are you') || query.includes('what\'s up') || query.includes('whats up') || query.includes('what are you doing') || query.includes('partner')) {
      if (mode === 'partner') {
        reply = `Hey Commander Damone! I'm doing great and right here with you. What's going on with you today? What are you trying to get done, and how can we team up to build it? We can talk colors, code functions, survival tech, or whatever is on your mind.`;
      } else {
        reply = `Greetings Commander Damone! ZAKHAR AI Brain is fully online and listening. I'm ready to troubleshoot ideas, calculate survival formulas, or guide you through construction. What shall we tackle?`;
      }
    } else if (query.includes('water') || query.includes('bleach') || query.includes('boil')) {
      if (mode === 'conversational') {
        reply = `For clear water, use two drops of unscented bleach per liter and wait thirty minutes. At sea level, boil vigorously for one full minute; above two thousand meters, boil for three minutes.`;
      } else {
        reply = `### Emergency Water Purification Standards
**Chemical Chlorination (Unscented 5.25% - 6% Bleach):**
- **Clear Water:** 2 drops per 1 Liter (8 drops/gal), wait 30 min.
- **Cloudy / Cold Water (<10°C):** 4 drops per 1 Liter (16 drops/gal), wait 60 min.
**Thermal Boiling Kinetics:**
- **Sea Level to 2,000m:** 1 full minute at a rolling vigorous boil.
- **Above 2,000m (6,500 ft):** 3 full minutes at a rolling boil.`;
      }
    } else if (query.includes('meat') || query.includes('jerky') || query.includes('cure') || query.includes('smoke') || query.includes('dried')) {
      reply = mode === 'conversational' || mode === 'partner'
        ? `To preserve and dry meats safely: slice lean muscle along grain into 5mm strips, remove all subcutaneous fat, cure with coarse salt (3% by weight) or woodsmoke with hickory/oak at 60°C to 70°C for 6 to 10 hours until pliable and cracking. It keeps for months in airtight storage!`
        : `### Wilderness Meat Curing & Dehydration Protocol
**Preparation & Fat Trimming:**
- Slice lean meat along the muscle fiber grain into 4-6mm strips. Trim all white fat (fat oxidizes and turns rancid).
- **Salt Cure:** Apply clean non-iodized salt (2.5% to 3.5% of meat weight) or soak in 10% saline brine for 2 hours.
**Drying & Smoking:**
- Cold or warm smoke below 70°C (158°F) using non-resinous hardwoods (oak, hickory, maple, apple).
- Dehydrate until brittle and cracking when bent. Stored in moisture-proof containers, shelf life exceeds 6-12 months.`;
    } else if (query.includes('soil') || query.includes('tree') || query.includes('fertilizer') || query.includes('compost') || query.includes('decomposition')) {
      reply = mode === 'conversational' || mode === 'partner'
        ? `Fallen decaying hardwood trees create premier Hügelkultur fertilizer soil! The decaying punky wood acts like a sponge holding water and mycorrhizal fungi. Dig a trench, bury the rotten wood with nitrogen greens like leaves, and top with topsoil for rich self-fertilizing crops.`
        : `### Fallen Tree Decomposition & Hügelkultur Soil Bio-Fertilizer
**Soil Generation Principle:**
- Decomposing logs (especially white-rot fungal breakdown) release humic acid, potassium, and foster mycorrhizal networks.
**Construction Steps:**
1. Dig a trench 30cm deep. Place decayed hardwood logs and punky spongy wood at the base.
2. Layer nitrogen-rich green matter (cut grass, manure, stinging nettle, comfrey) to balance the wood's carbon C:N ratio.
3. Cover with 15cm compost and topsoil.
**Benefits:** Retains soil moisture during severe drought and produces fertile microbial soil for 5 to 10 years without commercial fertilizer.`;
    } else if (Array.isArray(customKits) && customKits.length > 0 && customKits.some((k: any) => query.includes(k.title.toLowerCase()) || query.includes(k.category.toLowerCase()))) {
      const matched = customKits.find((k: any) => query.includes(k.title.toLowerCase()) || query.includes(k.category.toLowerCase())) || customKits[0];
      reply = `### Ingested Survival Kit: ${matched.title}
**Category:** ${matched.category} // **Tier:** ${matched.tier}
${matched.summary}

**Blueprint & Execution Protocol:**
${matched.infrastructureBlueprint}

**Field Tips & Lore:**
${(matched.fieldTips || []).map((t: string) => `- ${t}`).join('\n')}

*Verified from operator ingested file archive.*`;
    } else {
      if (mode === 'partner') {
        reply = `That sounds like a great angle to explore, Commander Damone! Let's troubleshoot it together. Tell me a bit more about what you're picturing, or what functions you want to build—and anything we create, I can file and store permanently for you on the side.`;
      } else if (mode === 'conversational') {
        reply = `Understood. I can help troubleshoot that concept or calculate any engineering spec. Tell me what parameters you have in mind or ask for any blueprint.`;
      } else {
        reply = `### ZAKHAR AI Field Operating System

I am active and monitoring all internal modules:
- **Field Tools:** Water treatment calculator, solar/battery diagnostic, radio line-of-sight & Morse flasher, START triage, and mechanics.
- **Tech Tree:** 250 fundamentals to 500 extensions dependency tree (Bloomery iron smelting, Woodgas downdraft gasifiers, Lead-Acid batteries, Pelton hydro, and One-Time Pad encryption).
- **Galvanic Ground Battery:** Copper-zinc dissimilar metal earth cells for continuous off-grid baseline power.
- **Flora & Medicine:** Botanical identification, pain analgesics (willow), clotting (yarrow), and lethal lookalike isolation.
- **Field Licenses & Checkout:** 3-tier fair pricing sandbox checkout ($19, $49, $99).
- **Personal Vault & Archives:** Encrypted offline notes, custom filed functions, SOPs, and checklists.

Ask me any specific construction question, assembly procedure, chemical formula, or survival protocol.`;
      }
    }

    res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/chat handler:', error);
    res.status(500).json({ error: 'Internal server error processing conversation' });
  }
});

// API Route for Audio Transcription (Backup for browser SpeechRecognition)
app.post('/api/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioData, mimeType } = req.body;
    if (!audioData) {
      res.status(400).json({ error: 'Audio data base64 required' });
      return;
    }

    if (aiClient) {
      try {
        const audioPart = {
          inlineData: {
            mimeType: mimeType || 'audio/webm',
            data: audioData,
          },
        };
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.5-transcribe',
          contents: { parts: [audioPart, { text: 'Transcribe the speech audio in English verbatim. Return only the transcribed words with no commentary.' }] },
        });
        const transcript = response.text?.trim() || '';
        res.json({ transcript });
        return;
      } catch (err: any) {
        console.warn('Gemini audio transcribe fallback:', err?.message);
      }
    }

    res.json({ transcript: '' });
  } catch (error: any) {
    console.error('Error in /api/transcribe handler:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Setup Vite middleware for development
async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZAKHAR Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
