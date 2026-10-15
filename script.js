/**
 * ============================================================================
 * WORLD EXPLORER — Interactive 3D Globe & Landmark Discovery Engine
 * File: script.js
 * Tech Stack: Vanilla JavaScript (ES6+), Three.js (r128), OrbitControls, GeoJSON
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. CONFIGURATION & CONSTANTS
     ========================================================================== */
  const GLOBE_RADIUS = 100;
  const BORDER_ALTITUDE = 100.18;
  const HOVER_ALTITUDE = 100.42;
  const SELECT_ALTITUDE = 100.55;
  const MARKER_ALTITUDE = 100.85;
  const DEFAULT_CAMERA_DISTANCE = 255;
  const FOCUS_CAMERA_DISTANCE = 178;
  const LANDMARK_CAMERA_DISTANCE = 152;
  const DEG2RAD = Math.PI / 180;
  const RAD2DEG = 180 / Math.PI;

  const GEOJSON_URLS = [
    'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
    'https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json'
  ];

  const EARTH_TEXTURES = {
    diffuse: 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg',
    bump: 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png',
    specular: 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-water.png'
  };

  /* ==========================================================================
     2. STRUCTURED COUNTRY & LANDMARK DATASET (24 COUNTRIES × 5 LANDMARKS = 120)
     ========================================================================== */
  const COUNTRIES_DATABASE = {
    'Philippines': {
      name: 'Philippines',
      iso3: 'PHL',
      iso2: 'ph',
      flag: '🇵🇭',
      capital: 'Manila',
      region: 'Southeast Asia',
      population: '117.3M',
      currency: 'PHP (₱)',
      lat: 12.8797,
      lng: 121.7740,
      description: 'An archipelago of over 7,600 tropical islands renowned for its emerald rice terraces, symmetrical volcanic cones, Spanish colonial heritage, and biodiversity-rich coral reefs.',
      landmarks: [
        {
          name: 'Chocolate Hills',
          city: 'Bohol',
          lat: 9.8297,
          lng: 124.1397,
          category: 'Geological Wonder',
          era: '2M+ Years Old',
          visitors: '850K / yr',
          shortDesc: 'Over 1,260 conical karst hills that turn rich cocoa-brown during the dry season.',
          fullDesc: 'Spread across more than 50 square kilometers in central Bohol, the Chocolate Hills are an extraordinary geological formation of grass-covered marine limestone domes sculpted by millennia of rainfall and erosion. Declared a UNESCO Global Geopark centerpiece, they transform into rows of chocolate-colored mounds every dry season.',
          image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Banaue Rice Terraces',
          city: 'Ifugao',
          lat: 16.9240,
          lng: 121.0558,
          category: 'UNESCO Cultural Landscape',
          era: 'c. 2,000 Years Old',
          visitors: '420K / yr',
          shortDesc: 'Ancient hand-carved mountain terraces engineered by the indigenous Ifugao people.',
          fullDesc: 'Carved into the steep Cordillera mountains at altitudes reaching 1,500 meters, the Banaue and Batad Rice Terraces represent a living masterwork of indigenous hydraulic engineering. Fed by mountain rainforest springs above the terraces, they have sustained highland communities for millennia.',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Boracay White Beach',
          city: 'Malay, Aklan',
          lat: 11.9674,
          lng: 121.9248,
          category: 'Island Paradise',
          era: 'Natural Coastline',
          visitors: '2.1M / yr',
          shortDesc: 'World-famous island destination celebrated for powdery white sand and fiery sunsets.',
          fullDesc: 'Fringed by a four-kilometer crescent of talcum-fine white coral sand and calm azure waters, Boracay Island is one of the world’s premier beach destinations. Traditional paraw sailboats glide across the horizon at dusk while vibrant coral reefs surround the island.',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Mayon Volcano',
          city: 'Legazpi, Albay',
          lat: 13.2548,
          lng: 123.6861,
          category: 'Active Stratovolcano',
          era: '2,462m Elevation',
          visitors: '510K / yr',
          shortDesc: 'Iconic stratovolcano famed globally for its near-perfect symmetrical cone.',
          fullDesc: 'Rising 2,462 meters above the shores of Albay Gulf in the Bicol region, Mount Mayon is celebrated as the world’s most symmetrically shaped volcanic cone. Surrounding viewpoints such as the Cagsawa Ruins frame dramatic vistas of its mist-crowned crater.',
          image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Intramuros & Fort Santiago',
          city: 'Manila',
          lat: 14.5896,
          lng: 120.9747,
          category: 'Historic Walled City',
          era: 'Founded 1571',
          visitors: '1.8M / yr',
          shortDesc: 'Manila’s 16th-century Spanish stone citadel, cobblestone plazas, and UNESCO baroque church.',
          fullDesc: 'Constructed in 1571 along the southern bank of the Pasig River, Intramuros served as the historic seat of Spanish governance in Asia. Inside its massive stone bastions stand Fort Santiago, Manila Cathedral, and the earthquake-resistant San Agustin Church, a UNESCO World Heritage Site.',
          image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Japan': {
      name: 'Japan',
      iso3: 'JPN',
      iso2: 'jp',
      flag: '🇯🇵',
      capital: 'Tokyo',
      region: 'East Asia',
      population: '124.5M',
      currency: 'JPY (¥)',
      lat: 36.2048,
      lng: 138.2529,
      description: 'An island nation blending centuries-old Shinto shrines, Zen gardens, and samurai castles with futuristic neon metropolises and snow-capped volcanic peaks.',
      landmarks: [
        {
          name: 'Mount Fuji',
          city: 'Fujinomiya / Yamanashi',
          lat: 35.3606,
          lng: 138.7274,
          category: 'UNESCO Sacred Mountain',
          era: '3,776m Elevation',
          visitors: '3.2M / yr',
          shortDesc: 'Japan’s highest peak and timeless cultural symbol capped with snow above the Fuji Five Lakes.',
          fullDesc: 'Standing at 3,776 meters, Mount Fuji is an active stratovolcano and revered sacred mountain that has inspired Japanese woodblock prints, poetry, and pilgrimages for centuries. Framed by cherry blossoms in spring and Chureito Pagoda, it is a UNESCO World Heritage cultural site.',
          image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Tokyo Tower',
          city: 'Minato, Tokyo',
          lat: 35.6586,
          lng: 139.7454,
          category: 'Architectural Icon',
          era: 'Built 1958',
          visitors: '2.8M / yr',
          shortDesc: 'Vibrant 333-meter red-and-white lattice observation tower illuminating the Tokyo skyline.',
          fullDesc: 'Soaring 333 meters above Zojo-ji Temple in Minato Ward, Tokyo Tower is an enduring beacon of post-war Japanese resurgence. Its dual observation decks command 360-degree views across the sprawling Tokyo metropolis all the way to Mount Fuji on clear days.',
          image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Fushimi Inari Taisha',
          city: 'Kyoto',
          lat: 34.9671,
          lng: 135.7727,
          category: 'Shinto Shrine',
          era: 'Founded 711 AD',
          visitors: '4.5M / yr',
          shortDesc: 'Famous hillside Shinto shrine featuring thousands of vermilion torii gates winding through forest trails.',
          fullDesc: 'Dedicated to Inari, the Shinto deity of rice and prosperity, Fushimi Inari Taisha is renowned for the Senbon Torii—roughly 10,000 closely spaced vermilion gates that form hypnotic mountain tunnels ascending sacred Mount Inari in southern Kyoto.',
          image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Arashiyama Bamboo Grove',
          city: 'Kyoto',
          lat: 35.0170,
          lng: 135.6713,
          category: 'Natural Sanctuary',
          era: 'Heian Period Heritage',
          visitors: '3.1M / yr',
          shortDesc: 'Soaring stalks of emerald moso bamboo creating anotherworldly acoustic pathway in western Kyoto.',
          fullDesc: 'Adjacent to the UNESCO-listed Tenryu-ji Zen temple, the Arashiyama Bamboo Grove immerses visitors in a cathedral-like corridor of towering green bamboo stalks whose rustling leaves are officially recognized by Japan’s Ministry of the Environment as one of the "100 Soundscapes of Japan."',
          image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Himeji Castle',
          city: 'Himeji, Hyogo',
          lat: 34.8394,
          lng: 134.6939,
          category: 'UNESCO Feudal Castle',
          era: 'Completed 1609',
          visitors: '1.9M / yr',
          shortDesc: 'Known as the "White Heron Castle," Japan’s finest surviving example of feudal castle architecture.',
          fullDesc: 'Comprising 83 wooden buildings with brilliant white plastered earthen walls and labyrinthine defensive gates, Himeji Castle survived centuries of warfare, earthquakes, and modern history intact. Its graceful multi-tiered roofs resemble a white egret taking flight.',
          image: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'France': {
      name: 'France',
      iso3: 'FRA',
      iso2: 'fr',
      flag: '🇫🇷',
      capital: 'Paris',
      region: 'Western Europe',
      population: '68.2M',
      currency: 'EUR (€)',
      lat: 46.2276,
      lng: 2.2137,
      description: 'Celebrated worldwide for its art, haute cuisine, Gothic cathedrals, royal châteaux, Alpine peaks, and romantic boulevards along the Seine.',
      landmarks: [
        {
          name: 'Eiffel Tower',
          city: 'Paris',
          lat: 48.8584,
          lng: 2.2945,
          category: 'Architectural Monument',
          era: 'Built 1889',
          visitors: '7.0M / yr',
          shortDesc: 'Gustave Eiffel’s 330-meter wrought-iron masterpiece presiding over the Champ de Mars.',
          fullDesc: 'Constructed as the centerpiece of the 1889 Exposition Universelle, the Eiffel Tower held the title of tallest human-made structure in the world for 41 years. Every evening it sparkles with 20,000 golden lights overlooking the Seine and Paris skyline.',
          image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Louvre Museum',
          city: 'Paris',
          lat: 48.8606,
          lng: 2.3376,
          category: 'World Art Museum',
          era: 'Opened 1793',
          visitors: '8.9M / yr',
          shortDesc: 'Historic royal palace and glass pyramid housing the Mona Lisa and Venus de Milo.',
          fullDesc: 'Originally built as a 12th-century fortress before becoming the royal residence of French monarchs, the Louvre is the world’s most visited art museum. Entered through I. M. Pei’s iconic glass pyramid, its galleries span 9,000 years of human creativity.',
          image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Palace of Versailles',
          city: 'Versailles',
          lat: 48.8049,
          lng: 2.1204,
          category: 'UNESCO Royal Château',
          era: '17th Century',
          visitors: '8.1M / yr',
          shortDesc: 'Opulent palace of King Louis XIV famed for its Hall of Mirrors and geometric manicured gardens.',
          fullDesc: 'Transformed by Louis XIV from a royal hunting lodge into the dazzling seat of the French court, Versailles epitomizes 17th-century grandeur with its 357-mirror Galerie des Glaces, musical fountains, and 800 hectares of classical gardens designed by André Le Nôtre.',
          image: 'https://images.unsplash.com/photo-1591289009723-aef0a1a8a211?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Mont-Saint-Michel',
          city: 'Normandy',
          lat: 48.6361,
          lng: -1.5115,
          category: 'UNESCO Tidal Island',
          era: 'Founded 8th Century',
          visitors: '2.8M / yr',
          shortDesc: 'Medieval Gothic abbey crowning a dramatic rocky tidal island off the coast of Normandy.',
          fullDesc: 'Rising like a mirage above vast tidal flats that flood twice daily with Europe’s highest tides, Mont-Saint-Michel is a fortified medieval village crowned by a breathtaking Benedictine abbey soaring 92 meters above the sea.',
          image: 'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Promenade des Anglais',
          city: 'Nice, Côte d’Azur',
          lat: 43.6947,
          lng: 7.2653,
          category: 'Mediterranean Coast',
          era: '19th Century',
          visitors: '4.6M / yr',
          shortDesc: 'Sun-drenched French Riviera boulevard curving along the turquoise Baie des Anges.',
          fullDesc: 'Stretching seven kilometers along the glittering Mediterranean waterfront of Nice, the UNESCO-recognized Promenade des Anglais showcases Belle Époque palaces, palm-lined esplanades, and pastel hillside vistas of the French Riviera.',
          image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Italy': {
      name: 'Italy',
      iso3: 'ITA',
      iso2: 'it',
      flag: '🇮🇹',
      capital: 'Rome',
      region: 'Southern Europe',
      population: '58.9M',
      currency: 'EUR (€)',
      lat: 41.8719,
      lng: 12.5674,
      description: 'Cradle of the Roman Empire and the Renaissance, home to more UNESCO World Heritage Sites than any other nation on Earth.',
      landmarks: [
        {
          name: 'The Colosseum',
          city: 'Rome',
          lat: 41.8902,
          lng: 12.4922,
          category: 'Ancient Amphitheatre',
          era: 'Completed 80 AD',
          visitors: '7.6M / yr',
          shortDesc: 'Monumental travertine amphitheatre of Imperial Rome that once seated 50,000 spectators.',
          fullDesc: 'Commissioned under Emperor Vespasian and inaugurated by Titus in 80 AD, the Flavian Amphitheatre remains the largest ancient amphitheatre ever built. Its multi-story arcades and subterranean hypogeum showcase Roman engineering mastery.',
          image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Leaning Tower of Pisa',
          city: 'Pisa, Tuscany',
          lat: 43.7230,
          lng: 10.3966,
          category: 'UNESCO Romanesque Bell Tower',
          era: 'Built 1173–1372',
          visitors: '5.0M / yr',
          shortDesc: 'White marble medieval campanile famous for its nearly four-degree architectural tilt.',
          fullDesc: 'Standing on the emerald Piazza dei Miracoli alongside Pisa’s Cathedral and Baptistery, this eight-story Romanesque bell tower began tilting during construction in the 12th century due to soft subsoil, becoming an enduring architectural wonder.',
          image: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Venice Grand Canal & Piazza San Marco',
          city: 'Venice',
          lat: 45.4342,
          lng: 12.3388,
          category: 'UNESCO Lagoon City',
          era: 'Founded 5th Century',
          visitors: '5.5M / yr',
          shortDesc: 'Floating city of marble palaces, Rialto Bridge, gondolas, and St. Mark’s Basilica.',
          fullDesc: 'Built across 118 islands linked by over 400 bridges in the Venetian Lagoon, Venice enchants travelers with its S-shaped Grand Canal, Venetian Gothic palazzi, the Doge’s Palace, and the gilded Byzantine mosaics of St. Mark’s Basilica.',
          image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Florence Cathedral (Duomo)',
          city: 'Florence',
          lat: 43.7731,
          lng: 11.2560,
          category: 'Renaissance Masterpiece',
          era: 'Completed 1436',
          visitors: '4.5M / yr',
          shortDesc: 'Crowned by Filippo Brunelleschi’s monumental terracotta dome in the heart of Tuscany.',
          fullDesc: 'The Cathedral of Santa Maria del Fiore dominates the Florence skyline with its polychrome green, pink, and white marble facade and Brunelleschi’s self-supporting brick dome—the largest masonry dome ever constructed.',
          image: 'https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Amalfi Coast (Positano)',
          city: 'Campania',
          lat: 40.6281,
          lng: 14.4850,
          category: 'UNESCO Coastal Landscape',
          era: 'Medieval Maritime Republic',
          visitors: '5.0M / yr',
          shortDesc: 'Dramatic cliffside villages, lemon groves, and cobalt coves overlooking the Tyrrhenian Sea.',
          fullDesc: 'Stretching along the southern edge of the Sorrentine Peninsula, the Amalfi Coast is famous for vertical pastel villages like Positano and Ravello clinging to limestone cliffs above shimmering Mediterranean waters.',
          image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'United States': {
      name: 'United States',
      iso3: 'USA',
      iso2: 'us',
      flag: '🇺🇸',
      capital: 'Washington, D.C.',
      region: 'North America',
      population: '334.9M',
      currency: 'USD ($)',
      lat: 39.8283,
      lng: -98.5795,
      description: 'Spanning from Atlantic harbors to Pacific redwoods, featuring monumental national parks, iconic suspension bridges, and global cultural capitals.',
      landmarks: [
        {
          name: 'Statue of Liberty',
          city: 'New York City, NY',
          lat: 40.6892,
          lng: -74.0445,
          category: 'UNESCO National Monument',
          era: 'Dedicated 1886',
          visitors: '4.2M / yr',
          shortDesc: 'Colossal neoclassical copper statue welcoming vessels into New York Harbor.',
          fullDesc: 'Designed by Frédéric Auguste Bartholdi with an internal iron framework by Gustave Eiffel, Lady Liberty was gifted by France to the United States in 1886 and stands on Liberty Island as a universal emblem of freedom and democracy.',
          image: 'https://images.unsplash.com/photo-1503572327579-b5c6afe5c5c5?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Grand Canyon',
          city: 'Arizona',
          lat: 36.1069,
          lng: -112.1129,
          category: 'UNESCO Natural Wonder',
          era: '5–6M Years Carved',
          visitors: '4.7M / yr',
          shortDesc: 'Mile-deep chasm carved by the Colorado River exposing two billion years of geological history.',
          fullDesc: 'Stretching 446 kilometers across northern Arizona, the Grand Canyon dazzles visitors with its vast layered bands of red, ochre, and gold rock formations that shift dramatically in color from sunrise to sunset.',
          image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Golden Gate Bridge',
          city: 'San Francisco, CA',
          lat: 37.8199,
          lng: -122.4783,
          category: 'Engineering Marvel',
          era: 'Opened 1937',
          visitors: '10.0M / yr',
          shortDesc: 'Art Deco suspension bridge painted in "International Orange" spanning the Golden Gate strait.',
          fullDesc: 'Linking San Francisco to Marin County across the turbulent entrance to San Francisco Bay, the Golden Gate Bridge rises 227 meters above the Pacific swell and is celebrated for its Art Deco towers and coastal fog vistas.',
          image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Yellowstone National Park',
          city: 'Wyoming / Montana',
          lat: 44.4280,
          lng: -110.5885,
          category: 'First National Park',
          era: 'Established 1872',
          visitors: '4.5M / yr',
          shortDesc: 'Geothermal wonderland home to Old Faithful geyser, Grand Prismatic Spring, and roaming bison.',
          fullDesc: 'Established in 1872 as the world’s first national park, Yellowstone sits atop a volcanic hotspot containing half of Earth’s active hydrothermal features alongside alpine canyons, waterfalls, and abundant wildlife.',
          image: 'https://images.unsplash.com/photo-1533414417583-f0ab99151186?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Empire State Building & Midtown',
          city: 'New York City, NY',
          lat: 40.7484,
          lng: -73.9857,
          category: 'Art Deco Skyscraper',
          era: 'Completed 1931',
          visitors: '4.0M / yr',
          shortDesc: 'Iconic 102-story Manhattan skyscraper offering panoramic views from its 86th and 102nd floor decks.',
          fullDesc: 'Soaring 443 meters to its lightning rod tip in the heart of Midtown Manhattan, the Empire State Building is a triumph of Art Deco architecture and an unmistakable centerpiece of the New York City skyline.',
          image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'China': {
      name: 'China',
      iso3: 'CHN',
      iso2: 'cn',
      flag: '🇨🇳',
      capital: 'Beijing',
      region: 'East Asia',
      population: '1.41B',
      currency: 'CNY (¥)',
      lat: 35.8617,
      lng: 104.1954,
      description: 'One of the world’s oldest continuous civilizations, defined by imperial palaces, ancient frontier fortifications, karst landscapes, and modern megacities.',
      landmarks: [
        {
          name: 'Great Wall of China (Mutianyu & Badaling)',
          city: 'Beijing',
          lat: 40.4319,
          lng: 116.5704,
          category: 'UNESCO World Wonder',
          era: '7th Century BC – Ming Dynasty',
          visitors: '10.0M / yr',
          shortDesc: 'Colossal stone and brick defense system snaking across rugged northern mountain ridges.',
          fullDesc: 'Built and rebuilt across dynasties spanning over two millennia, the Great Wall stretches more than 21,000 kilometers across northern China. Its Ming-era watchtowers and battlements crest steep forested peaks outside Beijing.',
          image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'The Forbidden City',
          city: 'Beijing',
          lat: 39.9163,
          lng: 116.3972,
          category: 'Imperial Palace Complex',
          era: 'Built 1406–1420',
          visitors: '14.0M / yr',
          shortDesc: 'Sprawling Ming and Qing imperial palace complex comprising 980 ceremonial buildings.',
          fullDesc: 'At the ceremonial heart of Beijing, the Palace Museum (Forbidden City) served as home to 24 Chinese emperors over five centuries. Its golden-roofed wooden halls and vermilion walls represent the pinnacle of traditional Chinese palatial design.',
          image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Terracotta Army',
          city: 'Xi’an, Shaanxi',
          lat: 34.3841,
          lng: 109.2785,
          category: 'Archaeological Marvel',
          era: '210–209 BC',
          visitors: '6.8M / yr',
          shortDesc: 'Thousands of life-sized clay warriors guarding the mausoleum of China’s first emperor.',
          fullDesc: 'Discovered by local farmers in 1974 near Xi’an, the funerary complex of Emperor Qin Shi Huang contains over 8,000 individually sculpted life-sized terracotta soldiers, chariots, and horses arrayed in battle formation.',
          image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Zhangjiajie National Forest Park',
          city: 'Hunan Province',
          lat: 29.3249,
          lng: 110.4343,
          category: 'UNESCO Global Geopark',
          era: 'Devonian Sandstone Pillars',
          visitors: '4.9M / yr',
          shortDesc: 'Over 3,000 towering quartz-sandstone pillars piercing mist-filled subtropical valleys.',
          fullDesc: 'Part of the Wulingyuan Scenic Area, Zhangjiajie is famed for its sky-scraping sandstone spires—some rising over 200 meters—draped in pine trees and swirling mountain clouds.',
          image: 'https://images.unsplash.com/photo-1513415277900-a62401e19be4?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Li River Karst Peaks',
          city: 'Guilin & Yangshuo',
          lat: 24.7785,
          lng: 110.4966,
          category: 'UNESCO Natural Karst',
          era: 'Ancient Limestone Landscape',
          visitors: '5.5M / yr',
          shortDesc: 'Poetic river valley winding between emerald limestone pinnacles and bamboo groves.',
          fullDesc: 'Immortalized on China’s 20-yuan banknote and centuries of ink-wash landscape scrolls, the 83-kilometer Li River cruise between Guilin and Yangshuo reveals dramatic karst peaks reflected in jade waters.',
          image: 'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'India': {
      name: 'India',
      iso3: 'IND',
      iso2: 'in',
      flag: '🇮🇳',
      capital: 'New Delhi',
      region: 'South Asia',
      population: '1.43B',
      currency: 'INR (₹)',
      lat: 20.5937,
      lng: 78.9629,
      description: 'A vibrant tapestry of Mughal marble mausoleums, Rajput desert fortresses, sacred river ghats, Himalayan summits, and ancient temple architecture.',
      landmarks: [
        {
          name: 'Taj Mahal',
          city: 'Agra, Uttar Pradesh',
          lat: 27.1751,
          lng: 78.0421,
          category: 'UNESCO World Wonder',
          era: 'Built 1632–1653',
          visitors: '7.5M / yr',
          shortDesc: 'Ivory-white marble mausoleum on the Yamuna River commissioned by Emperor Shah Jahan.',
          fullDesc: 'Inlaid with semi-precious stones in delicate floral pietra dura patterns, the Taj Mahal was built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal and is universally admired as the jewel of Indo-Islamic architecture.',
          image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Hawa Mahal (Palace of Winds)',
          city: 'Jaipur, Rajasthan',
          lat: 26.9239,
          lng: 75.8267,
          category: 'Rajput Royal Palace',
          era: 'Built 1799',
          visitors: '1.4M / yr',
          shortDesc: 'Five-story pink sandstone facade honeycombed with 953 intricate lattice windows.',
          fullDesc: 'Constructed in 1799 by Maharaja Sawai Pratap Singh in the heart of Jaipur’s Pink City, Hawa Mahal’s pyramidal facade of 953 jharokha windows utilizes the Venturi effect to channel cool breezes through the royal chambers.',
          image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Amber Fort (Amer Fort)',
          city: 'Jaipur, Rajasthan',
          lat: 26.9855,
          lng: 75.8513,
          category: 'UNESCO Hill Fortress',
          era: 'Founded 1592',
          visitors: '1.8M / yr',
          shortDesc: 'Majestic sandstone and marble hilltop citadel overlooking Maota Lake.',
          fullDesc: 'Crowning a rugged ridge above Maota Lake, Amber Fort blends Rajput and Mughal architectural grandeur, highlighted by the dazzling Sheesh Mahal (Mirror Palace) where thousands of convex mirrors illuminate at the strike of a single candle.',
          image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Varanasi Dashashwamedh Ghat',
          city: 'Varanasi, Uttar Pradesh',
          lat: 25.3068,
          lng: 83.0104,
          category: 'Sacred Riverfront',
          era: 'Over 3,000 Years Old',
          visitors: '6.2M / yr',
          shortDesc: 'Ancient stepped stone embankments along the sacred Ganges illuminated by nightly Ganga Aarti ceremonies.',
          fullDesc: 'As one of the world’s oldest continuously inhabited cities, Varanasi’s 84 riverfront ghats form the spiritual heart of India, where brass lamps, chants, and floral offerings illuminate the Ganges each dusk.',
          image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Qutub Minar',
          city: 'New Delhi',
          lat: 28.5245,
          lng: 77.1855,
          category: 'UNESCO Victory Tower',
          era: 'Begun 1199 AD',
          visitors: '3.2M / yr',
          shortDesc: 'Soaring 72.5-meter fluted red sandstone minaret adorned with intricate calligraphic bands.',
          fullDesc: 'Standing inside the historic Mehrauli archaeological complex in southern Delhi, Qutub Minar is the tallest brick minaret in the world, surrounded by ancient iron pillars and carved courtyard arcades.',
          image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Egypt': {
      name: 'Egypt',
      iso3: 'EGY',
      iso2: 'eg',
      flag: '🇪🇬',
      capital: 'Cairo',
      region: 'North Africa / Middle East',
      population: '112.7M',
      currency: 'EGP (E£)',
      lat: 26.8206,
      lng: 30.8025,
      description: 'Home to the Nile River valley and the monumental legacy of the Pharaohs, where 4,500-year-old pyramids and rock-cut temples rise from golden desert sands.',
      landmarks: [
        {
          name: 'Great Pyramid of Giza & Sphinx',
          city: 'Giza (Greater Cairo)',
          lat: 29.9792,
          lng: 31.1342,
          category: 'Ancient World Wonder',
          era: 'c. 2560 BC',
          visitors: '14.7M / yr',
          shortDesc: 'The oldest and sole surviving Wonder of the Ancient World, guarded by the Great Sphinx.',
          fullDesc: 'Built for Fourth Dynasty Pharaoh Khufu from over 2.3 million limestone and granite blocks, the Great Pyramid of Giza rises beside the pyramids of Khafre and Menkaure and the monolithic Great Sphinx on the Giza Plateau.',
          image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Abu Simbel Temples',
          city: 'Aswan Governorate',
          lat: 22.3372,
          lng: 31.6258,
          category: 'UNESCO Rock-Cut Temple',
          era: 'c. 1264 BC',
          visitors: '1.2M / yr',
          shortDesc: 'Twin sandstone cliff temples of Ramesses II and Queen Nefertari overlooking Lake Nasser.',
          fullDesc: 'Guarded by four 20-meter seated colossi of Pharaoh Ramesses II, the twin temples of Abu Simbel were famously relocated block-by-block in 1968 to save them from the rising waters of Lake Nasser.',
          image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Karnak Temple Complex',
          city: 'Luxor',
          lat: 25.7188,
          lng: 32.6573,
          category: 'Ancient Religious Complex',
          era: '2055 BC – 100 AD',
          visitors: '2.9M / yr',
          shortDesc: 'Monumental sanctuary famous for its Great Hypostyle Hall of 134 towering papyrus columns.',
          fullDesc: 'Constructed over 2,000 years by more than thirty pharaohs in ancient Thebes, the Karnak Temple Complex features giant granite obelisks, sacred lakes, and a forest of carved sandstone columns.',
          image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Valley of the Kings',
          city: 'West Bank, Luxor',
          lat: 25.7402,
          lng: 32.6014,
          category: 'UNESCO Royal Necropolis',
          era: '1539–1075 BC (New Kingdom)',
          visitors: '2.2M / yr',
          shortDesc: 'Desert wadi honeycombed with richly painted underground tombs including Tutankhamun’s.',
          fullDesc: 'Across the Nile from Luxor, New Kingdom pharaohs carved over 60 subterranean royal tombs deep into the Theban hills, decorated with vivid astronomical ceilings and passages from the Book of the Dead.',
          image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Citadel of Qaitbay & Alexandria Harbor',
          city: 'Alexandria',
          lat: 31.2140,
          lng: 29.8856,
          category: 'Mediterranean Fortress',
          era: 'Built 1477 AD',
          visitors: '1.5M / yr',
          shortDesc: '15th-century coastal fortress standing on the exact site of the ancient Pharos Lighthouse.',
          fullDesc: 'Built by Sultan Al-Ashraf Qaitbay along the eastern harbor of Alexandria using salvaged stones from the fallen Lighthouse of Alexandria, the fortress commands sweeping views of the Mediterranean Sea.',
          image: 'https://images.unsplash.com/photo-1572252821143-035a024857ac?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Brazil': {
      name: 'Brazil',
      iso3: 'BRA',
      iso2: 'br',
      flag: '🇧🇷',
      capital: 'Brasília',
      region: 'South America',
      population: '216.4M',
      currency: 'BRL (R$)',
      lat: -14.2350,
      lng: -51.9253,
      description: 'South America’s largest nation, encompassing the Amazon basin, thundering subtropical waterfalls, granite coastal peaks, and vibrant Afro-Brazilian heritage.',
      landmarks: [
        {
          name: 'Christ the Redeemer',
          city: 'Rio de Janeiro',
          lat: -22.9519,
          lng: -43.2105,
          category: 'New World Wonder',
          era: 'Completed 1931',
          visitors: '2.2M / yr',
          shortDesc: 'Art Deco soapstone statue atop Mount Corcovado embracing Guanabara Bay from 710m high.',
          fullDesc: 'Standing 30 meters tall atop an 8-meter pedestal at the summit of Corcovado Mountain in Tijuca Forest National Park, Cristo Redentor overlooks Rio de Janeiro’s beaches, lagoons, and granite peaks.',
          image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Iguazu Falls (Foz do Iguaçu)',
          city: 'Paraná',
          lat: -25.6953,
          lng: -54.4367,
          category: 'UNESCO Natural Wonder',
          era: 'Paraná Plateau',
          visitors: '1.9M / yr',
          shortDesc: 'Colossal semicircular system of 275 cascading waterfalls culminating in the Devil’s Throat.',
          fullDesc: 'Surrounded by lush Atlantic rainforest on the border of Brazil and Argentina, Iguazu Falls spans nearly 2.7 kilometers, sending mist clouds and double rainbows high above the roaring Devil’s Throat chasm.',
          image: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Sugarloaf Mountain (Pão de Açúcar)',
          city: 'Rio de Janeiro',
          lat: -22.9492,
          lng: -43.1545,
          category: 'Granite Monolith',
          era: 'Cableway Opened 1912',
          visitors: '1.6M / yr',
          shortDesc: 'Sheer 396-meter quartz-granite peak rising directly from the mouth of Guanabara Bay.',
          fullDesc: 'Reached by a two-stage glass cable car ascending Morro da Urca and Pão de Açúcar, Sugarloaf Mountain offers unforgettable sunset vistas over Copacabana Beach and Christ the Redeemer.',
          image: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Meeting of Waters & Amazon Theatre',
          city: 'Manaus, Amazonas',
          lat: -3.1303,
          lng: -60.0234,
          category: 'Amazonian Gateway',
          era: 'Theatre Built 1896',
          visitors: '780K / yr',
          shortDesc: 'Heart of the Amazon Rainforest where the dark Rio Negro and sandy Solimões flow side by side.',
          fullDesc: 'Manaus combines the Belle Époque splendor of the pink-domed Teatro Amazonas with the natural spectacle of the Meeting of Waters, where two giant rivers run parallel for kilometers without mixing.',
          image: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Pelourinho Historic Center',
          city: 'Salvador, Bahia',
          lat: -12.9714,
          lng: -38.5108,
          category: 'UNESCO Colonial District',
          era: 'Founded 1549',
          visitors: '1.5M / yr',
          shortDesc: 'Pastel baroque churches and cobblestone squares pulsing with Afro-Brazilian music and culture.',
          fullDesc: 'As Brazil’s first colonial capital, Salvador’s upper city (Pelourinho) is renowned for its brightly painted 17th-century architecture, gold-leaf interior of São Francisco Church, and vibrant capoeira circles.',
          image: 'https://images.unsplash.com/photo-1554168848-228452c09d60?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Australia': {
      name: 'Australia',
      iso3: 'AUS',
      iso2: 'au',
      flag: '🇦🇺',
      capital: 'Canberra',
      region: 'Oceania',
      population: '26.6M',
      currency: 'AUD (A$)',
      lat: -25.2744,
      lng: 133.7751,
      description: 'An island continent of vast crimson outback monoliths, the world’s largest living coral reef system, dramatic coastal limestone stacks, and iconic harbor architecture.',
      landmarks: [
        {
          name: 'Sydney Opera House',
          city: 'Sydney, NSW',
          lat: -33.8568,
          lng: 151.2153,
          category: 'UNESCO Architectural Icon',
          era: 'Opened 1973',
          visitors: '10.9M / yr',
          shortDesc: 'Jørn Utzon’s expressionist masterpiece of interlocking white ceramic-tiled shell vaults.',
          fullDesc: 'Poised on Bennelong Point jutting into Sydney Harbour, the Sydney Opera House features over one million Swedish ceramic tiles across its billowing sail-like roofs and hosts over 1,800 performances annually.',
          image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Great Barrier Reef',
          city: 'Coral Sea, Queensland',
          lat: -18.2871,
          lng: 147.6992,
          category: 'UNESCO Marine Wonder',
          era: '2,300 km Living Reef',
          visitors: '2.4M / yr',
          shortDesc: 'Earth’s largest coral reef ecosystem spanning 2,900 individual reefs and 900 islands.',
          fullDesc: 'Visible from orbit off the coast of Queensland, the Great Barrier Reef teems with over 1,500 species of tropical fish, sea turtles, manta rays, and turquoise coral lagoons like Heart Reef and Whitehaven Beach.',
          image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Uluru (Ayers Rock)',
          city: 'Northern Territory',
          lat: -25.3444,
          lng: 131.0369,
          category: 'UNESCO Sacred Monolith',
          era: '550M Years Old',
          visitors: '300K / yr',
          shortDesc: 'Sacred sandstone monolith in the Red Centre that glows fiery crimson at dawn and dusk.',
          fullDesc: 'Rising 348 meters above the desert plains of Uluru-Kata Tjuta National Park, Uluru is deeply sacred to the Anangu traditional owners and famous for its dramatic color transformations under the outback sun.',
          image: 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'The Twelve Apostles',
          city: 'Great Ocean Road, Victoria',
          lat: -38.6621,
          lng: 143.1051,
          category: 'Coastal Limestone Stacks',
          era: '10–20M Years Sculpted',
          visitors: '2.1M / yr',
          shortDesc: 'Towering limestone sea stacks standing against the roaring surf of the Southern Ocean.',
          fullDesc: 'Sculpted by relentless Southern Ocean waves eroding soft coastal cliffs along Victoria’s Great Ocean Road, the Twelve Apostles rise up to 50 meters above golden beaches and foaming surf.',
          image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Sydney Harbour Bridge',
          city: 'Sydney, NSW',
          lat: -33.8523,
          lng: 151.2108,
          category: 'Steel Arch Bridge',
          era: 'Opened 1932',
          visitors: '4.0M / yr',
          shortDesc: 'Affectionately dubbed the "Coathanger," the monumental steel arch spanning Port Jackson.',
          fullDesc: 'Rising 134 meters above Sydney Harbour directly opposite the Opera House, the Sydney Harbour Bridge offers panoramic summit walks along its massive steel arch.',
          image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'United Kingdom': {
      name: 'United Kingdom',
      iso3: 'GBR',
      iso2: 'gb',
      flag: '🇬🇧',
      capital: 'London',
      region: 'Northern / Western Europe',
      population: '67.7M',
      currency: 'GBP (£)',
      lat: 54.0,
      lng: -2.0,
      description: 'An island realm of royal castles, prehistoric stone circles, Gothic cathedrals, Highland glens, and London’s storied Thames waterfront.',
      landmarks: [
        {
          name: 'Big Ben & Palace of Westminster',
          city: 'London',
          lat: 51.5007,
          lng: -0.1246,
          category: 'UNESCO Gothic Revival',
          era: 'Completed 1859',
          visitors: '5.5M / yr',
          shortDesc: 'Iconic golden-dialed Elizabeth Tower and Houses of Parliament along the River Thames.',
          fullDesc: 'Standing 96 meters tall at the north end of the Palace of Westminster, the Elizabeth Tower houses the 13.7-ton Great Bell ("Big Ben") and represents an unmistakable symbol of British parliamentary heritage.',
          image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Tower of London & Tower Bridge',
          city: 'London',
          lat: 51.5081,
          lng: -0.0759,
          category: 'UNESCO Royal Fortress',
          era: 'Founded 1066',
          visitors: '3.0M / yr',
          shortDesc: 'William the Conqueror’s Norman castle guarding the Crown Jewels beside Victorian Tower Bridge.',
          fullDesc: 'Founded in 1066 around the White Tower, Her Majesty’s Royal Palace and Fortress of the Tower of London has served as royal residence, armory, and treasury for the dazzling Crown Jewels.',
          image: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Stonehenge',
          city: 'Wiltshire, England',
          lat: 51.1789,
          lng: -1.8262,
          category: 'UNESCO Prehistoric Monument',
          era: 'c. 3000–2000 BC',
          visitors: '1.3M / yr',
          shortDesc: 'Enigmatic Neolithic ring of giant sarsen stones and Welsh bluestones aligned with the solstices.',
          fullDesc: 'Rising on Salisbury Plain, Stonehenge was erected in stages over a thousand years using 25-ton sarsen blocks and bluestones transported over 240 kilometers from Wales in alignment with the midsummer sunrise.',
          image: 'https://images.unsplash.com/photo-1599833975787-5c143f373c30?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Edinburgh Castle',
          city: 'Edinburgh, Scotland',
          lat: 55.9486,
          lng: -3.1999,
          category: 'Historic Royal Fortress',
          era: '12th Century',
          visitors: '2.2M / yr',
          shortDesc: 'Commanding Scottish fortress perched atop the extinct volcanic plug of Castle Rock.',
          fullDesc: 'Dominating the skyline of Scotland’s capital at the head of the Royal Mile, Edinburgh Castle houses the Honours of Scotland (the oldest Crown Jewels in Britain) and the historic Stone of Destiny.',
          image: 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Lake District (Windermere)',
          city: 'Cumbria, England',
          lat: 54.4609,
          lng: -3.0886,
          category: 'UNESCO National Park',
          era: 'Glacial Ribbon Lakes',
          visitors: '18.0M / yr',
          shortDesc: 'Glacial lakes and rugged fells that inspired Romantic poets William Wordsworth and Beatrix Potter.',
          fullDesc: 'Home to England’s highest peak (Scafell Pike) and deepest glacial lakes, the Lake District National Park offers dramatic mountain ridges, stone villages, and mirror-still waters.',
          image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Spain': {
      name: 'Spain',
      iso3: 'ESP',
      iso2: 'es',
      flag: '🇪🇸',
      capital: 'Madrid',
      region: 'Southern Europe',
      population: '48.3M',
      currency: 'EUR (€)',
      lat: 40.4637,
      lng: -3.7492,
      description: 'A sun-drenched Iberian nation famed for Gaudí’s surrealist architecture, Moorish palaces in Andalusia, flamenco traditions, and lively plazas.',
      landmarks: [
        {
          name: 'Basílica de la Sagrada Família',
          city: 'Barcelona',
          lat: 41.4036,
          lng: 2.1744,
          category: 'UNESCO Modernisme Basilica',
          era: 'Begun 1882',
          visitors: '4.7M / yr',
          shortDesc: 'Antoni Gaudí’s soaring Catalan Modernisme masterpiece of organic stone spires and stained glass.',
          fullDesc: 'Blending Gothic structural principles with organic nature-inspired geometry, Gaudí’s Sagrada Família features tree-like interior columns bathed in kaleidoscopic stained-glass light.',
          image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'The Alhambra',
          city: 'Granada, Andalusia',
          lat: 37.1760,
          lng: -3.5881,
          category: 'UNESCO Moorish Palace',
          era: '13th–14th Century',
          visitors: '2.7M / yr',
          shortDesc: 'Nasrid palace and fortress complex framed by the snow-capped Sierra Nevada mountains.',
          fullDesc: 'Perched atop Sabika hill in Granada, the Alhambra enchants visitors with its Court of the Lions, honeycomb muqarnas vaults, tranquil reflecting pools, and the fragrant Generalife gardens.',
          image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Park Güell',
          city: 'Barcelona',
          lat: 41.4145,
          lng: 2.1527,
          category: 'UNESCO Architectural Park',
          era: 'Built 1900–1914',
          visitors: '3.1M / yr',
          shortDesc: 'Hillside garden complex decorated with Gaudí’s colorful trencadís ceramic mosaics.',
          fullDesc: 'Overlooking Barcelona and the Mediterranean from Carmel Hill, Park Güell showcases serpentine mosaic benches, gingerbread gatehouses, and the famous mosaic salamander ("El Drac").',
          image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Plaza de España',
          city: 'Seville, Andalusia',
          lat: 37.3772,
          lng: -5.9869,
          category: 'Monumental Plaza',
          era: 'Built 1928',
          visitors: '3.5M / yr',
          shortDesc: 'Sweeping semicircular brick-and-ceramic pavilion moat complex in Maria Luisa Park.',
          fullDesc: 'Designed by Aníbal González for the 1929 Ibero-American Exposition, Seville’s Plaza de España features Venetian-style bridges over a curving canal and 48 hand-painted ceramic alcoves representing Spain’s provinces.',
          image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Prado Museum & Royal Madrid',
          city: 'Madrid',
          lat: 40.4138,
          lng: -3.6921,
          category: 'UNESCO Landscape of Light',
          era: 'Opened 1819',
          visitors: '3.2M / yr',
          shortDesc: 'Spain’s premier art museum housing masterpieces by Velázquez, Goya, and El Greco.',
          fullDesc: 'Anchoring Madrid’s UNESCO-listed Paseo del Prado, the Museo Nacional del Prado holds one of the world’s finest collections of European painting, including Velázquez’s Las Meninas.',
          image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Greece': {
      name: 'Greece',
      iso3: 'GRC',
      iso2: 'gr',
      flag: '🇬🇷',
      capital: 'Athens',
      region: 'Southern Europe',
      population: '10.4M',
      currency: 'EUR (€)',
      lat: 39.0742,
      lng: 21.8243,
      description: 'Birthplace of democracy, philosophy, and the Olympic Games, where classical marble temples overlook sun-bleached Aegean islands.',
      landmarks: [
        {
          name: 'Acropolis of Athens & Parthenon',
          city: 'Athens',
          lat: 37.9715,
          lng: 23.7257,
          category: 'UNESCO Classical Citadel',
          era: '447–432 BC',
          visitors: '3.8M / yr',
          shortDesc: 'Ancient limestone citadel crowned by the marble Parthenon temple dedicated to Athena.',
          fullDesc: 'Rising 150 meters above Athens, the Acropolis embodies the Golden Age of Pericles with the Doric perfection of the Parthenon, the Erechtheion’s Caryatid porch, and the Odeon of Herodes Atticus.',
          image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Santorini Caldera (Oia)',
          city: 'Cyclades Islands',
          lat: 36.4618,
          lng: 25.3753,
          category: 'Volcanic Island Caldera',
          era: 'Minoan Caldera Rim',
          visitors: '2.0M / yr',
          shortDesc: 'Whitewashed Cycladic houses and blue-domed churches perched on cliffs above a submerged volcano.',
          fullDesc: 'Carved into the sheer volcanic cliffs of northern Santorini, the village of Oia offers world-renowned Aegean sunsets over a deep-blue flooded volcanic caldera.',
          image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Meteora Monasteries',
          city: 'Kalambaka, Thessaly',
          lat: 39.7217,
          lng: 21.6306,
          category: 'UNESCO Cliff Monasteries',
          era: '14th Century',
          visitors: '1.1M / yr',
          shortDesc: 'Byzantine monasteries balanced atop towering conglomerate rock pillars in central Greece.',
          fullDesc: 'Meaning "suspended in the air," Meteora features six active Eastern Orthodox monasteries perched atop sheer sandstone monoliths rising 400 meters above the Thessalian plain.',
          image: 'https://images.unsplash.com/photo-1503152394-c571994fd383?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Temple of Poseidon at Cape Sounion',
          city: 'Attica',
          lat: 37.6502,
          lng: 24.0245,
          category: 'Classical Sea Temple',
          era: '444–440 BC',
          visitors: '600K / yr',
          shortDesc: 'White Doric marble columns commanding a rocky promontory high above the Aegean Sea.',
          fullDesc: 'Perched 60 meters above the crashing waves at the southernmost tip of the Attica peninsula, the Temple of Poseidon guided ancient Athenians returning home by sea.',
          image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Palace of Knossos',
          city: 'Heraklion, Crete',
          lat: 35.2980,
          lng: 25.1630,
          category: 'Minoan Bronze Age Palace',
          era: 'c. 1900 BC',
          visitors: '950K / yr',
          shortDesc: 'Europe’s oldest city and ceremonial center of the Bronze Age Minoan civilization.',
          fullDesc: 'Steeped in the myth of King Minos and the Labyrinth, Knossos features vibrant frescoes of leaping dolphins, tapered red columns, and multi-story royal quarters.',
          image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Peru': {
      name: 'Peru',
      iso3: 'PER',
      iso2: 'pe',
      flag: '🇵🇪',
      capital: 'Lima',
      region: 'South America',
      population: '34.4M',
      currency: 'PEN (S/)',
      lat: -9.1900,
      lng: -75.0152,
      description: 'Heartland of the Inca Empire, spanning from desert coastal geoglyphs to high Andean cloud-forest citadels and Amazonian headwaters.',
      landmarks: [
        {
          name: 'Machu Picchu',
          city: 'Cusco Region',
          lat: -13.1631,
          lng: -72.5450,
          category: 'UNESCO World Wonder',
          era: 'c. 1450 AD',
          visitors: '1.5M / yr',
          shortDesc: '15th-century Inca dry-stone citadel nestled on a mist-shrouded saddle high in the Andes.',
          fullDesc: 'Built by Inca Emperor Pachacuti at 2,430 meters elevation above the Urubamba River canyon, Machu Picchu showcases mortar-free ashlar masonry, astronomical temples, and agricultural terraces framed by Huayna Picchu.',
          image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Sacred Valley of the Incas (Ollantaytambo)',
          city: 'Urubamba, Cusco',
          lat: -13.2584,
          lng: -72.2633,
          category: 'Inca Heartland',
          era: '15th Century',
          visitors: '1.1M / yr',
          shortDesc: 'Fertile Andean river valley lined with monumental Inca fortresses and salt pans of Maras.',
          fullDesc: 'Stretching between Pisac and Ollantaytambo, the Sacred Valley preserves terraced stone citadels, the concentric agricultural laboratory of Moray, and thousands of pre-Inca evaporation salt pools at Maras.',
          image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Rainbow Mountain (Vinicunca)',
          city: 'Cusco Andes',
          lat: -13.8694,
          lng: -71.3030,
          category: 'Geological Wonder',
          era: '5,200m Elevation',
          visitors: '450K / yr',
          shortDesc: 'High-altitude Andean ridge striped with natural bands of turquoise, gold, lavender, and crimson.',
          fullDesc: 'Formed by weathering mineral-rich sedimentary layers near the Ausangate glacier at 5,200 meters above sea level, Vinicunca displays surreal rainbow striations across the high Peruvian puna.',
          image: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Nazca Lines',
          city: 'Ica Region',
          lat: -14.7390,
          lng: -75.1300,
          category: 'UNESCO Ancient Geoglyphs',
          era: '500 BC – 500 AD',
          visitors: '220K / yr',
          shortDesc: 'Hundreds of giant desert geoglyphs depicting hummingbirds, monkeys, and geometric spirals.',
          fullDesc: 'Etched into the arid iron-oxide pebbles of the Nazca plateau over two millennia ago, these colossal figures span up to 370 meters and remain preserved by the windless desert microclimate.',
          image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Historic Center of Cusco & Sacsayhuamán',
          city: 'Cusco',
          lat: -13.5160,
          lng: -71.9788,
          category: 'UNESCO Imperial Capital',
          era: '13th–16th Century',
          visitors: '1.7M / yr',
          shortDesc: 'Historic capital of the Inca Empire crowned by zigzagging megalithic fortress walls.',
          fullDesc: 'Sitting at 3,399 meters in the Andes, Cusco blends precision-fitted Inca stone walls and the Temple of the Sun (Qorikancha) with Spanish baroque cathedrals and the cyclopean ramparts of Sacsayhuamán.',
          image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Mexico': {
      name: 'Mexico',
      iso3: 'MEX',
      iso2: 'mx',
      flag: '🇲🇽',
      capital: 'Mexico City',
      region: 'North / Central America',
      population: '128.5M',
      currency: 'MXN ($)',
      lat: 23.6345,
      lng: -102.5528,
      description: 'Rich in Maya and Aztec pyramid complexes, turquoise cenotes, vibrant colonial cities, and UNESCO-recognized culinary and artistic traditions.',
      landmarks: [
        {
          name: 'Chichén Itzá (El Castillo)',
          city: 'Yucatán',
          lat: 20.6843,
          lng: -88.5678,
          category: 'UNESCO World Wonder',
          era: 'c. 600–1200 AD',
          visitors: '2.6M / yr',
          shortDesc: 'Sacred Maya city dominated by the step-pyramid of Kukulcán aligned with the equinox sun.',
          fullDesc: 'Featuring 365 steps—one for each day of the solar year—the Temple of Kukulcán casts a dramatic shadow of a descending feathered serpent every spring and autumn equinox.',
          image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Teotihuacán Pyramids of the Sun & Moon',
          city: 'State of Mexico',
          lat: 19.6925,
          lng: -98.8438,
          category: 'UNESCO Pre-Columbian City',
          era: '100 BC – 550 AD',
          visitors: '3.5M / yr',
          shortDesc: 'Monumental Avenue of the Dead flanked by two of Mesoamerica’s largest ancient pyramids.',
          fullDesc: 'Northeast of Mexico City, Teotihuacán was once the largest metropolis in the pre-Columbian Americas. Its Pyramid of the Sun rises 65 meters above painted temple courtyards.',
          image: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Tulum Cliffside Mayan Ruins',
          city: 'Quintana Roo',
          lat: 20.2149,
          lng: -87.4289,
          category: 'Coastal Maya Fortress',
          era: '13th–15th Century',
          visitors: '2.1M / yr',
          shortDesc: 'Walled Maya trading port perched on 12-meter limestone cliffs above the turquoise Caribbean.',
          fullDesc: 'Overlooking the Mesoamerican Barrier Reef in the Riviera Maya, Tulum’s El Castillo served as an ancient lighthouse guiding Maya trading canoes through coral reef channels.',
          image: 'https://images.unsplash.com/photo-1504730655501-24c39ac53f0e?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Museo Frida Kahlo (La Casa Azul)',
          city: 'Coyoacán, Mexico City',
          lat: 19.3551,
          lng: -99.1626,
          category: 'Cultural & Art Museum',
          era: 'Opened 1958',
          visitors: '800K / yr',
          shortDesc: 'Cobalt-blue courtyard home and studio where artist Frida Kahlo lived and painted.',
          fullDesc: 'Located in the leafy Coyoacán neighborhood of Mexico City, Casa Azul preserves Frida Kahlo’s easel, personal folk-art collection, traditional Tehuana dresses, and lush volcanic-stone gardens.',
          image: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Palacio de Bellas Artes & Zócalo',
          city: 'Mexico City',
          lat: 19.4352,
          lng: -99.1412,
          category: 'Architectural & Cultural Center',
          era: 'Completed 1934',
          visitors: '2.8M / yr',
          shortDesc: 'Carrara marble cultural palace crowned with a golden-orange dome and murals by Diego Rivera.',
          fullDesc: 'Blending Art Nouveau exteriors with Art Deco interiors, the Palacio de Bellas Artes houses monumental murals by Rivera, Siqueiros, and Orozco alongside a Tiffany stained-glass stage curtain.',
          image: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Canada': {
      name: 'Canada',
      iso3: 'CAN',
      iso2: 'ca',
      flag: '🇨🇦',
      capital: 'Ottawa',
      region: 'North America',
      population: '40.1M',
      currency: 'CAD (C$)',
      lat: 56.1304,
      lng: -106.3468,
      description: 'Spanning from Atlantic fjords to Pacific rainforests, celebrated for turquoise glacier-fed lakes in the Canadian Rockies and French colonial heritage.',
      landmarks: [
        {
          name: 'Banff National Park & Lake Louise',
          city: 'Alberta',
          lat: 51.4254,
          lng: -116.1773,
          category: 'UNESCO Rocky Mountain Park',
          era: 'Established 1885',
          visitors: '4.1M / yr',
          shortDesc: 'Glacier-fed turquoise alpine lakes framed by snow-draped peaks of the Canadian Rockies.',
          fullDesc: 'Canada’s oldest national park is world-famous for the vivid emerald and turquoise waters of Lake Louise and Moraine Lake, colored by glacial rock flour suspended in alpine meltwater.',
          image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Niagara Falls (Horseshoe Falls)',
          city: 'Ontario',
          lat: 43.0799,
          lng: -79.0747,
          category: 'Natural Waterfall Wonder',
          era: 'Formed 12,000 Years Ago',
          visitors: '13.0M / yr',
          shortDesc: 'Thundering semicircular cataract dropping 57 meters with the highest flow rate in North America.',
          fullDesc: 'Connecting Lake Erie and Lake Ontario, the Canadian Horseshoe Falls pours over 168,000 cubic meters of water per minute over its curved brink into a mist-shrouded gorge.',
          image: 'https://images.unsplash.com/photo-1533094602577-198d3beab8ea?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'CN Tower',
          city: 'Toronto, Ontario',
          lat: 43.6426,
          lng: -79.3871,
          category: 'Engineering Landmark',
          era: 'Completed 1976',
          visitors: '2.0M / yr',
          shortDesc: '553-meter communications and observation tower dominating the Lake Ontario skyline.',
          fullDesc: 'Soaring 553.3 meters above downtown Toronto, the CN Tower features glass-floor observation decks, a revolving 360 restaurant, and the outdoor EdgeWalk hands-free ledge experience.',
          image: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Old Quebec & Château Frontenac',
          city: 'Quebec City, QC',
          lat: 46.8122,
          lng: -71.2045,
          category: 'UNESCO Walled City',
          era: 'Founded 1608',
          visitors: '4.5M / yr',
          shortDesc: 'The only fortified city north of Mexico, crowned by the grand copper-roofed Château Frontenac.',
          fullDesc: 'Perched atop Cap Diamant overlooking the St. Lawrence River, Old Quebec preserves 400 years of French colonial ramparts, cobblestone Petit-Champlain lanes, and grand chateau architecture.',
          image: 'https://images.unsplash.com/photo-1558507652-2d9626c4e67a?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Stanley Park & Seawall',
          city: 'Vancouver, BC',
          lat: 49.3043,
          lng: -123.1443,
          category: 'Coastal Rainforest Park',
          era: 'Opened 1888',
          visitors: '8.0M / yr',
          shortDesc: '405-hectare coastal cedar rainforest peninsula encircled by a scenic oceanfront seawall.',
          fullDesc: 'Jutting into Burrard Inlet on the edge of downtown Vancouver, Stanley Park combines ancient western red cedars, Indigenous totem poles at Brockton Point, and mountain views across English Bay.',
          image: 'https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Germany': {
      name: 'Germany',
      iso3: 'DEU',
      iso2: 'de',
      flag: '🇩🇪',
      capital: 'Berlin',
      region: 'Central Europe',
      population: '84.5M',
      currency: 'EUR (€)',
      lat: 51.1657,
      lng: 10.4515,
      description: 'Land of Bavarian fairy-tale castles, soaring Gothic cathedrals along the Rhine, dense Black Forest valleys, and Berlin’s historic landmarks.',
      landmarks: [
        {
          name: 'Neuschwanstein Castle',
          city: 'Schwangau, Bavaria',
          lat: 47.5576,
          lng: 10.7498,
          category: 'UNESCO Romantic Castle',
          era: 'Begun 1869',
          visitors: '1.4M / yr',
          shortDesc: 'King Ludwig II’s fairy-tale Romanesque Revival palace perched high in the Bavarian Alps.',
          fullDesc: 'Commissioned by Bavarian King Ludwig II as a poetic homage to composer Richard Wagner, Neuschwanstein’s limestone turrets rise above dramatic alpine gorges and crystal lakes.',
          image: 'https://images.unsplash.com/photo-1534313314376-a72289b6181e?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Brandenburg Gate',
          city: 'Berlin',
          lat: 52.5163,
          lng: 13.3777,
          category: 'Neoclassical Monument',
          era: 'Built 1788–1791',
          visitors: '12.0M / yr',
          shortDesc: '18th-century sandstone triumphal arch crowned by the bronze Quadriga chariot of peace.',
          fullDesc: 'Designed by Carl Gotthard Langhans at the western end of Unter den Linden, the Brandenburg Gate stood at the divide of Cold War Berlin before becoming the cherished symbol of German reunification.',
          image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Cologne Cathedral (Kölner Dom)',
          city: 'Cologne',
          lat: 50.9413,
          lng: 6.9583,
          category: 'UNESCO High Gothic Cathedral',
          era: '1248–1880',
          visitors: '6.0M / yr',
          shortDesc: 'Twin-spired Gothic masterpiece soaring 157 meters beside the Rhine River.',
          fullDesc: 'Constructed over six centuries to house the gilded Shrine of the Three Kings, Cologne Cathedral boasts the largest facade of any church in the world and breathtaking medieval stained glass.',
          image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Elbphilharmonie & Speicherstadt',
          city: 'Hamburg',
          lat: 53.5413,
          lng: 9.9841,
          category: 'Modern Concert Hall & UNESCO Port',
          era: 'Opened 2017',
          visitors: '3.2M / yr',
          shortDesc: 'Shimmering wave-crested glass concert hall crowning a historic red-brick warehouse on the Elbe.',
          fullDesc: 'Designed by Herzog & de Meuron alongside Hamburg’s UNESCO-listed Speicherstadt canal district, the Elbphilharmonie pairs maritime red brick with an acoustically revolutionary concert hall.',
          image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Heidelberg Castle & Old Bridge',
          city: 'Heidelberg',
          lat: 49.4106,
          lng: 8.7153,
          category: 'Renaissance Palace Ruins',
          era: '13th–17th Century',
          visitors: '1.2M / yr',
          shortDesc: 'Red sandstone Renaissance palace overlooking the Neckar River and Germany’s oldest university town.',
          fullDesc: 'Nestled 80 meters up the Königstuhl hillside, Heidelberg Castle embodies German Romanticism with its ornate Friedrichsbau facade and panoramic views over the Old Bridge.',
          image: 'https://images.unsplash.com/photo-1534313314376-a72289b6181e?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Thailand': {
      name: 'Thailand',
      iso3: 'THA',
      iso2: 'th',
      flag: '🇹🇭',
      capital: 'Bangkok',
      region: 'Southeast Asia',
      population: '71.8M',
      currency: 'THB (฿)',
      lat: 15.8700,
      lng: 100.9925,
      description: 'The "Land of Smiles," celebrated for gilded Buddhist temples along the Chao Phraya River, ancient royal ruins, and emerald Andaman limestone islands.',
      landmarks: [
        {
          name: 'The Grand Palace & Wat Phra Kaew',
          city: 'Bangkok',
          lat: 13.7500,
          lng: 100.4913,
          category: 'Royal Palace & Sacred Temple',
          era: 'Founded 1782',
          visitors: '8.0M / yr',
          shortDesc: 'Dazzling complex of gilded spires and mosaic halls housing the revered Emerald Buddha.',
          fullDesc: 'Established in 1782 by King Rama I along the Chao Phraya River, the Grand Palace served as the ceremonial seat of the Siamese monarchy and encloses Wat Phra Kaew, Thailand’s most sacred temple.',
          image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Wat Arun (Temple of Dawn)',
          city: 'Bangkok',
          lat: 13.7437,
          lng: 100.4888,
          category: 'Riverside Buddhist Temple',
          era: '17th–19th Century',
          visitors: '3.5M / yr',
          shortDesc: '79-meter riverside spire encrusted with colorful Chinese porcelain and seashells.',
          fullDesc: 'Standing on the west bank of the Chao Phraya River, Wat Arun’s central Khmer-style prang symbolizes Mount Meru and glitters in both early morning sunlight and golden evening floodlights.',
          image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Phi Phi Islands & Maya Bay',
          city: 'Krabi Province',
          lat: 7.7407,
          lng: 98.7784,
          category: 'Marine National Park',
          era: 'Andaman Sea Karst',
          visitors: '1.8M / yr',
          shortDesc: 'Sheer limestone cliffs sheltering crystal-clear turquoise lagoons in the Andaman Sea.',
          fullDesc: 'Part of Hat Noppharat Thara–Mu Ko Phi Phi National Park, these six islands feature dramatic vertical karst cliffs, vibrant coral gardens, and the sheltered crescent of Maya Bay.',
          image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Historic City of Ayutthaya',
          city: 'Phra Nakhon Si Ayutthaya',
          lat: 14.3569,
          lng: 100.5586,
          category: 'UNESCO Ancient Capital',
          era: 'Founded 1350',
          visitors: '2.4M / yr',
          shortDesc: 'Island capital of the Siamese Kingdom famous for brick reliquary towers and Wat Mahathat.',
          fullDesc: 'Once one of the world’s largest cosmopolitan trading cities, Ayutthaya’s archaeological park preserves towering red-brick chedis, giant reclining Buddhas, and the stone Buddha head entwined in banyan tree roots.',
          image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Wat Phra That Doi Suthep',
          city: 'Chiang Mai',
          lat: 18.8048,
          lng: 98.9215,
          category: 'Mountain Lanna Temple',
          era: 'Founded 1383',
          visitors: '2.1M / yr',
          shortDesc: 'Sacred golden Lanna chedi reached by a 306-step naga-flanked staircase overlooking Chiang Mai.',
          fullDesc: 'Perched 1,073 meters up Doi Suthep mountain in northern Thailand, this revered temple dazzles with its gold-plated central stupa and panoramic views across the Chiang Mai valley.',
          image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'South Korea': {
      name: 'South Korea',
      iso3: 'KOR',
      iso2: 'kr',
      flag: '🇰🇷',
      capital: 'Seoul',
      region: 'East Asia',
      population: '51.7M',
      currency: 'KRW (₩)',
      lat: 35.9078,
      lng: 127.7669,
      description: 'Harmonizing Joseon Dynasty royal palaces and tranquil hanok villages with cutting-edge architecture and volcanic island landscapes.',
      landmarks: [
        {
          name: 'Gyeongbokgung Palace',
          city: 'Seoul',
          lat: 37.5796,
          lng: 126.9770,
          category: 'Joseon Royal Palace',
          era: 'Built 1395',
          visitors: '5.5M / yr',
          shortDesc: 'Grandest of the Five Grand Palaces of the Joseon Dynasty, framed by Bugaksan Mountain.',
          fullDesc: 'Built in 1395 by King Taejo, Gyeongbokgung features the majestic Geunjeongjeon Throne Hall, the lotus-pond pavilion of Gyeonghoeru, and vivid royal guard-changing ceremonies at Gwanghwamun Gate.',
          image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'N Seoul Tower (Namsan Tower)',
          city: 'Seoul',
          lat: 37.5512,
          lng: 126.9882,
          category: 'Skyline Observation Tower',
          era: 'Opened 1980',
          visitors: '8.4M / yr',
          shortDesc: 'Iconic hilltop tower atop Namsan Mountain offering 360-degree views across Seoul and the Han River.',
          fullDesc: 'Rising 480 meters above sea level in central Seoul, N Seoul Tower is reached via scenic cable car or cherry-blossom park trails and glows nightly with LED light art.',
          image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Bukchon Hanok Village',
          city: 'Seoul',
          lat: 37.5826,
          lng: 126.9830,
          category: 'Traditional Heritage District',
          era: '600-Year Joseon Neighborhood',
          visitors: '2.9M / yr',
          shortDesc: 'Preserved hillside neighborhood of curved-tile Korean hanok residences between two royal palaces.',
          fullDesc: 'Situated between Gyeongbokgung and Changdeokgung Palaces, Bukchon’s sloping alleyways showcase ratusan authentic timber-and-tile hanok homes alongside modern Seoul skyline views.',
          image: 'https://images.unsplash.com/photo-1546874177-9e664107314e?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Seongsan Ilchulbong (Sunrise Peak)',
          city: 'Jeju Island',
          lat: 33.4581,
          lng: 126.9426,
          category: 'UNESCO Volcanic Tuff Cone',
          era: '5,000 Years Old',
          visitors: '2.1M / yr',
          shortDesc: 'Dramatic crown-shaped hydrovolcanic crater rising directly from the eastern shores of Jeju Island.',
          fullDesc: 'Formed by hydrovolcanic eruptions on a shallow seabed 5,000 years ago, Sunrise Peak features a 600-meter-wide lush green crater bowl surrounded by jagged rock pinnacles and Haenyeo diving waters.',
          image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Bulguksa Temple & Seokguram Grotto',
          city: 'Gyeongju',
          lat: 35.7900,
          lng: 129.3321,
          category: 'UNESCO Silla Masterpiece',
          era: 'Rebuilt 751 AD',
          visitors: '1.6M / yr',
          shortDesc: 'Golden Age Silla Kingdom Buddhist temple renowned for its twin stone pagodas and lotus bridges.',
          fullDesc: 'Nestled on the slopes of Mount Toham in Korea’s ancient capital of Gyeongju, Bulguksa and the nearby granite Seokguram Grotto represent the zenith of 8th-century Korean Buddhist art.',
          image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'United Arab Emirates': {
      name: 'United Arab Emirates',
      iso3: 'ARE',
      iso2: 'ae',
      flag: '🇦🇪',
      capital: 'Abu Dhabi',
      region: 'Middle East',
      population: '9.5M',
      currency: 'AED (د.إ)',
      lat: 23.4241,
      lng: 53.8478,
      description: 'Where Arabian desert dunes and pearl-diving heritage meet record-breaking supertall skyscrapers, architectural domes, and artificial archipelagos.',
      landmarks: [
        {
          name: 'Burj Khalifa',
          city: 'Dubai',
          lat: 25.1972,
          lng: 55.2744,
          category: 'World’s Tallest Structure',
          era: 'Opened 2010',
          visitors: '6.2M / yr',
          shortDesc: 'Soaring 828 meters and 163 stories into the clouds above the Dubai Fountain.',
          fullDesc: 'Inspired by the geometry of the desert Hymenocallis flower, Burj Khalifa holds the world record as the tallest building on Earth, with observation decks on the 124th, 125th, and 148th floors.',
          image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Sheikh Zayed Grand Mosque',
          city: 'Abu Dhabi',
          lat: 24.4128,
          lng: 54.4750,
          category: 'Architectural Masterpiece',
          era: 'Completed 2007',
          visitors: '5.8M / yr',
          shortDesc: 'Pure white Sivec marble mosque crowned by 82 domes and over 1,000 amethyst-and-jasper columns.',
          fullDesc: 'Capable of welcoming over 40,000 worshippers, the Sheikh Zayed Grand Mosque features reflecting pools, Swarovski crystal chandeliers, and the world’s largest hand-knotted carpet.',
          image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Louvre Abu Dhabi',
          city: 'Saadiyat Island, Abu Dhabi',
          lat: 24.5337,
          lng: 54.3981,
          category: 'Universal Art Museum',
          era: 'Opened 2017',
          visitors: '1.4M / yr',
          shortDesc: 'Jean Nouvel’s floating museum crowned by a 180-meter geometric lattice dome casting a "rain of light."',
          fullDesc: 'Surrounded by the turquoise waters of Saadiyat Island, Louvre Abu Dhabi’s eight-layered star-patterned steel dome filters desert sunlight like interwoven palm fronds over waterfront art galleries.',
          image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Palm Jumeirah',
          city: 'Dubai',
          lat: 25.1124,
          lng: 55.1390,
          category: 'Coastal Engineering Icon',
          era: 'Completed 2006',
          visitors: '5.1M / yr',
          shortDesc: 'Palm-tree-shaped archipelago extending into the Arabian Gulf crowned by Atlantis resorts.',
          fullDesc: 'Sculpted with 16 symmetric fronds and an 11-kilometer protective crescent breakwater, Palm Jumeirah is an engineering landmark visible from low Earth orbit.',
          image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Museum of the Future',
          city: 'Dubai',
          lat: 25.2192,
          lng: 55.2819,
          category: 'Futuristic Torus Landmark',
          era: 'Opened 2022',
          visitors: '1.7M / yr',
          shortDesc: 'Column-free stainless-steel torus engraved with flowing Arabic calligraphy windows.',
          fullDesc: 'Designed by Killa Design, the 77-meter torus along Sheikh Zayed Road features 1,024 robotic-manufactured panels inscribed with poetic quotes that double as interior daylight skylights.',
          image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'South Africa': {
      name: 'South Africa',
      iso3: 'ZAF',
      iso2: 'za',
      flag: '🇿🇦',
      capital: 'Pretoria / Cape Town',
      region: 'Southern Africa',
      population: '60.4M',
      currency: 'ZAR (R)',
      lat: -30.5595,
      lng: 22.9375,
      description: 'The "Rainbow Nation" at the southern tip of Africa, uniting flat-topped coastal mountains, Big Five savanna reserves, and dramatic ocean capes.',
      landmarks: [
        {
          name: 'Table Mountain',
          city: 'Cape Town',
          lat: -33.9628,
          lng: 18.4098,
          category: 'New7Wonders of Nature',
          era: '500M-Year Sandstone Plateau',
          visitors: '1.1M / yr',
          shortDesc: 'Flat-topped 1,085-meter sandstone massif overlooking Cape Town and Table Bay.',
          fullDesc: 'Accessible via revolving aerial cableway or scenic hiking trails through the Cape Floral Kingdom, Table Mountain is frequently draped in its famous "tablecloth" of white orographic cloud.',
          image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Kruger National Park',
          city: 'Limpopo & Mpumalanga',
          lat: -23.9884,
          lng: 31.5547,
          category: 'Premier Wildlife Reserve',
          era: 'Established 1898',
          visitors: '1.8M / yr',
          shortDesc: 'Vast 19,485 sq km savanna sanctuary home to Africa’s Big Five: lion, leopard, elephant, rhino, and buffalo.',
          fullDesc: 'Spanning nearly two million hectares of bushveld and riverine forest, Kruger National Park is one of Africa’s oldest and most biodiverse conservation sanctuaries.',
          image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Cape of Good Hope & Cape Point',
          city: 'Cape Peninsula',
          lat: -34.3568,
          lng: 18.4740,
          category: 'Coastal Promontory',
          era: 'Navigated 1488',
          visitors: '1.0M / yr',
          shortDesc: 'Dramatic sea cliffs and historic lighthouse at the southwestern tip of the African continent.',
          fullDesc: 'Part of Table Mountain National Park, Cape Point features sheer cliffs plunging 200 meters into the Atlantic surf alongside nearby Boulders Beach’s colony of African penguins.',
          image: 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Robben Island',
          city: 'Table Bay, Cape Town',
          lat: -33.8076,
          lng: 18.3712,
          category: 'UNESCO World Heritage Site',
          era: 'Museum Opened 1997',
          visitors: '350K / yr',
          shortDesc: 'Historic island in Table Bay where Nelson Mandela was imprisoned for 18 years before leading South Africa to democracy.',
          fullDesc: 'Now a living museum and UNESCO site, Robben Island stands as a poignant tribute to the triumph of the human spirit, freedom, and reconciliation over apartheid.',
          image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Blyde River Canyon (Three Rondavels)',
          city: 'Mpumalanga',
          lat: -24.5608,
          lng: 30.8037,
          category: 'Subtropical Green Canyon',
          era: 'Drakensberg Escarpment',
          visitors: '900K / yr',
          shortDesc: 'One of Earth’s largest green canyons featuring quartzite domes shaped like traditional rondavel huts.',
          fullDesc: 'Carved 800 meters deep into red sandstone along the Panorama Route, Blyde River Canyon offers sweeping vistas from God’s Window and Bourke’s Luck Potholes.',
          image: 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Switzerland': {
      name: 'Switzerland',
      iso3: 'CHE',
      iso2: 'ch',
      flag: '🇨🇭',
      capital: 'Bern',
      region: 'Central Europe',
      population: '8.8M',
      currency: 'CHF (Fr.)',
      lat: 46.8182,
      lng: 8.2275,
      description: 'An Alpine confederation of pyramidal mountain peaks, cogwheel mountain railways, glacier-fed lakes, and medieval lakeside castles.',
      landmarks: [
        {
          name: 'The Matterhorn',
          city: 'Zermatt, Valais',
          lat: 45.9766,
          lng: 7.6585,
          category: 'Iconic Alpine Peak',
          era: '4,478m Elevation',
          visitors: '2.0M / yr',
          shortDesc: 'Chiseled four-faced pyramidal peak towering 4,478 meters above car-free Zermatt.',
          fullDesc: 'Straddling the Swiss-Italian border, the Matterhorn is one of the world’s most photographed mountains, reflected perfectly in the alpine Riffelsee along the Gornergrat railway.',
          image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Jungfraujoch (Top of Europe)',
          city: 'Bernese Oberland',
          lat: 46.5475,
          lng: 7.9851,
          category: 'UNESCO Alpine Glacier Saddle',
          era: 'Railway Opened 1912',
          visitors: '1.0M / yr',
          shortDesc: 'Europe’s highest railway station at 3,454 meters overlooking the 22-km Aletsch Glacier.',
          fullDesc: 'Reached by a tunnel cogwheel train bored through the Eiger and Mönch mountains, Jungfraujoch features the Sphinx Observatory and panoramic views across the UNESCO Swiss Alps.',
          image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Chapel Bridge (Kapellbrücke)',
          city: 'Lucerne',
          lat: 47.0516,
          lng: 8.3075,
          category: 'Medieval Covered Bridge',
          era: 'Built 1333',
          visitors: '3.5M / yr',
          shortDesc: 'Europe’s oldest wooden covered bridge crossing the Reuss River beside an octagonal Water Tower.',
          fullDesc: 'Adorned with 17th-century triangular interior roof paintings depicting Lucerne’s history, the floral-lined Chapel Bridge is the centerpiece of Lucerne’s medieval old town.',
          image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Château de Chillon',
          city: 'Veytaux, Lake Geneva',
          lat: 46.4142,
          lng: 6.9275,
          category: 'Medieval Island Castle',
          era: '12th–13th Century',
          visitors: '430K / yr',
          shortDesc: 'Romantic medieval water castle set on a rocky islet on the shores of Lake Geneva.',
          fullDesc: 'Immortalized by Lord Byron’s poem "The Prisoner of Chillon," this Savoyard fortress features Gothic vaulted subterranean halls framed by the Dents du Midi mountains.',
          image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Lauterbrunnen Valley (72 Waterfalls)',
          city: 'Bernese Oberland',
          lat: 46.5935,
          lng: 7.9091,
          category: 'Glacial U-Shaped Valley',
          era: 'Staubbach Falls (297m)',
          visitors: '1.4M / yr',
          shortDesc: 'Deep glacial trough flanked by sheer 300-meter limestone cliffs and 72 plunging waterfalls.',
          fullDesc: 'Serving as the gateway to car-free alpine villages Wengen and Mürren, Lauterbrunnen features the free-falling Staubbach Falls and subterranean glacier cascades of Trümmelbach Falls.',
          image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Turkey': {
      name: 'Turkey',
      iso3: 'TUR',
      iso2: 'tr',
      flag: '🇹🇷',
      capital: 'Ankara',
      region: 'Transcontinental (Eurasia)',
      population: '85.3M',
      currency: 'TRY (₺)',
      lat: 38.9637,
      lng: 35.2433,
      description: 'Bridging Europe and Asia across the Bosphorus Strait, uniting Byzantine and Ottoman domes with surreal volcanic fairy chimneys and travertine terraces.',
      landmarks: [
        {
          name: 'Hagia Sophia',
          city: 'Istanbul',
          lat: 41.0086,
          lng: 28.9802,
          category: 'UNESCO Architectural Wonder',
          era: 'Completed 537 AD',
          visitors: '13.5M / yr',
          shortDesc: 'Emperor Justinian’s revolutionary domed basilica and Ottoman mosque in Sultanahmet.',
          fullDesc: 'For nearly a thousand years the world’s largest interior space, Hagia Sophia’s 55.6-meter pendentive dome seems to float on a ring of 40 arched windows above golden mosaics and calligraphic medallions.',
          image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Cappadocia & Göreme Open-Air Museum',
          city: 'Nevşehir, Central Anatolia',
          lat: 38.6431,
          lng: 34.8289,
          category: 'UNESCO Volcanic Landscape',
          era: '4th–13th Century Cave Churches',
          visitors: '4.2M / yr',
          shortDesc: 'Honeycombed volcanic tuff valleys and fairy chimneys famous for sunrise hot-air balloon flights.',
          fullDesc: 'Sculpted from soft volcanic ash deposits, Cappadocia features multi-level underground cities, frescoed rock-cut Byzantine chapels, and skies filled with colorful hot-air balloons at dawn.',
          image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Pamukkale Thermal Pools & Hierapolis',
          city: 'Denizli',
          lat: 37.9250,
          lng: 29.1211,
          category: 'UNESCO Natural & Ancient Site',
          era: 'Founded 2nd Century BC',
          visitors: '2.5M / yr',
          shortDesc: 'Snow-white calcium carbonate travertine terraces cascading down a hillside below Greco-Roman Hierapolis.',
          fullDesc: 'Meaning "Cotton Castle" in Turkish, Pamukkale’s mineral-rich thermal waters spill through tiered turquoise basins directly below the remarkably preserved Roman theater of Hierapolis.',
          image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Ancient City of Ephesus (Library of Celsus)',
          city: 'Selçuk, İzmir',
          lat: 37.9391,
          lng: 27.3408,
          category: 'UNESCO Classical Metropolis',
          era: '10th Century BC – Roman Era',
          visitors: '2.3M / yr',
          shortDesc: 'Grand marble avenues of Roman Asia Minor anchored by the two-story facade of the Library of Celsus.',
          fullDesc: 'Once a thriving Aegean port city of 250,000 inhabitants, Ephesus preserves marble-paved Curetes Street, terraced patrician villas, a 25,000-seat Great Theatre, and the iconic Library of Celsus.',
          image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Topkapı Palace & Bosphorus View',
          city: 'Istanbul',
          lat: 41.0115,
          lng: 28.9834,
          category: 'Imperial Ottoman Palace',
          era: 'Built 1459–1465',
          visitors: '3.4M / yr',
          shortDesc: 'Four-courtyard imperial residence of the Ottoman Sultans overlooking the Golden Horn and Bosphorus.',
          fullDesc: 'Commanding Seraglio Point where the Marmara Sea meets the Bosphorus, Topkapı Palace showcases İznik-tiled pavilions, the Imperial Harem, and the dazzling Spoonmaker’s Diamond.',
          image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Morocco': {
      name: 'Morocco',
      iso3: 'MAR',
      iso2: 'ma',
      flag: '🇲🇦',
      capital: 'Rabat',
      region: 'North Africa',
      population: '37.8M',
      currency: 'MAD (د.م.)',
      lat: 31.7917,
      lng: -7.0926,
      description: 'A sensory crossroads of High Atlas peaks, Saharan erg dunes, cobalt-blue mountain medinas, and intricate zellige tilework.',
      landmarks: [
        {
          name: 'Jemaa el-Fnaa & Koutoubia Mosque',
          city: 'Marrakesh',
          lat: 31.6258,
          lng: -7.9891,
          category: 'UNESCO Cultural Square',
          era: 'Founded 11th Century',
          visitors: '3.0M / yr',
          shortDesc: 'Marrakesh’s storied central plaza watched over by the 77-meter Almohad minaret of Koutoubia.',
          fullDesc: 'Recognized by UNESCO as a Masterpiece of the Oral and Intangible Heritage of Humanity, Jemaa el-Fnaa comes alive at dusk with Gnawa musicians, storytellers, spice souks, and lantern-lit food stalls.',
          image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Chefchaouen (The Blue Pearl)',
          city: 'Rif Mountains',
          lat: 35.1688,
          lng: -5.2636,
          category: 'Historic Mountain Medina',
          era: 'Founded 1471',
          visitors: '950K / yr',
          shortDesc: 'Enchanting Rif Mountain town where every alleyway, stairway, and doorway is washed in shades of blue.',
          fullDesc: 'Founded in 1471 as a small kasbah fortress, Chefchaouen is world-famous for its powder-blue, indigo, and cerulean-washed walls framed by terracotta roofs and mountain peaks.',
          image: 'https://images.unsplash.com/photo-1553899017-90b502a22d8d?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Ksar of Aït Benhaddou',
          city: 'Ouarzazate Province',
          lat: 31.0470,
          lng: -7.1319,
          category: 'UNESCO Earthen Clay Ksar',
          era: '17th Century Caravan Stop',
          visitors: '650K / yr',
          shortDesc: 'Fortified red-earth village along the ancient trans-Saharan caravan route across the High Atlas.',
          fullDesc: 'Constructed from rammed red earth and sun-dried mud brick (pisé) along the Ounila River, Aït Benhaddou’s corner towers and labyrinthine lanes represent classic southern Moroccan earthen architecture.',
          image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Hassan II Mosque',
          city: 'Casablanca',
          lat: 33.6084,
          lng: -7.6326,
          category: 'Oceanfront Architectural Marvel',
          era: 'Completed 1993',
          visitors: '1.2M / yr',
          shortDesc: 'Monumental Atlantic oceanfront mosque featuring a 210-meter minaret and retractable roof.',
          fullDesc: 'Built partially on a rocky outcrop over the crashing waves of the Atlantic Ocean, the Hassan II Mosque showcases hand-carved cedar ceilings, zellige mosaics, and one of the world’s tallest minarets.',
          image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Jardin Majorelle',
          city: 'Marrakesh',
          lat: 31.6415,
          lng: -8.0033,
          category: 'Botanical & Art Garden',
          era: 'Created 1923',
          visitors: '900K / yr',
          shortDesc: 'Lush botanical oasis of cacti, bamboo, and water lilies centered on a vibrant "Majorelle Blue" villa.',
          fullDesc: 'Designed over forty years by French Orientalist painter Jacques Majorelle and later restored by Yves Saint Laurent, this two-acre sanctuary pairs exotic desert flora with electric ultramarine architecture.',
          image: 'https://images.unsplash.com/photo-1553899017-90b502a22d8d?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Argentina': {
      name: 'Argentina',
      iso3: 'ARG',
      iso2: 'ar',
      flag: '🇦🇷',
      capital: 'Buenos Aires',
      region: 'South America',
      population: '46.6M',
      currency: 'ARS ($)',
      lat: -38.4161,
      lng: -63.6167,
      description: 'Stretching from subtropical jungles and colorful Andean canyons in the north to Patagonian granite spires and advancing glaciers in the far south.',
      landmarks: [
        {
          name: 'Perito Moreno Glacier',
          city: 'Los Glaciares National Park, Santa Cruz',
          lat: -50.4957,
          lng: -73.1377,
          category: 'UNESCO Patagonian Glacier',
          era: 'Southern Patagonian Ice Field',
          visitors: '700K / yr',
          shortDesc: 'Colossal 30-kilometer-long wall of electric-blue ice calving thunderously into Lago Argentino.',
          fullDesc: 'Rising 74 meters above the turquoise surface of Lago Argentino, Perito Moreno is one of Patagonia’s few stable glaciers, offering close-up boardwalk views of towering ice seracs.',
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Mount Fitz Roy (El Chaltén)',
          city: 'Patagonia, Santa Cruz',
          lat: -49.2713,
          lng: -73.0432,
          category: 'Granite Alpine Spire',
          era: '3,405m Elevation',
          visitors: '380K / yr',
          shortDesc: 'Jagged granite massif piercing the Patagonian sky above glacial Laguna de los Tres.',
          fullDesc: 'Known as "Chaltén" (Smoking Mountain) by the Indigenous Tehuelche people because of the clouds that crown its summit, Mount Fitz Roy is a world-renowned trekking and mountaineering icon.',
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'La Boca (Caminito) & Teatro Colón',
          city: 'Buenos Aires',
          lat: -34.6394,
          lng: -58.3627,
          category: 'Cultural & Musical Heritage',
          era: '19th–20th Century',
          visitors: '3.1M / yr',
          shortDesc: 'Vibrant open-air street museum of brightly painted conventillos and tango heritage in Buenos Aires.',
          fullDesc: 'From the polychrome corrugated metal houses of Caminito in La Boca to the acoustic perfection of the 1908 Teatro Colón opera house, Buenos Aires radiates passion, architecture, and tango culture.',
          image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Quebrada de Humahuaca (Hill of 14 Colors)',
          city: 'Jujuy Province',
          lat: -23.2045,
          lng: -65.3489,
          category: 'UNESCO Andean Canyon',
          era: '10,000-Year Inca Trail Corridor',
          visitors: '520K / yr',
          shortDesc: 'Dramatic high-altitude desert valley featuring mineral-striped mountains like Hornocal and Purmamarca.',
          fullDesc: 'Following a major cultural route used since pre-Inca times, the Quebrada de Humahuaca showcases the Hill of Seven Colors in Purmamarca and the serrated 14-colored ridge of Serranía de Hornocal.',
          image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Ushuaia & Tierra del Fuego National Park',
          city: 'Tierra del Fuego',
          lat: -54.8019,
          lng: -68.3030,
          category: 'Subantarctic Wilderness',
          era: 'End of the World (Fin del Mundo)',
          visitors: '490K / yr',
          shortDesc: 'The world’s southernmost city resting between the Martial Mountains and the Beagle Channel.',
          fullDesc: 'At the southern tip of South America, Ushuaia and Tierra del Fuego National Park offer subantarctic forests, emerald bays along the Beagle Channel, and the gateway to Antarctica.',
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'New Zealand': {
      name: 'New Zealand',
      iso3: 'NZL',
      iso2: 'nz',
      flag: '🇳🇿',
      capital: 'Wellington',
      region: 'Oceania',
      population: '5.2M',
      currency: 'NZD (NZ$)',
      lat: -40.9006,
      lng: 174.8860,
      description: 'Aotearoa ("Land of the Long White Cloud"), famous for glacier-carved fjords, geothermal valleys, bioluminescent caves, and Southern Alps peaks.',
      landmarks: [
        {
          name: 'Milford Sound (Piopiotahi)',
          city: 'Fiordland, South Island',
          lat: -44.6716,
          lng: 167.9256,
          category: 'UNESCO Glacial Fjord',
          era: 'Ice Age Carved',
          visitors: '870K / yr',
          shortDesc: 'Dramatic fjord dominated by 1,692-meter Mitre Peak and hundreds of cascading rainforest waterfalls.',
          fullDesc: 'Described by Rudyard Kipling as the "eighth wonder of the world," Milford Sound features sheer dark granite cliffs where fur seals, bottleneck dolphins, and Fiordland crested penguins thrive.',
          image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Aoraki / Mount Cook National Park',
          city: 'Canterbury, South Island',
          lat: -43.5950,
          lng: 170.1418,
          category: 'UNESCO Alpine Reserve',
          era: '3,724m Highest Peak',
          visitors: '950K / yr',
          shortDesc: 'New Zealand’s highest mountain rising above turquoise Lake Pukaki and the Tasman Glacier.',
          fullDesc: 'Part of a Gold Tier International Dark Sky Reserve, Aoraki / Mount Cook features 19 peaks over 3,000 meters, glacial valleys, and dazzling milky-blue lakes.',
          image: 'https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Hobbiton Movie Set',
          city: 'Matamata, Waikato',
          lat: -37.8721,
          lng: 175.6829,
          category: 'Cinematic Cultural Landmark',
          era: 'Created 1999',
          visitors: '650K / yr',
          shortDesc: 'Lush rolling hills of the Shire dotted with 44 handcrafted Hobbit Holes and the Green Dragon Inn.',
          fullDesc: 'Set across a picturesque 1,250-acre sheep farm in the Waikato region with the Kaimai Ranges in the distance, Hobbiton brings Middle-earth to life with permanent timber-and-stone craftsmanship.',
          image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Rotorua Geothermal Valley & Te Puia',
          city: 'Rotorua, North Island',
          lat: -38.1620,
          lng: 176.2546,
          category: 'Geothermal & Māori Heritage',
          era: 'Taupo Volcanic Zone',
          visitors: '1.3M / yr',
          shortDesc: 'Steaming silica terraces, Pohutu Geyser, rainbow champagne pools, and vibrant Māori culture.',
          fullDesc: 'Located in the Pacific Ring of Fire, Rotorua is home to the 30-meter Pohutu Geyser, bubbling mud pools, and the New Zealand Māori Arts and Crafts Institute.',
          image: 'https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Waitomo Glowworm Caves',
          city: 'Waikato, North Island',
          lat: -38.2607,
          lng: 175.1035,
          category: 'Subterranean Wonder',
          era: '30M-Year Limestone Caves',
          visitors: '500K / yr',
          shortDesc: 'Underground limestone river caverns illuminated like a starry galaxy by endemic Arachnocampa luminosa.',
          fullDesc: 'Visitors glide silently by boat beneath a subterranean vaulted ceiling glowing with thousands of bioluminescent New Zealand glowworms.',
          image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Norway': {
      name: 'Norway',
      iso3: 'NOR',
      iso2: 'no',
      flag: '🇳🇴',
      capital: 'Oslo',
      region: 'Northern Europe (Scandinavia)',
      population: '5.5M',
      currency: 'NOK (kr)',
      lat: 60.4720,
      lng: 8.4689,
      description: 'Realm of the Midnight Sun and Northern Lights, carved by deep glacial fjords, sheer coastal cliffs, and Arctic island chains.',
      landmarks: [
        {
          name: 'Geirangerfjord',
          city: 'Møre og Romsdal',
          lat: 62.1008,
          lng: 7.0941,
          category: 'UNESCO West Norwegian Fjord',
          era: 'Glacial Fjord',
          visitors: '900K / yr',
          shortDesc: 'Deep sapphire fjord flanked by vertical cliffs and the Seven Sisters waterfall.',
          fullDesc: 'Surrounded by snow-covered mountain peaks and abandoned historic mountain farms clinging to ledges, Geirangerfjord is a jewel of the UNESCO West Norwegian Fjords.',
          image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Preikestolen (Pulpit Rock)',
          city: 'Rogaland (Lysefjord)',
          lat: 58.9864,
          lng: 6.1904,
          category: 'Natural Cliff Plateau',
          era: 'Formed 10,000 Years Ago',
          visitors: '330K / yr',
          shortDesc: 'Flat 25-by-25-meter granite cliff platform towering 604 meters straight above Lysefjord.',
          fullDesc: 'Carved by glacial frost expansion at the end of the last Ice Age, Preikestolen offers one of the most dramatic natural viewing platforms in Scandinavia.',
          image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Lofoten Archipelago (Reine)',
          city: 'Nordland (Arctic Circle)',
          lat: 67.9325,
          lng: 13.0886,
          category: 'Arctic Island Chain',
          era: 'North of the Arctic Circle',
          visitors: '600K / yr',
          shortDesc: 'Jagged granite peaks rising directly from the Norwegian Sea above red fishermen’s rorbuer cabins.',
          fullDesc: 'Located above the Arctic Circle, Lofoten combines dramatic alpine peaks, white coral beaches, the summer Midnight Sun, and dancing winter Aurora Borealis.',
          image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Bryggen Hanseatic Wharf',
          city: 'Bergen',
          lat: 60.3976,
          lng: 5.3245,
          category: 'UNESCO Historic Harbor',
          era: 'Founded 1360',
          visitors: '1.4M / yr',
          shortDesc: 'Row of colorful timber merchant houses lining the Vågen harbor in historic Bergen.',
          fullDesc: 'For nearly 400 years a vital trading outpost of the Hanseatic League, Bryggen’s narrow wooden passages and gabled facades preserve medieval maritime history.',
          image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Oslo Opera House',
          city: 'Oslo',
          lat: 59.9075,
          lng: 10.7531,
          category: 'Contemporary Architecture',
          era: 'Opened 2008',
          visitors: '1.8M / yr',
          shortDesc: 'Angled white Carrara marble and glass cultural center rising like a glacier from the Oslofjord.',
          fullDesc: 'Designed by Snøhetta, the Oslo Opera House invites visitors to walk directly up its sloping white marble roof for panoramic views over the fjord and city skyline.',
          image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },

    'Indonesia': {
      name: 'Indonesia',
      iso3: 'IDN',
      iso2: 'id',
      flag: '🇮🇩',
      capital: 'Jakarta',
      region: 'Southeast Asia',
      population: '277.5M',
      currency: 'IDR (Rp)',
      lat: -0.7893,
      lng: 113.9213,
      description: 'The world’s largest archipelago of 17,000+ islands, home to colossal Buddhist stupas, Balinese sea temples, volcanic craters, and Komodo dragons.',
      landmarks: [
        {
          name: 'Borobudur Temple Compounds',
          city: 'Magelang, Central Java',
          lat: -7.6079,
          lng: 110.2038,
          category: 'UNESCO World’s Largest Buddhist Temple',
          era: '8th–9th Century AD',
          visitors: '3.8M / yr',
          shortDesc: 'Monumental 9th-century step-pyramid mandala adorned with 2,672 relief panels and 72 perforated stupas.',
          fullDesc: 'Constructed from two million volcanic andesite stone blocks without mortar during the Sailendra Dynasty, Borobudur rises out of misty Javanese plains framed by twin volcanoes.',
          image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Uluwatu & Tanah Lot Sea Temples',
          city: 'Bali',
          lat: -8.8291,
          lng: 115.0849,
          category: 'Sacred Balinese Hindu Temples',
          era: '11th–16th Century',
          visitors: '3.2M / yr',
          shortDesc: 'Dramatic oceanfront temples perched on sheer limestone cliffs and wave-lashed offshore rocks.',
          fullDesc: 'Guarding Bali from sea spirits, Uluwatu Temple perches 70 meters above Indian Ocean surf where traditional Kecak fire dances unfold against glowing sunsets.',
          image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Tegallalang Rice Terraces (Ubud)',
          city: 'Gianyar, Bali',
          lat: -8.4312,
          lng: 115.2792,
          category: 'UNESCO Subak Cultural Landscape',
          era: '9th-Century Subak System',
          visitors: '2.0M / yr',
          shortDesc: 'Sculpted emerald rice paddies irrigated by Bali’s cooperative water-temple Subak tradition.',
          fullDesc: 'North of Ubud, the cascading valley terraces of Tegallalang exemplify the ancient Balinese philosophy of Tri Hita Karana—harmony between people, nature, and spirit.',
          image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Mount Bromo & Tengger Caldera',
          city: 'East Java',
          lat: -7.9425,
          lng: 112.9530,
          category: 'Active Volcanic Caldera',
          era: '2,329m Elevation',
          visitors: '950K / yr',
          shortDesc: 'Steaming volcanic cone rising from a vast "Sea of Sand" caldera beneath towering Mount Semeru.',
          fullDesc: 'At sunrise from Mount Penanjakan, golden light reveals the smoking crater of Mount Bromo, ribbed Mount Batok, and the conical plume of Semeru floating above morning clouds.',
          image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80'
        },
        {
          name: 'Komodo National Park (Padar Island)',
          city: 'East Nusa Tenggara',
          lat: -8.6594,
          lng: 119.5586,
          category: 'UNESCO Biosphere & Marine Park',
          era: 'Established 1980',
          visitors: '300K / yr',
          shortDesc: 'Volcanic islands with tri-colored beaches (pink, white, and black sand) and wild Komodo dragons.',
          fullDesc: 'Situated at the Wallacea biogeographical crossroads, Komodo National Park protects Earth’s largest living lizard alongside Padar Island’s panoramic three-bay ridge and manta ray reefs.',
          image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
        }
      ]
    }
  };

  /* ==========================================================================
     3.COUNTRY NAME ALIASES & FALLBACK METADATA (FOR ALL GEOJSON COUNTRIES)
     ========================================================================== */
  const COUNTRY_NAME_ALIASES = {
    'United States of America': 'United States',
    'USA': 'United States',
    'US': 'United States',
    'UK': 'United Kingdom',
    'Great Britain': 'United Kingdom',
    'England': 'United Kingdom',
    'Republic of Korea': 'South Korea',
    'Korea, Republic of': 'South Korea',
    'Korea': 'South Korea',
    'Russian Federation': 'Russia',
    'Viet Nam': 'Vietnam',
    'Czechia': 'Czech Republic',
    'United Republic of Tanzania': 'Tanzania'
  };

  const EXTENDED_COUNTRY_METADATA = {
    'Russia': { flag: '🇷🇺', capital: 'Moscow', region: 'Eastern Europe / Northern Asia' },
    'Vietnam': { flag: '🇻🇳', capital: 'Hanoi', region: 'Southeast Asia' },
    'Singapore': { flag: '🇸🇬', capital: 'Singapore', region: 'Southeast Asia' },
    'Malaysia': { flag: '🇲🇾', capital: 'Kuala Lumpur', region: 'Southeast Asia' },
    'Portugal': { flag: '🇵🇹', capital: 'Lisbon', region: 'Southern Europe' },
    'Netherlands': { flag: '🇳🇱', capital: 'Amsterdam', region: 'Western Europe' },
    'Sweden': { flag: '🇸🇪', capital: 'Stockholm', region: 'Northern Europe' },
    'Iceland': { flag: '🇮🇸', capital: 'Reykjavík', region: 'Northern Europe' },
    'Kenya': { flag: '🇰🇪', capital: 'Nairobi', region: 'East Africa' },
    'Chile': { flag: '🇨🇱', capital: 'Santiago', region: 'South America' },
    'Colombia': { flag: '🇨🇴', capital: 'Bogotá', region: 'South America' },
    'Saudi Arabia': { flag: '🇸🇦', capital: 'Riyadh', region: 'Middle East' }
  };

  /* ==========================================================================
     4. APPLICATION STATE & THREE.JS REFERENCES
     ========================================================================== */
  const state = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    globeGroup: null,
    earthMesh: null,
    cloudsMesh: null,
    atmosphereMesh: null,
    starfield: null,
    bordersMesh: null,
    hoveredBorderGroup: null,
    selectedBorderGroup: null,
    landmarkMarkersGroup: null,
    globalMarkersGroup: null,
    geoFeatures: [],
    hoveredCountryName: null,
    selectedCountryName: null,
    exploredCountries: new Set(),
    autoRotate: true,
    showBorders: true,
    cameraAnimation: null,
    pointerDownPos: { x: 0, y: 0 },
    raycaster: null,
    pointerNDC: null,
    activeModalLandmark: null
  };

  /* ==========================================================================
     5. SPHERICAL COORDINATE MATHEMATICS (LAT/LNG <-> 3D VECTOR3)
     ========================================================================== */

  /**
   * Converts geographic Latitude and Longitude (in degrees) to 3D Cartesian
   * coordinates on a Three.js SphereGeometry of radius `radius`.
   * Matches standard equirectangular UV mapping seamlessly.
   */
  function latLngToVector3(lat, lng, radius = GLOBE_RADIUS) {
    const phi = (90 - lat) * DEG2RAD;
    const theta = (lng + 180) * DEG2RAD;

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  }

  /**
   * Inverse transformation: converts a 3D point on the sphere (in local globe space)
   * back into exact geographic (lat, lng) coordinates in degrees.
   */
  function vector3ToLatLng(point, radius = GLOBE_RADIUS) {
    const normalizedY = Math.max(-1, Math.min(1, point.y / radius));
    const phi = Math.acos(normalizedY);
    const lat = 90 - phi * RAD2DEG;

    let theta = Math.atan2(point.z, -point.x);
    if (theta < 0) {
      theta += Math.PI * 2;
    }
    const lng = theta * RAD2DEG - 180;

    return { lat, lng };
  }

  /* ==========================================================================
     6. PROCEDURAL FALLBACK ASSETS (EARTH TEXTURE, LANDMARK SVG, GEOJSON)
     ========================================================================== */

  /**
   * Generates a rich equirectangular Earth texture on an HTML5 Canvas so the globe
   * renders immediately and still looks great even if CDN textures are slow/offline.
   */
  function createProceduralEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep ocean bathymetry gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0.0, '#0c2348');
    oceanGrad.addColorStop(0.2, '#072a5c');
    oceanGrad.addColorStop(0.5, '#093875');
    oceanGrad.addColorStop(0.8, '#072a5c');
    oceanGrad.addColorStop(1.0, '#0c2348');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle latitude/longitude graticule lines on ocean
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Polar ice caps softening
    const northIce = ctx.createLinearGradient(0, 0, 0, 32);
    northIce.addColorStop(0, 'rgba(226, 242, 254, 0.65)');
    northIce.addColorStop(1, 'rgba(226, 242, 254, 0)');
    ctx.fillStyle = northIce;
    ctx.fillRect(0, 0, canvas.width, 32);

    const southIce = ctx.createLinearGradient(0, canvas.height - 42, 0, canvas.height);
    southIce.addColorStop(0, 'rgba(226, 242, 254, 0)');
    southIce.addColorStop(1, 'rgba(226, 242, 254, 0.78)');
    ctx.fillStyle = southIce;
    ctx.fillRect(0, canvas.height - 42, canvas.width, 42);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return { texture, canvas, ctx };
  }

  /**
   * Once GeoJSON features are loaded, we also paint filled continent land-masses onto
   * the procedural canvas so that if external satellite imagery fails to load,
   * the globe still displays lush green/gold continents and crisp coastlines.
   */
  function paintContinentsOnProceduralCanvas(canvasObj, features) {
    if (!canvasObj || !canvasObj.ctx) return;
    const { ctx, canvas, texture } = canvasObj;

    ctx.save();
    ctx.fillStyle = '#144d3e';
    ctx.strokeStyle = '#227c63';
    ctx.lineWidth = 0.8;

    features.forEach((feature) => {
      const geom = feature.geometry;
      if (!geom) return;
      const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
      polys.forEach((poly) => {
        const ring = poly[0];
        if (!ring || ring.length < 3) return;
        ctx.beginPath();
        ring.forEach((coord, idx) => {
          const lng = coord[0];
          const lat = coord[1];
          const x = ((lng + 180) / 360) * canvas.width;
          const y = ((90 - lat) / 180) * canvas.height;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
    });

    ctx.restore();
    texture.needsUpdate = true;
  }

  /**
   * Generates a bespoke SVG data-URI illustration for any landmark if an external
   * thumbnail image cannot be reached.
   */
  function createLandmarkFallbackSVG(landmarkName, cityName, category) {
    const safeTitle = (landmarkName || 'Landmark').replace(/[<>&"']/g, '');
    const safeCity = (cityName || '').replace(/[<>&"']/g, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#07132c"/>
          <stop offset="55%" stop-color="#0f2952"/>
          <stop offset="100%" stop-color="#1e3a5f"/>
        </linearGradient>
        <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.2"/>
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#sky)"/>
      <circle cx="440" cy="130" r="62" fill="url(#sun)"/>
      <path d="M0 320 L140 190 L260 280 L390 165 L520 275 L600 220 L600 400 L0 400 Z" fill="#0b1d3a" opacity="0.85"/>
      <path d="M0 350 L190 240 L330 310 L470 215 L600 310 L600 400 L0 400 Z" fill="#061024"/>
      <text x="36" y="330" fill="#38bdf8" font-family="Inter, sans-serif" font-size="16" font-weight="700" letter-spacing="2">${safeCity.toUpperCase()}</text>
      <text x="36" y="362" fill="#ffffff" font-family="Inter, sans-serif" font-size="24" font-weight="800">${safeTitle}</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  /**
   * Built-in fallback GeoJSON features in case all external GeoJSON CDNs are unreachable.
   */
  function getFallbackGeoJSON() {
    const features = [];
    Object.values(COUNTRIES_DATABASE).forEach((country) => {
      const cLat = country.lat;
      const cLng = country.lng;
      const dLat = 5.2;
      const dLng = 6.5;
      const ring = [
        [cLng - dLng, cLat - dLat],
        [cLng + dLng, cLat - dLat],
        [cLng + dLng, cLat + dLat],
        [cLng - dLng, cLat + dLat],
        [cLng - dLng, cLat - dLat]
      ];
      features.push({
        type: 'Feature',
        properties: { name: country.name, iso_a3: country.iso3 },
        geometry: {
          type: 'Polygon',
          coordinates: [ring]
        }
      });
    });
    return { type: 'FeatureCollection', features };
  }

  /* ==========================================================================
     7. INITIALIZING THE THREE.JS SCENE, EARTH, ATMOSPHERE & STARS
     ========================================================================== */

  function initScene() {
    const container = document.getElementById('globe-canvas-container');
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    state.scene = new THREE.Scene();

    state.camera = new THREE.PerspectiveCamera(42, width / height, 1, 2500);
    // Start camera viewing Europe/Asia/Africa and smoothly rotating
    const initialPos = latLngToVector3(22, 18, DEFAULT_CAMERA_DISTANCE);
    state.camera.position.copy(initialPos);

    state.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    state.renderer.setSize(width, height);
    state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(state.renderer.domElement);

    // OrbitControls Setup
    state.controls = new THREE.OrbitControls(state.camera, state.renderer.domElement);
    state.controls.enableDamping = true;
    state.controls.dampingFactor = 0.055;
    state.controls.enablePan = false;
    state.controls.rotateSpeed = 0.55;
    state.controls.zoomSpeed = 0.85;
    state.controls.minDistance = 128;
    state.controls.maxDistance = 420;
    state.controls.autoRotate = state.autoRotate;
    state.controls.autoRotateSpeed = 0.42;

    // Scene Lighting
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.65);
    state.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x080d1a, 0.55);
    state.scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.15);
    sunLight.position.set(220, 140, 180);
    state.scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    rimLight.position.set(-200, -110, -160);
    state.scene.add(rimLight);

    // Main Globe Group
    state.globeGroup = new THREE.Group();
    state.scene.add(state.globeGroup);

    state.hoveredBorderGroup = new THREE.Group();
    state.selectedBorderGroup = new THREE.Group();
    state.landmarkMarkersGroup = new THREE.Group();
    state.globalMarkersGroup = new THREE.Group();

    state.globeGroup.add(state.hoveredBorderGroup);
    state.globeGroup.add(state.selectedBorderGroup);
    state.globeGroup.add(state.landmarkMarkersGroup);
    state.globeGroup.add(state.globalMarkersGroup);

    state.raycaster = new THREE.Raycaster();
    state.pointerNDC = new THREE.Vector2(-999, -999);
  }

  function createEarthAndAtmosphere() {
    // 1. Procedural base texture (immediate fallback)
    const proceduralCanvasObj = createProceduralEarthTexture();

    const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 96, 96);
    const earthMat = new THREE.MeshPhongMaterial({
      map: proceduralCanvasObj.texture,
      bumpScale: 1.35,
      specular: new THREE.Color(0x1e3a5f),
      shininess: 16
    });

    state.earthMesh = new THREE.Mesh(earthGeo, earthMat);
    state.earthMesh.userData.proceduralCanvasObj = proceduralCanvasObj;
    state.globeGroup.add(state.earthMesh);

    // Load high-resolution satellite Earth textures from CDN asynchronously
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    textureLoader.load(
      EARTH_TEXTURES.diffuse,
      (diffuseTex) => {
        diffuseTex.anisotropy = state.renderer.capabilities.getMaxAnisotropy();
        earthMat.map = diffuseTex;
        earthMat.needsUpdate = true;
      },
      undefined,
      () => {
        // Keep procedural Earth texture if offline
      }
    );

    textureLoader.load(
      EARTH_TEXTURES.bump,
      (bumpTex) => {
        earthMat.bumpMap = bumpTex;
        earthMat.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    textureLoader.load(
      EARTH_TEXTURES.specular,
      (specTex) => {
        earthMat.specularMap = specTex;
        earthMat.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    // 2. Outer Fresnel Atmospheric Glow Shader
    const atmosphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.13, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.66 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.22, 0.68, 0.98, 1.0) * intensity * 1.15;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });

    state.atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    state.scene.add(state.atmosphereMesh);

    // 3. Inner Subtle Limb Halo
    const innerHaloGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.012, 64, 64);
    const innerHaloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float glow = pow(rim, 3.2);
          gl_FragColor = vec4(0.28, 0.76, 1.0, glow * 0.42);
        }
      `,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    });
    const innerHaloMesh = new THREE.Mesh(innerHaloGeo, innerHaloMat);
    state.globeGroup.add(innerHaloMesh);

    // 4. Deep-Space Starfield (3,600 multi-spectral stars)
    createStarfield();
  }

  function createStarfield() {
    const starCount = 3600;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const starPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#bae6fd'),
      new THREE.Color('#fde68a'),
      new THREE.Color('#93c5fd'),
      new THREE.Color('#fbcfe8')
    ];

    for (let i = 0; i < starCount; i++) {
      const r = 520 + Math.random() * 900;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c = starPalette[i % starPalette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      sizeAttenuation: true
    });

    state.starfield = new THREE.Points(starGeo, starMat);
    state.scene.add(state.starfield);
  }

  /* ==========================================================================
     8. LOADING GEOJSON BOUNDARIES & BUILDING 3D BORDER MESHES
     ========================================================================== */

  async function loadGeographicBoundaries() {
    setLoadingProgress(55, 'Loading high-precision country boundaries...');
    let geoData = null;

    for (const url of GEOJSON_URLS) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          geoData = await response.json();
          if (geoData && Array.isArray(geoData.features) && geoData.features.length > 0) {
            break;
          }
        }
      } catch (err) {
        // Continue to next fallback URL
      }
    }

    if (!geoData || !Array.isArray(geoData.features)) {
      geoData = getFallbackGeoJSON();
    }

    // Normalize country names & precompute bounding boxes for fast hit-testing
    state.geoFeatures = geoData.features
      .filter((f) => f && f.geometry && f.geometry.coordinates)
      .map((feature) => {
        const rawName =
          (feature.properties &&
            (feature.properties.name ||
              feature.properties.NAME ||
              feature.properties.admin ||
              feature.properties.ADMIN)) ||
          'Unknown Territory';
        const canonicalName = normalizeCountryName(rawName);
        const bbox = computeFeatureBBox(feature.geometry);
        return {
          ...feature,
          canonicalName,
          rawName,
          bbox
        };
      });

    // Paint land outlines onto procedural canvas texture so offline earth has crisp continents
    if (state.earthMesh && state.earthMesh.userData.proceduralCanvasObj) {
      paintContinentsOnProceduralCanvas(
        state.earthMesh.userData.proceduralCanvasObj,
        state.geoFeatures
      );
    }

    setLoadingProgress(85, 'Constructing 3D country boundary vectors...');
    buildBaseCountryBorders(state.geoFeatures);
    createGlobalFeaturedMarkers();
  }

  function normalizeCountryName(rawName) {
    if (!rawName) return 'Unknown';
    const trimmed = rawName.trim();
    if (COUNTRIES_DATABASE[trimmed]) return trimmed;
    if (COUNTRY_NAME_ALIASES[trimmed]) return COUNTRY_NAME_ALIASES[trimmed];

    // Case-insensitive match against COUNTRIES_DATABASE keys
    const lower = trimmed.toLowerCase();
    for (const key of Object.keys(COUNTRIES_DATABASE)) {
      if (key.toLowerCase() === lower) return key;
    }
    return trimmed;
  }

  function computeFeatureBBox(geometry) {
    let minLat = 90;
    let maxLat = -90;
    let minLng = 180;
    let maxLng = -180;
    let sumLat = 0;
    let sumLng = 0;
    let count = 0;

    const polygons =
      geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;

    polygons.forEach((poly) => {
      const exteriorRing = poly[0];
      if (!exteriorRing) return;
      exteriorRing.forEach((pt) => {
        const lng = pt[0];
        const lat = pt[1];
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        sumLat += lat;
        sumLng += lng;
        count++;
      });
    });

    return {
      minLat,
      maxLat,
      minLng,
      maxLng,
      centerLat: count > 0 ? sumLat / count : 0,
      centerLng: count > 0 ? sumLng / count : 0
    };
  }

  function buildBaseCountryBorders(features) {
    if (state.bordersMesh) {
      state.globeGroup.remove(state.bordersMesh);
    }

    const segmentVertices = [];

    features.forEach((feature) => {
      const geom = feature.geometry;
      const polygons =
        geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;

      polygons.forEach((poly) => {
        poly.forEach((ring) => {
          if (!ring || ring.length < 2) return;
          for (let i = 0; i < ring.length - 1; i++) {
            const p1 = latLngToVector3(ring[i][1], ring[i][0], BORDER_ALTITUDE);
            const p2 = latLngToVector3(
              ring[i + 1][1],
              ring[i + 1][0],
              BORDER_ALTITUDE
            );
            segmentVertices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
          }
        });
      });
    });

    const borderGeo = new THREE.BufferGeometry();
    borderGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(segmentVertices, 3)
    );

    const borderMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.32
    });

    state.bordersMesh = new THREE.LineSegments(borderGeo, borderMat);
    state.globeGroup.add(state.bordersMesh);
  }

  /* ==========================================================================
     9. POINT-IN-POLYGON GEOGRAPHIC COUNTRY DETECTION & HIGHLIGHTING
     ========================================================================== */

  /**
   * Standard Ray-Casting 2D Point-in-Polygon algorithm on (lng, lat) coordinates.
   */
  function isPointInRing(lng, lat, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0];
      const yi = ring[i][1];
      const xj = ring[j][0];
      const yj = ring[j][1];

      const intersect =
        yi > lat !== yj > lat &&
        lng < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-12) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * Checks whether (lng, lat) falls inside a GeoJSON Polygon (inside exterior ring
   * and NOT inside any interior hole rings).
   */
  function isPointInPolygonRings(lng, lat, rings) {
    if (!rings || rings.length === 0) return false;
    if (!isPointInRing(lng, lat, rings[0])) return false;
    for (let k = 1; k < rings.length; k++) {
      if (isPointInRing(lng, lat, rings[k])) return false;
    }
    return true;
  }

  /**
   * Identifies the exact GeoJSON country feature containing (lat, lng).
   * Includes a secondary tight coastal tolerance (< 1.5 deg) so archipelagic
   * island countries like Philippines, Japan, or UK can be clicked smoothly.
   */
  function detectCountryAtLatLng(lat, lng) {
    // Pass 1: Strict polygon interior containment
    for (let i = 0; i < state.geoFeatures.length; i++) {
      const feature = state.geoFeatures[i];
      const bbox = feature.bbox;
      if (
        lat < bbox.minLat ||
        lat > bbox.maxLat ||
        lng < bbox.minLng ||
        lng > bbox.maxLng
      ) {
        continue;
      }

      const geom = feature.geometry;
      if (geom.type === 'Polygon') {
        if (isPointInPolygonRings(lng, lat, geom.coordinates)) {
          return feature;
        }
      } else if (geom.type === 'MultiPolygon') {
        for (let p = 0; p < geom.coordinates.length; p++) {
          if (isPointInPolygonRings(lng, lat, geom.coordinates[p])) {
            return feature;
          }
        }
      }
    }

    // Pass 2: Coastal / archipelago vertex proximity fallback (< 1.45 degrees)
    let closestFeature = null;
    let minSqDist = 1.45 * 1.45;

    for (let i = 0; i < state.geoFeatures.length; i++) {
      const feature = state.geoFeatures[i];
      const bbox = feature.bbox;
      if (
        lat < bbox.minLat - 1.5 ||
        lat > bbox.maxLat + 1.5 ||
        lng < bbox.minLng - 1.5 ||
        lng > bbox.maxLng + 1.5
      ) {
        continue;
      }

      const geom = feature.geometry;
      const polygons =
        geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;

      for (let p = 0; p < polygons.length; p++) {
        const ring = polygons[p][0];
        if (!ring) continue;
        for (let r = 0; r < ring.length; r++) {
          const dLng = ring[r][0] - lng;
          const dLat = ring[r][1] - lat;
          const sqDist = dLng * dLng + dLat * dLat;
          if (sqDist < minSqDist) {
            minSqDist = sqDist;
            closestFeature = feature;
          }
        }
      }
    }

    return closestFeature;
  }

  /**
   * Clears a Three.js Group of its child geometries and materials cleanly.
   */
  function clearThreeGroup(group) {
    if (!group) return;
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  }

  /**
   * Builds a multi-layered glowing 3D boundary highlight for the hovered or selected country.
   */
  function highlightCountryFeature(feature, mode = 'hover') {
    const targetGroup =
      mode === 'select' ? state.selectedBorderGroup : state.hoveredBorderGroup;
    clearThreeGroup(targetGroup);

    if (!feature || !feature.geometry) return;

    const baseAlt = mode === 'select' ? SELECT_ALTITUDE : HOVER_ALTITUDE;
    const primaryColor = mode === 'select' ? 0xfbbf24 : 0x38bdf8;
    const secondaryColor = mode === 'select' ? 0xf59e0b : 0x7dd3fc;

    const polygons =
      feature.geometry.type === 'Polygon'
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates;

    // Layer 1 & Layer 2 stacked slightly in altitude for volumetric border glow
    [0, 0.22].forEach((offset, layerIdx) => {
      const vertices = [];
      polygons.forEach((poly) => {
        poly.forEach((ring) => {
          if (!ring || ring.length < 2) return;
          for (let i = 0; i < ring.length - 1; i++) {
            const p1 = latLngToVector3(
              ring[i][1],
              ring[i][0],
              baseAlt + offset
            );
            const p2 = latLngToVector3(
              ring[i + 1][1],
              ring[i + 1][0],
              baseAlt + offset
            );
            vertices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
          }
        });
      });

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

      const mat = new THREE.LineBasicMaterial({
        color: layerIdx === 0 ? primaryColor : secondaryColor,
        transparent: true,
        opacity: layerIdx === 0 ? 1.0 : 0.72,
        blending: THREE.AdditiveBlending
      });

      targetGroup.add(new THREE.LineSegments(geo, mat));
    });
  }

  /* ==========================================================================
     10. 3D LANDMARK MARKERS & GLOBAL POPULAR DESTINATION PINS
     ========================================================================== */

  /**
   * Creates subtle glowing beacons on the globe for all 24 featured countries.
   */
  function createGlobalFeaturedMarkers() {
    clearThreeGroup(state.globalMarkersGroup);

    Object.values(COUNTRIES_DATABASE).forEach((country) => {
      const pos = latLngToVector3(country.lat, country.lng, GLOBE_RADIUS + 0.45);
      const dotGeo = new THREE.SphereGeometry(0.68, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.78
      });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.copy(pos);
      dotMesh.userData = {
        type: 'country-beacon',
        countryName: country.name
      };
      state.globalMarkersGroup.add(dotMesh);
    });
  }

  /**
   * Spawns 3D interactive pin markers for each landmark of the currently selected country.
   */
  function renderCountryLandmarkMarkers(countryData) {
    clearThreeGroup(state.landmarkMarkersGroup);
    if (!countryData || !Array.isArray(countryData.landmarks)) return;

    countryData.landmarks.forEach((landmark, index) => {
      const surfacePos = latLngToVector3(
        landmark.lat,
        landmark.lng,
        MARKER_ALTITUDE
      );
      const normal = surfacePos.clone().normalize();

      const markerHolder = new THREE.Group();
      markerHolder.position.copy(surfacePos);
      markerHolder.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        normal
      );

      // Pin stem
      const stemGeo = new THREE.CylinderGeometry(0.16, 0.06, 3.2, 8);
      stemGeo.translate(0, 1.6, 0);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);

      // Glowing Pin Head
      const headGeo = new THREE.SphereGeometry(0.95, 16, 16);
      headGeo.translate(0, 3.4, 0);
      const headMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
      const headMesh = new THREE.Mesh(headGeo, headMat);
      headMesh.userData = {
        type: 'landmark-marker',
        landmark,
        countryData,
        index
      };

      // Surface Halo Ring
      const ringGeo = new THREE.RingGeometry(0.85, 1.55, 24);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.userData.isPulseRing = true;

      markerHolder.add(stemMesh);
      markerHolder.add(headMesh);
      markerHolder.add(ringMesh);

      state.landmarkMarkersGroup.add(markerHolder);
    });
  }

  /* ==========================================================================
     11. CAMERA SMOOTH FLY-TO ANIMATION (SPHERICAL INTERPOLATION)
     ========================================================================== */

  function animateCameraTo(lat, lng, targetDistance = FOCUS_CAMERA_DISTANCE, duration = 1250) {
    const startPos = state.camera.position.clone();
    const startDist = startPos.length();
    const startDir = startPos.clone().normalize();

    const endPos = latLngToVector3(lat, lng, targetDistance);
    const endDir = endPos.clone().normalize();

    // Pause auto-rotation while focusing on a selected location
    state.autoRotate = false;
    state.controls.autoRotate = false;
    updateAutoRotateButtonUI();

    state.cameraAnimation = {
      startTime: performance.now(),
      duration,
      startDir,
      endDir,
      startDist,
      endDist: targetDistance
    };
  }

  function updateCameraAnimation(now) {
    if (!state.cameraAnimation) return;

    const { startTime, duration, startDir, endDir, startDist, endDist } =
      state.cameraAnimation;
    const elapsed = now - startTime;
    const rawT = Math.min(1, elapsed / duration);

    // Cubic ease-out
    const easeT = 1 - Math.pow(1 - rawT, 3);

    // Spherical interpolation of direction vector + smooth radius interpolation
    const currentDir = startDir.clone().lerp(endDir, easeT).normalize();
    const currentDist = startDist + (endDist - startDist) * easeT;

    state.camera.position.copy(currentDir.multiplyScalar(currentDist));
    state.camera.lookAt(0, 0, 0);
    state.controls.target.set(0, 0, 0);

    if (rawT >= 1) {
      state.cameraAnimation = null;
    }
  }

  /* ==========================================================================
     12. COUNTRY DATA RESOLUTION & GRACEFUL FALLBACK FOR ANY COUNTRY
     ========================================================================== */

  function resolveCountryProfile(countryName, geoFeature) {
    const canonical = normalizeCountryName(countryName);
    if (COUNTRIES_DATABASE[canonical]) {
      return COUNTRIES_DATABASE[canonical];
    }

    // Build graceful profile for countries outside the 24 curated sets
    const ext = EXTENDED_COUNTRY_METADATA[canonical] || {};
    const centerLat = geoFeature && geoFeature.bbox ? geoFeature.bbox.centerLat : 0;
    const centerLng = geoFeature && geoFeature.bbox ? geoFeature.bbox.centerLng : 0;

    return {
      name: canonical,
      iso3: (geoFeature && geoFeature.id) || canonical.slice(0, 3).toUpperCase(),
      iso2: null,
      flag: ext.flag || '🌍',
      capital: ext.capital || 'National Capital',
      region: ext.region || getRegionFromLatLng(centerLat, centerLng),
      population: 'UN Member / Territory',
      currency: 'Local Currency',
      lat: centerLat,
      lng: centerLng,
      description: `${canonical} is a distinctive destination in ${ext.region || getRegionFromLatLng(centerLat, centerLng)} featuring rich cultural traditions, historical heritage sites, and scenic natural landscapes.`,
      landmarks: [
        {
          name: `${canonical} National Heritage Center`,
          city: ext.capital || canonical,
          lat: centerLat + 0.4,
          lng: centerLng + 0.4,
          category: 'Cultural Landmark',
          era: 'Historic Heritage',
          visitors: 'Featured Destination',
          shortDesc: `Central historic district, architecture, and national museums of ${canonical}.`,
          fullDesc: `Located in the cultural heart of ${canonical}, this landmark showcases the country's architectural history, national art collections, and public plazas.`,
          image: createLandmarkFallbackSVG(`${canonical} Heritage`, ext.capital || canonical, 'Cultural')
        },
        {
          name: `${canonical} Natural Reserve & Scenic Park`,
          city: `${canonical} Highlands`,
          lat: centerLat - 0.6,
          lng: centerLng + 0.5,
          category: 'Natural Wonder',
          era: 'Protected Ecosystem',
          visitors: 'Eco-Tourism Hub',
          shortDesc: `Protected wilderness area preserving native flora, fauna, and panoramic viewpoints in ${canonical}.`,
          fullDesc: `Spanning scenic mountains, valleys, and waterways, this protected reserve highlights the biodiversity and natural beauty of ${canonical}.`,
          image: createLandmarkFallbackSVG(`${canonical} Nature Park`, canonical, 'Nature')
        },
        {
          name: `Old Quarter & Traditional Market`,
          city: ext.capital || canonical,
          lat: centerLat + 0.2,
          lng: centerLng - 0.5,
          category: 'Historic Quarter',
          era: 'Traditional District',
          visitors: 'Popular Attraction',
          shortDesc: `Historic streetscapes, culinary markets, and artisan workshops reflecting local life.`,
          fullDesc: `Travelers gather in the historic quarter of ${canonical} to experience authentic regional cuisine, traditional craftsmanship, and centuries-old squares.`,
          image: createLandmarkFallbackSVG(`Historic Quarter`, canonical, 'Heritage')
        },
        {
          name: `${canonical} Citadel & Monument`,
          city: canonical,
          lat: centerLat - 0.3,
          lng: centerLng - 0.4,
          category: 'National Monument',
          era: 'National Landmark',
          visitors: 'Iconic Sight',
          shortDesc: `Commemorative monument and panoramic citadel overlooking the surrounding region.`,
          fullDesc: `Standing as a proud emblem of ${canonical}'s history and resilience, this monument offers sweeping views and historical exhibitions.`,
          image: createLandmarkFallbackSVG(`${canonical} Monument`, canonical, 'Monument')
        },
        {
          name: `Scenic Coastline & Valley Trail`,
          city: canonical,
          lat: centerLat + 0.7,
          lng: centerLng,
          category: 'Scenic Destination',
          era: 'Natural Landscape',
          visitors: 'Scenic Route',
          shortDesc: `Breathtaking horizon vistas, waterside promenades, and outdoor exploration routes.`,
          fullDesc: `One of ${canonical}'s most photographed natural corridors, ideal for sunset views and outdoor discovery.`,
          image: createLandmarkFallbackSVG(`Scenic Panorama`, canonical, 'Landscape')
        }
      ]
    };
  }

  function getRegionFromLatLng(lat, lng) {
    if (lat > 34 && lng > -25 && lng < 45) return 'Europe';
    if (lat <= 34 && lat > -38 && lng > -20 && lng < 52) return 'Africa';
    if (lng >= 45 && lat > -12) return 'Asia';
    if (lat <= -10 && lng > 110) return 'Oceania';
    if (lat > 12 && lng < -30) return 'North & Central America';
    return 'South America';
  }

  /* ==========================================================================
     13. SELECTING A COUNTRY & UPDATING THE UI PANEL
     ========================================================================== */

  function selectCountry(countryName, geoFeature = null) {
    const canonical = normalizeCountryName(countryName);

    // Find matching GeoJSON feature if not passed directly
    let matchedFeature = geoFeature;
    if (!matchedFeature) {
      matchedFeature = state.geoFeatures.find(
        (f) => f.canonicalName.toLowerCase() === canonical.toLowerCase()
      );
    }

    const countryProfile = resolveCountryProfile(canonical, matchedFeature);
    state.selectedCountryName = countryProfile.name;
    state.exploredCountries.add(countryProfile.name);
    updateExplorationStatsUI();

    // Highlight country border on 3D globe
    if (matchedFeature) {
      highlightCountryFeature(matchedFeature, 'select');
    } else {
      clearThreeGroup(state.selectedBorderGroup);
    }

    // Spawn 5 3D landmark pins on the country
    renderCountryLandmarkMarkers(countryProfile);

    // Smoothly rotate camera to focus on the selected country
    const focusLat = countryProfile.lat || (matchedFeature && matchedFeature.bbox.centerLat) || 20;
    const focusLng = countryProfile.lng || (matchedFeature && matchedFeature.bbox.centerLng) || 0;
    animateCameraTo(focusLat, focusLng, FOCUS_CAMERA_DISTANCE, 1250);

    // Populate and open the Country Information Panel
    renderCountryPanel(countryProfile);
    updatePopularChipsActiveState(countryProfile.name);
  }

  function renderCountryPanel(country) {
    const panel = document.getElementById('country-info-panel');
    const flagEl = document.getElementById('panel-country-flag');
    const regionEl = document.getElementById('panel-country-region');
    const nameEl = document.getElementById('panel-country-name');
    const capitalEl = document.getElementById('panel-country-capital');
    const popEl = document.getElementById('panel-country-population');
    const currEl = document.getElementById('panel-country-currency');
    const descEl = document.getElementById('panel-country-description');
    const landmarksListEl = document.getElementById('panel-landmarks-list');

    // Flag rendering (CDN flag image with instant emoji fallback)
    if (country.iso2) {
      flagEl.innerHTML = `<img src="https://flagcdn.com/w80/${country.iso2.toLowerCase()}.png" alt="${country.name} flag" onerror="this.parentElement.textContent='${country.flag}'" />`;
    } else {
      flagEl.textContent = country.flag || '🌍';
    }

    regionEl.textContent = country.region;
    nameEl.textContent = country.name;
    capitalEl.textContent = country.capital;
    popEl.textContent = country.population;
    currEl.textContent = country.currency;
    descEl.textContent = country.description;

    landmarksListEl.innerHTML = '';
    country.landmarks.forEach((landmark, idx) => {
      const fallbackSvg = createLandmarkFallbackSVG(
        landmark.name,
        landmark.city,
        landmark.category
      );

      const card = document.createElement('article');
      card.className = 'landmark-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      const imgWrap = document.createElement('div');
      imgWrap.className = 'landmark-thumb-wrap';

      const img = document.createElement('img');
      img.className = 'landmark-thumb';
      img.alt = landmark.name;
      img.loading = 'lazy';
      img.src = landmark.image || fallbackSvg;
      img.onerror = function () {
        this.onerror = null;
        this.src = fallbackSvg;
      };

      const badge = document.createElement('span');
      badge.className = 'landmark-index-badge';
      badge.textContent = String(idx + 1);

      imgWrap.appendChild(img);
      imgWrap.appendChild(badge);

      const body = document.createElement('div');
      body.className = 'landmark-card-body';
      body.innerHTML = `
        <div>
          <div class="landmark-card-top">
            <h4 class="landmark-name">${landmark.name}</h4>
          </div>
          <div class="landmark-city">📍 ${landmark.city}</div>
          <p class="landmark-desc">${landmark.shortDesc}</p>
        </div>
        <div class="landmark-card-footer">
          <span class="landmark-category-tag">${landmark.category}</span>
          <span class="landmark-explore-link">Explore Details →</span>
        </div>
      `;

      card.appendChild(imgWrap);
      card.appendChild(body);

      const handleActivate = () => {
        animateCameraTo(landmark.lat, landmark.lng, LANDMARK_CAMERA_DISTANCE, 950);
        openLandmarkModal(landmark, country);
      };

      card.addEventListener('click', handleActivate);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleActivate();
        }
      });

      landmarksListEl.appendChild(card);
    });

    panel.classList.add('open');
  }

  function closeCountryPanel() {
    const panel = document.getElementById('country-info-panel');
    panel.classList.remove('open');
    state.selectedCountryName = null;
    clearThreeGroup(state.selectedBorderGroup);
    clearThreeGroup(state.landmarkMarkersGroup);
    updatePopularChipsActiveState(null);
  }

  /* ==========================================================================
     14. LANDMARK DETAIL MODAL
     ========================================================================== */

  function openLandmarkModal(landmark, country) {
    state.activeModalLandmark = { landmark, country };
    const backdrop = document.getElementById('landmark-modal-backdrop');
    const heroImg = document.getElementById('modal-hero-img');
    const categoryEl = document.getElementById('modal-category-pill');
    const titleEl = document.getElementById('modal-landmark-title');
    const locEl = document.getElementById('modal-landmark-location');
    const eraEl = document.getElementById('modal-stat-era');
    const visitorsEl = document.getElementById('modal-stat-visitors');
    const coordsEl = document.getElementById('modal-stat-coords');
    const fullDescEl = document.getElementById('modal-full-description');

    const fallbackSvg = createLandmarkFallbackSVG(
      landmark.name,
      landmark.city,
      landmark.category
    );

    heroImg.onerror = function () {
      this.onerror = null;
      this.src = fallbackSvg;
    };
    heroImg.src = landmark.image || fallbackSvg;

    categoryEl.textContent = landmark.category;
    titleEl.textContent = landmark.name;
    locEl.textContent = `${landmark.city}, ${country.name} ${country.flag || ''}`;
    eraEl.textContent = landmark.era || 'Historic Site';
    visitorsEl.textContent = landmark.visitors || 'Major Attraction';
    coordsEl.textContent = `${landmark.lat.toFixed(2)}°, ${landmark.lng.toFixed(2)}°`;
    fullDescEl.textContent = landmark.fullDesc || landmark.shortDesc;

    backdrop.classList.add('open');
  }

  function closeLandmarkModal() {
    const backdrop = document.getElementById('landmark-modal-backdrop');
    backdrop.classList.remove('open');
    state.activeModalLandmark = null;
  }

  /* ==========================================================================
     15. POINTER RAYCASTING (HOVER TOOLTIP, BORDER GLOW & CLICK DETECTION)
     ========================================================================== */

  function handlePointerMove(event) {
    const container = document.getElementById('globe-canvas-container');
    const rect = container.getBoundingClientRect();

    state.pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state.pointerNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    state.raycaster.setFromCamera(state.pointerNDC, state.camera);

    // 1. Check if hovering over a 3D landmark marker first
    if (state.landmarkMarkersGroup.children.length > 0) {
      const markerHits = state.raycaster.intersectObjects(
        state.landmarkMarkersGroup.children,
        true
      );
      for (const hit of markerHits) {
        if (hit.object && hit.object.userData && hit.object.userData.type === 'landmark-marker') {
          const { landmark, countryData } = hit.object.userData;
          container.classList.add('country-hover');
          showTooltip(
            event.clientX,
            event.clientY,
            '📍',
            landmark.name,
            `${landmark.city} · Click for details`
          );
          return;
        }
      }
    }

    // 2. Raycast against the 3D Earth sphere
    if (!state.earthMesh) return;
    const earthHits = state.raycaster.intersectObject(state.earthMesh, false);

    if (earthHits.length === 0) {
      clearHoverState();
      return;
    }

    const hitPointWorld = earthHits[0].point.clone();
    const hitPointLocal = state.globeGroup.worldToLocal(hitPointWorld);
    const { lat, lng } = vector3ToLatLng(hitPointLocal, GLOBE_RADIUS);

    const detectedFeature = detectCountryAtLatLng(lat, lng);

    if (!detectedFeature) {
      clearHoverState();
      return;
    }

    const countryName = detectedFeature.canonicalName;
    const profile = COUNTRIES_DATABASE[countryName];
    const flag =
      (profile && profile.flag) ||
      (EXTENDED_COUNTRY_METADATA[countryName] &&
        EXTENDED_COUNTRY_METADATA[countryName].flag) ||
      '🌍';
    const subtitle = profile
      ? `${profile.capital} · 5 Famous Landmarks`
      : 'Click to explore country';

    container.classList.add('country-hover');
    showTooltip(event.clientX, event.clientY, flag, countryName, subtitle);

    if (state.hoveredCountryName !== countryName) {
      state.hoveredCountryName = countryName;
      highlightCountryFeature(detectedFeature, 'hover');
    }
  }

  function clearHoverState() {
    const container = document.getElementById('globe-canvas-container');
    container.classList.remove('country-hover');
    hideTooltip();
    if (state.hoveredCountryName !== null) {
      state.hoveredCountryName = null;
      clearThreeGroup(state.hoveredBorderGroup);
    }
  }

  function showTooltip(clientX, clientY, flag, title, subtitle) {
    const tooltip = document.getElementById('globe-tooltip');
    const flagEl = document.getElementById('tooltip-flag');
    const titleEl = document.getElementById('tooltip-title');
    const subEl = document.getElementById('tooltip-subtitle');

    flagEl.textContent = flag;
    titleEl.textContent = title;
    subEl.textContent = subtitle;

    tooltip.style.left = `${clientX}px`;
    tooltip.style.top = `${clientY - 12}px`;
    tooltip.classList.add('visible');
  }

  function hideTooltip() {
    const tooltip = document.getElementById('globe-tooltip');
    tooltip.classList.remove('visible');
  }

  function handlePointerDown(event) {
    state.pointerDownPos.x = event.clientX;
    state.pointerDownPos.y = event.clientY;
  }

  function handlePointerUp(event) {
    // Distinguish an intentional click from a globe drag gesture
    const dx = event.clientX - state.pointerDownPos.x;
    const dy = event.clientY - state.pointerDownPos.y;
    const dragDistance = Math.hypot(dx, dy);
    if (dragDistance > 6) return;

    const container = document.getElementById('globe-canvas-container');
    const rect = container.getBoundingClientRect();

    state.pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state.pointerNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    state.raycaster.setFromCamera(state.pointerNDC, state.camera);

    // 1. Check click on 3D landmark marker
    if (state.landmarkMarkersGroup.children.length > 0) {
      const markerHits = state.raycaster.intersectObjects(
        state.landmarkMarkersGroup.children,
        true
      );
      for (const hit of markerHits) {
        if (hit.object && hit.object.userData && hit.object.userData.type === 'landmark-marker') {
          const { landmark, countryData } = hit.object.userData;
          animateCameraTo(landmark.lat, landmark.lng, LANDMARK_CAMERA_DISTANCE, 950);
          openLandmarkModal(landmark, countryData);
          return;
        }
      }
    }

    // 2. Check click on global featured country beacon
    if (state.globalMarkersGroup.children.length > 0) {
      const beaconHits = state.raycaster.intersectObjects(
        state.globalMarkersGroup.children,
        true
      );
      if (beaconHits.length > 0 && beaconHits[0].object.userData.countryName) {
        selectCountry(beaconHits[0].object.userData.countryName);
        return;
      }
    }

    // 3. Check click on Earth surface country polygon
    if (!state.earthMesh) return;
    const earthHits = state.raycaster.intersectObject(state.earthMesh, false);
    if (earthHits.length === 0) return;

    const hitPointLocal = state.globeGroup.worldToLocal(
      earthHits[0].point.clone()
    );
    const { lat, lng } = vector3ToLatLng(hitPointLocal, GLOBE_RADIUS);
    const detectedFeature = detectCountryAtLatLng(lat, lng);

    if (detectedFeature) {
      selectCountry(detectedFeature.canonicalName, detectedFeature);
    }
  }

  /* ==========================================================================
     16. SEARCH, POPULAR DESTINATIONS RAIL & UI CONTROLS
     ========================================================================== */

  function getAllSearchableCountries() {
    const map = new Map();

    // Prioritize curated 24 countries
    Object.values(COUNTRIES_DATABASE).forEach((c) => {
      map.set(c.name.toLowerCase(), {
        name: c.name,
        flag: c.flag,
        capital: c.capital,
        region: c.region,
        featured: true
      });
    });

    // Include all GeoJSON countries
    state.geoFeatures.forEach((f) => {
      const key = f.canonicalName.toLowerCase();
      if (!map.has(key)) {
        const ext = EXTENDED_COUNTRY_METADATA[f.canonicalName] || {};
        map.set(key, {
          name: f.canonicalName,
          flag: ext.flag || '🌍',
          capital: ext.capital || 'Explore Borders',
          region: ext.region || 'Global Territory',
          featured: false
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }

  function populatePopularDestinationsRail() {
    const listEl = document.getElementById('popular-destinations-list');
    listEl.innerHTML = '';

    Object.values(COUNTRIES_DATABASE).forEach((country) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'popular-chip';
      btn.dataset.country = country.name;
      btn.innerHTML = `
        <span class="popular-chip-left">
          <span>${country.flag}</span>
          <span class="popular-chip-name">${country.name}</span>
        </span>
        <span class="popular-chip-count">5 spots</span>
      `;
      btn.addEventListener('click', () => {
        selectCountry(country.name);
      });
      listEl.appendChild(btn);
    });
  }

  function updatePopularChipsActiveState(activeCountryName) {
    const chips = document.querySelectorAll('.popular-chip');
    chips.forEach((chip) => {
      if (
        activeCountryName &&
        chip.dataset.country.toLowerCase() === activeCountryName.toLowerCase()
      ) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  function updateExplorationStatsUI() {
    const countEl = document.getElementById('explored-count-value');
    if (countEl) {
      countEl.textContent = String(state.exploredCountries.size);
    }
  }

  function updateAutoRotateButtonUI() {
    const btn = document.getElementById('toggle-rotate-btn');
    if (!btn) return;
    if (state.autoRotate) {
      btn.classList.add('active-toggle');
    } else {
      btn.classList.remove('active-toggle');
    }
  }

  function discoverRandomCountry() {
    const keys = Object.keys(COUNTRIES_DATABASE);
    const available = keys.filter((k) => k !== state.selectedCountryName);
    const pick =
      available[Math.floor(Math.random() * available.length)] || keys[0];
    selectCountry(pick);
  }

  function resetGlobeView() {
    closeLandmarkModal();
    closeCountryPanel();
    const currentDir = state.camera.position.clone().normalize();
    const latLng = vector3ToLatLng(
      currentDir.clone().multiplyScalar(GLOBE_RADIUS),
      GLOBE_RADIUS
    );
    animateCameraTo(latLng.lat, latLng.lng, DEFAULT_CAMERA_DISTANCE, 900);
    setTimeout(() => {
      state.autoRotate = true;
      state.controls.autoRotate = true;
      updateAutoRotateButtonUI();
    }, 920);
  }

  function initUIEvents() {
    const canvasContainer = document.getElementById('globe-canvas-container');
    canvasContainer.addEventListener('pointermove', handlePointerMove);
    canvasContainer.addEventListener('pointerdown', handlePointerDown);
    canvasContainer.addEventListener('pointerup', handlePointerUp);
    canvasContainer.addEventListener('pointerleave', clearHoverState);

    // Search Input & Dropdown
    const searchInput = document.getElementById('country-search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    const dropdown = document.getElementById('search-results-dropdown');

    function renderSearchDropdown(query) {
      const q = query.trim().toLowerCase();
      clearBtn.classList.toggle('visible', q.length > 0);

      const allCountries = getAllSearchableCountries();
      const filtered = q
        ? allCountries.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.capital.toLowerCase().includes(q) ||
              c.region.toLowerCase().includes(q)
          )
        : allCountries.slice(0, 10);

      if (filtered.length === 0) {
        dropdown.innerHTML = `
          <div class="search-result-item">
            <span class="search-result-name">No matching countries found</span>
          </div>
        `;
        dropdown.classList.add('open');
        return;
      }

      dropdown.innerHTML = '';
      filtered.slice(0, 12).forEach((item) => {
        const row = document.createElement('div');
        row.className = 'search-result-item';
        row.innerHTML = `
          <div class="search-result-main">
            <span class="search-result-flag">${item.flag}</span>
            <div>
              <div class="search-result-name">${item.name}</div>
              <div class="search-result-capital">${item.capital} · ${item.region}</div>
            </div>
          </div>
          <span class="search-result-badge">${item.featured ? '5 Landmarks' : 'Explore'}</span>
        `;
        row.addEventListener('click', () => {
          searchInput.value = item.name;
          clearBtn.classList.add('visible');
          dropdown.classList.remove('open');
          selectCountry(item.name);
        });
        dropdown.appendChild(row);
      });

      dropdown.classList.add('open');
    }

    searchInput.addEventListener('focus', () => {
      renderSearchDropdown(searchInput.value);
    });

    searchInput.addEventListener('input', () => {
      renderSearchDropdown(searchInput.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim().toLowerCase();
        if (!q) return;
        const match = getAllSearchableCountries().find(
          (c) =>
            c.name.toLowerCase() === q ||
            c.name.toLowerCase().startsWith(q) ||
            c.name.toLowerCase().includes(q)
        );
        if (match) {
          searchInput.value = match.name;
          dropdown.classList.remove('open');
          selectCountry(match.name);
        }
      } else if (e.key === 'Escape') {
        dropdown.classList.remove('open');
      }
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.classList.remove('visible');
      dropdown.classList.remove('open');
      searchInput.focus();
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrapper')) {
        dropdown.classList.remove('open');
      }
    });

    // Top Nav Buttons
    document
      .getElementById('random-country-btn')
      .addEventListener('click', discoverRandomCountry);

    document
      .getElementById('toggle-rotate-btn')
      .addEventListener('click', () => {
        state.autoRotate = !state.autoRotate;
        state.controls.autoRotate = state.autoRotate;
        updateAutoRotateButtonUI();
      });

    document
      .getElementById('toggle-borders-btn')
      .addEventListener('click', (e) => {
        state.showBorders = !state.showBorders;
        if (state.bordersMesh) {
          state.bordersMesh.visible = state.showBorders;
        }
        e.currentTarget.classList.toggle('active-toggle', state.showBorders);
      });

    // Popular Destinations Collapse Toggle
    const popularStrip = document.getElementById('popular-strip');
    const popularToggleBtn = document.getElementById('popular-toggle-btn');
    popularToggleBtn.addEventListener('click', () => {
      const collapsed = popularStrip.classList.toggle('collapsed');
      popularToggleBtn.textContent = collapsed ? 'Expand' : 'Hide';
    });

    // Country Panel Close Button
    document
      .getElementById('panel-close-btn')
      .addEventListener('click', closeCountryPanel);

    // Bottom HUD Zoom & Reset Controls
    document.getElementById('zoom-in-btn').addEventListener('click', () => {
      const dist = Math.max(132, state.camera.position.length() * 0.84);
      state.camera.position.setLength(dist);
    });

    document.getElementById('zoom-out-btn').addEventListener('click', () => {
      const dist = Math.min(410, state.camera.position.length() * 1.18);
      state.camera.position.setLength(dist);
    });

    document
      .getElementById('reset-globe-btn')
      .addEventListener('click', resetGlobeView);

    // Landmark Detail Modal Events
    document
      .getElementById('modal-close-btn')
      .addEventListener('click', closeLandmarkModal);

    document
      .getElementById('landmark-modal-backdrop')
      .addEventListener('click', (e) => {
        if (e.target.id === 'landmark-modal-backdrop') {
          closeLandmarkModal();
        }
      });

    document.getElementById('modal-fly-btn').addEventListener('click', () => {
      if (state.activeModalLandmark) {
        const { landmark } = state.activeModalLandmark;
        animateCameraTo(landmark.lat, landmark.lng, 142, 950);
        closeLandmarkModal();
      }
    });

    // Window Resize Handler
    window.addEventListener('resize', () => {
      const width = canvasContainer.clientWidth || window.innerWidth;
      const height = canvasContainer.clientHeight || window.innerHeight;
      state.camera.aspect = width / height;
      state.camera.updateProjectionMatrix();
      state.renderer.setSize(width, height);
    });
  }

  /* ==========================================================================
     17. ANIMATION LOOP & INITIALIZATION SEQUENCE
     ========================================================================== */

  function setLoadingProgress(percent, statusText) {
    const bar = document.getElementById('loader-progress-bar');
    const status = document.getElementById('loader-status-text');
    if (bar) bar.style.width = `${percent}%`;
    if (status && statusText) status.textContent = statusText;
  }

  function animate(now) {
    requestAnimationFrame(animate);

    // Smooth camera fly-to transitions
    updateCameraAnimation(now);

    // Subtle starfield drift
    if (state.starfield) {
      state.starfield.rotation.y += 0.00012;
    }

    // Pulse animation on 3D landmark surface rings
    if (state.landmarkMarkersGroup.children.length > 0) {
      const pulseScale = 1 + 0.32 * Math.sin(now * 0.0045);
      state.landmarkMarkersGroup.children.forEach((holder) => {
        holder.children.forEach((child) => {
          if (child.userData && child.userData.isPulseRing) {
            child.scale.set(pulseScale, pulseScale, 1);
          }
        });
      });
    }

    state.controls.update();
    state.renderer.render(state.scene, state.camera);
  }

  async function initWorldExplorer() {
    try {
      setLoadingProgress(25, 'Initializing 3D WebGL scene & shaders...');
      initScene();
      createEarthAndAtmosphere();

      await loadGeographicBoundaries();
      populatePopularDestinationsRail();
      initUIEvents();
      updateAutoRotateButtonUI();

      setLoadingProgress(100, 'Ready to explore Earth.');
      animate(performance.now());

      setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        if (loader) loader.classList.add('hidden');
      }, 380);
    } catch (error) {
      console.error('Initialization recovery triggered:', error);
      const loader = document.getElementById('loading-screen');
      if (loader) loader.classList.add('hidden');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorldExplorer);
  } else {
    initWorldExplorer();
  }
})();
