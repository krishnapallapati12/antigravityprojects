// jaikrishnaram.formhouse.com - Core Interactive Application
// Pure, native, zero-dependency JavaScript. Guaranteed to run on file:/// with 0 CORS errors.

document.addEventListener("DOMContentLoaded", () => {
  const data = window.ESTATE_DATA;
  if (!data) {
    console.error("ESTATE_DATA not found");
    return;
  }

  // Ensure Title Bar is strictly jaikrishnaram.formhouse.com
  document.title = "jaikrishnaram.formhouse.com";

  // 1. Initialize 3D WebGL Experience
  let threeExperience = null;
  const canvasContainer = document.getElementById("three-canvas-container");
  if (canvasContainer && window.Estate3DExperience) {
    try {
      threeExperience = new window.Estate3DExperience("three-canvas-container");
    } catch (e) {
      console.warn("3D WebGL initialization fallback:", e);
    }
  }

  // 2. Initialize Procedural Nature Soundscape (Web Audio API)
  let soundscape = null;
  if (window.NatureSoundscape) {
    try {
      soundscape = new window.NatureSoundscape();
    } catch (e) {
      console.warn("Soundscape initialization fallback:", e);
    }
  }

  // 3. Buffalo Sanctuary Cinematic VFX Simulation (Canvas 2D Particle & Fluid Engine)
  let buffaloVfx = null;
  const buffaloCanvas = document.getElementById("buffalo-vfx-canvas");
  if (buffaloCanvas && window.BuffaloSanctuaryVFX) {
    try {
      buffaloVfx = new window.BuffaloSanctuaryVFX("buffalo-vfx-canvas");
    } catch (e) {
      console.warn("Buffalo VFX initialization fallback:", e);
    }
  }

  // Buffalo VFX Time of Day Switcher
  const vfxModeBtns = document.querySelectorAll(".btn-vfx-mode");
  vfxModeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-mode");
      if (buffaloVfx) buffaloVfx.setMode(mode);

      vfxModeBtns.forEach((b) => {
        b.classList.remove("bg-[#d4af37]", "text-[#052617]", "font-bold", "shadow");
        b.classList.add("text-slate-300");
      });
      btn.classList.remove("text-slate-300");
      btn.classList.add("bg-[#d4af37]", "text-[#052617]", "font-bold", "shadow");
    });
  });

  // Buffalo VFX Layer Toggles
  const toggleMist = document.getElementById("toggle-vfx-mist");
  const toggleGodrays = document.getElementById("toggle-vfx-godrays");
  const toggleRipples = document.getElementById("toggle-vfx-ripples");

  if (toggleMist && buffaloVfx) {
    toggleMist.addEventListener("change", (e) => {
      buffaloVfx.enableMist = e.target.checked;
    });
  }
  if (toggleGodrays && buffaloVfx) {
    toggleGodrays.addEventListener("change", (e) => {
      buffaloVfx.enableGodrays = e.target.checked;
    });
  }
  if (toggleRipples && buffaloVfx) {
    toggleRipples.addEventListener("change", (e) => {
      buffaloVfx.enableRipples = e.target.checked;
    });
  }
  const soundBtns = document.querySelectorAll(".btn-toggle-sound");
  let isAudioPlaying = false;
  soundBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!soundscape) return;
      isAudioPlaying = soundscape.toggle();
      soundBtns.forEach((b) => {
        const textSpan = b.querySelector(".sound-text");
        const waveSpan = b.querySelector(".sound-wave");
        const iconSpan = b.querySelector(".sound-icon");

        if (isAudioPlaying) {
          b.classList.add("bg-[#0a4d2e]", "border-emerald-400", "text-white");
          b.classList.remove("bg-white/5", "border-white/20", "text-slate-300");
          if (textSpan) textSpan.textContent = "Water Sounds On";
          if (waveSpan) waveSpan.classList.remove("hidden");
          if (iconSpan) iconSpan.classList.add("hidden");
        } else {
          b.classList.remove("bg-[#0a4d2e]", "border-emerald-400", "text-white");
          b.classList.add("bg-white/5", "border-white/20", "text-slate-300");
          if (textSpan) textSpan.textContent = "Hear Waterfalls & Nature";
          if (waveSpan) waveSpan.classList.add("hidden");
          if (iconSpan) iconSpan.classList.remove("hidden");
        }
      });
    });
  });

  // 4. 3D Camera View Selector Buttons
  const viewBtns = document.querySelectorAll(".btn-3d-view");
  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-mode");
      if (threeExperience) threeExperience.setCameraMode(mode);

      viewBtns.forEach((b) => {
        b.classList.remove("bg-[#d4af37]", "text-[#052617]", "bg-cyan-500", "bg-emerald-500", "bg-pink-500", "text-slate-950", "text-white", "font-bold");
        b.classList.add("text-slate-200");
      });

      btn.classList.remove("text-slate-200");
      if (mode === "waterfall-pool") {
        btn.classList.add("bg-cyan-500", "text-slate-950", "font-bold");
      } else if (mode === "buffalos") {
        btn.classList.add("bg-emerald-500", "text-slate-950", "font-bold");
      } else if (mode === "flowers") {
        btn.classList.add("bg-pink-500", "text-white", "font-bold");
      } else {
        btn.classList.add("bg-[#d4af37]", "text-[#052617]", "font-bold");
      }
    });
  });

  // 5. 3D Lighting Ambience (Day / Sunset / Night)
  const timeBtns = document.querySelectorAll(".btn-3d-time");
  timeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const time = btn.getAttribute("data-time");
      if (threeExperience) threeExperience.setTimeOfDay(time);

      timeBtns.forEach((b) => {
        b.classList.remove("bg-white", "text-slate-900", "bg-amber-500", "bg-indigo-600", "text-slate-950", "text-white", "font-bold");
        b.classList.add("text-slate-300");
      });

      btn.classList.remove("text-slate-300");
      if (time === "sunset") {
        btn.classList.add("bg-amber-500", "text-slate-950", "font-bold");
      } else if (time === "night") {
        btn.classList.add("bg-indigo-600", "text-white", "font-bold");
      } else {
        btn.classList.add("bg-white", "text-slate-900", "font-bold");
      }
    });
  });

  // 6. 4K Video Player Modal
  const videoModal = document.getElementById("video-modal");
  const videoIframe = document.getElementById("video-modal-iframe");
  const videoTitle = document.getElementById("video-modal-title");
  const videoTag = document.getElementById("video-modal-tag");
  const videoDesc = document.getElementById("video-modal-desc");
  const videoCloseBtn = document.getElementById("video-modal-close");

  function openVideoModal(videoObj) {
    if (!videoModal || !videoObj) return;
    if (videoIframe) videoIframe.src = videoObj.videoUrl;
    if (videoTitle) videoTitle.textContent = videoObj.title;
    if (videoTag) videoTag.textContent = videoObj.tag;
    if (videoDesc) videoDesc.textContent = videoObj.description;
    videoModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeVideoModal() {
    if (!videoModal) return;
    if (videoIframe) videoIframe.src = ""; // Stop playback
    videoModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }

  if (videoCloseBtn) videoCloseBtn.addEventListener("click", closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  // Trigger video buttons
  document.querySelectorAll("[data-video-id]").forEach((el) => {
    el.addEventListener("click", () => {
      const vidId = el.getAttribute("data-video-id");
      const found = data.videos.find((v) => v.id === vidId) || data.videos[0];
      openVideoModal(found);
    });
  });

  // 7. High-Res Photo Lightbox Modal
  const photoModal = document.getElementById("photo-modal");
  const photoImg = document.getElementById("photo-modal-img");
  const photoTitle = document.getElementById("photo-modal-title");
  const photoDesc = document.getElementById("photo-modal-desc");
  const photoCloseBtn = document.getElementById("photo-modal-close");

  function openPhotoModal(imgSrc, title, desc) {
    if (!photoModal) return;
    if (photoImg) photoImg.src = imgSrc;
    if (photoTitle) photoTitle.textContent = title;
    if (photoDesc) photoDesc.textContent = desc;
    photoModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closePhotoModal() {
    if (!photoModal) return;
    photoModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }

  if (photoCloseBtn) photoCloseBtn.addEventListener("click", closePhotoModal);
  if (photoModal) {
    photoModal.addEventListener("click", (e) => {
      if (e.target === photoModal) closePhotoModal();
    });
  }

  // Attach to all gallery items
  document.querySelectorAll(".gallery-card").forEach((card) => {
    card.addEventListener("click", () => {
      const src = card.getAttribute("data-img-src");
      const title = card.getAttribute("data-img-title");
      const desc = card.getAttribute("data-img-desc");
      openPhotoModal(src, title, desc);
    });
  });

  // 8. Gallery Category Filter Tabs
  const filterBtns = document.querySelectorAll(".gallery-tab-btn");
  const galleryItems = document.querySelectorAll(".gallery-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-category");

      filterBtns.forEach((b) => {
        b.classList.remove("bg-[#0a4d2e]", "text-white", "shadow-md");
        b.classList.add("bg-white", "text-slate-600");
      });
      btn.classList.remove("bg-white", "text-slate-600");
      btn.classList.add("bg-[#0a4d2e]", "text-white", "shadow-md");

      galleryItems.forEach((item) => {
        const itemCat = item.getAttribute("data-category");
        if (cat === "all" || itemCat === cat) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // 9. Booking Calculator & Pricing Engine
  const baseLeasePrice = 500000;
  const guestSlider = document.getElementById("guest-slider");
  const guestCountDisplay = document.getElementById("guest-count-display");
  const bookingDateInput = document.getElementById("booking-date-input");
  const addonsCheckboxes = document.querySelectorAll(".addon-checkbox");
  const addonsTotalDisplay = document.getElementById("addons-total-display");
  const addonsRow = document.getElementById("addons-summary-row");
  const grandTotalDisplay = document.getElementById("grand-total-display");

  // Auto-set next Saturday
  if (bookingDateInput) {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sun, 6 is Sat
    let daysUntilSat = (6 - dayOfWeek + 7) % 7;
    if (daysUntilSat === 0) daysUntilSat = 7;
    const nextSat = new Date(today);
    nextSat.setDate(today.getDate() + daysUntilSat);
    bookingDateInput.value = nextSat.toISOString().split("T")[0];
  }

  function calculateGrandTotal() {
    let addonsSum = 0;
    let selectedCount = 0;

    addonsCheckboxes.forEach((cb) => {
      if (cb.checked) {
        addonsSum += parseInt(cb.getAttribute("data-price") || 0, 10);
        selectedCount++;
      }
    });

    const total = baseLeasePrice + addonsSum;

    if (addonsTotalDisplay) {
      addonsTotalDisplay.textContent = "+₹" + addonsSum.toLocaleString("en-IN");
    }

    if (addonsRow) {
      if (selectedCount > 0) {
        addonsRow.classList.remove("hidden");
      } else {
        addonsRow.classList.add("hidden");
      }
    }

    if (grandTotalDisplay) {
      grandTotalDisplay.textContent = "₹" + total.toLocaleString("en-IN");
    }

    return { total, addonsSum, selectedCount };
  }

  if (guestSlider && guestCountDisplay) {
    guestSlider.addEventListener("input", (e) => {
      guestCountDisplay.textContent = e.target.value + " Guests";
    });
  }

  addonsCheckboxes.forEach((cb) => {
    cb.addEventListener("change", calculateGrandTotal);
  });

  // 10. WhatsApp Direct Inquiry
  function triggerWhatsAppInquiry() {
    const name = document.getElementById("input-name")?.value || "Interested VIP Guest";
    const date = bookingDateInput?.value || "Upcoming Saturday & Sunday";
    const guests = guestSlider?.value || "15";
    const eventType = document.getElementById("select-event-type")?.value || "Private Retreat";
    const { total } = calculateGrandTotal();

    const msg = encodeURIComponent(
      `Hello Jai Krishna Ram Farmhouse Concierge (jaikrishnaram.formhouse.com)!\n\n` +
      `I want to lease the 100-Acre Luxury Farmhouse for the weekend of ${date}.\n\n` +
      `👤 Name: ${name}\n` +
      `👥 Estimated Guests: ${guests}\n` +
      `🎉 Event Type: ${eventType}\n` +
      `💰 Total Lease Package: ₹${total.toLocaleString("en-IN")}\n\n` +
      `Please confirm slot availability and guided 100-acre tour arrangements.`
    );

    window.open(`https://wa.me/${data.brand.whatsapp}?text=${msg}`, "_blank");
  }

  document.querySelectorAll(".btn-whatsapp-inquiry").forEach((btn) => {
    btn.addEventListener("click", triggerWhatsAppInquiry);
  });

  // 11. Reservation Form Submission & Voucher Modal
  const bookingForm = document.getElementById("lease-booking-form");
  const voucherModal = document.getElementById("voucher-modal");
  const voucherCloseBtn = document.getElementById("voucher-modal-close");

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("input-name")?.value;
      const phone = document.getElementById("input-phone")?.value;
      const date = bookingDateInput?.value;
      const guests = guestSlider?.value;
      const eventType = document.getElementById("select-event-type")?.value;
      const { total, addonsSum } = calculateGrandTotal();

      if (!name || !phone) {
        alert("Please enter your Name and Phone Number to reserve your weekend.");
        return;
      }

      // Populate Voucher
      document.getElementById("voucher-ref-id").textContent = "Ref: JKR100-" + Math.floor(100000 + Math.random() * 900000);
      document.getElementById("voucher-guest-name").textContent = name;
      document.getElementById("voucher-date").textContent = date + " (Sat 10 AM to Sun 6 PM)";
      document.getElementById("voucher-guests").textContent = guests + " Guests";
      document.getElementById("voucher-event").textContent = eventType;
      document.getElementById("voucher-phone").textContent = phone;
      document.getElementById("voucher-addons").textContent = addonsSum > 0 ? "+₹" + addonsSum.toLocaleString("en-IN") : "None";
      document.getElementById("voucher-total").textContent = "₹" + total.toLocaleString("en-IN");

      if (voucherModal) {
        voucherModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      }
    });
  }

  if (voucherCloseBtn && voucherModal) {
    voucherCloseBtn.addEventListener("click", () => {
      voucherModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    });
  }
});
