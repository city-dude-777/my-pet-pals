// ============================================================
// MY PET PALS — Main Game Script
// A kawaii chibi virtual pet game for kids ages 8–10
// ============================================================

(function () {
  'use strict';

  // ──────────── AUDIO SYSTEM (Web Audio API beeps) ────────────
  // Simple beep/chirp sounds using oscillators — no external audio files.
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function ensureAudio() {
    if (!audioCtx) audioCtx = new AudioCtx();
  }

  function playBeep(freq = 520, duration = 0.1, type = 'sine', vol = 0.15) {
    try {
      ensureAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = vol;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) { /* silent fail */ }
  }

  function sfxClick()   { playBeep(660, 0.08, 'sine', 0.12); }
  function sfxHappy()   { playBeep(880, 0.12, 'sine', 0.14); setTimeout(() => playBeep(1100, 0.12, 'sine', 0.14), 120); }
  function sfxPop()     { playBeep(1200, 0.06, 'sine', 0.1); }
  function sfxMunch()   { playBeep(300, 0.08, 'square', 0.08); setTimeout(() => playBeep(350, 0.08, 'square', 0.08), 100); }
  function sfxSplash()  { playBeep(400, 0.2, 'sawtooth', 0.06); }
  function sfxBrush()   { playBeep(500, 0.05, 'triangle', 0.1); }
  function sfxSticker() { playBeep(700, 0.1, 'sine', 0.12); setTimeout(() => playBeep(900, 0.1, 'sine', 0.12), 100); setTimeout(() => playBeep(1200, 0.15, 'sine', 0.14), 200); }
  function sfxEvent()   { playBeep(600, 0.15, 'triangle', 0.1); }

  // ──────────── DOM REFERENCES ────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const splashScreen   = $('#splash-screen');
  const selectScreen   = $('#select-screen');
  const gameScreen     = $('#game-screen');
  const feedScene      = $('#feed-scene');
  const parkScene      = $('#park-scene');
  const groomScene     = $('#groom-scene');
  const bathScene      = $('#bath-scene');
  const dryScene       = $('#dry-scene');
  const walkScene      = $('#walk-scene');
  const playgroundScene = $('#playground-scene');
  const sleepScene     = $('#sleep-scene');
  const btnStart       = $('#btn-start');
  const petCards       = $$('.pet-card');
  const nameArea       = $('#name-area');
  const petNameInput   = $('#pet-name-input');
  const btnGo          = $('#btn-go');
  const petNameDisplay = $('#pet-name-display');
  const petContainer   = $('#pet-container');
  const accessoryOvl   = $('#accessory-overlay');
  const speechBubble   = $('#speech-bubble');
  const speechText     = $('#speech-text');
  const eventBanner    = $('#event-banner');
  const eventText      = $('#event-text');
  const particlesCont  = $('#particles');
  const confettiCont   = $('#confetti-container');

  // Scene-specific pet containers
  const diningPetContainer = $('#dining-pet-container');
  const parkPetContainer   = $('#park-pet-container');
  const barberPetContainer = $('#barber-pet-container');
  const bathPetContainer   = $('#bath-pet-container');
  const dryPetContainer    = $('#dry-pet-container');
  const diningParticles    = $('#dining-particles');
  const parkParticles      = $('#park-particles');
  const barberParticles    = $('#barber-particles');
  const bathParticles      = $('#bath-particles');
  const dryParticles       = $('#dry-particles');
  const barberFluffCont    = $('#barber-fluff');
  const diningSpeech       = $('#dining-speech');
  const diningSpeechText   = $('#dining-speech-text');
  const parkSpeech         = $('#park-speech');
  const parkSpeechText     = $('#park-speech-text');
  const barberSpeech       = $('#barber-speech');
  const barberSpeechText   = $('#barber-speech-text');
  const bathSpeech         = $('#bath-speech');
  const bathSpeechText     = $('#bath-speech-text');
  const drySpeech          = $('#dry-speech');
  const drySpeechText      = $('#dry-speech-text');
  const barberBrush        = $('#barber-brush');
  const barberGroomZone    = $('#barber-groom-zone');
  const blowdryer          = $('#blowdryer');

  // Walk scene refs
  const walkPetContainer   = $('#walk-pet-container');
  const walkParticles      = $('#walk-particles');
  const walkSpeech         = $('#walk-speech');
  const walkSpeechText     = $('#walk-speech-text');
  const walkPetSpot        = $('#walk-pet-spot');
  const walkPaws           = $('#walk-paws');
  const walkItemsCont      = $('#walk-items');
  const npcPetsArea        = $('#npc-pets-area');
  const npcHeartsArea      = $('#npc-hearts-area');

  // Playground scene refs
  const pgMyPet            = $('#pg-my-pet');
  const pgMyPetContainer   = $('#pg-my-pet-container');
  const pgNpcPet           = $('#pg-npc-pet');
  const pgNpcPetContainer  = $('#pg-npc-pet-container');
  const pgNpcTag           = $('#pg-npc-tag');
  const pgMySpeech         = $('#pg-my-speech');
  const pgMySpeechText     = $('#pg-my-speech-text');
  const pgNpcSpeech        = $('#pg-npc-speech');
  const pgNpcSpeechText    = $('#pg-npc-speech-text');
  const pgParticles        = $('#pg-particles');
  const pgFunMeter         = $('#pg-fun-meter');
  const pgTricksDone       = $('#pg-tricks-done');

  // Sleep scene refs
  const bedPetContainer = $('#bed-pet-container');
  const bedPetSpot      = document.querySelector('.bed-pet-spot');
  const bedBlanket      = $('#bed-blanket');
  const zzzArea         = $('#zzz-area');
  const bedSpeech       = $('#bed-speech');
  const bedSpeechText   = $('#bed-speech-text');
  const bedParticles    = $('#bed-particles');
  const bedTitle        = $('#bed-title');
  const bedHint         = $('#bed-hint');

  // Event visual overlay
  const eventVisual     = $('#event-visual');

  // Stat elements
  const hungerBar  = $('#hunger-bar');
  const cleanBar   = $('#clean-bar');
  const funBar     = $('#fun-bar');
  const groomBar   = $('#groom-bar');
  const hungerVal  = $('#hunger-val');
  const cleanVal   = $('#clean-val');
  const funVal     = $('#fun-val');
  const groomVal   = $('#groom-val');
  const happyBar   = $('#happiness-bar');
  const happyFace  = $('#happiness-face');
  const happyVal   = $('#happiness-val');
  const heartsCount = $('#hearts-count');

  // Action buttons
  const btnFeed   = $('#btn-feed');
  const btnShower = $('#btn-shower');
  const btnPlay   = $('#btn-play');
  const btnGroom  = $('#btn-groom');
  const btnWalk   = $('#btn-walk');
  const btnSleep  = $('#btn-sleep');
  const btnStickers = $('#btn-stickers');
  const btnNewPet = $('#btn-new-pet');

  // Overlays
  const stickerOverlay = $('#sticker-overlay');

  // ──────────── GAME STATE ────────────
  let state = {
    petType: null,       // 'dog' | 'cat' | 'bird'
    petName: 'Buddy',
    hunger: 70,
    cleanliness: 70,
    fun: 70,
    grooming: 70,
    hearts: 0,
    stickers: [],        // array of sticker emoji strings
    equippedAccessory: null,  // accessory id or null
    happyStreak: 0,      // seconds happiness >= 80
  };

  // Available sticker icons (max collection)
  const STICKER_ICONS = ['⭐','🌟','💖','🌈','🎀','🍭','🦄','🌸','🎵','🍩','🧁','🐾','🎠','🦋','🌻','🍬'];

  // Accessories (unlock requirements: sticker count)
  const ACCESSORIES = [
    { id: 'chef-hat',      label: '👨‍🍳 Chef Hat',     req: 1, cssClass: 'acc-chef-hat' },
    { id: 'bow-tie',       label: '🎀 Bow Tie',       req: 2, cssClass: 'acc-bow-tie' },
    { id: 'collar',        label: '📿 Collar Tag',    req: 3, cssClass: 'acc-collar' },
    { id: 'flower-crown',  label: '🌸 Flower Crown',  req: 5, cssClass: 'acc-flower-crown' },
    { id: 'star-headband', label: '⭐ Star Band',     req: 7, cssClass: 'acc-star-headband' },
  ];

  // Cute dialogue lines
  const IDLE_LINES = [
    'Hi hi! I\'m your tiny buddy!',
    'Snack time? Pretty please?',
    'BUBBLES!!!',
    'I feel sparkly!',
    'Let\'s play! 🎈',
    'I love you THIS much! 💕',
    'Am I the cutest?',
    'Wiggle wiggle!',
    'Hehe! That tickles!',
    'You\'re the best!',
    'Paws up! 🐾',
    'Fluffy mode: ON!',
  ];

  // Random events: { text, effects: { hunger, cleanliness, fun, grooming } }
  const RANDOM_EVENTS = [
    { text: '🧦 Your pet found a mystery sock!', effects: { fun: 8, cleanliness: -5 }, visual: 'sock', visualCount: 2 },
    { text: '🦋 A butterfly landed on your pet!', effects: { fun: 10 }, visual: 'butterfly', visualCount: 3 },
    { text: '✨ Glitter breeze!', effects: { cleanliness: 8, fun: 6 }, visual: 'glitter', visualCount: 8 },
    { text: '🍪 Snack crumbs everywhere!', effects: { hunger: 8, cleanliness: -5 }, visual: 'crumbs', visualCount: 5 },
    { text: '🌈 Rainbow appeared!', effects: { fun: 12 }, visual: 'rainbow', visualCount: 2 },
    { text: '💐 Your pet smelled some flowers!', effects: { fun: 5, grooming: 4 }, visual: 'flower', visualCount: 4 },
    { text: '🎶 A catchy tune played!', effects: { fun: 8 }, visual: 'music', visualCount: 5 },
    { text: '🧼 A soap bubble drifted by!', effects: { cleanliness: 6 }, visual: 'soap', visualCount: 4 },
    { text: '🍃 A leaf fell on your pet!', effects: { fun: 4, grooming: -3 }, visual: 'leaf', visualCount: 3 },
    { text: '⭐ A star winked at your pet!', effects: { fun: 6, grooming: 3 }, visual: 'star', visualCount: 4 },
  ];

  // Timers
  let decayInterval  = null;
  let dialogueTimer  = null;
  let eventTimer     = null;
  let happyCheckTimer = null;
  let blinkTimer     = null;
  let actionLocked   = false;   // prevent spamming actions during mini-games

  // ──────────── UTILITY HELPERS ────────────
  function clamp(v, min = 0, max = 100) { return Math.max(min, Math.min(max, v)); }
  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[rand(0, arr.length - 1)]; }

  function showScreen(screen) {
    [splashScreen, selectScreen, gameScreen, feedScene, parkScene, groomScene, bathScene, dryScene, walkScene, playgroundScene, sleepScene].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
    // Hide the brush when leaving barber shop
    if (screen !== groomScene) barberBrush.style.display = 'none';
    // Hide the blowdryer when leaving dry scene
    if (screen !== dryScene) blowdryer.style.display = 'none';
  }

  // ──────────── PET DRAWING (build chibi pet HTML via JS) ────────────
  // Returns the inner HTML for the current pet type
  function getPetHTML() {
    if (state.petType === 'dog') {
      return `
        <div class="dog-ear-l"></div>
        <div class="dog-ear-r"></div>
        <div class="chibi-body">
          <div class="chibi-belly"></div>
          <div class="chibi-eyes"><div class="chibi-eye eye-l"></div><div class="chibi-eye eye-r"></div></div>
          <div class="chibi-nose"></div>
          <div class="chibi-mouth"></div>
          <div class="chibi-blush-l"></div>
          <div class="chibi-blush-r"></div>
        </div>
        <div class="chibi-legs"><div class="chibi-leg"></div><div class="chibi-leg"></div></div>
        <div class="dog-tail"></div>
      `;
    } else if (state.petType === 'cat') {
      return `
        <div class="cat-ear-l"></div>
        <div class="cat-ear-r"></div>
        <div class="cat-ear-inner-l"></div>
        <div class="cat-ear-inner-r"></div>
        <div class="chibi-body">
          <div class="chibi-belly"></div>
          <div class="chibi-eyes"><div class="chibi-eye eye-l"></div><div class="chibi-eye eye-r"></div></div>
          <div class="chibi-nose"></div>
          <div class="chibi-mouth"></div>
          <div class="chibi-blush-l"></div>
          <div class="chibi-blush-r"></div>
          <div class="cat-whiskers">
            <div class="cat-whisker"></div><div class="cat-whisker"></div>
            <div class="cat-whisker"></div><div class="cat-whisker"></div>
          </div>
        </div>
        <div class="chibi-legs"><div class="chibi-leg"></div><div class="chibi-leg"></div></div>
        <div class="cat-tail"></div>
      `;
    } else {
      return `
        <div class="bird-wing-l"></div>
        <div class="bird-wing-r"></div>
        <div class="chibi-body">
          <div class="chibi-belly"></div>
          <div class="chibi-eyes"><div class="chibi-eye eye-l"></div><div class="chibi-eye eye-r"></div></div>
          <div class="chibi-blush-l"></div>
          <div class="chibi-blush-r"></div>
        </div>
        <div class="bird-beak"></div>
        <div class="chibi-legs"><div class="chibi-leg"></div><div class="chibi-leg"></div></div>
      `;
    }
  }

  // Draws the pet into a specific container. id is optional (for #chibi-pet in main screen).
  function drawPetInto(container, id) {
    container.innerHTML = '';
    const pet = document.createElement('div');
    pet.className = `chibi-pet ${state.petType}`;
    if (id) pet.id = id;
    pet.innerHTML = getPetHTML();
    container.appendChild(pet);
    return pet;
  }

  // Constructs the CSS-only pet inside #pet-container (main game screen)
  function drawPet() {
    drawPetInto(petContainer, 'chibi-pet');
    updateAccessory();
  }

  // ──────────── STAT UPDATES & UI SYNC ────────────
  // Refreshes all stat bars, happiness meter, and pet visual reactions.
  function updateUI() {
    const h  = Math.round(state.hunger);
    const c  = Math.round(state.cleanliness);
    const f  = Math.round(state.fun);
    const g  = Math.round(state.grooming);
    const hp = Math.round((h + c + f + g) / 4);

    hungerBar.style.width = h + '%';
    cleanBar.style.width  = c + '%';
    funBar.style.width    = f + '%';
    groomBar.style.width  = g + '%';
    happyBar.style.width  = hp + '%';

    hungerVal.textContent = h;
    cleanVal.textContent  = c;
    funVal.textContent    = f;
    groomVal.textContent  = g;
    happyVal.textContent  = hp;

    // Happiness face
    if (hp >= 90) happyFace.textContent = '🤩';
    else if (hp >= 75) happyFace.textContent = '😄';
    else if (hp >= 55) happyFace.textContent = '🙂';
    else if (hp >= 35) happyFace.textContent = '😐';
    else if (hp >= 18) happyFace.textContent = '😟';
    else happyFace.textContent = '😭';

    heartsCount.textContent = state.hearts;

    // Color-code bars when low
    hungerBar.style.background = h < 25 ? '#ff6b6b' : '';
    cleanBar.style.background  = c < 25 ? '#ff6b6b' : '';
    funBar.style.background    = f < 25 ? '#ff6b6b' : '';
    groomBar.style.background  = g < 25 ? '#ff6b6b' : '';

    // Pet reactions based on lowest stat
    updatePetReaction(h, c, f, g);
  }

  // Visual pet reactions based on stat levels
  function updatePetReaction(h, c, f, g) {
    const pet = $('#chibi-pet');
    if (!pet) return;

    pet.classList.remove('pet-bored');

    // Stink lines if dirty
    if (c < 20) {
      if (!petContainer.querySelector('.stink-line')) {
        for (let i = 0; i < 3; i++) {
          const s = document.createElement('span');
          s.className = 'stink-line';
          s.textContent = '💨';
          s.style.left = rand(20, 80) + '%';
          s.style.top = rand(0, 30) + '%';
          s.style.animationDelay = (i * 0.3) + 's';
          petContainer.appendChild(s);
          setTimeout(() => s.remove(), 1500);
        }
      }
    }

    // Pleading eyes when hungry
    const eyes = petContainer.querySelectorAll('.chibi-eye');
    eyes.forEach(e => e.classList.toggle('pleading', h < 20));

    // Bored sway when fun is low
    if (f < 20) {
      pet.classList.add('pet-bored');
    }
  }

  // ──────────── GAME LOOP: STAT DECAY ────────────
  // Every 3 seconds stats gently decay. Each pet type decays differently:
  //   Dog: cleanliness drops faster (gets dirty playing)
  //   Cat: grooming drops faster (fur care matters)
  //   Bird: hunger drops faster (tiny tummy)
  function startDecay() {
    if (decayInterval) clearInterval(decayInterval);
    decayInterval = setInterval(() => {
      let hd = 1.5, cd = 1.0, fd = 1.2, gd = 0.8;

      if (state.petType === 'dog')  { cd = 1.8; fd = 0.9; }
      if (state.petType === 'cat')  { gd = 1.5; hd = 1.8; }
      if (state.petType === 'bird') { hd = 2.2; gd = 0.6; }

      state.hunger      = clamp(state.hunger - hd);
      state.cleanliness = clamp(state.cleanliness - cd);
      state.fun         = clamp(state.fun - fd);
      state.grooming    = clamp(state.grooming - gd);

      updateUI();
      saveGame();
    }, 3000);
  }

  // ──────────── BLINK ANIMATION ────────────
  // Pet blinks every few seconds for liveliness.
  function startBlink() {
    if (blinkTimer) clearInterval(blinkTimer);
    const doBlink = () => {
      const eyes = petContainer.querySelectorAll('.chibi-eye');
      eyes.forEach(e => e.classList.add('blink'));
      setTimeout(() => eyes.forEach(e => e.classList.remove('blink')), 180);
    };
    blinkTimer = setInterval(doBlink, rand(2500, 5000));
  }

  // ──────────── SPEECH BUBBLE ROTATION ────────────
  function startDialogue() {
    if (dialogueTimer) clearInterval(dialogueTimer);
    const show = () => {
      speechText.textContent = pick(IDLE_LINES);
      speechBubble.classList.remove('hidden');
      setTimeout(() => speechBubble.classList.add('hidden'), 4000);
    };
    show();
    dialogueTimer = setInterval(show, rand(8000, 14000));
  }

  function showSpeech(text, duration = 3000) {
    speechText.textContent = text;
    speechBubble.classList.remove('hidden');
    setTimeout(() => speechBubble.classList.add('hidden'), duration);
  }

  // ──────────── RANDOM CUTE EVENTS ────────────
  // Every 15–25 seconds, a random event pops up with small stat effects.
  function startEvents() {
    if (eventTimer) clearInterval(eventTimer);
    const trigger = () => {
      const evt = pick(RANDOM_EVENTS);
      // Apply effects
      if (evt.effects.hunger)      state.hunger      = clamp(state.hunger      + evt.effects.hunger);
      if (evt.effects.cleanliness) state.cleanliness = clamp(state.cleanliness + evt.effects.cleanliness);
      if (evt.effects.fun)         state.fun         = clamp(state.fun         + evt.effects.fun);
      if (evt.effects.grooming)    state.grooming    = clamp(state.grooming    + evt.effects.grooming);

      sfxEvent();
      showEventBanner(evt.text);
      // Show visual animation on the pet so you can SEE the event happen
      if (evt.visual) {
        showEventVisuals(evt.visual, evt.visualCount || 3);
      }
      updateUI();
      // Reschedule
      clearTimeout(eventTimer);
      eventTimer = setTimeout(trigger, rand(15000, 25000));
    };
    eventTimer = setTimeout(trigger, rand(15000, 25000));
  }

  function showEventBanner(text) {
    eventText.textContent = text;
    eventBanner.classList.remove('hidden');
    setTimeout(() => eventBanner.classList.add('hidden'), 3500);
  }

  // ──────────── HAPPINESS STREAK → STICKER REWARD ────────────
  // If happiness stays ≥80 for 30 seconds straight, award a sticker.
  function startHappyCheck() {
    if (happyCheckTimer) clearInterval(happyCheckTimer);
    happyCheckTimer = setInterval(() => {
      const hp = (state.hunger + state.cleanliness + state.fun + state.grooming) / 4;
      if (hp >= 80) {
        state.happyStreak++;
        if (state.happyStreak >= 30) {
          awardSticker();
          state.happyStreak = 0;
        }
      } else {
        state.happyStreak = 0;
      }
    }, 1000);
  }

  function awardSticker() {
    if (state.stickers.length >= STICKER_ICONS.length) return; // max collected
    const available = STICKER_ICONS.filter(s => !state.stickers.includes(s));
    if (available.length === 0) return;
    const sticker = pick(available);
    state.stickers.push(sticker);
    state.hearts += 5;
    sfxSticker();
    showSpeech('NEW STICKER! ' + sticker, 4000);
    spawnConfetti();
    updateUI();
    saveGame();
  }

  // ──────────── PARTICLES & CONFETTI ────────────
  function spawnSparkles(count = 6) {
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle-particle';
      s.textContent = pick(['✨', '⭐', '💫', '🌟']);
      s.style.left = rand(20, 80) + '%';
      s.style.top = rand(20, 70) + '%';
      s.style.animationDelay = (i * 0.1) + 's';
      particlesCont.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }
  }

  function spawnFloatEmoji(emoji, count = 4) {
    for (let i = 0; i < count; i++) {
      const e = document.createElement('span');
      e.className = 'float-emoji';
      e.textContent = emoji;
      e.style.left = rand(25, 75) + '%';
      e.style.top = rand(40, 70) + '%';
      e.style.setProperty('--dx', rand(-40, 40) + 'px');
      e.style.animationDelay = (i * 0.15) + 's';
      particlesCont.appendChild(e);
      setTimeout(() => e.remove(), 1400);
    }
  }

  function spawnConfetti(count = 30) {
    const colors = ['#ff6b8a', '#ffd93d', '#6bcb77', '#4d96ff', '#ff8585', '#c084fc', '#f9a8d4'];
    for (let i = 0; i < count; i++) {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      c.style.left = rand(5, 95) + '%';
      c.style.background = pick(colors);
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      c.style.width = rand(6, 12) + 'px';
      c.style.height = rand(6, 12) + 'px';
      c.style.animationDuration = (1.5 + Math.random()) + 's';
      c.style.animationDelay = (Math.random() * 0.5) + 's';
      confettiCont.appendChild(c);
      setTimeout(() => c.remove(), 3000);
    }
  }

  // Happy bounce on pet
  function petBounce() {
    const pet = $('#chibi-pet');
    if (!pet) return;
    pet.classList.remove('pet-happy');
    void pet.offsetWidth; // trigger reflow
    pet.classList.add('pet-happy');
    setTimeout(() => pet.classList.remove('pet-happy'), 1500);
  }

  // ──────────── ACCESSORY RENDERING ────────────
  function updateAccessory() {
    accessoryOvl.innerHTML = '';
    if (!state.equippedAccessory) return;
    const acc = ACCESSORIES.find(a => a.id === state.equippedAccessory);
    if (!acc) return;
    const el = document.createElement('div');
    el.className = acc.cssClass;
    accessoryOvl.appendChild(el);
  }

  // ──────────── ACTIONS ────────────

  // ── FEED (Dining Room Scene) ──
  // Transitions to a full dining room scene with the pet at a table.
  // Player picks a snack, pet eats with animation, then returns to game.
  function openFeed() {
    if (actionLocked) return;
    sfxClick();
    // Draw pet in dining room
    drawPetInto(diningPetContainer, 'dining-chibi-pet');
    // Show the food plate empty
    $('#plate-food').textContent = '';
    // Show speech
    diningSpeechText.textContent = pick(['Yummy time!', 'What\'s for dinner?', 'I\'m hungry! 🍽️', 'Snack o\'clock!']);
    diningSpeech.classList.remove('hidden');
    // Switch to dining scene
    showScreen(feedScene);
  }

  function leaveDiningRoom() {
    showScreen(gameScreen);
  }

  // Spawn floating food emojis inside the dining room particles container
  function spawnDiningEmoji(emoji, count) {
    for (let i = 0; i < count; i++) {
      const e = document.createElement('span');
      e.className = 'float-emoji';
      e.textContent = emoji;
      e.style.left = rand(30, 70) + '%';
      e.style.top = rand(20, 50) + '%';
      e.style.setProperty('--dx', rand(-40, 40) + 'px');
      e.style.animationDelay = (i * 0.15) + 's';
      diningParticles.appendChild(e);
      setTimeout(() => e.remove(), 1400);
    }
  }

  function doFeed(snack) {
    sfxMunch();
    let hg = 0, fg = 0, gg = 0;
    let foodEmoji = '';

    if (snack === 'kibble') {
      hg = 25;
      foodEmoji = '🍪';
    } else if (snack === 'fish') {
      hg = 20;
      fg = state.petType === 'cat' ? 15 : 8;
      foodEmoji = '🐟';
    } else if (snack === 'seeds') {
      hg = state.petType === 'bird' ? 30 : 18;
      gg = 5;
      foodEmoji = '🌻';
    }

    // Show food on plate
    $('#plate-food').textContent = foodEmoji;

    // Spawn floating food emojis in dining scene
    spawnDiningEmoji(foodEmoji, 5);

    // Bounce the dining pet
    const dPet = $('#dining-chibi-pet');
    if (dPet) {
      dPet.classList.remove('pet-happy');
      void dPet.offsetWidth;
      dPet.classList.add('pet-happy');
    }

    // Update speech in dining room
    diningSpeechText.textContent = pick(['YUM! 😋', 'Nom nom nom!', 'Delicious! 🤤', 'Tasty treat! 🍽️', 'So good!!']);
    diningSpeech.classList.remove('hidden');

    // Apply stats
    state.hunger   = clamp(state.hunger + hg);
    state.fun      = clamp(state.fun + fg);
    state.grooming = clamp(state.grooming + gg);
    state.hearts  += 1;

    updateUI();
    saveGame();

    // After a pause, also spawn sparkles in main game and return
    setTimeout(() => {
      spawnSparkles(4);
      petBounce();
      showSpeech(pick(['That was yummy!', 'Full tummy! 😊', 'Best meal ever!']), 2500);
      leaveDiningRoom();
    }, 2200);
  }

  // ── SHOWER (Bathroom Scene → Blowdry Scene) ──
  // Phase 1: Bathroom — player holds a button to run water, filling a wash meter.
  //          Water streams pour from showerhead, bubbles appear in tub.
  // Phase 2: Blowdry — pet is wet on a mat, player drags a blowdryer over
  //          the pet to dry them. When dry, returns to main game.
  let washProgress = 0;
  let washActive = false;
  let waterHeld = false;
  let washInterval = null;
  let bubbleInterval = null;

  function openShower() {
    if (actionLocked) return;
    actionLocked = true;
    sfxSplash();
    washProgress = 0;
    washActive = true;
    waterHeld = false;

    // Draw pet in bathtub
    drawPetInto(bathPetContainer, 'bath-chibi-pet');

    // Reset UI
    $('#wash-meter').style.width = '0%';
    $('#tub-water').style.height = '0%';
    $('#tub-bubbles').innerHTML = '';
    $('#water-streams').classList.remove('active');
    $('#water-streams').innerHTML = '';

    // Create water stream lines
    const streams = $('#water-streams');
    for (let i = 0; i < 6; i++) {
      const s = document.createElement('div');
      s.className = 'water-stream';
      s.style.left = (3 + i * 6) + 'px';
      s.style.height = '100%';
      s.style.animationDelay = (i * 0.1) + 's';
      streams.appendChild(s);
    }

    // Speech
    bathSpeechText.textContent = pick(['Bath time! 🛁', 'Warm water please!', 'Bubble bath!', 'Splish splash!']);
    bathSpeech.classList.remove('hidden');

    // Switch to bath scene
    showScreen(bathScene);

    // Spawn some initial tub bubbles
    spawnTubBubbles(3);
  }

  function spawnTubBubbles(count) {
    const cont = $('#tub-bubbles');
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'tub-bub';
      b.style.left = rand(10, 85) + '%';
      b.style.bottom = rand(0, 30) + 'px';
      b.style.width = b.style.height = rand(12, 22) + 'px';
      b.style.animationDelay = (Math.random() * 1.5) + 's';
      cont.appendChild(b);
      // Remove after a while to keep things tidy
      setTimeout(() => b.remove(), 4000);
    }
  }

  // Water button: hold to shower
  function startWater() {
    if (!washActive) return;
    waterHeld = true;
    $('#water-streams').classList.add('active');
    $('#btn-water').classList.add('pressing');
    playBeep(200, 0.3, 'sawtooth', 0.04); // water sound

    // Fill meter while holding
    if (washInterval) clearInterval(washInterval);
    washInterval = setInterval(() => {
      if (!waterHeld || !washActive) {
        clearInterval(washInterval);
        return;
      }
      washProgress = Math.min(washProgress + 2, 100);
      $('#wash-meter').style.width = washProgress + '%';
      $('#tub-water').style.height = Math.min(washProgress * 0.6, 60) + 'px';

      // Bubbles while washing
      if (Math.random() > 0.5) spawnTubBubbles(1);

      // Sound ticks
      if (washProgress % 10 === 0) playBeep(300 + washProgress * 2, 0.05, 'sine', 0.06);

      // Speech milestones
      if (washProgress === 30) bathSpeechText.textContent = pick(['Ooh bubbly! 🫧', 'So warm!', 'Scrub scrub!']);
      if (washProgress === 60) bathSpeechText.textContent = pick(['Almost clean!', 'Squeaky! 🧼', 'More bubbles!']);
      if (washProgress === 90) bathSpeechText.textContent = pick(['Nearly done!', 'So fresh!', 'One more splash!']);

      if (washProgress >= 100) {
        endWashPhase();
      }
    }, 100);

    // Also keep spawning bubbles
    if (bubbleInterval) clearInterval(bubbleInterval);
    bubbleInterval = setInterval(() => {
      if (waterHeld && washActive) spawnTubBubbles(2);
    }, 800);
  }

  function stopWater() {
    waterHeld = false;
    $('#water-streams').classList.remove('active');
    $('#btn-water').classList.remove('pressing');
    clearInterval(washInterval);
    clearInterval(bubbleInterval);
  }

  function endWashPhase() {
    washActive = false;
    stopWater();

    // Apply half the cleanliness gain (rest comes from drying)
    state.cleanliness = clamp(state.cleanliness + 20);
    state.hearts += 1;

    bathSpeechText.textContent = pick(['All clean! Time to dry! 💨', 'Squeaky clean!', 'Now let\'s dry off!']);

    // Spawn sparkles in bath
    for (let i = 0; i < 6; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle-particle';
      s.textContent = pick(['🫧', '✨', '💧']);
      s.style.left = rand(20, 80) + '%';
      s.style.top = rand(10, 50) + '%';
      s.style.animationDelay = (i * 0.1) + 's';
      bathParticles.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }

    updateUI();
    saveGame();

    // Transition to blowdry scene after a moment
    setTimeout(() => {
      openBlowdry();
    }, 1800);
  }

  function leaveBathroom() {
    washActive = false;
    stopWater();
    actionLocked = false;
    showScreen(gameScreen);
  }

  // ── BLOWDRY PHASE ──
  let dryProgress = 0;
  let dryActive = false;
  let dryerDragging = false;
  let dryerOffsetX = 0;
  let dryerOffsetY = 0;
  let lastDryHitTime = 0;
  let dryTimeout = null;
  let steamInterval = null;

  function openBlowdry() {
    dryProgress = 0;
    dryActive = true;
    dryerDragging = false;

    // Draw wet pet on mat
    drawPetInto(dryPetContainer, 'dry-chibi-pet');

    // Reset UI
    $('#dry-meter').style.width = '0%';
    $('#dry-result').textContent = '';
    $('#wet-drops').innerHTML = '';

    // Create water drops on pet (showing it's wet)
    spawnWetDrops(8);

    // Speech
    drySpeechText.textContent = pick(['I\'m all wet! 💧', 'Brrr so cold!', 'Dry me please!', 'Drip drip drip!']);
    drySpeech.classList.remove('hidden');

    // Show blowdryer on the right
    blowdryer.style.display = 'block';
    blowdryer.style.right = '16px';
    blowdryer.style.left = '';
    blowdryer.style.top = '45%';
    blowdryer.classList.remove('dragging', 'blowing');

    // Switch to dry scene
    showScreen(dryScene);
    blowdryer.style.display = 'block'; // re-show after showScreen hides it

    // Steam rising from wet pet
    steamInterval = setInterval(() => {
      if (dryActive) spawnSteam();
    }, 600);

    // Auto-close after 12s
    dryTimeout = setTimeout(() => {
      if (dryActive) endBlowdry(false);
    }, 12000);
  }

  function spawnWetDrops(count) {
    const cont = $('#wet-drops');
    cont.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const d = document.createElement('div');
      d.className = 'wet-drop';
      d.style.left = rand(15, 85) + '%';
      d.style.top = rand(10, 70) + '%';
      d.style.animationDelay = (Math.random() * 1) + 's';
      d.style.animationDuration = (0.8 + Math.random() * 0.6) + 's';
      cont.appendChild(d);
    }
  }

  function spawnSteam() {
    const area = $('#steam-area');
    const s = document.createElement('span');
    s.className = 'steam-puff';
    s.textContent = pick(['☁️', '💨', '🌫️']);
    s.style.left = rand(20, 80) + '%';
    s.style.bottom = '0';
    area.appendChild(s);
    setTimeout(() => s.remove(), 2000);
  }

  function spawnAirBlast() {
    const p = document.createElement('span');
    p.className = 'air-blast';
    p.textContent = pick(['💨', '〰️', '~']);
    const dryerRect = blowdryer.getBoundingClientRect();
    p.style.left = (dryerRect.left - 20) + 'px';
    p.style.top = (dryerRect.top + 20) + 'px';
    p.style.position = 'fixed';
    p.style.setProperty('--ax', rand(-60, -20) + 'px');
    p.style.setProperty('--ay', rand(-20, 20) + 'px');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 500);
  }

  // Check if dryer overlaps pet
  function checkDryerOverPet() {
    if (!dryActive || !dryerDragging) return;
    const dryerRect = blowdryer.getBoundingClientRect();
    const petSpot = document.querySelector('.dry-pet-spot');
    if (!petSpot) return;
    const petRect = petSpot.getBoundingClientRect();

    const overlapX = dryerRect.left < petRect.right && dryerRect.right > petRect.left;
    const overlapY = dryerRect.top < petRect.bottom && dryerRect.bottom > petRect.top;

    if (overlapX && overlapY) {
      const now = Date.now();
      if (now - lastDryHitTime > 100) {
        lastDryHitTime = now;
        playBeep(800 + dryProgress * 3, 0.04, 'sawtooth', 0.04);
        dryProgress = Math.min(dryProgress + 2, 100);
        $('#dry-meter').style.width = dryProgress + '%';
        blowdryer.classList.add('blowing');
        spawnAirBlast();

        // Remove water drops progressively
        const drops = $('#wet-drops').children;
        const dropTarget = Math.floor((1 - dryProgress / 100) * 8);
        while (drops.length > dropTarget && drops.length > 0) {
          drops[drops.length - 1].remove();
        }

        // Reduce steam as drying progresses
        if (dryProgress > 50 && steamInterval) {
          clearInterval(steamInterval);
          steamInterval = setInterval(() => {
            if (dryActive) spawnSteam();
          }, 1500);
        }

        // Bounce pet
        const dPet = $('#dry-chibi-pet');
        if (dPet && !dPet.classList.contains('pet-happy')) {
          dPet.classList.add('pet-happy');
          setTimeout(() => dPet.classList.remove('pet-happy'), 400);
        }

        // Speech milestones
        if (dryProgress === 30) drySpeechText.textContent = pick(['Getting warmer!', 'Fluff fluff!', 'Oooh nice!']);
        if (dryProgress === 60) drySpeechText.textContent = pick(['Almost dry!', 'So fluffy!', 'Keep going!']);
        if (dryProgress === 90) drySpeechText.textContent = pick(['Nearly done! ✨', 'SO DRY!', 'One more puff!']);

        if (dryProgress >= 100) {
          endBlowdry(true);
        }
      }
    } else {
      blowdryer.classList.remove('blowing');
    }
  }

  // Dryer drag handlers
  function onDryerStart(e) {
    if (!dryActive) return;
    e.preventDefault();
    dryerDragging = true;
    blowdryer.classList.add('dragging');
    const pt = e.touches ? e.touches[0] : e;
    const rect = blowdryer.getBoundingClientRect();
    dryerOffsetX = pt.clientX - rect.left;
    dryerOffsetY = pt.clientY - rect.top;
  }

  function onDryerMove(e) {
    if (!dryerDragging || !dryActive) return;
    e.preventDefault();
    const pt = e.touches ? e.touches[0] : e;
    blowdryer.style.left = (pt.clientX - dryerOffsetX) + 'px';
    blowdryer.style.top = (pt.clientY - dryerOffsetY) + 'px';
    blowdryer.style.right = 'auto';
    checkDryerOverPet();
  }

  function onDryerEnd() {
    dryerDragging = false;
    blowdryer.classList.remove('dragging', 'blowing');
  }

  // Attach dryer drag listeners
  blowdryer.addEventListener('mousedown', onDryerStart);
  blowdryer.addEventListener('touchstart', onDryerStart, { passive: false });
  document.addEventListener('mousemove', onDryerMove);
  document.addEventListener('touchmove', onDryerMove, { passive: false });
  document.addEventListener('mouseup', onDryerEnd);
  document.addEventListener('touchend', onDryerEnd);

  function endBlowdry(success) {
    dryActive = false;
    dryerDragging = false;
    clearTimeout(dryTimeout);
    clearInterval(steamInterval);
    blowdryer.classList.remove('dragging', 'blowing');

    if (success) {
      state.cleanliness = clamp(state.cleanliness + 20);
      state.hearts += 1;
      sfxHappy();
      spawnConfetti(20);

      // Sparkles in dry scene
      for (let i = 0; i < 8; i++) {
        const s = document.createElement('span');
        s.className = 'sparkle-particle';
        s.textContent = pick(['✨', '⭐', '💫', '🌟']);
        s.style.left = rand(15, 85) + '%';
        s.style.top = rand(10, 50) + '%';
        s.style.animationDelay = (i * 0.08) + 's';
        dryParticles.appendChild(s);
        setTimeout(() => s.remove(), 1200);
      }

      const dPet = $('#dry-chibi-pet');
      if (dPet) {
        dPet.classList.remove('pet-happy');
        void dPet.offsetWidth;
        dPet.classList.add('pet-happy');
      }

      $('#dry-result').textContent = pick(['Perfectly dry! ✨', 'SO FLUFFY!', 'Fresh & clean! 🌟', 'Fluff level: MAX!']);
      drySpeechText.textContent = pick(['I\'m so fluffy!', 'All dry! ✨', 'Best bath ever!']);
    } else {
      state.cleanliness = clamp(state.cleanliness + 8);
      state.hearts += 1;
      $('#dry-result').textContent = 'A bit damp but okay! 🙂';
      drySpeechText.textContent = 'Still a little wet!';
    }

    updateUI();
    saveGame();

    // Auto-return to main game
    setTimeout(() => {
      blowdryer.style.display = 'none';
      actionLocked = false;
      showScreen(gameScreen);
      spawnSparkles(6);
      petBounce();
      showSpeech(pick(['So fresh! 🫧', 'Squeaky clean!', 'Best bath ever! ✨', 'Sparkle sparkle!']), 2500);
    }, 2500);
  }

  // ── PLAY MINI-GAMES (Park Scene) ──
  // Transitions to a full park scene. Pet is shown in the park.
  // Mini-game plays at the bottom of the park scene.
  let playClicks = 0;
  let playGoal = 5;
  let playActive = false;
  let playSpawnTimer = null;

  function openPlay() {
    if (actionLocked) return;
    actionLocked = true;
    sfxClick();
    playClicks = 0;
    playGoal = 5;
    playActive = true;
    $('#play-clicks').textContent = '0';
    $('#play-area').innerHTML = '';
    $('#park-back').style.display = 'none';

    // Draw pet in park
    drawPetInto(parkPetContainer, 'park-chibi-pet');

    // Park speech
    parkSpeechText.textContent = pick(['Let\'s play!', 'The park is fun!', 'Yay, outside! 🌳', 'Run run run!']);
    parkSpeech.classList.remove('hidden');

    // Pick game variant based on pet type
    let gameType;
    if (state.petType === 'bird') {
      gameType = 'sing';
    } else if (state.petType === 'cat' && Math.random() > 0.5) {
      gameType = 'feather';
    } else {
      gameType = 'ball';
    }

    if (gameType === 'ball') {
      $('#play-title').textContent = 'Catch the Ball! 🎾';
    } else if (gameType === 'feather') {
      $('#play-title').textContent = 'Chase the Feather! 🪶';
    } else {
      $('#play-title').textContent = 'Sing Along! 🎵';
    }

    // Switch to park scene
    showScreen(parkScene);
    // Start the mini-game
    startPlaySpawn(gameType);
  }

  function startPlaySpawn(type) {
    const area = $('#play-area');
    const spawn = () => {
      if (!playActive) return;
      area.innerHTML = '';
      const t = document.createElement('div');
      t.className = type === 'sing' ? 'arrow-prompt' : 'play-target';

      if (type === 'ball')        t.textContent = '🎾';
      else if (type === 'feather') t.textContent = '🪶';
      else {
        const arrows = ['⬆️', '⬇️', '⬅️', '➡️'];
        t.textContent = pick(arrows);
      }

      t.style.left = rand(10, 80) + '%';
      t.style.top = rand(10, 75) + '%';
      t.addEventListener('click', () => {
        if (!playActive) return;
        playClicks++;
        sfxPop();
        t.remove();
        $('#play-clicks').textContent = playClicks;

        // Bounce the park pet on each hit
        const pPet = $('#park-chibi-pet');
        if (pPet) {
          pPet.classList.remove('pet-happy');
          void pPet.offsetWidth;
          pPet.classList.add('pet-happy');
        }

        if (playClicks >= playGoal) {
          endPlay();
        } else {
          setTimeout(spawn, 300);
        }
      });
      area.appendChild(t);

      // Auto-remove if not clicked in time
      setTimeout(() => {
        if (t.parentNode && playActive) {
          t.remove();
          setTimeout(spawn, 200);
        }
      }, 1800);
    };
    spawn();
  }

  // Spawn sparkles in the park particles container
  function spawnParkSparkles(count) {
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle-particle';
      s.textContent = pick(['✨', '⭐', '💫', '🌟', '🎉']);
      s.style.left = rand(20, 80) + '%';
      s.style.top = rand(10, 50) + '%';
      s.style.animationDelay = (i * 0.1) + 's';
      parkParticles.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }
  }

  function endPlay() {
    playActive = false;
    $('#play-area').innerHTML = '';
    actionLocked = false;

    state.fun         = clamp(state.fun + 30);
    state.hunger      = clamp(state.hunger - 5);
    state.cleanliness = clamp(state.cleanliness - 5);
    state.hearts     += 2;

    sfxHappy();

    // Show victory in the park
    parkSpeechText.textContent = pick(['That was FUN! 🎉', 'Again again!', 'WHEEE!', 'Best game ever! 🎈', 'Hehe so fun!']);
    parkSpeech.classList.remove('hidden');
    spawnParkSparkles(8);
    spawnConfetti(20);

    // Bounce park pet
    const pPet = $('#park-chibi-pet');
    if (pPet) {
      pPet.classList.remove('pet-happy');
      void pPet.offsetWidth;
      pPet.classList.add('pet-happy');
    }

    // Show back button briefly, then auto-return
    $('#park-back').style.display = 'inline-block';

    updateUI();
    saveGame();

    // Auto-return to main game after a pause
    setTimeout(() => {
      showScreen(gameScreen);
      spawnSparkles(6);
      petBounce();
      showSpeech(pick(['That was so fun!', 'The park was great!', 'Let\'s go again! 🎈']), 2500);
    }, 2800);
  }

  function leavePark() {
    playActive = false;
    actionLocked = false;
    $('#play-area').innerHTML = '';
    showScreen(gameScreen);
  }

  // ── WALK (Walk Scene) ──
  // Player takes their pet for a walk along a brown bumpy pathway in a park.
  // Tap the "Walk!" button to take steps. The pet bounces along, paw prints appear,
  // and random items appear on the path for bonus points.
  // Walk fills a progress meter. When full, the walk is complete.
  // NPC PARK PALS: Other pets of the same type appear in the park. You can
  // click on them to interact — sniff, play, or nuzzle for fun + stat bonuses.
  let walkSteps = 0;
  const WALK_GOAL = 30;
  let walkActive = false;
  let walkItemTimer = null;
  let walkPebbleTimer = null;
  let walkTimeout = null;
  let npcSpawnTimer = null;
  let npcInteracting = false;   // true while interacting with a park pal
  let currentNpcEl = null;       // the NPC element being interacted with

  // ── NPC Pet Data ──
  // Cute names for the park pals
  const NPC_DOG_NAMES = ['Biscuit', 'Peanut', 'Waffles', 'Mochi', 'Pepper', 'Churro', 'Nugget', 'Tofu'];
  const NPC_CAT_NAMES = ['Whiskers', 'Mittens', 'Noodle', 'Marshmallow', 'Pudding', 'Cinnamon', 'Muffin', 'Sesame'];
  const NPC_BIRD_NAMES = ['Tweety', 'Peep', 'Chirpy', 'Sunny', 'Kiwi', 'Mango', 'Pip', 'Sky'];

  function getNpcNames() {
    if (state.petType === 'dog') return NPC_DOG_NAMES;
    if (state.petType === 'cat') return NPC_CAT_NAMES;
    return NPC_BIRD_NAMES;
  }

  function openWalk() {
    if (actionLocked) return;
    actionLocked = true;
    sfxClick();
    walkSteps = 0;
    walkActive = true;
    npcInteracting = false;
    currentNpcEl = null;

    // Draw pet on path
    drawPetInto(walkPetContainer, 'walk-chibi-pet');

    // Show leash for dogs only
    const leash = $('#walk-leash');
    if (state.petType === 'dog') {
      leash.style.display = 'block';
    } else {
      leash.style.display = 'none';
    }

    // Reset UI
    $('#walk-meter').style.width = '0%';
    $('#walk-distance').textContent = '0 steps';
    walkPaws.innerHTML = '';
    walkItemsCont.innerHTML = '';
    $('#path-bumps').innerHTML = '';
    $('#walk-back').style.display = 'none';
    walkPetSpot.classList.remove('walking');
    walkPetSpot.classList.remove('playing');
    npcPetsArea.innerHTML = '';
    npcHeartsArea.innerHTML = '';

    // Speech
    const walkLines = state.petType === 'dog'
      ? ['Walkies! 🐕', 'Let\'s go outside!', 'I love walks!', 'Sniff sniff!']
      : state.petType === 'cat'
        ? ['A stroll? Okay... 🐱', 'Fresh air is nice.', 'I\'ll walk... for treats.']
        : ['Flutter time! 🐦', 'Hop hop hop!', 'Fresh air! Chirp!'];
    walkSpeechText.textContent = pick(walkLines);
    walkSpeech.classList.remove('hidden');

    // Switch to walk scene
    showScreen(walkScene);

    // Spawn initial pebbles on path
    spawnPathPebbles();
    // Start pebble scroll refresh
    walkPebbleTimer = setInterval(() => {
      if (walkActive) spawnPathPebbles();
    }, 3000);

    // Start spawning random items on path
    walkItemTimer = setInterval(() => {
      if (walkActive && !npcInteracting) spawnWalkItem();
    }, 2500);

    // Spawn NPC park pals periodically
    // First one appears quickly, then every 6–8 seconds
    setTimeout(() => { if (walkActive) spawnNpcPet(); }, rand(2000, 3500));
    npcSpawnTimer = setInterval(() => {
      if (walkActive && !npcInteracting && npcPetsArea.children.length < 3) {
        spawnNpcPet();
      }
    }, rand(6000, 8000));

    // Auto-end walk after 35s if not finished (a bit longer to allow interactions)
    walkTimeout = setTimeout(() => {
      if (walkActive) endWalk(false);
    }, 35000);
  }

  function spawnPathPebbles() {
    const cont = $('#path-bumps');
    while (cont.children.length > 20) cont.firstChild.remove();
    for (let i = 0; i < 6; i++) {
      const p = document.createElement('div');
      p.className = 'path-pebble';
      const size = rand(4, 10);
      p.style.width = size + 'px';
      p.style.height = (size * 0.7) + 'px';
      p.style.left = rand(0, 100) + '%';
      p.style.top = rand(15, 75) + '%';
      const shade = rand(0, 2);
      p.style.background = ['#a1887f', '#8d6e63', '#bcaaa4'][shade];
      p.style.animationDelay = (Math.random() * 2) + 's';
      cont.appendChild(p);
      setTimeout(() => p.remove(), 3500);
    }
  }

  function takeStep() {
    if (!walkActive || npcInteracting) return;
    walkSteps++;
    sfxPop();

    // Bounce pet
    walkPetSpot.classList.add('walking');
    setTimeout(() => {
      if (!walkActive) walkPetSpot.classList.remove('walking');
    }, 350);

    // Footstep sound
    playBeep(300 + rand(0, 100), 0.04, 'triangle', 0.06);

    // Update meter
    const progress = Math.min((walkSteps / WALK_GOAL) * 100, 100);
    $('#walk-meter').style.width = progress + '%';
    $('#walk-distance').textContent = walkSteps + ' steps';

    // Spawn paw print behind pet
    spawnPawPrint();

    // Bounce the pet sprite
    const wPet = $('#walk-chibi-pet');
    if (wPet) {
      wPet.classList.remove('pet-happy');
      void wPet.offsetWidth;
      wPet.classList.add('pet-happy');
    }

    // Speech milestones
    if (walkSteps === 5) walkSpeechText.textContent = pick(['Nice walk! 🌿', 'Fresh air!', 'Sniff sniff!']);
    if (walkSteps === 10) walkSpeechText.textContent = pick(['So many smells!', 'This is great!', 'Keep going! 🐾']);
    if (walkSteps === 15) walkSpeechText.textContent = pick(['Halfway there!', 'Look, a butterfly! 🦋', 'I love this!']);
    if (walkSteps === 20) walkSpeechText.textContent = pick(['Almost done!', 'Great walk!', 'A bit tired... 😄']);
    if (walkSteps === 25) walkSpeechText.textContent = pick(['Nearly there!', 'What a day! ☀️', 'Best walk ever!']);

    if (walkSteps >= WALK_GOAL) {
      endWalk(true);
    }
  }

  function spawnPawPrint() {
    const paw = document.createElement('span');
    paw.className = 'paw-print';
    paw.textContent = '🐾';
    const petRect = walkPetSpot.getBoundingClientRect();
    const wrapRect = walkPaws.getBoundingClientRect();
    const relX = petRect.left - wrapRect.left + rand(-15, 15);
    const relY = petRect.bottom - wrapRect.top + rand(-5, 5);
    paw.style.left = relX + 'px';
    paw.style.top = relY + 'px';
    paw.style.transform = 'rotate(' + rand(-20, 20) + 'deg)';
    walkPaws.appendChild(paw);
    setTimeout(() => paw.remove(), 2000);
  }

  function spawnWalkItem() {
    if (!walkActive) return;
    const items = ['🦋', '🍂', '🌰', '🍄', '🐿️', '⭐', '🎀', '🧦'];
    const item = document.createElement('span');
    item.className = 'walk-item';
    item.textContent = pick(items);
    item.style.top = rand(20, 70) + '%';
    item.style.left = '105%';
    item.addEventListener('click', () => {
      if (item.classList.contains('collected')) return;
      item.classList.add('collected');
      sfxPop();
      playBeep(1200, 0.08, 'sine', 0.1);
      walkSteps += 2;
      const progress = Math.min((walkSteps / WALK_GOAL) * 100, 100);
      $('#walk-meter').style.width = progress + '%';
      $('#walk-distance').textContent = walkSteps + ' steps';

      const spark = document.createElement('span');
      spark.className = 'sparkle-particle';
      spark.textContent = '✨';
      spark.style.left = item.style.left;
      spark.style.top = item.style.top;
      walkParticles.appendChild(spark);
      setTimeout(() => spark.remove(), 800);

      walkSpeechText.textContent = pick(['Found something! ✨', 'Ooh what\'s that!', 'Bonus! 🌟', 'Treasure!']);
      item.style.opacity = '0';
      item.style.transform = 'scale(1.5)';
      item.style.transition = 'all .3s';
      setTimeout(() => item.remove(), 300);

      if (walkSteps >= WALK_GOAL) endWalk(true);
    });
    walkItemsCont.appendChild(item);
    setTimeout(() => { if (item.parentNode) item.remove(); }, 4500);
  }

  // ────────── NPC PARK PALS ──────────
  // Creates an NPC pet of the same type that appears in the park.
  // The NPC walks in from the side, idles on the grass/path, and
  // can be tapped to open an interaction menu.
  function spawnNpcPet() {
    if (!walkActive || npcInteracting) return;

    const wrap = document.createElement('div');
    const hueClass = 'npc-hue-' + rand(1, 4);
    wrap.className = 'npc-pet-wrap ' + hueClass;

    // Name tag
    const npcName = pick(getNpcNames());
    const tag = document.createElement('div');
    tag.className = 'npc-name-tag';
    tag.textContent = npcName;
    wrap.appendChild(tag);

    // Tiny speech bubble (hidden initially)
    const speech = document.createElement('div');
    speech.className = 'npc-tiny-speech';
    speech.textContent = pick(getNpcGreetings());
    wrap.appendChild(speech);

    // Pet container
    const cont = document.createElement('div');
    cont.className = 'pet-container';
    wrap.appendChild(cont);

    // Draw the same pet type into this container
    const pet = document.createElement('div');
    pet.className = `chibi-pet ${state.petType}`;
    pet.innerHTML = getPetHTML();
    cont.appendChild(pet);

    // Position: start off-screen right, on the grass above the path
    const enterFromLeft = Math.random() > 0.5;
    wrap.style.bottom = rand(32, 50) + '%';
    if (enterFromLeft) {
      wrap.style.left = '-100px';
    } else {
      wrap.style.left = 'calc(100% + 20px)';
    }

    npcPetsArea.appendChild(wrap);

    // Slide into a visible position
    const targetLeft = rand(50, 75);
    requestAnimationFrame(() => {
      wrap.classList.add('approaching');
      wrap.style.left = targetLeft + '%';
    });

    // After arriving, show speech bubble briefly
    setTimeout(() => {
      speech.classList.add('show');
      // Play a cute notification sound
      playBeep(880, 0.06, 'sine', 0.08);
      setTimeout(() => playBeep(1100, 0.06, 'sine', 0.08), 100);
    }, 2000);

    setTimeout(() => {
      speech.classList.remove('show');
    }, 4500);

    // Click to interact
    wrap.addEventListener('click', () => {
      if (npcInteracting || !walkActive) return;
      openNpcInteraction(wrap, npcName);
    });

    // If not interacted with, the NPC leaves after a while
    wrap._leaveTimer = setTimeout(() => {
      if (wrap.parentNode && !npcInteracting) {
        npcPetLeave(wrap);
      }
    }, rand(10000, 15000));
  }

  function getNpcGreetings() {
    if (state.petType === 'dog') {
      return ['Woof woof! 🐕', 'Hewwo!', 'Sniff sniff?', '*tail wagging*', 'Play? Play?!', 'Bark bark! 🎾', 'Fren!! 💕'];
    } else if (state.petType === 'cat') {
      return ['Mew? 🐱', '*slow blink*', 'Purr~', 'Meow meow!', '*curious look*', 'Mrow~', 'Pspsps? 😸'];
    }
    return ['Chirp chirp! 🐦', 'Tweet!', '*flutters wings*', 'Peep peep!', 'Sing sing! 🎵', 'Cheep!', '*head tilt*'];
  }

  // ────────── PLAYGROUND INTERACTION ──────────
  // When player taps an NPC pet, both pets go to a playground scene
  // with a slide and trick zones on the grass. Tap activities to
  // control your pet to play together.
  let pgActive = false;
  let pgTricksCompleted = 0;
  const PG_TRICK_GOAL = 4;
  let pgBusy = false; // true while an animation is playing
  let pgCurrentNpcName = '';
  let pgAutoReturn = null;

  function openNpcInteraction(npcWrap, npcName) {
    npcInteracting = true;
    currentNpcEl = npcWrap;
    clearTimeout(npcWrap._leaveTimer);

    sfxClick();
    pgCurrentNpcName = npcName;

    // Transition to playground scene
    pgActive = true;
    pgBusy = false;
    pgTricksCompleted = 0;

    // Draw both pets in the playground
    drawPetInto(pgMyPetContainer, 'pg-my-chibi');
    const npcPetEl = document.createElement('div');
    npcPetEl.className = `chibi-pet ${state.petType}`;
    npcPetEl.id = 'pg-npc-chibi';
    npcPetEl.innerHTML = getPetHTML();
    pgNpcPetContainer.innerHTML = '';
    pgNpcPetContainer.appendChild(npcPetEl);

    // Apply a hue tint to the NPC
    const hues = [25, -15, 45, -30];
    pgNpcPet.style.filter = 'hue-rotate(' + pick(hues) + 'deg) saturate(1.1)';
    pgNpcTag.textContent = npcName;

    // Reset positions
    pgMyPet.style.left = '20%';
    pgMyPet.style.bottom = '24%';
    pgMyPet.className = 'pg-my-pet';
    pgNpcPet.style.left = '60%';
    pgNpcPet.style.bottom = '24%';
    pgNpcPet.className = 'pg-npc-pet';

    // Reset trick zones
    ['#pg-slide', '#pg-trick-jump', '#pg-trick-spin', '#pg-trick-roll'].forEach(sel => {
      $(sel).classList.remove('active-zone', 'done');
    });

    // Reset UI
    pgFunMeter.style.width = '0%';
    pgTricksDone.textContent = '0';
    pgParticles.innerHTML = '';
    $('#pg-back').style.display = 'none';

    // Speech
    pgMySpeechText.textContent = pick(getPlayerMeetLines());
    pgNpcSpeechText.textContent = pick(getNpcMeetLines());
    pgMySpeech.classList.remove('hidden');
    pgNpcSpeech.classList.remove('hidden');

    // Title
    $('#pg-title').textContent = '🎪 Playing with ' + npcName + '!';

    showScreen(playgroundScene);

    // Auto-return after 25s if not completed
    pgAutoReturn = setTimeout(() => {
      if (pgActive) leavePlayground();
    }, 25000);
  }

  function getNpcMeetLines() {
    if (state.petType === 'dog') return ['Let\'s play! 🐕', 'SLIDE SLIDE!', 'TRICKS!!', 'I can jump!'];
    if (state.petType === 'cat') return ['This looks fun.', 'Watch this!', '*climbs slide*', 'Hmm, okay!'];
    return ['Wheee! 🐦', 'Chirp chirp!', 'Fly high!', 'My turn!'];
  }

  function getPlayerMeetLines() {
    if (state.petType === 'dog') return ['PLAYGROUND!! 🐕', 'BEST DAY EVER!', 'Let\'s GO!', 'I wanna slide!'];
    if (state.petType === 'cat') return ['A playground? 🐱', 'I suppose...', 'Not bad!', 'Interesting.'];
    return ['Ooh fun! 🐦', 'Hop hop!', 'Look at that slide!', 'Yay!'];
  }

  // ── Playground Activity: Slide ──
  function pgDoSlide() {
    if (!pgActive || pgBusy) return;
    if ($('#pg-slide').classList.contains('done')) return;
    pgBusy = true;
    sfxClick();

    $('#pg-slide').classList.add('active-zone');
    pgMySpeechText.textContent = pick(['WHEEE!', 'Here I go!', 'Slide time!']);
    pgNpcSpeechText.textContent = pick(['Me too!', 'WHEEE!', 'So fun!']);

    // Move both pets to top of slide
    pgMyPet.classList.add('sliding');
    pgNpcPet.classList.add('sliding');
    pgMyPet.style.left = '12%';
    pgMyPet.style.bottom = '52%';
    pgNpcPet.style.left = '16%';
    pgNpcPet.style.bottom = '50%';

    // After reaching top, slide down
    setTimeout(() => {
      playBeep(800, 0.08, 'sine', 0.08);
      setTimeout(() => playBeep(600, 0.08, 'sine', 0.08), 150);
      setTimeout(() => playBeep(400, 0.08, 'sine', 0.08), 300);

      pgMyPet.style.left = '5%';
      pgMyPet.style.bottom = '20%';
      pgNpcPet.style.left = '10%';
      pgNpcPet.style.bottom = '18%';
    }, 900);

    // Celebrate at bottom
    setTimeout(() => {
      pgMyPet.classList.remove('sliding');
      pgNpcPet.classList.remove('sliding');
      pgMyPet.classList.add('celebrate');
      pgNpcPet.classList.add('celebrate');
      sfxHappy();
      spawnPgHearts(6);
      pgMySpeechText.textContent = pick(['Again again!', 'SO FUN!', 'WHEEE!']);
      pgNpcSpeechText.textContent = pick(['AMAZING!', 'Best slide!', 'WOOOO!']);

      completePgTrick('slide');
    }, 2200);

    setTimeout(() => {
      pgMyPet.classList.remove('celebrate');
      pgNpcPet.classList.remove('celebrate');
      resetPgPetPositions();
      pgBusy = false;
    }, 3500);
  }

  // ── Playground Activity: Jump Trick ──
  function pgDoJump() {
    if (!pgActive || pgBusy) return;
    if ($('#pg-trick-jump').classList.contains('done')) return;
    pgBusy = true;
    sfxClick();

    $('#pg-trick-jump').classList.add('active-zone');
    pgMySpeechText.textContent = pick(['Jump!', 'Watch this!', 'SO HIGH!']);
    pgNpcSpeechText.textContent = pick(['Wow!', 'Me next!', 'Jump jump!']);

    // Move pets to jump zone
    pgMyPet.style.left = '62%';
    pgMyPet.style.bottom = '34%';
    pgNpcPet.style.left = '72%';
    pgNpcPet.style.bottom = '34%';

    setTimeout(() => {
      // Both jump!
      pgMyPet.classList.add('jumping');
      playBeep(500, 0.06, 'triangle', 0.08);
      setTimeout(() => {
        pgNpcPet.classList.add('jumping');
        playBeep(600, 0.06, 'triangle', 0.08);
      }, 200);
    }, 800);

    setTimeout(() => {
      pgMyPet.classList.remove('jumping');
      pgNpcPet.classList.remove('jumping');
      pgMyPet.classList.add('celebrate');
      pgNpcPet.classList.add('celebrate');
      sfxHappy();
      spawnPgHearts(5);
      pgMySpeechText.textContent = pick(['WOAH!', 'Nailed it!', 'So high!']);
      pgNpcSpeechText.textContent = pick(['Amazing!', 'You flew!', 'JUMP!']);

      completePgTrick('jump');
    }, 2000);

    setTimeout(() => {
      pgMyPet.classList.remove('celebrate');
      pgNpcPet.classList.remove('celebrate');
      resetPgPetPositions();
      pgBusy = false;
    }, 3200);
  }

  // ── Playground Activity: Spin Trick ──
  function pgDoSpin() {
    if (!pgActive || pgBusy) return;
    if ($('#pg-trick-spin').classList.contains('done')) return;
    pgBusy = true;
    sfxClick();

    $('#pg-trick-spin').classList.add('active-zone');
    pgMySpeechText.textContent = pick(['Spin spin!', 'Round and round!', 'Dizzy!']);
    pgNpcSpeechText.textContent = pick(['Wheee!', 'Spinning!', 'Watch!']);

    // Move to spin zone
    pgMyPet.style.left = '34%';
    pgMyPet.style.bottom = '18%';
    pgNpcPet.style.left = '44%';
    pgNpcPet.style.bottom = '18%';

    setTimeout(() => {
      pgMyPet.classList.add('spinning');
      playBeep(400, 0.06, 'sine', 0.06);
      setTimeout(() => {
        pgNpcPet.classList.add('spinning');
        playBeep(500, 0.06, 'sine', 0.06);
      }, 150);
    }, 800);

    setTimeout(() => {
      pgMyPet.classList.remove('spinning');
      pgNpcPet.classList.remove('spinning');
      pgMyPet.classList.add('celebrate');
      pgNpcPet.classList.add('celebrate');
      sfxHappy();
      spawnPgHearts(5);
      pgMySpeechText.textContent = pick(['Dizzy! 🌀', 'SPINNNN!', 'Wobbly!']);
      pgNpcSpeechText.textContent = pick(['Hehe!', 'So dizzy!', 'Again!']);

      completePgTrick('spin');
    }, 1900);

    setTimeout(() => {
      pgMyPet.classList.remove('celebrate');
      pgNpcPet.classList.remove('celebrate');
      resetPgPetPositions();
      pgBusy = false;
    }, 3100);
  }

  // ── Playground Activity: Roll Trick ──
  function pgDoRoll() {
    if (!pgActive || pgBusy) return;
    if ($('#pg-trick-roll').classList.contains('done')) return;
    pgBusy = true;
    sfxClick();

    $('#pg-trick-roll').classList.add('active-zone');
    pgMySpeechText.textContent = pick(['Roll!', 'Tumble time!', 'Roly poly!']);
    pgNpcSpeechText.textContent = pick(['Rolling!', 'Hehe!', 'Weee!']);

    // Move to roll zone
    pgMyPet.style.left = '58%';
    pgMyPet.style.bottom = '18%';
    pgNpcPet.style.left = '68%';
    pgNpcPet.style.bottom = '18%';

    setTimeout(() => {
      pgMyPet.classList.add('rolling');
      playBeep(350, 0.06, 'sawtooth', 0.05);
      setTimeout(() => {
        pgNpcPet.classList.add('rolling');
        playBeep(450, 0.06, 'sawtooth', 0.05);
      }, 200);
    }, 800);

    setTimeout(() => {
      pgMyPet.classList.remove('rolling');
      pgNpcPet.classList.remove('rolling');
      pgMyPet.classList.add('celebrate');
      pgNpcPet.classList.add('celebrate');
      sfxHappy();
      spawnPgHearts(5);
      pgMySpeechText.textContent = pick(['Roly poly! 🔄', 'ROLL!', 'Tumble!']);
      pgNpcSpeechText.textContent = pick(['So silly!', 'Haha!', 'Fun!']);

      completePgTrick('roll');
    }, 1900);

    setTimeout(() => {
      pgMyPet.classList.remove('celebrate');
      pgNpcPet.classList.remove('celebrate');
      resetPgPetPositions();
      pgBusy = false;
    }, 3100);
  }

  function resetPgPetPositions() {
    pgMyPet.style.left = '20%';
    pgMyPet.style.bottom = '24%';
    pgNpcPet.style.left = '60%';
    pgNpcPet.style.bottom = '24%';
  }

  function completePgTrick(type) {
    pgTricksCompleted++;
    pgTricksDone.textContent = pgTricksCompleted;
    pgFunMeter.style.width = Math.min((pgTricksCompleted / PG_TRICK_GOAL) * 100, 100) + '%';

    // Mark this zone as done
    const sel = type === 'slide' ? '#pg-slide' : '#pg-trick-' + type;
    $(sel).classList.remove('active-zone');
    $(sel).classList.add('done');

    // Per-trick stat gains
    state.fun = clamp(state.fun + 8);
    state.hearts += 1;
    walkSteps += 2;
    const progress = Math.min((walkSteps / WALK_GOAL) * 100, 100);
    $('#walk-meter').style.width = progress + '%';
    $('#walk-distance').textContent = walkSteps + ' steps';
    updateUI();
    saveGame();

    // If all tricks done, finish playground
    if (pgTricksCompleted >= PG_TRICK_GOAL) {
      setTimeout(() => finishPlayground(), 800);
    }
  }

  function spawnPgHearts(count) {
    for (let i = 0; i < count; i++) {
      const h = document.createElement('span');
      h.className = 'npc-heart-particle';
      h.textContent = pick(['❤️', '💕', '💖', '💗', '✨', '🌟', '⭐']);
      h.style.left = rand(20, 80) + '%';
      h.style.top = rand(20, 55) + '%';
      h.style.animationDelay = (i * 0.12) + 's';
      pgParticles.appendChild(h);
      setTimeout(() => h.remove(), 1600);
    }
  }

  function finishPlayground() {
    clearTimeout(pgAutoReturn);
    pgActive = false;
    pgBusy = true;

    // Big celebration
    sfxHappy();
    spawnConfetti(25);
    spawnPgHearts(10);

    state.fun = clamp(state.fun + 10);
    state.hearts += 3;

    pgMySpeechText.textContent = pick(['BEST DAY!! 🎉', 'SO FUN!', 'I love you, friend!']);
    pgNpcSpeechText.textContent = pick(['Best friends! 💕', 'That was EPIC!', 'Come back soon!']);

    // Move pets together for a final nuzzle
    pgMyPet.style.left = '35%';
    pgNpcPet.style.left = '45%';
    pgMyPet.classList.add('celebrate');
    pgNpcPet.classList.add('celebrate');

    $('#pg-back').style.display = 'inline-block';

    updateUI();
    saveGame();

    // Auto-return
    setTimeout(() => {
      leavePlayground();
    }, 3500);
  }

  function leavePlayground() {
    pgActive = false;
    pgBusy = false;
    clearTimeout(pgAutoReturn);
    npcInteracting = false;

    // Remove the NPC from the walk scene
    if (currentNpcEl) {
      npcPetLeave(currentNpcEl);
      currentNpcEl = null;
    }

    // Return to walk scene (not main game screen)
    showScreen(walkScene);

    walkSpeechText.textContent = pick(['That was fun! 💕', 'I made a friend!', 'The playground was great!', 'Let\'s keep walking!']);
    spawnNpcHearts(4);

    if (walkSteps >= WALK_GOAL) {
      endWalk(true);
    }
  }

  function spawnNpcHearts(count) {
    const petRect = walkPetSpot.getBoundingClientRect();
    const areaRect = npcHeartsArea.getBoundingClientRect();
    const midX = petRect.right - areaRect.left + 20;
    const midY = petRect.top - areaRect.top + 30;

    for (let i = 0; i < count; i++) {
      const h = document.createElement('span');
      h.className = 'npc-heart-particle';
      h.textContent = pick(['❤️', '💕', '💖', '💗', '🩷', '🤍', '✨']);
      h.style.left = (midX + rand(-40, 40)) + 'px';
      h.style.top = (midY + rand(-20, 20)) + 'px';
      h.style.animationDelay = (i * 0.15) + 's';
      npcHeartsArea.appendChild(h);
      setTimeout(() => h.remove(), 1600);
    }
  }

  function npcPetLeave(npcWrap) {
    npcWrap.classList.add('leaving');
    npcWrap.style.left = '-120px';
    setTimeout(() => {
      if (npcWrap.parentNode) npcWrap.remove();
    }, 2200);
  }

  function endWalk(success) {
    walkActive = false;
    npcInteracting = false;
    walkPetSpot.classList.remove('walking');
    walkPetSpot.classList.remove('playing');
    clearInterval(walkItemTimer);
    clearInterval(walkPebbleTimer);
    clearInterval(npcSpawnTimer);
    clearTimeout(walkTimeout);

    if (success) {
      state.fun         = clamp(state.fun + 25);
      state.hunger      = clamp(state.hunger - 8);
      state.cleanliness = clamp(state.cleanliness - 5);
      state.hearts     += 3;

      sfxHappy();
      spawnConfetti(20);

      for (let i = 0; i < 8; i++) {
        const s = document.createElement('span');
        s.className = 'sparkle-particle';
        s.textContent = pick(['✨', '⭐', '💫', '🌟', '🐾']);
        s.style.left = rand(15, 85) + '%';
        s.style.top = rand(10, 50) + '%';
        s.style.animationDelay = (i * 0.08) + 's';
        walkParticles.appendChild(s);
        setTimeout(() => s.remove(), 1200);
      }

      const wPet = $('#walk-chibi-pet');
      if (wPet) {
        wPet.classList.remove('pet-happy');
        void wPet.offsetWidth;
        wPet.classList.add('pet-happy');
      }

      walkSpeechText.textContent = pick(['Best walk ever! 🐾', 'That was pawsome!', 'Great exercise! ✨', 'SO FUN!']);
    } else {
      state.fun         = clamp(state.fun + 10);
      state.hunger      = clamp(state.hunger - 3);
      state.hearts     += 1;
      walkSpeechText.textContent = pick(['Short walk!', 'Okay, let\'s go home!', 'Maybe longer next time!']);
    }

    // Show back button
    $('#walk-back').style.display = 'inline-block';

    updateUI();
    saveGame();

    // Auto-return after a pause
    setTimeout(() => {
      leaveWalk();
    }, 3000);
  }

  function leaveWalk() {
    walkActive = false;
    npcInteracting = false;
    clearInterval(walkItemTimer);
    clearInterval(walkPebbleTimer);
    clearInterval(npcSpawnTimer);
    clearTimeout(walkTimeout);
    walkPetSpot.classList.remove('walking');
    walkPetSpot.classList.remove('playing');
    actionLocked = false;
    showScreen(gameScreen);
    spawnSparkles(6);
    petBounce();
    showSpeech(pick(['Great walk! 🐾', 'That was fun!', 'Fresh air was nice! ☀️', 'Tired but happy!', 'I made friends! 💕']), 2500);
  }

  // ── SLEEP (Bedroom Scene) ──
  // Pet goes to a cozy bedroom with a blue bed covered in bright yellow stars.
  // At "nighttime" the pet sleeps for 3-5 seconds, then wakes up refreshed.
  let sleepActive = false;
  let sleepTimeout = null;
  let zzzTimer = null;

  function sfxSnore() {
    playBeep(150, 0.3, 'sine', 0.06);
    setTimeout(() => playBeep(120, 0.4, 'sine', 0.05), 400);
  }
  function sfxYawn() {
    playBeep(400, 0.2, 'sine', 0.08);
    setTimeout(() => playBeep(300, 0.3, 'sine', 0.07), 200);
  }
  function sfxWake() {
    playBeep(600, 0.1, 'sine', 0.1);
    setTimeout(() => playBeep(800, 0.1, 'sine', 0.12), 100);
    setTimeout(() => playBeep(1000, 0.15, 'sine', 0.14), 200);
  }

  function openSleep() {
    if (actionLocked) return;
    actionLocked = true;
    sleepActive = true;
    sfxYawn();

    // Show bedroom scene
    showScreen(sleepScene);

    // Draw pet in bed
    drawPetInto(bedPetContainer, 'bed-chibi-pet');

    // Reset state
    bedPetSpot.classList.remove('waking');
    bedBlanket.style.top = '45px'; // blanket down (pet covered)
    zzzArea.innerHTML = '';
    bedParticles.innerHTML = '';
    bedSpeechText.textContent = pick(['*yaaawn* So sleepy...', 'Nighty night! 💤', 'Time for dreamland...', 'Zzz... 😴']);
    bedTitle.textContent = '🌙 Nighty Night!';
    bedHint.textContent = 'Your pet is falling asleep...';

    // After a short pause, cover pet with blanket and start sleeping
    setTimeout(() => {
      bedBlanket.style.top = '20px'; // pull blanket up more
      bedSpeechText.textContent = pick(['💤 Zzz...', 'Dreaming of treats...', '💤 So cozy...', 'Sweet dreams... 🌙']);
      bedHint.textContent = 'Shhh... your pet is sleeping... 💤';

      // Start Zzz animation
      startZzz();

      // Start snore sounds
      sfxSnore();
      zzzTimer = setInterval(sfxSnore, 2500);

      // Sleep for 3-5 seconds, then wake
      const sleepDuration = rand(3000, 5000);
      sleepTimeout = setTimeout(() => {
        wakeUp();
      }, sleepDuration);
    }, 1200);
  }

  function startZzz() {
    zzzArea.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const z = document.createElement('span');
      z.className = 'zzz-float';
      z.textContent = 'Z';
      zzzArea.appendChild(z);
    }
  }

  function wakeUp() {
    clearInterval(zzzTimer);
    sleepActive = false;
    sfxWake();

    // Remove Zzz
    zzzArea.innerHTML = '';

    // Pull blanket down
    bedBlanket.style.top = '55px';

    // Wake up eyes
    bedPetSpot.classList.add('waking');

    bedSpeechText.textContent = pick(['*yaaawn* Good morning! ☀️', 'I feel great! ✨', 'Best nap ever!', 'So refreshed! 💪', 'Ready for adventure! 🌟']);
    bedTitle.textContent = '☀️ Good Morning!';
    bedHint.textContent = 'Your pet feels refreshed!';

    // Bounce the pet
    const bPet = $('#bed-chibi-pet');
    if (bPet) {
      bPet.classList.add('pet-happy');
      setTimeout(() => bPet.classList.remove('pet-happy'), 600);
    }

    // Sparkle particles in bedroom
    for (let i = 0; i < 6; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle-particle';
      s.textContent = pick(['✨', '⭐', '💫', '🌟', '☀️']);
      s.style.left = rand(20, 80) + '%';
      s.style.top = rand(15, 60) + '%';
      s.style.animationDelay = (i * 0.1) + 's';
      bedParticles.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }

    // Apply stat boosts (sleep restores all stats a bit, especially hunger & fun)
    state.hunger      = clamp(state.hunger + 15);
    state.cleanliness = clamp(state.cleanliness + 5);
    state.fun         = clamp(state.fun + 12);
    state.grooming    = clamp(state.grooming + 5);
    state.hearts     += 2;

    spawnConfetti(15);
    updateUI();
    saveGame();

    // Auto return home after 2s
    setTimeout(() => {
      leaveSleep();
    }, 2500);
  }

  function leaveSleep() {
    sleepActive = false;
    clearInterval(zzzTimer);
    clearTimeout(sleepTimeout);
    actionLocked = false;
    showScreen(gameScreen);
    spawnSparkles(6);
    petBounce();
    showSpeech(pick(['That nap was great! ✨', 'I feel so refreshed! 😄', 'Ready to play! 🌟', 'Sweet dreams were nice! 💤']), 2500);
  }

  // ── EVENT VISUALS ──
  // When random events happen, show visual items floating near the pet
  // so the kid can SEE what's happening (not just a text banner).
  const EVENT_VISUALS = {
    'sock':      { emoji: '🧦', cssClass: 'event-sock' },
    'butterfly': { emoji: '🦋', cssClass: 'event-butterfly' },
    'glitter':   { emoji: '✨', cssClass: 'event-glitter' },
    'crumbs':    { emoji: '🍪', cssClass: 'event-item' },
    'rainbow':   { emoji: '🌈', cssClass: 'event-item' },
    'flower':    { emoji: '💐', cssClass: 'event-item' },
    'music':     { emoji: '🎵', cssClass: 'event-item' },
    'soap':      { emoji: '🧼', cssClass: 'event-item' },
    'leaf':      { emoji: '🍃', cssClass: 'event-leaf' },
    'star':      { emoji: '⭐', cssClass: 'event-star-wink' },
  };

  // Spawn visual items around the pet during an event
  function showEventVisuals(eventKey, count) {
    if (!gameScreen.classList.contains('active')) return; // only show on main screen

    eventVisual.classList.remove('hidden');
    eventVisual.innerHTML = '';

    const petRect = petContainer.getBoundingClientRect();
    const centerX = petRect.left + petRect.width / 2;
    const centerY = petRect.top + petRect.height / 2;

    const vis = EVENT_VISUALS[eventKey] || EVENT_VISUALS['star'];

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'event-item ' + vis.cssClass;
      el.textContent = vis.emoji;
      el.style.left = (centerX + rand(-60, 60)) + 'px';
      el.style.top  = (centerY + rand(-70, 30)) + 'px';
      el.style.animationDelay = (i * 0.2) + 's';
      eventVisual.appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }

    // Also bounce the pet to react
    petBounce();

    // Hide overlay after animations finish
    setTimeout(() => {
      eventVisual.classList.add('hidden');
    }, 3800);
  }

  // ── GROOM (Barber Shop Scene) ──
  // Transitions to a full barber shop scene. Player drags a brush
  // over the pet to groom it. Each brush stroke over the pet fills
  // a meter. When full, grooming is complete with sparkles + confetti.
  let groomProgress = 0;
  let groomActive = false;
  let groomTimeout = null;
  let brushDragging = false;
  let brushOffsetX = 0;
  let brushOffsetY = 0;
  let lastBrushHitTime = 0;

  function openGroom() {
    if (actionLocked) return;
    actionLocked = true;
    sfxClick();
    groomProgress = 0;
    groomActive = true;
    brushDragging = false;
    $('#brush-meter').style.width = '0%';
    $('#groom-result').textContent = '';
    $('#groom-back').style.display = 'none';

    // Draw pet in barber shop
    drawPetInto(barberPetContainer, 'barber-chibi-pet');

    // Speech
    barberSpeechText.textContent = pick([
      'Brush me! 🪮', 'Make me fluffy!', 'Salon time! ✂️',
      'I want to be pretty!', 'Fluff me up!'
    ]);
    barberSpeech.classList.remove('hidden');

    // Show the brush on the right side
    barberBrush.style.display = 'block';
    barberBrush.style.right = '20px';
    barberBrush.style.left = '';
    barberBrush.style.top = '45%';
    barberBrush.classList.remove('dragging', 'brushing');

    // Switch to barber scene
    showScreen(groomScene);
    // Re-show brush since showScreen hides it for other screens
    barberBrush.style.display = 'block';

    // Auto-close after 12s if not completed
    groomTimeout = setTimeout(() => {
      if (groomActive) endGroom(false);
    }, 12000);
  }

  // Fluff particles that fly off the pet when brushed (fur / feather bits)
  function spawnFluffParticle() {
    const fluffIcons = state.petType === 'bird'
      ? ['🪶', '✨', '💨']
      : ['💨', '✨', '🌟', '💫'];
    const f = document.createElement('span');
    f.className = 'fluff-particle';
    f.textContent = pick(fluffIcons);
    f.style.left = rand(20, 80) + '%';
    f.style.top = rand(20, 60) + '%';
    f.style.setProperty('--fx', rand(-50, 50) + 'px');
    f.style.setProperty('--fy', rand(-60, -20) + 'px');
    barberFluffCont.appendChild(f);
    setTimeout(() => f.remove(), 900);
  }

  // Check if brush overlaps the pet groom zone
  function checkBrushOverPet() {
    if (!groomActive || !brushDragging) return;
    const brushRect = barberBrush.getBoundingClientRect();
    const zoneRect = barberGroomZone.getBoundingClientRect();

    const overlapX = brushRect.left < zoneRect.right && brushRect.right > zoneRect.left;
    const overlapY = brushRect.top < zoneRect.bottom && brushRect.bottom > zoneRect.top;

    if (overlapX && overlapY) {
      const now = Date.now();
      // Throttle: only count a brush stroke every 120ms
      if (now - lastBrushHitTime > 120) {
        lastBrushHitTime = now;
        sfxBrush();
        groomProgress = Math.min(groomProgress + 3, 100);
        $('#brush-meter').style.width = groomProgress + '%';
        barberBrush.classList.add('brushing');
        spawnFluffParticle();

        // Bounce pet slightly
        const bPet = $('#barber-chibi-pet');
        if (bPet && !bPet.classList.contains('pet-happy')) {
          bPet.classList.add('pet-happy');
          setTimeout(() => bPet.classList.remove('pet-happy'), 400);
        }

        // Update speech at milestones
        if (groomProgress === 30) {
          barberSpeechText.textContent = pick(['Ooh that feels nice!', 'Keep going!', 'So relaxing!']);
        } else if (groomProgress === 60) {
          barberSpeechText.textContent = pick(['Almost fluffy!', 'Looking good!', 'More more!']);
        } else if (groomProgress === 90) {
          barberSpeechText.textContent = pick(['Almost done! ✨', 'SO FLUFFY!', 'One more stroke!']);
        }

        if (groomProgress >= 100) {
          endGroom(true);
        }
      }
    } else {
      barberBrush.classList.remove('brushing');
    }
  }

  // Drag handlers for the brush (mouse + touch)
  function onBrushStart(e) {
    if (!groomActive) return;
    e.preventDefault();
    brushDragging = true;
    barberBrush.classList.add('dragging');
    const pt = e.touches ? e.touches[0] : e;
    const rect = barberBrush.getBoundingClientRect();
    brushOffsetX = pt.clientX - rect.left;
    brushOffsetY = pt.clientY - rect.top;
  }

  function onBrushMove(e) {
    if (!brushDragging || !groomActive) return;
    e.preventDefault();
    const pt = e.touches ? e.touches[0] : e;
    barberBrush.style.left = (pt.clientX - brushOffsetX) + 'px';
    barberBrush.style.top = (pt.clientY - brushOffsetY) + 'px';
    barberBrush.style.right = 'auto';
    checkBrushOverPet();
  }

  function onBrushEnd() {
    brushDragging = false;
    barberBrush.classList.remove('dragging', 'brushing');
  }

  // Attach brush drag listeners
  barberBrush.addEventListener('mousedown', onBrushStart);
  barberBrush.addEventListener('touchstart', onBrushStart, { passive: false });
  document.addEventListener('mousemove', onBrushMove);
  document.addEventListener('touchmove', onBrushMove, { passive: false });
  document.addEventListener('mouseup', onBrushEnd);
  document.addEventListener('touchend', onBrushEnd);

  // Spawn sparkles in barber scene
  function spawnBarberSparkles(count) {
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle-particle';
      s.textContent = pick(['✨', '⭐', '💫', '🌟']);
      s.style.left = rand(15, 85) + '%';
      s.style.top = rand(10, 50) + '%';
      s.style.animationDelay = (i * 0.08) + 's';
      barberParticles.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }
  }

  function endGroom(success) {
    groomActive = false;
    brushDragging = false;
    clearTimeout(groomTimeout);
    barberBrush.classList.remove('dragging', 'brushing');

    if (success) {
      state.grooming = clamp(state.grooming + 35);
      state.hearts += 2;
      sfxHappy();
      spawnBarberSparkles(10);
      spawnConfetti(25);

      // Bounce barber pet
      const bPet = $('#barber-chibi-pet');
      if (bPet) {
        bPet.classList.remove('pet-happy');
        void bPet.offsetWidth;
        bPet.classList.add('pet-happy');
      }

      const msgs = [
        'WOW! Fluff level: MAX! 🌟',
        'So shiny!! ✨',
        'Fresh like a new sticker!',
        'FLUFF LEVEL UP! 💖',
        'Gorgeous!! 🎀',
      ];
      $('#groom-result').textContent = pick(msgs);
      barberSpeechText.textContent = pick(['I\'m so fluffy!', 'Look at me! ✨', 'Best groom ever!']);
    } else {
      state.grooming = clamp(state.grooming + 10);
      state.hearts += 1;
      $('#groom-result').textContent = 'Good try! A little fluffier! 🙂';
      barberSpeechText.textContent = 'More brushing next time!';
    }

    $('#groom-back').style.display = 'inline-block';
    updateUI();
    saveGame();

    // Auto-return after a pause
    setTimeout(() => {
      barberBrush.style.display = 'none';
      actionLocked = false;
      showScreen(gameScreen);
      spawnSparkles(6);
      petBounce();
      showSpeech(pick([
        'I feel so pretty!', 'Salon was great! ✨',
        'Fluffiest pet ever!', 'So fresh and clean!'
      ]), 2500);
    }, 2500);
  }

  function leaveBarberShop() {
    groomActive = false;
    brushDragging = false;
    clearTimeout(groomTimeout);
    barberBrush.style.display = 'none';
    actionLocked = false;
    showScreen(gameScreen);
  }

  // ──────────── STICKER BOOK + ACCESSORIES ────────────
  function openStickers() {
    sfxClick();
    const grid = $('#sticker-grid');
    grid.innerHTML = '';
    STICKER_ICONS.forEach((icon) => {
      const slot = document.createElement('div');
      slot.className = 'sticker-slot';
      if (state.stickers.includes(icon)) {
        slot.classList.add('earned');
        slot.textContent = icon;
      } else {
        slot.textContent = '?';
      }
      grid.appendChild(slot);
    });

    const accGrid = $('#accessory-grid');
    accGrid.innerHTML = '';

    // "None" button to remove accessory
    const noneBtn = document.createElement('button');
    noneBtn.className = 'accessory-btn' + (state.equippedAccessory === null ? ' equipped' : '');
    noneBtn.textContent = '❌ None';
    noneBtn.addEventListener('click', () => {
      state.equippedAccessory = null;
      sfxClick();
      updateAccessory();
      saveGame();
      openStickers(); // refresh
    });
    accGrid.appendChild(noneBtn);

    ACCESSORIES.forEach((acc) => {
      const btn = document.createElement('button');
      const unlocked = state.stickers.length >= acc.req;
      btn.className = 'accessory-btn' + (unlocked ? '' : ' locked') + (state.equippedAccessory === acc.id ? ' equipped' : '');
      btn.textContent = acc.label + (unlocked ? '' : ` (🔒 ${acc.req}⭐)`);
      if (unlocked) {
        btn.addEventListener('click', () => {
          state.equippedAccessory = acc.id;
          sfxClick();
          updateAccessory();
          saveGame();
          openStickers(); // refresh
        });
      }
      accGrid.appendChild(btn);
    });

    stickerOverlay.classList.remove('hidden');
  }

  // ──────────── SAVE / LOAD (localStorage) ────────────
  const SAVE_KEY = 'myPetPals_save';

  function saveGame() {
    const data = {
      petType: state.petType,
      petName: state.petName,
      hunger: state.hunger,
      cleanliness: state.cleanliness,
      fun: state.fun,
      grooming: state.grooming,
      hearts: state.hearts,
      stickers: state.stickers,
      equippedAccessory: state.equippedAccessory,
    };
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (_) {}
  }

  function loadGame() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data.petType) return false;
      state.petType          = data.petType;
      state.petName          = data.petName || 'Buddy';
      state.hunger           = data.hunger ?? 70;
      state.cleanliness      = data.cleanliness ?? 70;
      state.fun              = data.fun ?? 70;
      state.grooming         = data.grooming ?? 70;
      state.hearts           = data.hearts ?? 0;
      state.stickers         = data.stickers || [];
      state.equippedAccessory = data.equippedAccessory || null;
      return true;
    } catch (_) { return false; }
  }

  function resetGame() {
    try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
    state = {
      petType: null, petName: 'Buddy',
      hunger: 70, cleanliness: 70, fun: 70, grooming: 70,
      hearts: 0, stickers: [], equippedAccessory: null, happyStreak: 0,
    };
    clearInterval(decayInterval);
    clearInterval(blinkTimer);
    clearInterval(dialogueTimer);
    clearTimeout(eventTimer);
    clearInterval(happyCheckTimer);
    actionLocked = false;
    showScreen(selectScreen);
  }

  // ──────────── GAME START / LAUNCH ────────────
  function launchGame() {
    showScreen(gameScreen);
    petNameDisplay.textContent = '🐾 ' + state.petName;
    drawPet();
    updateUI();
    startDecay();
    startBlink();
    startDialogue();
    startEvents();
    startHappyCheck();
  }

  // ──────────── EVENT LISTENERS ────────────

  // Splash → Selection
  btnStart.addEventListener('click', () => {
    sfxClick();
    showScreen(selectScreen);
  });

  // Pet Card Selection
  let selectedType = null;
  petCards.forEach(card => {
    card.addEventListener('click', () => {
      sfxClick();
      petCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedType = card.dataset.pet;
      nameArea.style.display = 'flex';
      petNameInput.focus();
    });
  });

  // Go Button
  btnGo.addEventListener('click', () => {
    if (!selectedType) return;
    sfxHappy();
    state.petType = selectedType;
    state.petName = petNameInput.value.trim() || 'Buddy';
    state.hunger = 70;
    state.cleanliness = 70;
    state.fun = 70;
    state.grooming = 70;
    state.hearts = 0;
    state.stickers = [];
    state.equippedAccessory = null;
    state.happyStreak = 0;
    saveGame();
    launchGame();
  });

  // Allow Enter to confirm name
  petNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btnGo.click();
  });

  // Action Buttons
  btnFeed.addEventListener('click', openFeed);
  btnShower.addEventListener('click', openShower);
  btnPlay.addEventListener('click', openPlay);
  btnGroom.addEventListener('click', openGroom);
  btnWalk.addEventListener('click', openWalk);
  btnSleep.addEventListener('click', openSleep);

  // Feed snack buttons (in dining room scene)
  $$('.btn-snack').forEach(btn => {
    btn.addEventListener('click', () => doFeed(btn.dataset.snack));
  });
  // Back button from dining room
  $('#feed-back').addEventListener('click', () => {
    leaveDiningRoom();
  });

  // Back button from park
  $('#park-back').addEventListener('click', () => {
    leavePark();
  });

  // Back button from barber shop
  $('#groom-back').addEventListener('click', () => {
    leaveBarberShop();
  });

  // Water button (hold to shower) — mouse + touch
  const btnWater = $('#btn-water');
  btnWater.addEventListener('mousedown', (e) => { e.preventDefault(); startWater(); });
  btnWater.addEventListener('touchstart', (e) => { e.preventDefault(); startWater(); }, { passive: false });
  btnWater.addEventListener('mouseup', stopWater);
  btnWater.addEventListener('mouseleave', stopWater);
  btnWater.addEventListener('touchend', stopWater);
  btnWater.addEventListener('touchcancel', stopWater);

  // Back button from bathroom
  $('#bath-back').addEventListener('click', () => {
    leaveBathroom();
  });

  // Walk step button
  $('#btn-step').addEventListener('click', () => {
    takeStep();
  });
  // Back button from walk
  $('#walk-back').addEventListener('click', () => {
    leaveWalk();
  });

  // Playground activity zones
  $('#pg-slide').addEventListener('click', pgDoSlide);
  $('#pg-trick-jump').addEventListener('click', pgDoJump);
  $('#pg-trick-spin').addEventListener('click', pgDoSpin);
  $('#pg-trick-roll').addEventListener('click', pgDoRoll);
  // Back button from playground
  $('#pg-back').addEventListener('click', () => {
    leavePlayground();
  });

  // Sticker book
  btnStickers.addEventListener('click', openStickers);
  $('#sticker-close').addEventListener('click', () => {
    stickerOverlay.classList.add('hidden');
  });

  // New Pet
  btnNewPet.addEventListener('click', () => {
    if (confirm('Start over with a new pet? 🥺')) {
      resetGame();
    }
  });

  // Keyboard shortcuts (1–5 for actions, only on main game screen)
  document.addEventListener('keydown', (e) => {
    if (!gameScreen.classList.contains('active')) return;
    if (e.key === '1') btnFeed.click();
    if (e.key === '2') btnShower.click();
    if (e.key === '3') btnPlay.click();
    if (e.key === '4') btnGroom.click();
    if (e.key === '5') btnWalk.click();
    if (e.key === '6') btnSleep.click();
  });

  // ──────────── INIT ────────────
  // Check for saved game; if found, skip to game screen.
  if (loadGame()) {
    // Saved game exists — go straight to game
    launchGame();
  }
  // Otherwise stay on splash screen (default active).

})();
