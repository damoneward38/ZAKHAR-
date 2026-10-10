import { BotanicalPlant } from '../types';

export const BOTANICAL_PLANTS: BotanicalPlant[] = [
  {
    id: 'white-willow',
    commonName: 'White Willow / Black Willow',
    scientificName: 'Salix alba / Salix nigra',
    family: 'Salicaceae',
    classification: 'Medicinal',
    medicalIndications: [
      'Severe Pain & Inflammation (Analgesic)',
      'Fever & Antipyretic'
    ],
    activeCompounds: ['Salicin (metabolized to Salicylic Acid)', 'Polyphenolic Tannins', 'Flavonoids'],
    flowerDescription: 'Slender yellowish-green cylindrical catkins (3-5 cm long) appearing concurrently with leaves in early spring.',
    flowerColor: 'Yellow',
    leafPattern: 'Alternate',
    stemAndGrowth: 'Graceful deciduous tree (10-25m tall). Young twigs flexible and greenish-yellow. Inner bark is pale pinkish-white and fibrous.',
    habitatAndSeason: 'Wet alluvial soils, riverbanks, creek margins, marsh borders throughout temperate zones.',
    preparations: [
      {
        method: 'Decoction (Boiled)',
        partUsed: 'Inner Bark',
        instructions: 'Harvest 2-3 year old twigs. Peel outer brown bark, scrape off the inner fibrous pink/white cambium layer. Simmer 15-20g (approx 2 tablespoons chopped) dried inner bark in 500 mL water for 20 minutes.',
        dosage: 'Drink 1 cup (250 mL) 2-3 times daily after food for severe joint pain, dental toothache, or headache.'
      },
      {
        method: 'Alcohol Tincture',
        partUsed: 'Inner Bark',
        instructions: 'Steep 100g fresh shredded inner bark in 400 mL 50% alcohol (vodka/grain spirit) in sealed jar for 4 weeks. Shake daily. Strain through cloth.',
        dosage: '2-4 mL (approx 40-60 drops) diluted in water every 4-6 hours for acute pain relief.'
      }
    ],
    lookalikes: [
      {
        toxicSpecies: 'Prunus serotina (Wild Black Cherry)',
        toxicCommonName: 'Wild Cherry (Wilted Leaves)',
        distinctionKey: 'Cherry bark has horizontal lenticels and smells strongly of bitter almond (cyanide); willow inner bark has zero almond odor.',
        lethalHazard: 'Wilted cherry leaves contain lethal prunasin (hydrocyanic acid) causing rapid cellular asphyxiation.'
      }
    ],
    toxicityWarning: 'Contraindicated in individuals allergic to aspirin. Do not administer to children under 16 with viral fevers (Reye syndrome risk).',
    svgBadge: 'willow'
  },
  {
    id: 'common-yarrow',
    commonName: 'Common Yarrow',
    scientificName: 'Achillea millefolium',
    family: 'Asteraceae',
    classification: 'Medicinal',
    medicalIndications: [
      'Hemostatic / Blood Clotting',
      'Wound Wash & Antiseptic',
      'Fever & Antipyretic'
    ],
    activeCompounds: ['Achilleine (hemostatic alkaloid)', 'Chamazulene (anti-inflammatory)', 'Sesquiterpene lactones', 'Tannins'],
    flowerDescription: 'Dense, flat-topped terminal corymb umbel clusters composed of 15-25 tiny 5-petaled florets (4-6 mm) with cream/white rays and yellow centers.',
    flowerColor: 'White',
    leafPattern: 'Alternate',
    stemAndGrowth: 'Erect, ribbed, fibrous, finely hairy stem (30-80 cm tall). Leaves are finely divided, fern-like, feathery, 3-pinnate ("millefolium" = thousand leaves). Emits sharp pleasant aromatic sage-like scent when crushed.',
    habitatAndSeason: 'Open sunny meadows, dry roadsides, pastures, grasslands. Blooms May to October.',
    preparations: [
      {
        method: 'Fresh Poultice (Crushed)',
        partUsed: 'Leaves',
        instructions: 'Chew or mash fresh feathery leaves with a clean rock into a moist green pulp. Apply directly into arterial or puncture bleeding wounds; pack under firm pressure dressing.',
        dosage: 'Achilleine triggers immediate platelet aggregation and local vasoconstriction within 60-90 seconds.'
      },
      {
        method: 'Cold/Hot Infusion (Steeped)',
        partUsed: 'Whole Aerial',
        instructions: 'Steep 2 tablespoons dried flowering tops in 300 mL boiling water for 15 minutes covered (keeps volatile chamazulene oils trapped).',
        dosage: 'Drink hot to induce diaphoretic sweating for breaking high fevers; or cool and use as sterile wound wash.'
      }
    ],
    lookalikes: [
      {
        toxicSpecies: 'Conium maculatum',
        toxicCommonName: 'Poison Hemlock (DEADLY LETHAL)',
        distinctionKey: 'CRITICAL WARNING: Yarrow leaves are soft, finely feathery, and fragrant with hairy stems. Poison hemlock has SMOOTH, HAIRLESS, HOLLOW stems covered in PURPLE MOUSE-URINE SPOTS and parsely-like leaves.',
        lethalHazard: 'Poison hemlock contains coniine: 6-8 leaves cause total neuromuscular respiratory paralysis and death in 1-2 hours.'
      }
    ],
    svgBadge: 'yarrow'
  },
  {
    id: 'broadleaf-plantain',
    commonName: 'Broadleaf Plantain / Ribwort',
    scientificName: 'Plantago major / Plantago lanceolata',
    family: 'Plantaginaceae',
    classification: 'Medicinal',
    medicalIndications: [
      'Wound Wash & Antiseptic',
      'Burn & Skin Regeneration'
    ],
    activeCompounds: ['Aucubin (antimicrobial iridoid)', 'Allantoin (rapid cellular tissue regeneration)', 'Mucilage', 'Silica'],
    flowerDescription: 'Long, narrow, dense cylindrical spike (5-20 cm long) packed with tiny greenish-white to brown sessile flowers on erect leafless stalks.',
    flowerColor: 'Green/Inconspicuous',
    leafPattern: 'Basal Rosette',
    stemAndGrowth: 'Low-growing perennial forming ground-hugging basal rosette. Broad oval leaves with 5-7 prominent longitudinal parallel fibrous veins that string like celery when snapped.',
    habitatAndSeason: 'Compacted soils, field pathways, disturbed lawns, campsite verges worldwide. Extremely hardy.',
    preparations: [
      {
        method: 'Fresh Poultice (Crushed)',
        partUsed: 'Leaves',
        instructions: 'Thoroughly wash 3-4 mature leaves. Bruise heavily with clean stone or chew into paste. Apply directly over infected lacerations, bee/wasp stings, spider bites, or open sores. Secure with bandage.',
        dosage: 'Change poultice every 4 hours. Draws out embedded splinters, neutralizes venom, and accelerates granulation.'
      },
      {
        method: 'Infused Salve',
        partUsed: 'Leaves',
        instructions: 'Wilt clean leaves for 12 hours (remove moisture). Steep in warm olive oil or animal tallow at 50°C for 4 hours. Strain and blend with 20% beeswax to form firm field antiseptic ointment.',
        dosage: 'Apply topically to burn scars, frostbite cracks, and infected scrapes twice daily.'
      }
    ],
    lookalikes: [
      {
        toxicSpecies: 'Convallaria majalis',
        toxicCommonName: 'Lily of the Valley (Toxic)',
        distinctionKey: 'Lily of the valley leaves emerge on a central upright stem and flowers are drooping white bells; Plantain leaves strictly form a ground-level rosette with tall rat-tail spikes.',
        lethalHazard: 'Lily of the valley contains lethal convallatoxin (cardiac arrest).'
      }
    ],
    svgBadge: 'plantain'
  },
  {
    id: 'valerian',
    commonName: 'Wild Valerian / All-Heal',
    scientificName: 'Valeriana officinalis',
    family: 'Caprifoliaceae',
    classification: 'Medicinal',
    medicalIndications: [
      'Sedative & Sleep Aid',
      'Severe Pain & Inflammation (Analgesic)',
      'Digestive Spasms & Nausea'
    ],
    activeCompounds: ['Valerenic acid (GABA reuptake inhibitor)', 'Isovaleric acid', 'Valepotriates'],
    flowerDescription: 'Umbel-like rounded clusters of tiny 5-petaled sweet-scented pink to pale lavender flowers blooming on tall hollow stalks.',
    flowerColor: 'Pink/Red',
    leafPattern: 'Opposite',
    stemAndGrowth: 'Stout, erect, hollow furrowed stem (1-1.5m tall). Leaves pinnately divided with 6-10 pairs of toothed leaflets. Rootstock is a dense rhizome with potent pungent "sweaty socks" aroma.',
    habitatAndSeason: 'Damp meadows, riverbanks, ditch sides, woodland edges. Dig roots in late autumn when top dies back.',
    preparations: [
      {
        method: 'Decoction (Boiled)',
        partUsed: 'Roots',
        instructions: 'Scrub dug roots thoroughly in water. Chop into 5mm bits and dry in shade. Boil 10g (approx 1 heaping tablespoon) dried root in 300 mL water for 15 minutes covered.',
        dosage: 'Drink 1 cup 30 minutes before sleep for severe shock, traumatic insomnia, or intense muscle spasms.'
      },
      {
        method: 'Alcohol Tincture',
        partUsed: 'Roots',
        instructions: 'Macerate fresh chopped root in 60% alcohol (1:2 ratio by weight) for 3 weeks in dark amber glass.',
        dosage: '2-5 mL in water as rapid-acting emergency field sedative during acute panic reactions.'
      }
    ],
    lookalikes: [
      {
        toxicSpecies: 'Conium maculatum (Poison Hemlock)',
        toxicCommonName: 'Poison Hemlock',
        distinctionKey: 'Valerian has OPPOSITE leaves and sweet-smelling pink flower clusters with distinct pungent roots. Hemlock has ALTERNATE leaves, purple-blotched stems, and foul mouse odor.',
        lethalHazard: 'Lethal neurotoxin causing respiratory collapse.'
      }
    ],
    svgBadge: 'valerian'
  },
  {
    id: 'mullein',
    commonName: 'Great Mullein / Velvet Dock',
    scientificName: 'Verbascum thapsus',
    family: 'Scrophulariaceae',
    classification: 'Medicinal',
    medicalIndications: [
      'Respiratory Bronchodilator & Cough'
    ],
    activeCompounds: ['Verbascoside (anti-inflammatory)', 'Saponins (mucus expelling)', 'Flavonoids', 'Volatile oil'],
    flowerDescription: 'Dense, erect, elongated flower spike (up to 1m long) bearing 5-petaled bright sulfur-yellow flowers (15-20 mm) that open irregularly.',
    flowerColor: 'Yellow',
    leafPattern: 'Basal Rosette',
    stemAndGrowth: 'Biennial plant. Year 1 produces giant rosette of thick, woolly, densely felted pale silver-green velvety leaves. Year 2 shoots up massive single rigid spike up to 2 meters tall.',
    habitatAndSeason: 'Dry gravelly slopes, abandoned quarries, roadsides, disturbed sunny soils.',
    preparations: [
      {
        method: 'Cold/Hot Infusion (Steeped)',
        partUsed: 'Leaves',
        instructions: 'Steep 2 tablespoons dried crushed woolly leaves in 400 mL boiling water for 15 minutes. MANDATORY: Strain through fine cotton cloth or coffee filter to catch tiny irritating plant hairs before drinking.',
        dosage: 'Drink 1 cup 3 times daily to soothe smoke-inhalation lungs, intractable dry coughing, and bronchitis.'
      },
      {
        method: 'Infused Salve',
        partUsed: 'Flowers',
        instructions: 'Pick yellow flowers. Pack into small jar with olive oil in warm sun for 14 days. Strain.',
        dosage: 'Warm 2-3 drops placed into outer ear canal for acute bacterial middle earache.'
      }
    ],
    lookalikes: [
      {
        toxicSpecies: 'Digitalis purpurea (Foxglove)',
        toxicCommonName: 'Foxglove (Year 1 Rosette - DEADLY)',
        distinctionKey: 'First-year foxglove rosettes lack the dense, thick, woolly down of mullein; foxglove leaves are darker green, have toothed margins, and prominent netted veins without velvety felt.',
        lethalHazard: 'Foxglove causes lethal cardiac arrhythmia and cardiac arrest.'
      }
    ],
    svgBadge: 'mullein'
  },
  {
    id: 'poison-hemlock',
    commonName: 'Poison Hemlock',
    scientificName: 'Conium maculatum',
    family: 'Apiaceae (Parsley family)',
    classification: 'Deadly Toxic',
    medicalIndications: [
      'Potent Poison / Lethal Hazard'
    ],
    activeCompounds: ['Coniine', 'gamma-Coniceine (potent nicotinic acetylcholine receptor antagonists)'],
    flowerDescription: 'Large compound terminal umbels (4-8 cm across) composed of 10-15 smaller umbellets with tiny 5-petaled white flowers.',
    flowerColor: 'White',
    leafPattern: 'Alternate',
    stemAndGrowth: 'Tall, stout, hollow, branching biennial stem (1.5-3m tall). ABSOLUTELY HAIRLESS AND SMOOTH, covered with distinct irregular PURPLE/RED BLOTCHES and SPOTS. Emits nauseating mousy odor when bruised.',
    habitatAndSeason: 'Damp roadsides, ditch banks, cultivated field margins, river valleys.',
    preparations: [],
    lookalikes: [
      {
        toxicSpecies: 'Daucus carota',
        toxicCommonName: 'Wild Carrot / Queen Anne\'s Lace (Edible Root)',
        distinctionKey: 'Wild Carrot stems are SOLID, COVERED IN ROUGH HAIRS, have ZERO purple spots, and often have a single central purple/black flower in the umbel with 3-forked bracts below. Hemlock has SMOOTH HAIRLESS STEMS with PURPLE SPOTS.',
        lethalHazard: 'Mistaking hemlock for wild carrot is one of the most common fatal wilderness foraging mistakes.'
      },
      {
        toxicSpecies: 'Achillea millefolium',
        toxicCommonName: 'Yarrow',
        distinctionKey: 'Yarrow has soft hairy stems and delicate feathery leaves; hemlock has giant parsley-like 3-pinnate leaves with purple-splotched hollow stems.',
        lethalHazard: 'Fatal ingestion.'
      }
    ],
    toxicityWarning: 'LETHAL EMERGENCY: Ascending flaccid muscular paralysis starting in legs, moving upward to diaphragm within 60-120 minutes while patient remains fully conscious. 6-8 leaves is a fatal adult dose.',
    emergencyAntidoteProtocol: '1. If within 30 minutes of ingestion and patient conscious, induce immediate vomiting. 2. Administer 50g-100g Activated Charcoal slurry in water to bind unabsorbed coniine. 3. Prepare for artificial mechanical ventilation / bag-valve-mask breathing as diaphragm paralyses.',
    svgBadge: 'hemlock'
  },
  {
    id: 'deadly-nightshade',
    commonName: 'Deadly Nightshade / Belladonna',
    scientificName: 'Atropa belladonna',
    family: 'Solanaceae',
    classification: 'Deadly Toxic',
    medicalIndications: [
      'Potent Poison / Lethal Hazard'
    ],
    activeCompounds: ['Hyoscyamine', 'Atropine', 'Scopolamine (anticholinergic tropane alkaloids)'],
    flowerDescription: 'Solitary, drooping, bell-shaped / tubular flowers (2.5-3 cm) with dull purple-brown or brownish-green coloration and yellow throat.',
    flowerColor: 'Purple/Blue',
    leafPattern: 'Alternate',
    stemAndGrowth: 'Bushy herbaceous perennial (1-1.5m tall). Leaves dull green, ovate, entire margins (not toothed). Produces glossy, lustrous, jet-black cherry-sized berries (1-2 cm) nestled in a 5-lobed star-like green calyx cup.',
    habitatAndSeason: 'Chalky limestone soils, forest clearings, scrublands, ruins. Fruit ripens August to October.',
    preparations: [],
    lookalikes: [
      {
        toxicSpecies: 'Vaccinium myrtillus',
        toxicCommonName: 'Wild Bilberry / Blueberry',
        distinctionKey: 'Blueberries grow on low woody shrubs (<40cm) in acidic bog soils; Belladonna berries are much larger, solitary, glistening jet-black, and sit inside a prominent 5-pointed green star calyx.',
        lethalHazard: '2-4 sweet-tasting Belladonna berries will kill a child; 10-20 berries kill a healthy adult.'
      }
    ],
    toxicityWarning: 'ANTICHOLINERGIC TOXIDROME: "Blind as a bat (severe mydriasis/pupil dilation), Mad as a hatter (hallucinations/delirium), Red as a beet (cutaneous flushing), Hot as a hare (hyperthermia), Dry as a bone (zero sweat/saliva/dry mouth). Rapid ventricular tachycardia followed by coma.',
    emergencyAntidoteProtocol: '1. Immediate gastric lavage / activated charcoal (50g). 2. Cold wet compresses for extreme hyperthermia (>41°C). 3. Physician administration of Physostigmine salicylate (1-2 mg IV slow) where medical support exists.',
    svgBadge: 'belladonna'
  },
  {
    id: 'foxglove',
    commonName: 'Foxglove',
    scientificName: 'Digitalis purpurea',
    family: 'Plantaginaceae',
    classification: 'Deadly Toxic',
    medicalIndications: [
      'Potent Poison / Lethal Hazard'
    ],
    activeCompounds: ['Digitoxin', 'Digoxin (cardiac steroidal glycosides)'],
    flowerDescription: 'Magnificent, one-sided terminal raceme spire (1-2m tall) bearing 20-80 tubular, bell-like drooping flowers (4-5 cm) colored rich magenta-purple or pink with white-bordered dark spots inside throat.',
    flowerColor: 'Pink/Red',
    leafPattern: 'Alternate',
    stemAndGrowth: 'Biennial plant. Year 1 produces ground rosette of dark green, wrinkled, downy leaves with scalloped margins. Year 2 bolts single massive unbranched flowering stem.',
    habitatAndSeason: 'Acidic soils, woodland margins, clearings, heathlands, rocky hillsides. Blooms June to September.',
    preparations: [],
    lookalikes: [
      {
        toxicSpecies: 'Symphytum officinale',
        toxicCommonName: 'Comfrey (Medicinal Root/Poultice)',
        distinctionKey: 'Comfrey leaves have winged petioles running down the stem and bristly stiff hairs that scratch skin; Foxglove leaves are soft-downy and have distinct scalloped/toothed margins.',
        lethalHazard: 'Brewing foxglove leaves mistaken for comfrey tea causes fatal cardiac arrhythmia.'
      }
    ],
    toxicityWarning: 'LETHAL CARDIOTROPIC EFFECT: Profound bradycardia, yellow-green halos in vision (xanthopsia), nausea, vomiting, followed by ventricular tachycardia and cardiac arrest.',
    emergencyAntidoteProtocol: '1. Administer Activated Charcoal 50g immediately to interrupt enterohepatic recirculation. 2. Monitor pulse strictly; treat severe bradycardia with atropine if trained; administer Digoxin-specific Fab antibodies (DigiFab) in hospital setting.',
    svgBadge: 'foxglove'
  },
  {
    id: 'meadowsweet',
    commonName: 'Meadowsweet / Queen of the Meadow',
    scientificName: 'Filipendula ulmaria',
    family: 'Rosaceae',
    classification: 'Medicinal',
    medicalIndications: [
      'Severe Pain & Inflammation (Analgesic)',
      'Fever & Antipyretic',
      'Digestive Spasms & Nausea'
    ],
    activeCompounds: ['Spiraein / Salicin (Salicylate precursor to aspirin)', 'Flavonoids', 'Tannins', 'Volatile oil (methyl salicylate)'],
    flowerDescription: 'Frothy, delicate, plume-like sprays of tiny creamy-white flowers (3-6 mm) with numerous protruding stamens, emitting a sweet, honeyed almond-like fragrance.',
    flowerColor: 'White',
    leafPattern: 'Alternate',
    stemAndGrowth: 'Erect, reddish, grooved herbaceous perennial (1-1.5m tall). Leaves pinnately divided with large terminal 3-5 lobed leaflet, dark green on top and silvery-downy underneath.',
    habitatAndSeason: 'Wet meadows, riverbanks, damp woodland edges, ditches. Blooms June to September.',
    preparations: [
      {
        method: 'Cold/Hot Infusion (Steeped)',
        partUsed: 'Flowers',
        instructions: 'Steep 2 tablespoons fresh or dried creamy flower plumes in 350 mL boiling water for 15 minutes covered.',
        dosage: 'Drink 1 cup 3 times daily for headache, arthritis pain, fever, and acidic indigestion. Contains natural buffer tannins that protect stomach lining from ulceration unlike synthetic aspirin.'
      },
      {
        method: 'Alcohol Tincture',
        partUsed: 'Whole Aerial',
        instructions: 'Macerate fresh flowering tops in 45% alcohol for 4 weeks. Strain.',
        dosage: '2-4 mL in warm water for tension headache or flu-induced muscle aching.'
      }
    ],
    lookalikes: [
      {
        toxicSpecies: 'Cicuta virosa (Water Hemlock)',
        toxicCommonName: 'Water Hemlock (EXTREMELY LETHAL)',
        distinctionKey: 'Meadowsweet has sweet almond-smelling creamy plume clusters and reddish grooved stems; Water Hemlock has flat umbrella umbels, partitioned hollow rootstocks with yellow oily cicutoxin fluid, and no sweet fragrance.',
        lethalHazard: 'Water hemlock causes violent intractable grand mal convulsions and respiratory arrest within 30 minutes.'
      }
    ],
    svgBadge: 'meadowsweet'
  },
  {
    id: 'st-johns-wort',
    commonName: 'St. John\'s Wort / Amber Herb',
    scientificName: 'Hypericum perforatum',
    family: 'Hypericaceae',
    classification: 'Medicinal',
    medicalIndications: [
      'Severe Pain & Inflammation (Analgesic)',
      'Wound Wash & Antiseptic',
      'Burn & Skin Regeneration'
    ],
    activeCompounds: ['Hypericin (antiviral & nerve regeneration)', 'Hyperforin (antibacterial)', 'Flavonoids'],
    flowerDescription: 'Vibrant golden-yellow 5-petaled star flowers (2-3 cm) with numerous bushy protruding stamens. Petal margins have tiny black glandular dots that stain fingers blood-red when crushed.',
    flowerColor: 'Yellow',
    leafPattern: 'Opposite',
    stemAndGrowth: 'Erect, two-ridged branching stem (40-80cm tall). Small oblong opposite leaves that appear perforated with hundreds of tiny pin-prick translucent oil glands when held up to daylight.',
    habitatAndSeason: 'Sunny roadsides, dry gravel meadows, pastures. Traditional harvest at summer solstice (June).',
    preparations: [
      {
        method: 'Infused Salve',
        partUsed: 'Flowers',
        instructions: 'Pack freshly picked yellow flowers tightly into a glass jar with olive oil or pure rendered lard. Set in bright sun for 4-6 weeks until oil turns deep ruby-red from hypericin pigment. Strain.',
        dosage: 'Rub topically onto severe nerve pain, sciatica, shingles, crush wounds, and minor burns.'
      },
      {
        method: 'Cold/Hot Infusion (Steeped)',
        partUsed: 'Flowers',
        instructions: 'Steep 1 tablespoon dried flowers in 250 mL boiling water for 10 minutes.',
        dosage: 'Drink 1 cup twice daily for nerve-related trauma and low mood. Warning: Induces photosensitivity in bright sun.'
      }
    ],
    lookalikes: [
      {
        toxicSpecies: 'Senecio jacobaea (Tansy Ragwort)',
        toxicCommonName: 'Tansy Ragwort (Liver Toxic)',
        distinctionKey: 'St. John\'s Wort has opposite leaves with translucent pinhole dots and petals that crush blood-red; Ragwort has alternate lobed leaves, daisy-like composite heads, and does NOT crush red.',
        lethalHazard: 'Ragwort contains pyrrolizidine alkaloids causing irreversible chronic hepatic failure.'
      }
    ],
    svgBadge: 'hypericum'
  },
  {
    id: 'stinging-nettle',
    commonName: 'Stinging Nettle',
    scientificName: 'Urtica dioica',
    family: 'Urticaceae',
    classification: 'Edible Wild',
    medicalIndications: [
      'Nutritive Wild Food & Foraging',
      'Severe Pain & Inflammation (Analgesic)',
      'Hemostatic / Blood Clotting'
    ],
    activeCompounds: ['Histamine, Serotonin & Formic acid (in stinging hairs)', 'Plant Protein (25% dry wt)', 'Iron, Calcium, Vitamin A, C, K'],
    flowerDescription: 'Drooping, branching axillary catkin-like spikes of tiny inconspicuous greenish-white flowers hanging from leaf axils.',
    flowerColor: 'Green/Inconspicuous',
    leafPattern: 'Opposite',
    stemAndGrowth: 'Four-angled erect fibrous stem (1-2m tall). Heart-shaped to lanceolate opposite dark green leaves with coarsely saw-toothed margins, densely covered in hollow stinging silica hairs (trichomes).',
    habitatAndSeason: 'Nitrogen-rich soils, damp riverbanks, farmstead ruins, compost margins. Harvest young top 4 leaves in spring with gloves.',
    preparations: [
      {
        method: 'Decoction (Boiled)',
        partUsed: 'Leaves',
        instructions: 'Boil freshly foraged young nettle tops in water for 3 to 5 minutes. Boiling or drying INSTANTLY destroys the stinging formic acid silica hairs, rendering greens completely harmless and delicious.',
        dosage: 'Eat cooked greens as mineral-dense survival food (rich in iron and protein). Drink the remaining emerald cooking broth as a high-potency mineral restoration tonic.'
      },
      {
        method: 'Fresh Poultice (Crushed)',
        partUsed: 'Leaves',
        instructions: 'Controlled urtication: Lightly brushing fresh stinging nettle over arthritic knee or joint stimulates counter-irritant blood flow and endorphin release that dulls chronic arthritic joint pain.',
        dosage: 'Brief touch once daily for chronic joint swelling.'
      }
    ],
    lookalikes: [
      {
        toxicSpecies: 'Lamium album (White Deadnettle)',
        toxicCommonName: 'White Deadnettle (Edible / Harmless)',
        distinctionKey: 'Deadnettle looks identical but has zero stinging hairs and produces large white two-lipped snapdragon-like flowers.',
        lethalHazard: 'Non-toxic, safe.'
      }
    ],
    svgBadge: 'nettle'
  },
  {
    id: 'dandelion',
    commonName: 'Common Dandelion',
    scientificName: 'Taraxacum officinale',
    family: 'Asteraceae',
    classification: 'Edible Wild',
    medicalIndications: [
      'Nutritive Wild Food & Foraging',
      'Digestive Spasms & Nausea'
    ],
    activeCompounds: ['Taraxacin (bitter lactone)', 'Inulin prebiotic fiber (up to 40% in autumn roots)', 'Potassium, Vitamin A, Vitamin K'],
    flowerDescription: 'Solitary, bright golden-yellow composite flower head (2-4 cm) consisting entirely of strap-shaped ray florets, opening in morning sun on a hollow milky leafless stalk.',
    flowerColor: 'Yellow',
    leafPattern: 'Basal Rosette',
    stemAndGrowth: 'Stemless perennial with thick, deep, fleshy taproot (exuding white milky bitter latex). Leaves arranged in flat basal rosette with deeply jagged, backwards-pointing teeth ("dent-de-lion" = lion\'s tooth). Leaves are hairless.',
    habitatAndSeason: 'Disturbed ground, meadows, lawns, mountainsides globally. Available early spring to late freeze.',
    preparations: [
      {
        method: 'Cold/Hot Infusion (Steeped)',
        partUsed: 'Roots',
        instructions: 'Dig mature taproots in autumn. Scrub clean, chop into 1cm dice, and roast slowly in pan/oven at 150°C until dark brown and aromatic. Grind into powder; steep 2 tablespoons in hot water.',
        dosage: 'Drink roasted dandelion root as a rich coffee substitute, liver stimulant, and digestive bile tonic.'
      },
      {
        method: 'Decoction (Boiled)',
        partUsed: 'Leaves',
        instructions: 'Harvest young spring leaves before flowering. Eat raw in salads or steam for 3 minutes to reduce bitterness.',
        dosage: 'Consume 1-2 cups of greens as complete survival vitamin A, C, and potassium supplement.'
      }
    ],
    lookalikes: [
      {
        toxicSpecies: 'Hypochaeris radicata (Cat\'s Ear)',
        toxicCommonName: 'Cat\'s Ear / False Dandelion',
        distinctionKey: 'Cat\'s Ear has solid, wiry, branched flowering stems and bristly rough hairy leaves; True Dandelion has completely hairless leaves and a single hollow unbranched flower stem.',
        lethalHazard: 'Mildly toxic to horses; non-fatal to humans.'
      }
    ],
    svgBadge: 'dandelion'
  },
  {
    id: 'wild-carrot',
    commonName: 'Wild Carrot / Queen Anne\'s Lace',
    scientificName: 'Daucus carota',
    family: 'Apiaceae',
    classification: 'Edible Wild',
    medicalIndications: [
      'Nutritive Wild Food & Foraging',
      'Digestive Spasms & Nausea'
    ],
    activeCompounds: ['Carotenes', 'Volatile essential oils (carotol, pinene)', 'Pectin'],
    flowerDescription: 'Flat to concave lace-like compound umbel (5-10 cm) of tiny white 5-petaled flowers, famously featuring a single central solitary dark purple/black floret in the middle. Bracts beneath umbel are 3-forked and feather-like.',
    flowerColor: 'White',
    leafPattern: 'Alternate',
    stemAndGrowth: 'Stout, erect, green stem (30-100cm tall) covered in STIFF, ROUGH HAIRS. Stems are SOLID and have ZERO PURPLE SPOTS. Emits distinct, unmistakable sweet carrot aroma when crushed. White tapered taproot smells like cultivated carrot.',
    habitatAndSeason: 'Sunny fields, meadows, roadsides. First-year root harvested in autumn.',
    preparations: [
      {
        method: 'Decoction (Boiled)',
        partUsed: 'Roots',
        instructions: 'Dig first-year taproot before flowering. Scrub clean, slice, and simmer in water for 15-20 minutes until tender.',
        dosage: 'Eat root as calorie-rich cooked vegetable. Warning: Second-year flowering plants develop a tough woody inedible root.'
      }
    ],
    lookalikes: [
      {
        toxicSpecies: 'Conium maculatum (Poison Hemlock)',
        toxicCommonName: 'Poison Hemlock (FATAL LETHAL LOOKALIKE)',
        distinctionKey: 'CRITICAL DIFFERENCE: Wild Carrot stems are HAIRY, SOLID, have NO PURPLE SPOTS, and smell like sweet carrot. Poison Hemlock stems are COMPLETELY HAIRLESS, HOLLOW, covered in PURPLE MOUSE-URINE BLOTCHES, and smell foul!',
        lethalHazard: 'Mistaking hemlock for wild carrot causes neuromuscular paralysis and fatal respiratory arrest in 60-90 minutes!'
      }
    ],
    svgBadge: 'carrot'
  },
  {
    id: 'monkshood',
    commonName: 'Monkshood / Wolfsbane',
    scientificName: 'Aconitum napellus',
    family: 'Ranunculaceae',
    classification: 'Deadly Toxic',
    medicalIndications: [
      'Potent Poison / Lethal Hazard'
    ],
    activeCompounds: ['Aconitine', 'Mesaconitine (potent neurotoxins and sodium channel activators)'],
    flowerDescription: 'Dense erect terminal spike (50-150 cm) bearing distinctive helmet-like or cowl-shaped hooded flowers (2-3 cm) of intense deep violet-blue or dark purple coloration.',
    flowerColor: 'Purple/Blue',
    leafPattern: 'Alternate',
    stemAndGrowth: 'Stout, erect unbranched stem. Leaves are dark glossy green, deeply palmately divided into 5-7 narrow segments with sharp linear lobes. Fleshy tuberous root resembles small turnip.',
    habitatAndSeason: 'Moist damp soils, mountain meadows, stream banks, shade. Blooms July to September.',
    preparations: [],
    lookalikes: [
      {
        toxicSpecies: 'Delphinium (Larkspur)',
        toxicCommonName: 'Wild Larkspur (Toxic)',
        distinctionKey: 'Larkspur flowers have a backward-pointing spur; Monkshood flowers form a rounded curved helmet/cowl over the center.',
        lethalHazard: 'Both are severely toxic, but Monkshood aconitine is 10x more lethal.'
      }
    ],
    toxicityWarning: 'LETHAL TOXIN: Absorbs through intact skin! Never touch with bare hands. Ingestion causes instant mouth burning and numbness, vomiting, extreme bradycardia, ventricular fibrillation, and death within 30-120 minutes. Just 2 mg of pure aconitine or 1 gram of root is fatal.',
    emergencyAntidoteProtocol: '1. If swallowed, administer Activated Charcoal 50g-100g immediately. 2. Treat ventricular tachycardia with Amiodarone or Flecainide in advanced clinical setting. Atropine for severe bradycardia.',
    svgBadge: 'monkshood'
  }
];

