// Geocoding utility to convert destination names to coordinates

// Common destination coordinates database
const destinationCoordinates = {
  // United States
  'new york': [40.7128, -74.0060],
  'new york city': [40.7128, -74.0060],
  'nyc': [40.7128, -74.0060],
  'los angeles': [34.0522, -118.2437],
  'la': [34.0522, -118.2437],
  'chicago': [41.8781, -87.6298],
  'miami': [25.7617, -80.1918],
  'las vegas': [36.1699, -115.1398],
  'orlando': [28.5383, -81.3792],
  'san francisco': [37.7749, -122.4194],
  'seattle': [47.6062, -122.3321],
  'boston': [42.3601, -71.0589],
  'washington dc': [38.9072, -77.0369],
  'atlanta': [33.7490, -84.3880],
  'houston': [29.7604, -95.3698],
  'dallas': [32.7767, -96.7970],
  'denver': [39.7392, -104.9903],
  'phoenix': [33.4484, -112.0740],
  'nashville': [36.1627, -86.7816],
  'new orleans': [29.9511, -90.0715],
  'austin': [30.2672, -97.7431],
  'portland': [45.5152, -122.6784],
  'san diego': [32.7157, -117.1611],
  'hawaii': [21.3099, -157.8581],
  'honolulu': [21.3099, -157.8581],
  'charleston': [32.7765, -79.9311],
  'savannah': [32.0809, -81.0912],
  'key west': [24.5551, -81.7800],
  'santa fe': [35.6870, -105.9378],
  'aspen': [39.1911, -106.8175],
  'park city': [40.6461, -111.4980],
  'napa': [38.2975, -122.2869],
  'sonoma': [38.2919, -122.4580],
  'santa barbara': [34.4208, -119.6982],
  'malibu': [34.0259, -118.7798],
  'big sur': [36.2704, -121.8054],
  'jackson hole': [43.4799, -110.7624],
  'sedona': [34.8697, -111.7610],
  'santa monica': [34.0195, -118.4912],
  'memphis': [35.1495, -90.0490],
  'minneapolis': [44.9778, -93.2650],
  'salt lake city': [40.7608, -111.8910],
  'tampa': [27.9506, -82.4572],
  'fort lauderdale': [26.1224, -80.1373],
  'palm springs': [33.8303, -116.5453],
  'san antonio': [29.4241, -98.4936],
  'philadelphia': [39.9526, -75.1652],
  'pittsburgh': [40.4406, -79.9959],
  'cleveland': [41.4993, -81.6944],

  // International - Europe
  'london': [51.5074, -0.1278],
  'paris': [48.8566, 2.3522],
  'rome': [41.9028, 12.4964],
  'barcelona': [41.3851, 2.1734],
  'amsterdam': [52.3676, 4.9041],
  'berlin': [52.5200, 13.4050],
  'madrid': [40.4168, -3.7038],
  'vienna': [48.2082, 16.3738],
  'prague': [50.0755, 14.4378],
  'dublin': [53.3498, -6.2603],
  'lisbon': [38.7223, -9.1393],
  'athens': [37.9838, 23.7275],
  'istanbul': [41.0082, 28.9784],
  'budapest': [47.4979, 19.0402],
  'copenhagen': [55.6761, 12.5683],
  'stockholm': [59.3293, 18.0686],
  'oslo': [59.9139, 10.7522],
  'zurich': [47.3769, 8.5417],
  'munich': [48.1351, 11.5820],
  'venice': [45.4408, 12.3155],
  'florence': [43.7696, 11.2558],
  'milan': [45.4642, 9.1900],
  'edinburgh': [55.9533, -3.1883],
  'belgrade': [44.7866, 20.4489],
  'bucharest': [44.4268, 26.1025],
  'sofia': [42.6977, 23.3219],
  'bansko': [41.8350, 23.4883],
  'bulgaria': [42.6977, 23.3219],
  'santorini': [36.3932, 25.4615],
  'mykonos': [37.4467, 25.3289],
  'crete': [35.2401, 24.8093],
  'nice': [43.7102, 7.2620],
  'monaco': [43.7384, 7.4246],
  'cannes': [43.5528, 7.0174],
  'amalfi': [40.6340, 14.6027],
  'positano': [40.6280, 14.4850],
  'cinque terre': [44.1275, 9.7125],
  'naples': [40.8518, 14.2681],
  'seville': [37.3891, -5.9845],
  'valencia': [39.4699, -0.3763],
  'ibiza': [38.9067, 1.4206],
  'mallorca': [39.6953, 3.0176],
  'dubrovnik': [42.6507, 18.0944],
  'split': [43.5081, 16.4402],
  'croatia': [45.1, 15.2],
  'reykjavik': [64.1466, -21.9426],
  'iceland': [64.9631, -19.0208],
  'krakow': [50.0647, 19.9450],
  'warsaw': [52.2297, 21.0122],
  'tallinn': [59.4370, 24.7536],
  'riga': [56.9496, 24.1052],
  'vilnius': [54.6872, 25.2797],
  'helsinki': [60.1699, 24.9384],
  'bruges': [51.2093, 3.2247],
  'brussels': [50.8503, 4.3517],
  'luxembourg': [49.6116, 6.1319],
  'geneva': [46.2044, 6.1432],
  'interlaken': [46.6863, 7.8632],
  'salzburg': [47.8095, 13.0550],
  'innsbruck': [47.2692, 11.4041],

  // Asia
  'tokyo': [35.6762, 139.6503],
  'beijing': [39.9042, 116.4074],
  'shanghai': [31.2304, 121.4737],
  'hong kong': [22.3193, 114.1694],
  'singapore': [1.3521, 103.8198],
  'bangkok': [13.7563, 100.5018],
  'dubai': [25.2048, 55.2708],
  'seoul': [37.5665, 126.9780],
  'taipei': [25.0330, 121.5654],
  'mumbai': [19.0760, 72.8777],
  'delhi': [28.7041, 77.1025],
  'bali': [-8.3405, 115.0920],
  'phuket': [7.8804, 98.3923],
  'kuala lumpur': [3.1390, 101.6869],
  'manila': [14.5995, 120.9842],
  'hanoi': [21.0285, 105.8542],
  'ho chi minh': [10.8231, 106.6297],
  'kyoto': [35.0116, 135.7681],
  'osaka': [34.6937, 135.5023],
  'vietnam': [21.0285, 105.8542],
  'thailand': [13.7563, 100.5018],
  'indonesia': [-8.3405, 115.0920],
  'chiang mai': [18.7883, 98.9853],
  'krabi': [8.0863, 98.9063],
  'koh samui': [9.5137, 100.0132],
  'ubud': [-8.5069, 115.2625],
  'lombok': [-8.6500, 116.3242],
  'maldives': [3.2028, 73.2207],
  'seychelles': [-4.6796, 55.4920],
  'goa': [15.2993, 74.1240],
  'jaipur': [26.9124, 75.7873],
  'agra': [27.1767, 78.0081],
  'kathmandu': [27.7172, 85.3240],
  'bhutan': [27.5142, 90.4336],
  'sri lanka': [7.8731, 80.7718],
  'colombo': [6.9271, 79.8612],
  'laos': [19.8563, 102.4955],
  'cambodia': [12.5657, 104.9910],
  'siem reap': [13.3671, 103.8448],
  'angkor wat': [13.4125, 103.8670],
  'myanmar': [21.9162, 95.9560],
  'abu dhabi': [24.4539, 54.3773],
  'doha': [25.2854, 51.5310],
  'qatar': [25.3548, 51.1839],
  'muscat': [23.5880, 58.3829],
  'oman': [21.4735, 55.9754],
  'tel aviv': [32.0853, 34.7818],
  'jerusalem': [31.7683, 35.2137],
  'petra': [30.3285, 35.4444],
  'jordan': [30.5852, 36.2384],

  // Caribbean
  'jamaica': [18.1096, -77.2975],
  'bahamas': [25.0343, -77.3963],
  'nassau': [25.0443, -77.3504],
  'cancun': [21.1619, -86.8515],
  'mexico': [19.4326, -99.1332],
  'mexico city': [19.4326, -99.1332],
  'cabo': [22.8905, -109.9167],
  'cabo san lucas': [22.8905, -109.9167],
  'playa del carmen': [20.6296, -87.0739],
  'tulum': [20.2114, -87.4654],
  'aruba': [12.5211, -69.9683],
  'turks and caicos': [21.6940, -71.7979],
  'barbados': [13.1939, -59.5432],
  'puerto rico': [18.2208, -66.5901],
  'san juan': [18.4655, -66.1057],
  'dominican republic': [18.7357, -70.1627],
  'punta cana': [18.5601, -68.3725],
  'santo domingo': [18.4861, -69.9312],
  'st lucia': [13.9094, -60.9789],
  'antigua': [17.0608, -61.7964],
  'grenada': [12.1165, -61.6790],
  'cayman islands': [19.3133, -81.2546],
  'belize': [17.1899, -88.4976],
  'costa rica': [9.7489, -83.7534],
  'panama': [8.5380, -80.7821],
  'cartagena': [10.3910, -75.4794],
  'st martin': [18.0179, -63.0529],
  'curacao': [12.1224, -68.8824],
  'trinidad': [10.6918, -61.2225],
  'martinique': [14.6415, -61.0242],

  // Africa
  'cairo': [30.0444, 31.2357],
  'egypt': [30.0444, 31.2357],
  'luxor': [25.6872, 32.6396],
  'marrakech': [31.6295, -7.9811],
  'morocco': [31.7917, -7.0926],
  'casablanca': [33.5731, -7.5898],
  'fez': [34.0181, -5.0078],
  'cape town': [-33.9249, 18.4241],
  'south africa': [-33.9249, 18.4241],
  'johannesburg': [-26.2041, 28.0473],
  'durban': [-29.8587, 31.0218],
  'victoria falls': [-17.9243, 25.8572],
  'kruger': [-23.9884, 31.5547],
  'nairobi': [-1.2864, 36.8172],
  'kenya': [-0.0236, 37.9062],
  'tanzania': [-6.3690, 34.8888],
  'zanzibar': [-6.1659, 39.2026],
  'serengeti': [-2.3333, 34.8333],
  'kilimanjaro': [-3.0674, 37.3556],
  'botswana': [-22.3285, 24.6849],
  'namibia': [-22.5597, 17.0832],
  'tunisia': [36.8065, 10.1815],
  'ghana': [7.9465, -1.0232],
  'senegal': [14.4974, -14.4524],
  'ethiopia': [9.1450, 40.4897],
  'rwanda': [-1.9403, 29.8739],
  'madagascar': [-18.7669, 46.8691],
  'mauritius': [-20.1609, 57.5012],

  // South America
  'rio de janeiro': [-22.9068, -43.1729],
  'sao paulo': [-23.5505, -46.6333],
  'brazil': [-14.2350, -51.9253],
  'buenos aires': [-34.6037, -58.3816],
  'argentina': [-38.4161, -63.6167],
  'lima': [-12.0464, -77.0428],
  'peru': [-9.1900, -75.0152],
  'machu picchu': [-13.1631, -72.5450],
  'cusco': [-13.5319, -71.9675],
  'bogota': [4.7110, -74.0721],
  'colombia': [4.5709, -74.2973],
  'medellin': [6.2476, -75.5658],
  'santiago': [-33.4489, -70.6693],
  'chile': [-35.6751, -71.5430],
  'patagonia': [-49.3229, -72.9301],
  'ecuador': [-1.8312, -78.1834],
  'quito': [-0.1807, -78.4678],
  'galapagos': [-0.9538, -90.9656],
  'venezuela': [6.4238, -66.5897],
  'uruguay': [-32.5228, -55.7658],
  'montevideo': [-34.9011, -56.1645],
  'bolivia': [-16.2902, -63.5887],
  'la paz': [-16.5000, -68.1500],

  // Oceania
  'sydney': [-33.8688, 151.2093],
  'melbourne': [-37.8136, 144.9631],
  'australia': [-25.2744, 133.7751],
  'brisbane': [-27.4698, 153.0251],
  'perth': [-31.9505, 115.8605],
  'cairns': [-16.9186, 145.7781],
  'gold coast': [-28.0167, 153.4000],
  'great barrier reef': [-18.2871, 147.6992],
  'auckland': [-36.8485, 174.7633],
  'new zealand': [-40.9006, 174.8860],
  'queenstown': [-45.0312, 168.6626],
  'wellington': [-41.2865, 174.7762],
  'christchurch': [-43.5321, 172.6362],
  'fiji': [-17.7134, 178.0650],
  'bora bora': [-16.5004, -151.7414],
  'tahiti': [-17.6509, -149.4260],
  'samoa': [-13.7590, -172.1046],
  'tonga': [-21.1789, -175.1982],
  'cook islands': [-21.2367, -159.7777],
  'french polynesia': [-17.6797, -149.4068],
  'new caledonia': [-20.9043, 165.6180],
  'vanuatu': [-15.3767, 166.9592],
  'papua new guinea': [-6.3150, 143.9555],
  'palau': [7.5150, 134.5825],
  'guam': [13.4443, 144.7937],

  // Canada
  'toronto': [43.6532, -79.3832],
  'vancouver': [49.2827, -123.1207],
  'montreal': [45.5017, -73.5673],
  'canada': [56.1304, -106.3468],
  'calgary': [51.0447, -114.0719],
  'ottawa': [45.4215, -75.6972],
  'quebec city': [46.8139, -71.2080],
  'banff': [51.1784, -115.5708],
  'whistler': [50.1163, -122.9574],
  'niagara falls': [43.0896, -79.0849],
  'victoria': [48.4284, -123.3656],
  'halifax': [44.6488, -63.5752],
};

