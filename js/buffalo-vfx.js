/**
 * Buffalo Sanctuary Cinematic VFX & Atmospheric Simulation Engine
 * Procedural Canvas VFX: Volumetric Mist, Shimmering Water Lake, Godrays & Pasture Dynamics
 */
(function(window) {
  class BuffaloSanctuaryVFX {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext("2d");
      this.width = this.canvas.width = this.canvas.clientWidth || 800;
      this.height = this.canvas.height = this.canvas.clientHeight || 450;

      this.mode = "golden"; // "dawn", "golden", "noon", "night"
      this.enableMist = true;
      this.enableGodrays = true;
      this.enableRipples = true;

      this.particles = [];
      this.ripples = [];
      this.mistClouds = [];
      this.mouseX = this.width / 2;
      this.mouseY = this.height / 2;
      this.time = 0;
      this.animId = null;

      this.init();
    }

    init() {
      // 1. Create Mist Clouds
      for (let i = 0; i < 35; i++) {
        this.mistClouds.push({
          x: Math.random() * this.width,
          y: this.height * 0.45 + Math.random() * (this.height * 0.45),
          radius: 60 + Math.random() * 90,
          speed: 0.15 + Math.random() * 0.35,
          opacity: 0.08 + Math.random() * 0.12,
          drift: (Math.random() - 0.5) * 0.2
        });
      }

      // 2. Create Fireflies / Pollen Spores
      for (let i = 0; i < 60; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: 1.2 + Math.random() * 2.2,
          speedX: (Math.random() - 0.5) * 0.6,
          speedY: (Math.random() - 0.5) * 0.4,
          glow: Math.random() * Math.PI * 2,
          hue: 45 + Math.random() * 15
        });
      }

      // 3. Mouse interactions for water ripples & wind
      this.canvas.addEventListener("mousemove", (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = (e.clientX - rect.left) * (this.width / rect.width);
        this.mouseY = (e.clientY - rect.top) * (this.height / rect.height);

        // If cursor moves over lake (bottom right area), spawn ripples
        if (this.enableRipples && this.mouseY > this.height * 0.55 && this.mouseX > this.width * 0.4) {
          if (Math.random() < 0.3) {
            this.ripples.push({
              x: this.mouseX,
              y: this.mouseY,
              radius: 5,
              maxRadius: 45 + Math.random() * 30,
              opacity: 0.7,
              speed: 1.2
            });
          }
        }
      });

      window.addEventListener("resize", () => {
        if (!this.canvas) return;
        this.width = this.canvas.width = this.canvas.clientWidth || 800;
        this.height = this.canvas.height = this.canvas.clientHeight || 450;
      });

      this.start();
    }

    setMode(mode) {
      this.mode = mode;
    }

    start() {
      const render = () => {
        this.time += 0.016;
        this.draw();
        this.animId = requestAnimationFrame(render);
      };
      render();
    }

    draw() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      // A. Sky & Pasture Atmospheric Background Gradient
      let skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
      if (this.mode === "golden") {
        skyGrad.addColorStop(0, "#ff8c42");
        skyGrad.addColorStop(0.35, "#ffc371");
        skyGrad.addColorStop(0.65, "#2d5a27");
        skyGrad.addColorStop(1, "#183815");
      } else if (this.mode === "dawn") {
        skyGrad.addColorStop(0, "#4a5b6e");
        skyGrad.addColorStop(0.35, "#9bb7c7");
        skyGrad.addColorStop(0.6, "#3c6e47");
        skyGrad.addColorStop(1, "#1b3c22");
      } else if (this.mode === "night") {
        skyGrad.addColorStop(0, "#050b14");
        skyGrad.addColorStop(0.4, "#0f2027");
        skyGrad.addColorStop(0.7, "#0b2b16");
        skyGrad.addColorStop(1, "#04140a");
      } else {
        // noon
        skyGrad.addColorStop(0, "#4da0ff");
        skyGrad.addColorStop(0.4, "#bde0fe");
        skyGrad.addColorStop(0.65, "#408535");
        skyGrad.addColorStop(1, "#21531c");
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, this.width, this.height);

      // B. Volumetric Sunbeam Godrays
      if (this.enableGodrays && this.mode !== "night") {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const rayCount = 6;
        for (let i = 0; i < rayCount; i++) {
          const rayAngle = 0.55 + Math.sin(this.time * 0.4 + i) * 0.08;
          const rayX = this.width * (0.15 + i * 0.16);
          const rayGrad = ctx.createLinearGradient(rayX, 0, rayX + 220 * Math.cos(rayAngle), this.height);
          rayGrad.addColorStop(0, "rgba(255, 235, 170, 0.28)");
          rayGrad.addColorStop(0.6, "rgba(255, 215, 130, 0.12)");
          rayGrad.addColorStop(1, "rgba(255, 215, 130, 0.0)");

          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(rayX - 25, 0);
          ctx.lineTo(rayX + 35, 0);
          ctx.lineTo(rayX + 180 + Math.sin(this.time + i) * 20, this.height);
          ctx.lineTo(rayX + 60, this.height);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // C. Organic Buffalo Bathing Lake Water Surface (Bottom Right Area)
      ctx.save();
      const lakeX = this.width * 0.38;
      const lakeY = this.height * 0.58;
      const lakeW = this.width * 0.65;
      const lakeH = this.height * 0.45;

      const waterGrad = ctx.createRadialGradient(
        lakeX + lakeW * 0.4, lakeY + lakeH * 0.3, 20,
        lakeX + lakeW * 0.5, lakeY + lakeH * 0.5, lakeW * 0.6
      );
      waterGrad.addColorStop(0, "rgba(42, 120, 138, 0.85)");
      waterGrad.addColorStop(0.6, "rgba(20, 75, 90, 0.92)");
      waterGrad.addColorStop(1, "rgba(10, 45, 55, 0.98)");

      ctx.fillStyle = waterGrad;
      ctx.beginPath();
      ctx.ellipse(lakeX + lakeW * 0.45, lakeY + lakeH * 0.45, lakeW * 0.48, lakeH * 0.42, -0.08, 0, Math.PI * 2);
      ctx.fill();

      // Lake Water Waves & Specular Highlights
      ctx.strokeStyle = "rgba(180, 240, 255, 0.35)";
      ctx.lineWidth = 1.5;
      for (let w = 0; w < 5; w++) {
        const waveY = lakeY + 30 + w * 28 + Math.sin(this.time * 2 + w) * 3;
        ctx.beginPath();
        for (let x = lakeX + 20; x < this.width - 20; x += 15) {
          const dy = Math.sin((x * 0.04) + this.time * 2.5 + w) * 3.5;
          if (x === lakeX + 20) ctx.moveTo(x, waveY + dy);
          else ctx.lineTo(x, waveY + dy);
        }
        ctx.stroke();
      }

      // Water Ripples (Generated by wallowing buffalos or user clicks)
      if (this.enableRipples) {
        for (let r = this.ripples.length - 1; r >= 0; r--) {
          const rip = this.ripples[r];
          rip.radius += rip.speed;
          rip.opacity -= 0.012;

          if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
            this.ripples.splice(r, 1);
            continue;
          }

          ctx.strokeStyle = `rgba(220, 248, 255, ${rip.opacity})`;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.ellipse(rip.x, rip.y, rip.radius, rip.radius * 0.45, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();

      // D. Realistic Silhouettes of 500 Buffalos Grazing & Wallowing
      this.drawBuffaloSilhouettes(ctx);

      // E. Volumetric Atmospheric Mist (Drifting ground fog)
      if (this.enableMist && this.mode !== "noon") {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        this.mistClouds.forEach(cloud => {
          cloud.x += cloud.speed;
          cloud.y += Math.sin(this.time + cloud.x * 0.01) * 0.2;
          if (cloud.x - cloud.radius > this.width) {
            cloud.x = -cloud.radius;
            cloud.y = this.height * 0.45 + Math.random() * (this.height * 0.45);
          }

          const mGrad = ctx.createRadialGradient(
            cloud.x, cloud.y, 0,
            cloud.x, cloud.y, cloud.radius
          );
          const colorStr = this.mode === "golden" ? "255, 230, 190" : (this.mode === "night" ? "120, 170, 200" : "220, 240, 255");
          mGrad.addColorStop(0, `rgba(${colorStr}, ${cloud.opacity})`);
          mGrad.addColorStop(0.5, `rgba(${colorStr}, ${cloud.opacity * 0.5})`);
          mGrad.addColorStop(1, `rgba(${colorStr}, 0)`);

          ctx.fillStyle = mGrad;
          ctx.beginPath();
          ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // F. Atmospheric Fireflies / Golden Pollen Spores
      ctx.save();
      this.particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.glow += 0.05;

        if (p.x < 0) p.x = this.width;
        if (p.x > this.width) p.x = 0;
        if (p.y < 0) p.y = this.height;
        if (p.y > this.height) p.y = 0;

        const pulse = 0.5 + Math.sin(p.glow) * 0.5;
        ctx.fillStyle = this.mode === "night"
          ? `hsla(110, 95%, 75%, ${0.3 + pulse * 0.7})`
          : `hsla(${p.hue}, 95%, 70%, ${0.2 + pulse * 0.6})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.8 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    drawBuffaloSilhouettes(ctx) {
      ctx.save();
      ctx.fillStyle = "#111813";

      // 1. Buffalo bathing in lake with horns above water
      const lakeBuffaloX = this.width * 0.62;
      const lakeBuffaloY = this.height * 0.76;
      ctx.beginPath();
      // Back & Shoulder ridge in water
      ctx.ellipse(lakeBuffaloX, lakeBuffaloY, 32, 16, -0.05, Math.PI, 0);
      // Head
      ctx.ellipse(lakeBuffaloX + 26, lakeBuffaloY - 8, 14, 11, 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Curled Horns
      ctx.strokeStyle = "#38413b";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(lakeBuffaloX + 22, lakeBuffaloY - 18, 10, 0.3, Math.PI * 1.1);
      ctx.stroke();

      // Water ripples around swimming buffalo
      ctx.strokeStyle = "rgba(220, 250, 255, 0.4)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(lakeBuffaloX + 6, lakeBuffaloY + 2, 42, 10, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Large Majestic Bull Grazing on Pasture Meadow
      const bullX = this.width * 0.22;
      const bullY = this.height * 0.68;
      const bob = Math.sin(this.time * 2) * 3;

      // Torso
      ctx.beginPath();
      ctx.ellipse(bullX, bullY, 48, 28, -0.05, 0, Math.PI * 2);
      // Shoulder Wither Hump
      ctx.ellipse(bullX + 18, bullY - 14, 22, 16, 0.1, 0, Math.PI * 2);
      // Head bobbing down grazing
      ctx.ellipse(bullX + 48, bullY + 4 + bob, 18, 14, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Horns
      ctx.strokeStyle = "#474e48";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(bullX + 44, bullY - 12 + bob, 14, 0.2, Math.PI * 1.05);
      ctx.stroke();

      // Sturdy 4 Legs
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#111813";
      [
        [bullX - 28, bullY + 18, bullX - 28, bullY + 54],
        [bullX - 12, bullY + 18, bullX - 12, bullY + 54],
        [bullX + 16, bullY + 18, bullX + 18, bullY + 54],
        [bullX + 32, bullY + 18, bullX + 30, bullY + 54]
      ].forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // Swishing Tail
      const tailSwish = Math.sin(this.time * 3.5) * 8;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bullX - 44, bullY);
      ctx.quadraticCurveTo(bullX - 58, bullY + 20, bullX - 50 + tailSwish, bullY + 38);
      ctx.stroke();

      // 3. Herd silhouettes in distance
      for (let h = 0; h < 6; h++) {
        const hx = this.width * (0.08 + h * 0.14);
        const hy = this.height * 0.48 + Math.sin(h * 2) * 8;
        ctx.beginPath();
        ctx.ellipse(hx, hy, 16, 9, 0, 0, Math.PI * 2);
        ctx.ellipse(hx + 10, hy + 2, 7, 5, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  window.BuffaloSanctuaryVFX = BuffaloSanctuaryVFX;
})(window);

