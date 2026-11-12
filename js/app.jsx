// HITEC 100 Luxury Farmhouse & Agritourism React Application
const { useState, useEffect, useRef } = React;

function App() {
  const data = window.ESTATE_DATA;
  const [activeTab, setActiveTab] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeReel, setActiveReel] = useState(null);
  const [threeMode, setThreeMode] = useState("overview");
  const [timeOfDay, setTimeOfDay] = useState("day");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [guestCount, setGuestCount] = useState(15);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "Corporate Tech Offsite",
    notes: ""
  });

  const threeInstanceRef = useRef(null);
  const soundscapeRef = useRef(null);

  // Initialize 3D Engine and Soundscape
  useEffect(() => {
    document.title = "jaikrishnaram.formhouse.com";

    // Initialize 3D Experience after DOM paints
    const initTimer = setTimeout(() => {
      if (window.Estate3DExperience && !threeInstanceRef.current) {
        threeInstanceRef.current = new window.Estate3DExperience("three-canvas-container");
      }
    }, 120);

    // Initialize Nature Soundscape
    if (window.NatureSoundscape && !soundscapeRef.current) {
      soundscapeRef.current = new window.NatureSoundscape();
    }

    // Default next available Saturday date
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
    let daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    if (daysUntilSaturday === 0) daysUntilSaturday = 7;
    const nextSat = new Date(today);
    nextSat.setDate(today.getDate() + daysUntilSaturday);
    const dateStr = nextSat.toISOString().split("T")[0];
    setBookingDate(dateStr);

    return () => {
      clearTimeout(initTimer);
      if (threeInstanceRef.current) {
        threeInstanceRef.current.destroy();
      }
      if (soundscapeRef.current) {
        soundscapeRef.current.stop();
      }
    };
  }, []);

  // Update 3D Camera View
  const handleViewChange = (mode) => {
    setThreeMode(mode);
    if (threeInstanceRef.current) {
      threeInstanceRef.current.setCameraMode(mode);
    }
  };

  // Update 3D Lighting (Day / Sunset / Night)
  const handleTimeChange = (time) => {
    setTimeOfDay(time);
    if (threeInstanceRef.current) {
      threeInstanceRef.current.setTimeOfDay(time);
    }
  };

  // Soundscape Toggle
  const toggleSoundscape = () => {
    if (soundscapeRef.current) {
      const playing = soundscapeRef.current.toggle();
      setIsAudioPlaying(playing);
    }
  };

  // Addon Toggle
  const toggleAddon = (id) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((item) => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  // Price Calculation
  const baseLeasePrice = data.leaseDetails.price;
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = data.leaseDetails.vipAddons.find((a) => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);
  const totalLeasePrice = baseLeasePrice + addonsTotal;

  // Form Submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please provide your name and phone number to reserve your weekend.");
      return;
    }

    const calculatedSummary = {
      ...formData,
      bookingDate,
      guestCount,
      addons: selectedAddons.map((id) => data.leaseDetails.vipAddons.find((a) => a.id === id)?.name),
      basePrice: baseLeasePrice,
      addonsPrice: addonsTotal,
      total: totalLeasePrice,
      reservationId: "JKR100-" + Math.floor(100000 + Math.random() * 900000)
    };

    setBookingSuccessModal(calculatedSummary);
  };

  // WhatsApp Concierge Link
  const openWhatsAppInquiry = () => {
    const msg = encodeURIComponent(
      `Hello Jai Krishna Ram Farmhouse Concierge (jaikrishnaram.formhouse.com)!\n\nI want to lease the 100-Acre Luxury Farmhouse for the weekend of ${bookingDate}.\n\n` +
      `👤 Name: ${formData.name || "Interested VIP Guest"}\n` +
      `👥 Estimated Guests: ${guestCount}\n` +
      `🎉 Event Type: ${formData.eventType}\n` +
      `💰 Estimated Lease Package: ₹${totalLeasePrice.toLocaleString("en-IN")}\n\n` +
      `Please provide availability confirmation and private tour details.`
    );
    window.open(`https://wa.me/${data.brand.whatsapp}?text=${msg}`, "_blank");
  };

  // Filtered Gallery Items
  const filteredGallery =
    activeTab === "all"
      ? data.gallery
      : data.gallery.filter((item) => item.category === activeTab);

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-slate-800 antialiased selection:bg-[#d4af37] selection:text-[#052617]">
      
      {/* 1. TOP URGENCY & DEMAND TICKER */}
      <div className="bg-gradient-to-r from-[#8b0000] via-[#052617] to-[#8b0000] text-[#f3e5ab] text-xs py-2 px-4 border-b border-[#d4af37]/30 flex flex-wrap items-center justify-between shadow-inner">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
          <span className="font-extrabold tracking-wide uppercase text-red-300">{data.urgency.badge}:</span>
          <span className="font-medium text-white">{data.urgency.message}</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs text-slate-300">
          <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
            👁️ {data.urgency.viewingCount}
          </span>
          <a href={`tel:${data.brand.phone}`} className="hover:text-white transition flex items-center gap-1 font-bold text-white">
            📞 VIP Concierge: {data.brand.phone}
          </a>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#062c19]/95 backdrop-blur-md border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8c6b12] flex items-center justify-center text-[#052617] shadow-lg shadow-[#d4af37]/20 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">🏰</span>
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-black tracking-wide block text-white group-hover:text-[#f3e5ab] transition">
                JAI KRISHNA RAM
              </span>
              <span className="text-[11px] tracking-wider text-[#d4af37] font-bold block lowercase">
                jaikrishnaram.formhouse.com
              </span>
            </div>
          </a>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-200">
            <a href="#about-100-acres" className="hover:text-[#d4af37] transition">The 100 Acres</a>
            <a href="#cinematic-videos" className="text-cyan-300 hover:text-cyan-200 transition flex items-center gap-1 font-semibold">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> 4K Drone Videos
            </a>
            <a href="#three-d-experience" className="hover:text-[#d4af37] transition flex items-center gap-1">
              <span>3D World Tour</span>
            </a>
            <a href="#farmhouse-pool" className="hover:text-[#d4af37] transition">Pool & Waterfalls</a>
            <a href="#buffalo-sanctuary" className="hover:text-[#d4af37] transition">500 Buffalos</a>
            <a href="#viral-reels" className="text-amber-300 hover:text-amber-200 transition font-semibold">Viral Reels</a>
            <a href="#gallery" className="hover:text-[#d4af37] transition">4K Gallery</a>
            <a href="#weekend-lease" className="text-[#f3e5ab] hover:underline font-bold">₹5L Weekend Lease</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSoundscape}
              className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition ${
                isAudioPlaying
                  ? "bg-[#0a4d2e] border-emerald-400 text-white"
                  : "bg-white/5 border-white/20 text-slate-300 hover:bg-white/10"
              }`}
              title="Toggle Nature Soundscape (Waterfalls & Birds)"
            >
              {isAudioPlaying ? (
                <>
                  <span className="flex items-end h-3">
                    <span className="audio-wave-bar"></span>
                    <span className="audio-wave-bar"></span>
                    <span className="audio-wave-bar"></span>
                    <span className="audio-wave-bar"></span>
                  </span>
                  <span className="hidden sm:inline">Water Sounds On</span>
                </>
              ) : (
                <>
                  <span>🔈</span>
                  <span className="hidden sm:inline">Soundscape</span>
                </>
              )}
            </button>

            <a
              href="#weekend-lease"
              className="btn-gold px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2 shadow-lg"
            >
              <span>Lease for ₹5L</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION WITH VIDEO PREVIEW BADGE & PRESS AWARDS */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#062c19] via-[#083b22] to-[#041a0f] text-white py-16 lg:py-24">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-dark-gold text-xs tracking-wider font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping"></span>
                <span className="text-white font-bold">jaikrishnaram.formhouse.com</span> • Exclusive 100-Acre HITEC City Estate
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                Jai Krishna Ram <span className="text-gold-gradient">Farmhouse & 100 Acres</span> in HITEC City
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
                Experience the ultimate private weekend escape: A palatial central farmhouse with private swimming pool & cascading rock waterfalls, 50-acre sanctuary with 500 buffalos, lush fodder fields, free-range poultry, and 25+ acres of blooming flower meadows.
              </p>

              {/* Highlight Badge Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/5 border border-[#d4af37]/30 backdrop-blur-sm">
                  <span className="text-xs text-[#d4af37] font-semibold block">Private Lease Rate</span>
                  <span className="text-xl font-black text-[#f3e5ab]">₹5,00,000</span>
                  <span className="text-[11px] text-emerald-400 block">Sat 10 AM – Sun 6 PM</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-xs text-slate-400 block">Dairy Sanctuary</span>
                  <span className="text-xl font-black text-white">500 Buffalos</span>
                  <span className="text-[11px] text-slate-300 block">Across 50 Acres</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm col-span-2 sm:col-span-1">
                  <span className="text-xs text-slate-400 block">Estate Heart</span>
                  <span className="text-xl font-black text-white">Pool & Waterfalls</span>
                  <span className="text-[11px] text-cyan-300 block">Cascading Stone Rocks</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#weekend-lease"
                  className="btn-gold px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 shadow-xl"
                >
                  <span>Reserve Weekend for ₹5 Lakhs</span>
                  <span>→</span>
                </a>
                
                <button
                  onClick={() => setSelectedVideo(data.videos[0])}
                  className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide transition flex items-center gap-2 shadow-lg shadow-red-600/30 group"
                >
                  <span className="w-5 h-5 rounded-full bg-white text-red-600 flex items-center justify-center text-xs font-black group-hover:scale-110 transition">▶</span>
                  <span>Watch 4K Drone Film</span>
                </button>

                <a
                  href="#three-d-experience"
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm tracking-wide transition flex items-center gap-2 backdrop-blur-sm"
                >
                  <span>Launch 3D Explorer</span>
                </a>
              </div>

            </div>

            {/* Right Card / Interactive Video Hero Poster */}
            <div className="lg:col-span-5">
              <div
                onClick={() => setSelectedVideo(data.videos[0])}
                className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#d4af37]/40 group cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"
                  alt="Luxury Farmhouse in HITEC City"
                  className="w-full h-[450px] object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#052617] via-black/30 to-black/30 group-hover:via-black/20 transition-all"></div>

                {/* Pulsating Center Play Button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#d4af37] text-[#052617] flex items-center justify-center text-2xl font-black shadow-2xl group-hover:scale-115 transition-transform duration-300 pulse-water">
                    ▶
                  </div>
                  <span className="mt-3 text-xs uppercase tracking-widest font-extrabold text-[#f3e5ab] bg-black/60 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
                    Click to Play 4K Video Tour
                  </span>
                </div>

                {/* Floating Overlay Information */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl glass-dark border border-[#d4af37]/30 text-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="badge-dark-gold px-2.5 py-0.5 rounded-md text-[11px] font-semibold">
                      CENTRAL VILLA OASIS
                    </span>
                    <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 24/7 Security
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">Central Luxury Farmhouse</h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Private pool, rock waterfalls, paved roads, and 500-buffalo dairy sanctuary.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* PRESS & INDUSTRY AWARDS STRIP */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/10">
          <div className="text-center text-xs uppercase tracking-widest text-[#d4af37] font-bold mb-6">
            Recognized by Top Tourism & Architecture Bodies
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.pressAwards.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-sm hover:border-[#d4af37]/40 transition">
                <span className="text-2xl block mb-1">{item.icon}</span>
                <span className="text-xs font-bold text-white block">{item.name}</span>
                <span className="text-[11px] text-slate-300 block mt-0.5">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {data.stats.map((s, idx) => (
              <div key={idx} className="p-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#f3e5ab] font-serif">
                  {s.value}
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-wider mt-1">
                  {s.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CINEMATIC 4K VIDEO SHOWCASE & DRONE TOURS (HYPE SECTION) */}
      <section id="cinematic-videos" className="py-24 bg-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold tracking-wider uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              Ultra-HD 4K Video Tours
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-serif">
              Watch The 100-Acre Estate in <span className="text-gold-gradient">Cinematic Motion</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3">
              Experience the breathtaking drone flights, cascading waterfalls, swimming pool leisure, 500-buffalo dairy sanctuary, and vibrant flower valleys in full motion.
            </p>
          </div>

          {/* Video Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.videos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setSelectedVideo(vid)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-[#d4af37]/60 shadow-xl hover:shadow-2xl transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-60 img-zoom-container">
                    <img
                      src={vid.poster}
                      alt={vid.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-all"></div>
                    
                    {/* Play Button Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center text-xl font-bold shadow-xl group-hover:scale-120 group-hover:bg-red-600 transition-all duration-300">
                        ▶
                      </div>
                    </div>

                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow">
                      {vid.tag}
                    </div>

                    <div className="absolute bottom-3 right-3 bg-black/80 text-slate-200 text-xs font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                      ⏱ {vid.duration}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif font-bold text-lg text-white group-hover:text-[#f3e5ab] transition">
                      {vid.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <span className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5 group-hover:underline">
                    Watch Full 4K Video Now →
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. VIRAL SOCIAL REELS & INSTAGRAM HYPE WALL */}
      <section id="viral-reels" className="py-20 bg-gradient-to-b from-[#041a0f] to-[#062c19] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-dark-gold text-xs font-bold uppercase tracking-wider mb-2">
                VIRAL SOCIAL HYPE
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif">
                Trending on Instagram & TikTok in Hyderabad
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                See why tech leaders, celebrities, and wedding couples are raving about the 100-acre private lease.
              </p>
            </div>

            <button
              onClick={openWhatsAppInquiry}
              className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold"
            >
              Book Your Viral Weekend →
            </button>
          </div>

          {/* Social Reels Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.reels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => setSelectedVideo(data.videos[0])}
                className="group cursor-pointer rounded-3xl overflow-hidden bg-slate-900 border border-white/10 hover:border-[#d4af37] transition duration-300 relative shadow-2xl"
              >
                {/* Smartphone Aspect Ratio */}
                <div className="h-[420px] relative overflow-hidden img-zoom-container">
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30"></div>

                  {/* Top Creator Tag */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      <img
                        src={reel.avatar}
                        alt={reel.handle}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-[11px] font-bold text-white">{reel.handle}</span>
                    </div>
                    <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-full">
                      {reel.tag}
                    </span>
                  </div>

                  {/* Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-2xl font-bold border border-white/30">
                      ▶
                    </div>
                  </div>

                  {/* Bottom Stats & Caption */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-medium line-clamp-2 leading-snug mb-3">
                      {reel.title}
                    </p>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/20 text-slate-300">
                      <span className="flex items-center gap-1 font-bold text-rose-400">
                        ❤️ {reel.likes}
                      </span>
                      <span className="flex items-center gap-1 text-slate-300">
                        👁️ {reel.views}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. INTERACTIVE 3D VIRTUAL ESTATE EXPLORER */}
      <section id="three-d-experience" className="py-20 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wider uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              Interactive 3D WebGL Simulation
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif">
              Explore the 100-Acre Master Plan in <span className="text-gold-gradient">Interactive 3D</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              Rotate 360°, zoom in, and inspect the cascading rock waterfalls, swimming pool ripples, and grazing buffalo sanctuary.
            </p>
          </div>

          {/* 3D CANVAS & HUD INTERACTIVE BAR */}
          <div className="relative">
            
            {/* Top HUD Controls (Camera Angles & Lighting) */}
            <div className="hud-overlay top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3">
              
              {/* Camera Views Selector */}
              <div className="flex flex-wrap items-center gap-2 bg-[#062c19]/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-xl">
                <button
                  onClick={() => handleViewChange("overview")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    threeMode === "overview"
                      ? "bg-[#d4af37] text-[#052617] shadow-md font-bold"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  🗺️ 100-Acre Overview
                </button>
                <button
                  onClick={() => handleViewChange("waterfall-pool")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    threeMode === "waterfall-pool"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  💧 Waterfalls & Pool
                </button>
                <button
                  onClick={() => handleViewChange("buffalos")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    threeMode === "buffalos"
                      ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  🐂 500 Buffalos (50 Acres)
                </button>
                <button
                  onClick={() => handleViewChange("farmhouse")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    threeMode === "farmhouse"
                      ? "bg-[#d4af37] text-[#052617] shadow-md font-bold"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  🏰 Central Farmhouse
                </button>
                <button
                  onClick={() => handleViewChange("flowers")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    threeMode === "flowers"
                      ? "bg-pink-500 text-white shadow-md font-bold"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  🌸 Flower Fields
                </button>
              </div>

              {/* Time of Day Lighting Toggle */}
              <div className="flex items-center gap-1.5 bg-[#062c19]/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-xl">
                <span className="text-[11px] text-slate-400 px-2 font-medium">Ambience:</span>
                <button
                  onClick={() => handleTimeChange("day")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    timeOfDay === "day"
                      ? "bg-white text-slate-900 font-bold"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  ☀️ Day
                </button>
                <button
                  onClick={() => handleTimeChange("sunset")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    timeOfDay === "sunset"
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  🌅 Sunset
                </button>
                <button
                  onClick={() => handleTimeChange("night")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    timeOfDay === "night"
                      ? "bg-indigo-600 text-white font-bold"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  🌙 Night Lights
                </button>
              </div>

            </div>

            {/* Canvas Container */}
            <div id="three-canvas-container" className="cursor-grab active:cursor-grabbing border border-slate-700"></div>

            {/* Bottom 3D Helper & Sound Trigger */}
            <div className="hud-overlay bottom-4 left-4 right-4 flex flex-wrap items-center justify-between text-xs text-slate-300 pointer-events-none">
              <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <span className="text-[#d4af37]">🖱️ Drag to rotate</span>
                <span>•</span>
                <span>Scroll to zoom</span>
                <span>•</span>
                <span>Right click to pan</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSoundscape}
                  className="bg-black/70 hover:bg-black/90 pointer-events-auto backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-[#f3e5ab] font-medium flex items-center gap-2 transition"
                >
                  <span>{isAudioPlaying ? "🔊 Water Sounds Playing" : "🔈 Hear Waterfalls & Nature"}</span>
                </button>
              </div>
            </div>

          </div>

          {/* 3D Zone Feature Highlights Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div
              onClick={() => handleViewChange("waterfall-pool")}
              className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 cursor-pointer transition group"
            >
              <div className="text-cyan-400 text-xl mb-1">🌊 Waterfalls & Pool</div>
              <p className="text-xs text-slate-300">
                Cascading rock water feature with live mist and swimming pool rippling water surface.
              </p>
              <span className="text-[11px] text-cyan-400 font-semibold mt-2 inline-block group-hover:underline">Focus 3D View →</span>
            </div>

            <div
              onClick={() => handleViewChange("buffalos")}
              className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 cursor-pointer transition group"
            >
              <div className="text-emerald-400 text-xl mb-1">🐂 50-Acre Buffalo Sanctuary</div>
              <p className="text-xs text-slate-300">
                500 buffalos grazing in green pastures with automated shelters and milking sheds.
              </p>
              <span className="text-[11px] text-emerald-400 font-semibold mt-2 inline-block group-hover:underline">Focus 3D View →</span>
            </div>

            <div
              onClick={() => handleViewChange("farmhouse")}
              className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 cursor-pointer transition group"
            >
              <div className="text-[#d4af37] text-xl mb-1">🏰 Central Luxury Farmhouse</div>
              <p className="text-xs text-slate-300">
                Two-tier contemporary luxury estate centered on neat paved roads and private security.
              </p>
              <span className="text-[11px] text-[#d4af37] font-semibold mt-2 inline-block group-hover:underline">Focus 3D View →</span>
            </div>

            <div
              onClick={() => handleViewChange("flowers")}
              className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 cursor-pointer transition group"
            >
              <div className="text-pink-400 text-xl mb-1">🌸 25+ Acre Flower Meadows</div>
              <p className="text-xs text-slate-300">
                Vibrant multi-hue beds cultivating marigolds, roses, lavender, and sunflowers.
              </p>
              <span className="text-[11px] text-pink-400 font-semibold mt-2 inline-block group-hover:underline">Focus 3D View →</span>
            </div>
          </div>

        </div>
      </section>

      {/* 7. THE 100-ACRE ZONING BREAKDOWN */}
      <section id="about-100-acres" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-gold text-xs font-bold uppercase tracking-wider mb-2">
            ZONING ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#052617]">
            Inside Hyderabad’s Premier 100-Acre Estate
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Every section of the 100 acres has been thoughtfully designed for sustainable agriculture, elite hospitality, and total seclusion in HITEC City.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.zones.map((zone) => (
            <div
              key={zone.id}
              className="glass-card rounded-2xl overflow-hidden border border-slate-200 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 img-zoom-container">
                  <img
                    src={zone.image}
                    alt={zone.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#052617]/90 text-[#f3e5ab] text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-[#d4af37]/30">
                    {zone.acreage}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow">
                    {zone.tag}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-[#052617] mb-2">
                    {zone.name}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 mb-3">
                    ★ {zone.highlight}
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {zone.description}
                  </p>

                  <ul className="space-y-2 border-t border-slate-100 pt-3">
                    {zone.features.map((f, fIdx) => (
                      <li key={fIdx} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href="#three-d-experience"
                  onClick={() => {
                    if (zone.id === "buffalo-sanctuary") handleViewChange("buffalos");
                    else if (zone.id === "central-farmhouse") handleViewChange("waterfall-pool");
                    else if (zone.id === "flower-fields") handleViewChange("flowers");
                    else handleViewChange("overview");
                  }}
                  className="w-full py-2.5 rounded-xl border border-emerald-800/30 text-emerald-800 text-xs font-bold hover:bg-emerald-50 text-center block transition"
                >
                  View in 3D Explorer →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. SPOTLIGHT: CENTRAL FARMHOUSE, SWIMMING POOL & WATERFALLS */}
      <section id="farmhouse-pool" className="py-20 bg-[#062c19] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="badge-dark-gold px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase inline-block">
                CENTRAL OASIS HIGHLIGHT
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif leading-tight">
                Cascading Waterfalls & Swimming Pool Retreat
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Right in the center of the 100 acres sits the palatial luxury farmhouse. Unwind by the heated designer swimming pool while soothing natural rock waterfalls shower mist and tranquil acoustic rhythms into the evening air.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                    🌊
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Cascading Natural Rock Waterfall</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Engineered multi-tier stone rock waterfall with continuous stream, mist cooling, and poolside plunge zone.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    🏊
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Resort-Grade Swimming Pool</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Temperature-moderated azure pool with Italian mosaic tiles, sunbeds, submerged loungers, and underwater ambient night lighting.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                    🛣️
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Neat Paved Roads & 24/7 Armed Security</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Smooth asphalt and cobblestone avenues allow easy transit for luxury convoys, vintage cars, and VIP electric golf carts across all 100 acres.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#weekend-lease"
                  className="btn-gold px-7 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2"
                >
                  <span>Book Weekend Farmhouse Lease</span>
                  <span>→</span>
                </a>
                <button
                  onClick={() => setSelectedVideo(data.videos[1])}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold inline-flex items-center gap-2"
                >
                  <span>Watch Pool & Waterfall Video</span>
                </button>
              </div>
            </div>

            {/* Visual Mosaic of Farmhouse & Pool */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div
                  onClick={() => setSelectedImage(data.gallery[1])}
                  className="rounded-2xl overflow-hidden shadow-lg border border-white/10 h-64 img-zoom-container cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"
                    alt="Swimming Pool"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  onClick={() => setSelectedImage(data.gallery[11])}
                  className="rounded-2xl overflow-hidden shadow-lg border border-white/10 h-48 img-zoom-container cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
                    alt="Night Villa Lights"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div
                  onClick={() => setSelectedImage(data.gallery[2])}
                  className="rounded-2xl overflow-hidden shadow-lg border border-white/10 h-48 img-zoom-container cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80"
                    alt="Cascading Waterfall"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  onClick={() => setSelectedImage(data.gallery[9])}
                  className="rounded-2xl overflow-hidden shadow-lg border border-white/10 h-64 img-zoom-container cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
                    alt="Neat Paved Roads"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. SPOTLIGHT: 500 BUFFALO SANCTUARY & 10-ACRE FODDER */}
      <section id="buffalo-sanctuary" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div
              onClick={() => setSelectedVideo(data.videos[2])}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-800/30 img-zoom-container cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=1200&q=80"
                alt="500 Buffalos Farm"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center text-xl font-bold shadow-2xl group-hover:scale-115 transition">
                  ▶
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/80 backdrop-blur-md text-white border border-white/20">
                <div className="text-xs text-[#d4af37] font-bold">50 ACRES DAIRY SANCTUARY</div>
                <div className="text-sm font-semibold mt-0.5">500 Indian Murrah & Jafrabadi Buffalos</div>
                <div className="text-[11px] text-slate-300">Click to play video of herd grazing on 10 acres of fresh green fodder.</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <div className="badge-gold px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
              FLAGSHIP DAIRY ASSET
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#052617]">
              The 500-Buffalo Sanctuary & Organic Pastures
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Spanning 50 acres, our modern dairy sanctuary is home to 500 healthy, ethically cared-for buffalos. Equipped with aerated sheds, rain misting systems, clean mineral drinking reservoirs, and an adjacent 10-acre green grass pasture.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-2xl font-black text-emerald-800">500+</div>
                <div className="text-xs font-bold text-slate-800 uppercase mt-1">Prize Buffalos</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Ethical open grazing & sheltered care</div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-2xl font-black text-emerald-800">10 Acres</div>
                <div className="text-xs font-bold text-slate-800 uppercase mt-1">Green Fodder Grass</div>
                <div className="text-[11px] text-slate-500 mt-0.5">100% natural, chemical-free feed</div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-2xl font-black text-emerald-800">10 Acres</div>
                <div className="text-xs font-bold text-slate-800 uppercase mt-1">Poultry Farm</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Free-range healthy country hens</div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-2xl font-black text-emerald-800">Fresh Taste</div>
                <div className="text-xs font-bold text-slate-800 uppercase mt-1">Organic Dairy Tour</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Complimentary for weekend guests</div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => handleViewChange("buffalos")}
                className="btn-emerald px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
              >
                <span>Inspect Buffalos in 3D</span>
                <span>→</span>
              </button>
              <button
                onClick={() => setSelectedVideo(data.videos[2])}
                className="px-5 py-2.5 rounded-xl border border-emerald-800 text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition"
              >
                Watch Buffalo Film ▶
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 10. SPOTLIGHT: 25+ ACRE FLOWER MEADOWS */}
      <section id="flower-fields" className="py-20 bg-amber-50/60 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-pink-100 text-pink-800 border border-pink-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                BOTANICAL PARADISE
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#052617]">
                25+ Acres Cultivating Exotic Multi-Hue Flowers
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                The remaining fertile land cultivates blooming sweeps of fragrant, multi-colored flowers. Walking trails, charming gazebos, and gentle breezes make this a postcard-perfect setting for pre-wedding celebrations, fashion photoshoots, and sunset strolls.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xs">🌻</span>
                  <span>Golden Sunburst Sunflowers & Marigold Terraces</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-purple-400 text-white flex items-center justify-center font-bold text-xs">🪻</span>
                  <span>Aromatic Lavender Rows & Velvet Orchids</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-red-400 text-white flex items-center justify-center font-bold text-xs">🌹</span>
                  <span>Fragrant Crimson & Damask Rose Valley</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => handleViewChange("flowers")}
                  className="px-6 py-2.5 rounded-xl border border-pink-700 text-pink-700 hover:bg-pink-700 hover:text-white font-bold text-xs transition inline-flex items-center gap-2"
                >
                  <span>Experience Flower Valleys in 3D →</span>
                </button>
                <button
                  onClick={() => setSelectedVideo(data.videos[3])}
                  className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold"
                >
                  Watch Flower Drone Video ▶
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setSelectedImage(data.gallery[5])}
                  className="rounded-2xl overflow-hidden shadow-lg h-60 img-zoom-container cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=800&q=80"
                    alt="Flower Valley"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  onClick={() => setSelectedImage(data.gallery[6])}
                  className="rounded-2xl overflow-hidden shadow-lg h-60 img-zoom-container cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80"
                    alt="Sunflower Fields"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 11. HIGH-DEFINITION PHOTO GALLERY */}
      <section id="gallery" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-gold text-xs font-bold uppercase tracking-wider mb-2">
            HIGH-DEFINITION 4K VISUALS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#052617]">
            The 100-Acre Estate Photo Showcase
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Click any picture for full-screen high-resolution zoom view and estate details.
          </p>

          {/* Gallery Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { id: "all", label: "All Views" },
              { id: "farmhouse", label: "Central Farmhouse" },
              { id: "pool", label: "Swimming Pool" },
              { id: "waterfall", label: "Waterfalls" },
              { id: "buffalos", label: "500 Buffalos & Pasture" },
              { id: "flowers", label: "Flower Fields" },
              { id: "poultry", label: "Poultry Farm" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id
                    ? "bg-[#0a4d2e] text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGallery.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(item)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="h-60 relative overflow-hidden img-zoom-container">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs text-white font-medium flex items-center gap-1.5">
                    🔍 Click for 4K Zoom View
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition">
                  {item.title}
                </h4>
                <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12. CELEBRITY & CXO VIP TESTIMONIALS */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-dark-gold text-xs font-bold uppercase tracking-wider mb-2">
              CLIENT TESTIMONIALS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif">
              What Tech Leaders & Guests Say
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Read authentic feedback from corporate offsites, wedding shoots, and private weekend retreats.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {data.testimonials.map((t, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between hover:border-[#d4af37]/50 transition">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 text-sm mb-3">
                    {"★".repeat(t.rating)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-700">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#d4af37]"
                  />
                  <div>
                    <h5 className="font-bold text-white text-xs sm:text-sm">{t.name}</h5>
                    <p className="text-[11px] text-[#f3e5ab]">{t.role}</p>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">Event: {t.event}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 13. WEEKEND LEASE BOOKING & CALCULATOR ENGINE (₹5,00,000) */}
      <section id="weekend-lease" className="py-24 bg-gradient-to-b from-[#062c19] to-[#041a0f] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-dark-gold text-xs font-bold uppercase tracking-wider mb-3">
              SATURDAY & SUNDAY PRIVATE LEASE
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-serif">
              Lease the Entire 100 Acres for <span className="text-gold-gradient">₹5,00,000</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Every weekend, the entire estate is leased exclusively to one privileged group. Enjoy full private access to the central luxury villa, swimming pool, waterfalls, 500-buffalo dairy sanctuary, and flower valleys.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Inclusions & Highlights (Left 6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="p-6 rounded-2xl bg-white/5 border border-[#d4af37]/30 backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs text-slate-300">Standard Weekend Package</span>
                    <h3 className="text-2xl font-black font-serif text-[#f3e5ab]">
                      {data.leaseDetails.priceLabel}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                    All-Inclusive Estate Access
                  </span>
                </div>

                <div className="pt-4 text-xs text-slate-300 space-y-2">
                  <p className="font-semibold text-white">🗓️ Schedule:</p>
                  <p className="bg-white/5 p-2.5 rounded-lg border border-white/10 text-[#f3e5ab]">
                    {data.leaseDetails.schedule}
                  </p>
                  <p className="font-semibold text-white pt-2">🎯 Ideal For:</p>
                  <p>{data.leaseDetails.targetAudience}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-[#d4af37]">★</span> What Your ₹5,00,000 Lease Includes:
                </h4>
                <div className="grid sm:grid-cols-2 gap-2.5 text-xs text-slate-200">
                  {data.leaseDetails.inclusions.map((inc, iIdx) => (
                    <div key={iIdx} className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* VIP Add-ons Checklist */}
              <div className="pt-4 space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-[#d4af37]">✨</span> Optional VIP Custom Add-ons:
                </h4>
                <div className="space-y-2">
                  {data.leaseDetails.vipAddons.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition ${
                          isChecked
                            ? "bg-[#d4af37]/20 border-[#d4af37] text-white"
                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded text-[#d4af37] focus:ring-0"
                          />
                          <span className="font-medium">{addon.name}</span>
                        </div>
                        <span className="font-bold text-[#f3e5ab] shrink-0 ml-2">
                          +₹{addon.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Interactive Booking Calculator & Form (Right 6 cols) */}
            <div className="lg:col-span-6">
              <div className="glass-dark rounded-3xl p-6 sm:p-8 border border-[#d4af37]/40 shadow-2xl relative">
                
                <div className="text-center pb-6 border-b border-white/10">
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Weekend Lease Reservation Engine
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Select your upcoming Saturday & Sunday slot near HITEC City.
                  </p>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4 pt-6">
                  
                  {/* Weekend Date Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Select Weekend (Saturday Check-in Date) *
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                    />
                    <span className="text-[11px] text-emerald-400 mt-1 block">
                      ✓ Automatically reserves Saturday 10:00 AM through Sunday 06:00 PM.
                    </span>
                  </div>

                  {/* Guest Count */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1">
                      <span>Expected Guests</span>
                      <span className="text-[#f3e5ab] font-bold">{guestCount} Guests</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="100"
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value))}
                      className="w-full accent-[#d4af37]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>2 (Intimate Stay)</span>
                      <span>20 (Full Villa Capacity)</span>
                      <span>100 (Full Estate Gathering)</span>
                    </div>
                  </div>

                  {/* Guest Name & Contact */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Varma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        Purpose of Lease
                      </label>
                      <select
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      >
                        <option value="Corporate Tech Offsite" className="bg-slate-900 text-white">Corporate Tech Offsite (HITEC City)</option>
                        <option value="Private Family Retreat" className="bg-slate-900 text-white">Private Luxury Family Retreat</option>
                        <option value="Pre-Wedding & Drone Shoot" className="bg-slate-900 text-white">Pre-Wedding & Drone Photoshoot</option>
                        <option value="Destination Celebration" className="bg-slate-900 text-white">Anniversary / Milestone Celebration</option>
                        <option value="VIP Agritourism & Dairy Study" className="bg-slate-900 text-white">Agritourism & Farm Exploration</option>
                      </select>
                    </div>
                  </div>

                  {/* PRICE SUMMARY CARD */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-[#d4af37]/40 space-y-2 mt-4">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>100-Acre Weekend Lease (Sat & Sun):</span>
                      <span className="font-semibold text-white">₹5,00,000</span>
                    </div>

                    {addonsTotal > 0 && (
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>VIP Add-ons ({selectedAddons.length}):</span>
                        <span className="font-semibold text-[#f3e5ab]">+₹{addonsTotal.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-slate-300 block">Total Quotation Value</span>
                        <span className="text-[11px] text-emerald-400">Includes 24/7 Security & Safari</span>
                      </div>
                      <span className="text-2xl font-black text-[#d4af37] font-serif">
                        ₹{totalLeasePrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Submission Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="submit"
                      className="btn-gold w-full py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2"
                    >
                      <span>Generate Weekend Lease Voucher</span>
                    </button>

                    <button
                      type="button"
                      onClick={openWhatsAppInquiry}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                    >
                      <span>Send Direct Inquiry on WhatsApp Concierge</span>
                    </button>
                  </div>

                </form>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 14. STRATEGIC LOCATION & ACCESS MAP */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="badge-gold px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
              STRATEGIC HYDERABAD LOCATION
            </div>
            <h2 className="text-3xl font-extrabold font-serif text-[#052617]">
              Minutes Away from HITEC City & Financial District
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Situated right in the high-growth corridor of Hyderabad near HITEC City, offering complete seclusion and tranquility within 100 green acres without needing to travel hours outside the city.
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-700">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                <span className="font-semibold">Cyber Towers / HITEC City</span>
                <span className="text-emerald-700 font-bold">12 - 15 Mins</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                <span className="font-semibold">Financial District / Gachibowli</span>
                <span className="text-emerald-700 font-bold">18 - 20 Mins</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                <span className="font-semibold">Inorbit Mall & Durgam Cheruvu</span>
                <span className="text-emerald-700 font-bold">15 Mins</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                <span className="font-semibold">Rajiv Gandhi Intl Airport (RGIA)</span>
                <span className="text-emerald-700 font-bold">35 Mins via ORR</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto text-2xl shadow-lg">
                📍
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#052617]">
                100 Acres of Pure Seclusion in Central Hyderabad
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Full address and GPS coordinates provided privately upon confirmed weekend lease booking for security & discretion.
              </p>
              <div className="pt-2">
                <button
                  onClick={openWhatsAppInquiry}
                  className="btn-emerald px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
                >
                  <span>Request Private Location Pin</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 15. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-gold text-xs font-bold uppercase tracking-wider mb-2">
              FREQUENT QUESTIONS
            </div>
            <h2 className="text-3xl font-extrabold font-serif text-[#052617]">
              Everything You Need to Know About the Weekend Lease
            </h2>
          </div>

          <div className="space-y-4">
            {data.faq.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h4 className="font-serif font-bold text-slate-900 text-base mb-2">
                  {item.q}
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 16. FOOTER */}
      <footer className="bg-[#041a0f] text-slate-400 py-16 border-t border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-[#052617] flex items-center justify-center font-black">
                  🏰
                </div>
                <div>
                  <span className="font-serif font-bold text-base text-white block">JAI KRISHNA RAM</span>
                  <span className="text-[10px] text-[#d4af37] font-semibold block">jaikrishnaram.formhouse.com</span>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Hyderabad’s exclusive 100-acre private farmhouse, 500-buffalo dairy sanctuary, and weekend agritourism estate.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-3">Estate Zones</h5>
              <ul className="space-y-2">
                <li><a href="#buffalo-sanctuary" className="hover:text-white transition">50-Acre Buffalo Sanctuary</a></li>
                <li><a href="#farmhouse-pool" className="hover:text-white transition">Central Farmhouse & Pool</a></li>
                <li><a href="#farmhouse-pool" className="hover:text-white transition">Rock Waterfalls</a></li>
                <li><a href="#flower-fields" className="hover:text-white transition">25+ Acre Flower Meadows</a></li>
                <li><a href="#about-100-acres" className="hover:text-white transition">10-Acre Fodder & Poultry</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-3">Weekend Lease</h5>
              <ul className="space-y-2">
                <li><span>Fee: ₹5,00,000 / Weekend</span></li>
                <li><span>Saturday 10:00 AM – Sunday 06:00 PM</span></li>
                <li><span>Entire 100 Acres Private Access</span></li>
                <li><span>24/7 Security & Concierge</span></li>
                <li><a href="#weekend-lease" className="text-[#d4af37] hover:underline">Instant Booking Portal</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-3">Contact Concierge</h5>
              <p className="text-slate-300">HITEC City / Madhapur Corridor, Hyderabad, Telangana</p>
              <p className="mt-2 text-white font-medium">📞 {data.brand.phone}</p>
              <p className="text-white font-medium">✉️ {data.brand.email}</p>
              <div className="pt-3">
                <button
                  onClick={openWhatsAppInquiry}
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold transition"
                >
                  WhatsApp Direct Chat
                </button>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-wrap items-center justify-between gap-4">
            <p>© 2026 jaikrishnaram.formhouse.com • Jai Krishna Ram Farmhouse. All Rights Reserved.</p>
            <p className="text-slate-500">Built with HTML5, CSS3, JavaScript, React.js & Three.js 3D.</p>
          </div>
        </div>
      </footer>

      {/* 17. 4K CINEMATIC VIDEO LIGHTBOX MODAL */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl modal-content-animated relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/80 hover:bg-red-600 text-white flex items-center justify-center transition border border-white/30 font-bold"
            >
              ✕
            </button>

            {/* Responsive 16:9 Video Embed Player */}
            <div className="relative pt-[56.25%] bg-black">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-6 bg-slate-900 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="badge-dark-gold px-2.5 py-0.5 rounded text-[11px] font-bold uppercase">
                  {selectedVideo.tag}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                  {selectedVideo.title}
                </h3>
                <p className="text-slate-400 text-xs mt-1 max-w-2xl">
                  {selectedVideo.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="#weekend-lease"
                  onClick={() => setSelectedVideo(null)}
                  className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold text-[#052617]"
                >
                  Lease for ₹5,00,000 →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 18. LIGHTBOX MODAL FOR HIGH-RESOLUTION PICTURES */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/20 shadow-2xl modal-content-animated relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition border border-white/20"
            >
              ✕
            </button>
            <div className="h-[460px] relative">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 bg-slate-900">
              <h3 className="font-serif text-2xl font-bold text-white">{selectedImage.title}</h3>
              <p className="text-slate-300 text-sm mt-1">{selectedImage.desc}</p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>📍 HITEC 100 Acres Estate • Hyderabad</span>
                <a
                  href="#weekend-lease"
                  onClick={() => setSelectedImage(null)}
                  className="btn-gold px-4 py-2 rounded-lg text-xs font-bold text-[#052617]"
                >
                  Lease Estate for ₹5L →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 19. BOOKING CONFIRMATION & VOUCHER RECEIPT MODAL */}
      {bookingSuccessModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setBookingSuccessModal(null)}
        >
          <div
            className="max-w-xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl modal-content-animated text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Voucher Banner */}
            <div className="bg-gradient-to-r from-[#052617] to-[#0a4d2e] p-6 text-white text-center relative">
              <span className="w-12 h-12 rounded-full bg-[#d4af37] text-[#052617] font-black text-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                ✓
              </span>
              <h3 className="font-serif text-2xl font-bold">
                Weekend Lease Reservation Summary
              </h3>
              <p className="text-xs text-[#f3e5ab] mt-1">
                Ref ID: {bookingSuccessModal.reservationId}
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
                <strong>Thank you, {bookingSuccessModal.name}!</strong> Your request to lease the 100-Acre Farmhouse near HITEC City for the weekend has been drafted. Our estate manager will connect via phone/WhatsApp to confirm lock-in.
              </div>

              <div className="space-y-2 text-xs border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Reserved Weekend:</span>
                  <span className="font-bold text-slate-900">{bookingSuccessModal.bookingDate} (Sat & Sun)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Guests:</span>
                  <span className="font-bold text-slate-900">{bookingSuccessModal.guestCount} Guests</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Event Purpose:</span>
                  <span className="font-bold text-slate-900">{bookingSuccessModal.eventType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Phone Contact:</span>
                  <span className="font-bold text-slate-900">{bookingSuccessModal.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Base Weekend Lease (100 Acres):</span>
                  <span className="font-bold text-slate-900">₹{bookingSuccessModal.basePrice.toLocaleString("en-IN")}</span>
                </div>
                {bookingSuccessModal.addonsPrice > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">VIP Add-ons:</span>
                    <span className="font-bold text-emerald-700">+₹{bookingSuccessModal.addonsPrice.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 text-sm font-black text-[#052617]">
                  <span>Total Quotation:</span>
                  <span className="text-base text-emerald-800">₹{bookingSuccessModal.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={openWhatsAppInquiry}
                  className="btn-gold flex-1 py-3 rounded-xl text-xs font-bold text-[#052617] flex items-center justify-center gap-2"
                >
                  <span>Confirm on WhatsApp</span>
                </button>
                <button
                  onClick={() => setBookingSuccessModal(null)}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Render React App
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
