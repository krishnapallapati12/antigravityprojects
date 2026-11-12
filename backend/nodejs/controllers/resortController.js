/**
 * Resorts & Hyderabad Catalog Controller (MakeMyTrip Inspired)
 */
const RESORTS_DATA = [
  {
    id: "resort-jkr-100",
    name: "Jai Krishna Ram Farmhouse & 100-Acre Sanctuary",
    tagline: "Exclusive 100-Acre Private Luxury Farmhouse & Agritourism Sanctuary",
    slug: "jaikrishnaram-farmhouse-hyderabad",
    location: "HITEC City / Madhapur Corridor, Hyderabad",
    distanceFromHitecCity: "12 - 15 Mins",
    distanceFromAirport: "35 Mins via ORR",
    acreage: 100,
    baseWeekendPrice: 500000,
    rating: 4.95,
    reviewCount: 1420,
    starCategory: 5,
    propertyType: "LUXURY_FARMHOUSE",
    heroImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    usps: [
      "100 Acres Private Buyout (Only 1 group per weekend)",
      "50-Acre Buffalo Sanctuary with 500 Buffalos & Organic A2 Dairy Tasting",
      "Private Heated Swimming Pool & Natural Rock Waterfalls",
      "25+ Acres Blooming Flower Meadows",
      "24/7 Armed Security & Concierge Service"
    ]
  },
  {
    id: "resort-golkonda-hyd",
    name: "The Golkonda Resorts & Spa",
    tagline: "Lakeside Luxury Villas & Tropical Haven",
    slug: "golkonda-resorts-hyderabad",
    location: "Gandipet / Osman Sagar, Hyderabad",
    distanceFromHitecCity: "25 Mins",
    distanceFromAirport: "30 Mins via ORR",
    acreage: 13,
    baseWeekendPrice: 24000,
    rating: 4.3,
    reviewCount: 3120,
    starCategory: 5,
    propertyType: "HERITAGE_RESORT",
    heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    usps: ["Lakeside views", "Fine dining", "Full service spa"]
  },
  {
    id: "resort-pragati-hyd",
    name: "Pragati Green Resorts",
    tagline: "Eco Agritourism Resort & Herbal Nature Sanctuary",
    slug: "pragati-resorts-hyderabad",
    location: "Chilkur / Shankarpally, Hyderabad",
    distanceFromHitecCity: "40 Mins",
    distanceFromAirport: "45 Mins",
    acreage: 85,
    baseWeekendPrice: 18500,
    rating: 4.1,
    reviewCount: 2890,
    starCategory: 4,
    propertyType: "AGRITOURISM_SANCTUARY",
    heroImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    usps: ["Herbal plantations", "Waterpark", "Golf driving range"]
  }
];

exports.getResorts = (req, res) => {
  const { propertyType, minRating } = req.query;
  let results = [...RESORTS_DATA];

  if (propertyType) {
    results = results.filter(r => r.propertyType === propertyType);
  }
  if (minRating) {
    results = results.filter(r => r.rating >= Number(minRating));
  }

  res.json({ success: true, count: results.length, data: results });
};

exports.getResortById = (req, res) => {
  const resort = RESORTS_DATA.find(r => r.id === req.params.id);
  if (!resort) {
    return res.status(404).json({ success: false, message: "Resort not found" });
  }
  res.json({ success: true, data: resort });
};

