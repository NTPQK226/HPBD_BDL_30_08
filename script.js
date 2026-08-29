/**
 * HAPPY BIRTHDAY BÙI DIỆU LINH (30/08/2005)
 * Interactive Engine: Particles, 3D Envelope, Candle Blow, Confetti, Shooting Stars & Web Audio
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const bgCanvas = document.getElementById('bg-canvas');
  const confettiCanvas = document.getElementById('confetti-canvas');
  const bgCtx = bgCanvas.getContext('2d');
  const confettiCtx = confettiCanvas.getContext('2d');

  const sceneEnvelope = document.getElementById('scene-envelope');
  const sceneCake = document.getElementById('scene-cake');
  const sceneLetter = document.getElementById('scene-letter');

  const envelope = document.getElementById('envelope');
  const btnOpenEnvelope = document.getElementById('btn-open-envelope');
  const candle = document.getElementById('candle');
  const candleHint = document.getElementById('candle-hint');
  const wishRevealBox = document.getElementById('wish-reveal-box');
  const btnToLetter = document.getElementById('btn-to-letter');
  const btnReplay = document.getElementById('btn-replay');

  const wishInput = document.getElementById('wish-input');
  const btnSendWish = document.getElementById('btn-send-wish');
  const wishMessage = document.getElementById('wish-message');

  const musicPill = document.getElementById('music-pill');
  const bgAudio = document.getElementById('bg-audio');

  // State
  let isEnvelopeOpened = false;
  let isCandleBlown = false;
  let isMusicPlaying = false;
  let audioContext = null;
  let synthInterval = null;

  // Window resize handler for canvases
  function resizeCanvases() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  /* ==========================================================================
     1. BACKGROUND PARTICLES (Twinkling Stars, Floating Hearts & Orbs)
     ========================================================================== */
  const stars = [];
  const hearts = [];
  const numStars = Math.min(window.innerWidth > 600 ? 80 : 45, 100);

  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * bgCanvas.width;
      this.y = Math.random() * bgCanvas.height;
      this.size = Math.random() * 2 + 0.8;
      this.baseAlpha = Math.random() * 0.6 + 0.2;
      this.alpha = this.baseAlpha;
      this.twinkleSpeed = Math.random() * 0.03 + 0.01;
      this.color = Math.random() > 0.4 ? '#ffffff' : (Math.random() > 0.5 ? '#ffd166' : '#ffb3c1');
    }
    update(dt = 1) {
      this.alpha += this.twinkleSpeed * dt;
      if (this.alpha > 1 || this.alpha < 0.1) {
        this.twinkleSpeed = -this.twinkleSpeed;
      }
    }
    draw() {
      bgCtx.save();
      bgCtx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
      bgCtx.fillStyle = this.color;
      bgCtx.beginPath();
      bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      bgCtx.fill();
      bgCtx.restore();
    }
  }

  class FloatingHeart {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * bgCanvas.width;
      this.y = bgCanvas.height + 20 + Math.random() * 50;
      this.size = Math.random() * 12 + 10;
      this.speedY = Math.random() * 0.7 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.4 + 0.2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.015;
    }
    update(dt = 1) {
      this.y -= this.speedY * dt;
      this.x += this.speedX * dt;
      this.rotation += this.rotSpeed * dt;
      if (this.y < -30) {
        this.reset();
      }
    }
    draw() {
      bgCtx.save();
      bgCtx.globalAlpha = this.alpha;
      bgCtx.translate(this.x, this.y);
      bgCtx.rotate(this.rotation);
      bgCtx.font = `${this.size}px serif`;
      bgCtx.textAlign = 'center';
      bgCtx.textBaseline = 'middle';
      bgCtx.fillText('💖', 0, 0);
      bgCtx.restore();
    }
  }

  for (let i = 0; i < numStars; i++) stars.push(new Star());
  for (let i = 0; i < 12; i++) hearts.push(new FloatingHeart());

  let lastBgTime = performance.now();
  function animateBackground(currentTime) {
    const now = currentTime || performance.now();
    const dt = Math.min((now - lastBgTime) / 16.67, 2.5); // Target 60fps baseline
    lastBgTime = now;

    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    stars.forEach(star => {
      star.update(dt);
      star.draw();
    });
    hearts.forEach(heart => {
      heart.update(dt);
      heart.draw();
    });
    requestAnimationFrame(animateBackground);
  }
  requestAnimationFrame(animateBackground);

  /* ==========================================================================
     2. CONFETTI & FIREWORKS ENGINE (DELTA-TIME NORMALIZED)
     ========================================================================== */
  const confettiParticles = [];
  const shootingStars = [];
  const colors = ['#ff758c', '#ff4d6d', '#ffd166', '#c77dff', '#70d6ff', '#ffffff'];

  class Confetti {
    constructor(x, y) {
      this.x = x || confettiCanvas.width / 2;
      this.y = y || confettiCanvas.height / 2;
      this.size = Math.random() * 9 + 5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedX = (Math.random() - 0.5) * 14;
      this.speedY = Math.random() * -12 - 4;
      this.gravity = 0.32;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 10;
      this.alpha = 1;
      this.decay = Math.random() * 0.012 + 0.008;
    }
    update(dt = 1) {
      this.x += this.speedX * dt;
      this.y += this.speedY * dt;
      this.speedY += this.gravity * dt;
      this.speedX *= Math.pow(0.98, dt);
      this.rotation += this.rotSpeed * dt;
      this.alpha -= this.decay * dt;
    }
    draw() {
      confettiCtx.save();
      confettiCtx.globalAlpha = Math.max(0, this.alpha);
      confettiCtx.translate(this.x, this.y);
      confettiCtx.rotate((this.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = this.color;
      confettiCtx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      confettiCtx.restore();
    }
  }

  class ShootingStar {
    constructor(startX, startY, text) {
      this.x = startX || Math.random() * confettiCanvas.width * 0.5;
      this.y = startY || Math.random() * confettiCanvas.height * 0.3;
      this.length = 120;
      this.speed = 16;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
      this.alpha = 1;
      this.text = text || '';
    }
    update(dt = 1) {
      this.x += Math.cos(this.angle) * this.speed * dt;
      this.y += Math.sin(this.angle) * this.speed * dt;
      this.alpha -= 0.015 * dt;
    }
    draw() {
      confettiCtx.save();
      confettiCtx.globalAlpha = Math.max(0, this.alpha);
      
      const gradient = confettiCtx.createLinearGradient(
        this.x, this.y,
        this.x - Math.cos(this.angle) * this.length,
        this.y - Math.sin(this.angle) * this.length
      );
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.3, '#ffd166');
      gradient.addColorStop(1, 'transparent');

      confettiCtx.strokeStyle = gradient;
      confettiCtx.lineWidth = 3;
      confettiCtx.beginPath();
      confettiCtx.moveTo(this.x, this.y);
      confettiCtx.lineTo(
        this.x - Math.cos(this.angle) * this.length,
        this.y - Math.sin(this.angle) * this.length
      );
      confettiCtx.stroke();

      if (this.text) {
        confettiCtx.font = '16px "Be Vietnam Pro", sans-serif';
        confettiCtx.fillStyle = '#ffd166';
        confettiCtx.fillText(`✨ ${this.text}`, this.x + 15, this.y);
      }
      confettiCtx.restore();
    }
  }

  function triggerConfettiBurst(x, y, count = 100) {
    for (let i = 0; i < count; i++) {
      confettiParticles.push(new Confetti(x, y));
    }
  }

  function launchShootingStar(text) {
    shootingStars.push(new ShootingStar(null, null, text));
  }

  let lastConfettiTime = performance.now();
  function animateConfetti(currentTime) {
    const now = currentTime || performance.now();
    const dt = Math.min((now - lastConfettiTime) / 16.67, 2.5);
    lastConfettiTime = now;

    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.update(dt);
      p.draw();
      if (p.alpha <= 0 || p.y > confettiCanvas.height + 20) {
        confettiParticles.splice(i, 1);
      }
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.update(dt);
      s.draw();
      if (s.alpha <= 0) {
        shootingStars.splice(i, 1);
      }
    }

    requestAnimationFrame(animateConfetti);
  }
  requestAnimationFrame(animateConfetti);

  /* ==========================================================================
     3. AUDIO CONTROLLER (MP3 PLAYER)
     ========================================================================== */
  function startMusic() {
    if (isMusicPlaying) return;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isMusicPlaying = true;
          musicPill.classList.add('playing');
        })
        .catch((err) => {
          console.log('Chờ người dùng chạm màn hình để phát nhạc:', err);
        });
    }
  }

  function toggleMusic(e) {
    if (e) e.stopPropagation();
    if (isMusicPlaying) {
      bgAudio.pause();
      musicPill.classList.remove('playing');
      isMusicPlaying = false;
    } else {
      bgAudio.play().then(() => {
        isMusicPlaying = true;
        musicPill.classList.add('playing');
      }).catch(err => console.log(err));
    }
  }

  musicPill.addEventListener('click', toggleMusic);

  // Sync audio element events with UI
  bgAudio.addEventListener('play', () => {
    isMusicPlaying = true;
    musicPill.classList.add('playing');
  });

  bgAudio.addEventListener('pause', () => {
    isMusicPlaying = false;
    musicPill.classList.remove('playing');
  });

  // Try auto-play on load
  window.addEventListener('load', () => {
    startMusic();
  });

  // Unlock audio on ANY first user interaction (touch/click anywhere on page)
  function unlockAudioOnFirstInteraction() {
    if (!isMusicPlaying) {
      startMusic();
    }
    document.removeEventListener('pointerdown', unlockAudioOnFirstInteraction);
    document.removeEventListener('click', unlockAudioOnFirstInteraction);
    document.removeEventListener('touchstart', unlockAudioOnFirstInteraction);
  }
  document.addEventListener('pointerdown', unlockAudioOnFirstInteraction, { once: true, passive: true });
  document.addEventListener('click', unlockAudioOnFirstInteraction, { once: true });
  document.addEventListener('touchstart', unlockAudioOnFirstInteraction, { once: true, passive: true });

  /* ==========================================================================
     4. SCENE NAVIGATION & INTERACTION
     ========================================================================== */
  function switchScene(fromScene, toScene) {
    fromScene.style.opacity = '0';
    fromScene.style.transform = 'translateY(-20px) scale(0.96)';

    setTimeout(() => {
      fromScene.classList.remove('active');
      fromScene.style.display = 'none';

      toScene.style.display = 'flex';
      toScene.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger scene entrance
      setTimeout(() => {
        toScene.style.opacity = '1';
        toScene.style.transform = 'translateY(0) scale(1)';
      }, 50);
    }, 500);
  }

  // Open Envelope
  function handleOpenEnvelope() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    envelope.classList.add('opened');
    btnOpenEnvelope.style.opacity = '0';
    btnOpenEnvelope.style.pointerEvents = 'none';

    // Start background music automatically on interaction
    if (!isMusicPlaying) {
      toggleMusic();
    }

    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 90);

    setTimeout(() => {
      switchScene(sceneEnvelope, sceneCake);
    }, 1600);
  }

  envelope.addEventListener('click', handleOpenEnvelope);
  btnOpenEnvelope.addEventListener('click', handleOpenEnvelope);

  // Blow Candle
  candle.addEventListener('click', () => {
    if (isCandleBlown) return;
    isCandleBlown = true;

    candle.classList.add('blown');
    candleHint.textContent = '✨ Ước nguyện đã tỏa sáng! ✨';

    // Mega Confetti & Starburst
    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.4, 150);
    setTimeout(() => {
      triggerConfettiBurst(window.innerWidth * 0.3, window.innerHeight * 0.35, 80);
      triggerConfettiBurst(window.innerWidth * 0.7, window.innerHeight * 0.35, 80);
    }, 300);

    // Reveal Next Step
    setTimeout(() => {
      wishRevealBox.classList.add('show');
    }, 800);
  });

  // Go to Letter & Gallery Scene
  btnToLetter.addEventListener('click', () => {
    switchScene(sceneCake, sceneLetter);
  });

  // Wish Maker (Shooting Star)
  btnSendWish.addEventListener('click', () => {
    const wishText = wishInput.value.trim();
    if (!wishText) {
      wishMessage.textContent = 'Linh hãy nhập điều ước của mình trước nhé! 💖';
      return;
    }

    launchShootingStar(wishText);
    wishMessage.textContent = '⭐ Điều ước của Linh đang bay vút vào dải ngân hà rồi đó! ✨';
    wishInput.value = '';

    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.7, 50);

    setTimeout(() => {
      wishMessage.textContent = '';
    }, 5000);
  });

  wishInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      btnSendWish.click();
    }
  });

  // Replay from beginning
  btnReplay.addEventListener('click', () => {
    isEnvelopeOpened = false;
    isCandleBlown = false;
    envelope.classList.remove('opened');
    btnOpenEnvelope.style.opacity = '1';
    btnOpenEnvelope.style.pointerEvents = 'auto';
    candle.classList.remove('blown');
    wishRevealBox.classList.remove('show');
    candleHint.textContent = 'Chạm vào ngọn nến để thổi tắt và gửi ước nguyện...';

    switchScene(sceneLetter, sceneEnvelope);
  });

  /* ==========================================================================
     5. 3D CARD TILT EFFECT (Mouse / Touch)
     ========================================================================== */
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
});
