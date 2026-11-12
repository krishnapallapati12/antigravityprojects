const express = require("express");
const router = express.Router();

const REVIEWS = [
  {
    id: "rev-1",
    guestName: "Siddharth Rao",
    guestTitle: "Vice President, Enterprise Cloud (HITEC City Tech Major)",
    rating: 5.0,
    cleanliness: 5.0,
    hospitality: 5.0,
    food: 4.9,
    location: 5.0,
    value: 4.9,
    title: "Unmatched 100-Acre Sanctuary 15 Mins from Cyber Towers",
    text: "We leased the HITEC 100 estate for our annual leadership offsite of 40 directors. Having 100 acres completely to ourselves 15 minutes from Cyber Towers was unreal. The swimming pool, the waterfall sound, and the buffalo safari tour blew everyone away. Worth every rupee of the ₹5 Lakhs fee!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    verifiedStay: true
  },
  {
    id: "rev-2",
    guestName: "Ananya & Rohan Kulkarni",
    guestTitle: "Pre-Wedding Destination Hosts (Banjara Hills)",
    rating: 5.0,
    cleanliness: 5.0,
    hospitality: 5.0,
    food: 5.0,
    location: 5.0,
    value: 5.0,
    title: "Dream Destination for Pre-Wedding & 4K Drone Shoot",
    text: "We shot our pre-wedding cinematic video here. The combination of the modern luxury mansion with the rock waterfall and 25 acres of blooming flowers gave us shots that look like Tuscany and Bali combined! Our guests loved the Saturday night pool bonfire.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    verifiedStay: true
  },
  {
    id: "rev-3",
    guestName: "Dr. K. Ramachandra Murthy",
    guestTitle: "Industrialist & Agricultural Connoisseur",
    rating: 5.0,
    cleanliness: 5.0,
    hospitality: 5.0,
    food: 4.8,
    location: 5.0,
    value: 4.8,
    title: "A True Agritourism Marvel in Hyderabad",
    text: "As someone passionate about Indian livestock, seeing 500 Murrah buffalos housed with such immaculate hygiene, 10 acres of fresh green fodder, and paved roads is world-class. It is an agritourism triumph right in Hyderabad.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    verifiedStay: true
  }
];

router.get("/", (req, res) => {
  res.json({ success: true, count: REVIEWS.length, data: REVIEWS });
});

module.exports = router;