// Timezone mapping for destinations
const destinationTimezones = {
  // United States
  'new york': 'America/New_York', 'new york city': 'America/New_York', 'nyc': 'America/New_York',
  'los angeles': 'America/Los_Angeles', 'la': 'America/Los_Angeles', 'san francisco': 'America/Los_Angeles',
  'seattle': 'America/Los_Angeles', 'san diego': 'America/Los_Angeles', 'portland': 'America/Los_Angeles',
  'chicago': 'America/Chicago', 'dallas': 'America/Chicago', 'houston': 'America/Chicago',
  'austin': 'America/Chicago', 'nashville': 'America/Chicago', 'new orleans': 'America/Chicago',
  'miami': 'America/New_York', 'orlando': 'America/New_York', 'boston': 'America/New_York',
  'washington dc': 'America/New_York', 'atlanta': 'America/New_York',
  'las vegas': 'America/Los_Angeles', 'denver': 'America/Denver', 'phoenix': 'America/Phoenix',
  'hawaii': 'Pacific/Honolulu', 'honolulu': 'Pacific/Honolulu',

  // Europe
  'london': 'Europe/London', 'paris': 'Europe/Paris', 'rome': 'Europe/Rome', 'barcelona': 'Europe/Madrid',
  'madrid': 'Europe/Madrid', 'berlin': 'Europe/Berlin', 'amsterdam': 'Europe/Amsterdam',
  'vienna': 'Europe/Vienna', 'prague': 'Europe/Prague', 'budapest': 'Europe/Budapest',
  'athens': 'Europe/Athens', 'dublin': 'Europe/Dublin', 'lisbon': 'Europe/Lisbon',
  'copenhagen': 'Europe/Copenhagen', 'stockholm': 'Europe/Stockholm', 'oslo': 'Europe/Oslo',
  'helsinki': 'Europe/Helsinki', 'zurich': 'Europe/Zurich', 'switzerland': 'Europe/Zurich',
  'geneva': 'Europe/Zurich', 'brussels': 'Europe/Brussels', 'venice': 'Europe/Rome',
  'florence': 'Europe/Rome', 'milan': 'Europe/Rome', 'munich': 'Europe/Berlin',
  'edinburgh': 'Europe/London', 'warsaw': 'Europe/Warsaw', 'krakow': 'Europe/Warsaw',
  'reykjavik': 'Atlantic/Reykjavik', 'iceland': 'Atlantic/Reykjavik', 'norway': 'Europe/Oslo',
  'belgrade': 'Europe/Belgrade', 'bucharest': 'Europe/Bucharest', 'sofia': 'Europe/Sofia',
  'bansko': 'Europe/Sofia', 'bulgaria': 'Europe/Sofia',

  // Middle East & Africa
  'dubai': 'Asia/Dubai', 'abu dhabi': 'Asia/Dubai', 'istanbul': 'Europe/Istanbul',
  'cairo': 'Africa/Cairo', 'marrakech': 'Africa/Casablanca', 'cape town': 'Africa/Johannesburg',
  'south africa': 'Africa/Johannesburg', 'johannesburg': 'Africa/Johannesburg', 'nairobi': 'Africa/Nairobi',
  'tel aviv': 'Asia/Jerusalem',

  // Asia
  'tokyo': 'Asia/Tokyo', 'japan': 'Asia/Tokyo', 'osaka': 'Asia/Tokyo', 'kyoto': 'Asia/Tokyo',
  'beijing': 'Asia/Shanghai', 'shanghai': 'Asia/Shanghai', 'hong kong': 'Asia/Hong_Kong',
  'singapore': 'Asia/Singapore', 'bangkok': 'Asia/Bangkok', 'bangkok': 'Asia/Bangkok',
  'seoul': 'Asia/Seoul', 'taipei': 'Asia/Taipei', 'hanoi': 'Asia/Ho_Chi_Minh',
  'ho chi minh': 'Asia/Ho_Chi_Minh', 'kuala lumpur': 'Asia/Kuala_Lumpur', 'jakarta': 'Asia/Jakarta',
  'manila': 'Asia/Manila', 'bali': 'Asia/Makassar', 'mumbai': 'Asia/Kolkata',
  'delhi': 'Asia/Kolkata', 'bangalore': 'Asia/Kolkata', 'kathmandu': 'Asia/Kathmandu',

  // Caribbean
  'turks and caicos': 'America/Grand_Turk', 'jamaica': 'America/Jamaica', 'barbados': 'America/Barbados',
  'bahamas': 'America/Nassau', 'aruba': 'America/Aruba', 'cancun': 'America/Cancun',
  'mexico city': 'America/Mexico_City', 'cabo san lucas': 'America/Mazatlan',

  // South America
  'rio de janeiro': 'America/Sao_Paulo', 'sao paulo': 'America/Sao_Paulo',
  'buenos aires': 'America/Argentina/Buenos_Aires', 'lima': 'America/Lima',
  'bogota': 'America/Bogota', 'santiago': 'America/Santiago',

  // Oceania
  'sydney': 'Australia/Sydney', 'melbourne': 'Australia/Melbourne', 'auckland': 'Pacific/Auckland',
  'fiji': 'Pacific/Fiji', 'bora bora': 'Pacific/Tahiti', 'tahiti': 'Pacific/Tahiti',

  // Canada
  'toronto': 'America/Toronto', 'vancouver': 'America/Vancouver', 'montreal': 'America/Toronto',
};

