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

  // Caribbean
  'jamaica': [18.1096, -77.2975],
  'bahamas': [25.0343, -77.3963],
  'cancun': [21.1619, -86.8515],
  'mexico': [19.4326, -99.1332],
  'mexico city': [19.4326, -99.1332],
  'cabo': [22.8905, -109.9167],
  'cabo san lucas': [22.8905, -109.9167],
  'aruba': [12.5211, -69.9683],
  'turks and caicos': [21.6940, -71.7979],
  'barbados': [13.1939, -59.5432],
  'puerto rico': [18.2208, -66.5901],
  'dominican republic': [18.7357, -70.1627],
  'punta cana': [18.5601, -68.3725],

  // Africa
  'cairo': [30.0444, 31.2357],
  'marrakech': [31.6295, -7.9811],
  'cape town': [-33.9249, 18.4241],
  'south africa': [-33.9249, 18.4241],
  'nairobi': [-1.2864, 36.8172],
  'johannesburg': [-26.2041, 28.0473],

  // South America
  'rio de janeiro': [-22.9068, -43.1729],
  'sao paulo': [-23.5505, -46.6333],
  'buenos aires': [-34.6037, -58.3816],
  'lima': [-12.0464, -77.0428],
  'bogota': [4.7110, -74.0721],
  'santiago': [-33.4489, -70.6693],

  // Oceania
  'sydney': [-33.8688, 151.2093],
  'melbourne': [-37.8136, 144.9631],
  'auckland': [-36.8485, 174.7633],
  'fiji': [-17.7134, 178.0650],
  'bora bora': [-16.5004, -151.7414],
  'tahiti': [-17.6509, -149.4260],

  // Canada
  'toronto': [43.6532, -79.3832],
  'vancouver': [49.2827, -123.1207],
  'montreal': [45.5017, -73.5673],
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