// Normalize destination string for lookup
const normalizeDestination = (destination) => {
  if (!destination) return '';
  return destination.toLowerCase().trim();
};

// Get coordinates for a destination
export const getCoordinates = (destination) => {
  const normalized = normalizeDestination(destination);

  // If no destination provided, return null
  if (!normalized) {
    console.warn('No destination provided for geocoding');
    return null;
  }

  console.log(`Looking up coordinates for: "${destination}" (normalized: "${normalized}")`);

  // Direct lookup
  if (destinationCoordinates[normalized]) {
    console.log(`✓ Found exact match for "${normalized}"`);
    return destinationCoordinates[normalized];
  }

  // Try to match partial strings (e.g., "Tokyo, Japan" -> "tokyo")
  for (const [key, coords] of Object.entries(destinationCoordinates)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      console.log(`✓ Found partial match: "${normalized}" matched with "${key}"`);
      return coords;
    }
  }

  // Log if destination not found
  console.warn(`❌ Destination "${destination}" not found in geocoding database. Tried: "${normalized}"`);
  console.warn(`Available destinations include: ${Object.keys(destinationCoordinates).slice(0, 15).join(', ')}...`);
  return null;
};

// Get all trip locations with coordinates
export const getTripLocations = (trips) => {
  return trips
    .map(trip => {
      if (!trip.destination) {
        console.warn(`Trip "${trip.name}" has no destination set. Cannot show on map.`);
        return null;
      }

      const coords = getCoordinates(trip.destination);
      if (!coords) {
        console.warn(`Could not find coordinates for trip "${trip.name}" with destination "${trip.destination}"`);
        return null;
      }

      console.log(`✓ Mapped trip "${trip.name}" to ${trip.destination} at [${coords[0]}, ${coords[1]}]`);

      return {
        id: trip.id,
        name: trip.name,
        destination: trip.destination,
        coordinates: coords,
        startDate: trip.startDate,
        endDate: trip.endDate,
        status: getTripStatus(trip),
      };
    })
    .filter(location => location !== null);
};

// Helper to determine trip status
const getTripStatus = (trip) => {
  const now = new Date();
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);

  if (startDate > now) return 'upcoming';
  if (endDate < now) return 'completed';
  return 'active';
};

// Add a custom destination coordinate (for destinations not in the database)
export const addCustomDestination = (name, latitude, longitude) => {
  const normalized = normalizeDestination(name);
  destinationCoordinates[normalized] = [latitude, longitude];
};

// Get timezone for a destination
export const getTimezone = (destination) => {
  const normalized = normalizeDestination(destination);

  // Direct lookup
  if (destinationTimezones[normalized]) {
    return destinationTimezones[normalized];
  }

  // Try to match partial strings
  for (const [key, timezone] of Object.entries(destinationTimezones)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return timezone;
    }
  }

  return null;
};

// Get local time for a destination
export const getLocalTime = (destination) => {
  const timezone = getTimezone(destination);
  if (!timezone) return null;

  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return formatter.format(now);
  } catch (error) {
    console.error('Error formatting time:', error);
    return null;
  }
};

// Get timezone offset string (e.g., "GMT+9")
export const getTimezoneOffset = (destination) => {
  const timezone = getTimezone(destination);
  if (!timezone) return null;

  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(now);
    const tzPart = parts.find(part => part.type === 'timeZoneName');
    return tzPart ? tzPart.value : null;
  } catch (error) {
    console.error('Error getting timezone offset:', error);
    return null;
  }
};
