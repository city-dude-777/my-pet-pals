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

  // Nail salon scene refs
  const nailScene          = $('#nail-scene');
  const nailPetContainer   = $('#nail-pet-container');
  const nsSpeech           = $('#ns-speech');
  const nsSpeechText       = $('#ns-speech-text');
  const nsParticles        = $('#ns-particles');

  // Makeup vanity scene refs
  const makeupScene        = $('#makeup-scene');
  const mvPetPreview       = $('#mv-pet-preview');
  const mvMakeupOverlay    = $('#mv-makeup-overlay');
  const mvSpeechText       = $('#mv-speech-text');

  // Dress-up scene refs
  const dressScene         = $('#dress-scene');
  const dressPetContainer  = $('#dress-pet-container');
  const dressMirrorPet     = $('#dress-mirror-pet');
  const dressAccOvl        = $('#dress-accessory-overlay');
  const wrSpeechText       = $('#wr-speech-text');
  const wrParticles        = $('#wr-particles');

  // Kitchen scene refs
  const cookScene          = $('#cook-scene');
  const cookPetContainer   = $('#cook-pet-container');
  const ktSpeechText       = $('#kt-speech-text');
  const ktParticles        = $('#kt-particles');

  // Garden scene refs
  const gardenScene        = $('#garden-scene');
  const gardenPetContainer = $('#garden-pet-container');
  const gdSpeechText       = $('#gd-speech-text');
  const gdParticles        = $('#gd-particles');

  // Photo booth scene refs
  const photoScene         = $('#photo-scene');
  const photoPetContainer  = $('#photo-pet-container');
  const photoAccOvl        = $('#photo-accessory-overlay');

  // Party scene refs
  const partyScene         = $('#party-scene');
  const partyRoom          = $('#party-room');
  const partyDecos         = $('#party-decos');
  const partyGuests        = $('#party-guests');
  const partyHost          = $('#party-host');
  const partyMusic         = $('#party-music');
  const partyPicker        = $('#party-picker');
  const partyStatus        = $('#party-status');

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
  const btnNails  = $('#btn-nails');
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
    nailColors: [null, null, null, null],  // color for each paw (null = unpainted)
    ownedOutfits: [],    // array of outfit ids the player has bought
    equippedOutfit: null, // currently worn outfit id
    gardenPlots: [null, null, null, null], // {seed, stage, watered} or null
    photoGallery: [],    // array of {bg, prop} snapshots
    makeup: { blush: null, lipstick: null, eyeshadow: null, eyeliner: null, lashes: null, sparkle: null },
    createdAt: null,     // timestamp when pet was created
    lastBdaySurprise: null, // date string of last birthday surprise
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

  // Wardrobe outfits (buy with hearts)
  const OUTFITS = [
    { id: 'top-hat',       icon: '🎩', label: 'Top Hat',       cost: 3,  cssClass: 'outfit-top-hat' },
    { id: 'crown',         icon: '👑', label: 'Crown',         cost: 5,  cssClass: 'outfit-crown' },
    { id: 'sunglasses',    icon: '🕶️', label: 'Sunglasses',   cost: 2,  cssClass: 'outfit-sunglasses' },
    { id: 'scarf',         icon: '🧣', label: 'Scarf',         cost: 3,  cssClass: 'outfit-scarf' },
    { id: 'bow',           icon: '🎀', label: 'Hair Bow',      cost: 2,  cssClass: 'outfit-bow' },
    { id: 'cape',          icon: '🦸', label: 'Cape',          cost: 6,  cssClass: 'outfit-cape' },
    { id: 'party-hat',     icon: '🥳', label: 'Party Hat',     cost: 2,  cssClass: 'outfit-party-hat' },
    { id: 'wizard-hat',    icon: '🧙', label: 'Wizard Hat',    cost: 5,  cssClass: 'outfit-wizard-hat' },
    { id: 'bandana',       icon: '🏴‍☠️', label: 'Bandana',     cost: 3,  cssClass: 'outfit-bandana' },
    { id: 'tiara',         icon: '💎', label: 'Tiara',         cost: 4,  cssClass: 'outfit-tiara' },
    { id: 'dress',         icon: '👗', label: 'Pink Dress',    cost: 4,  cssClass: 'outfit-dress' },
    { id: 'fancy-dress',   icon: '💜', label: 'Fancy Dress',   cost: 6,  cssClass: 'outfit-fancy-dress' },
    { id: 'tshirt',        icon: '👕', label: 'Blue T-Shirt',  cost: 2,  cssClass: 'outfit-tshirt' },
    { id: 'red-tshirt',    icon: '❤️', label: 'Red T-Shirt',  cost: 2,  cssClass: 'outfit-red-tshirt' },
    { id: 'sweater',       icon: '🧶', label: 'Sweater',       cost: 4,  cssClass: 'outfit-sweater' },
    { id: 'cozy-sweater',  icon: '🍀', label: 'Cozy Sweater',  cost: 4,  cssClass: 'outfit-cozy-sweater' },
    { id: 'pants',         icon: '👖', label: 'Jeans',          cost: 3,  cssClass: 'outfit-pants' },
    { id: 'shorts',        icon: '🩳', label: 'Shorts',        cost: 2,  cssClass: 'outfit-shorts' },
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
    [splashScreen, selectScreen, gameScreen, feedScene, parkScene, groomScene, bathScene, dryScene, walkScene, playgroundScene, sleepScene, nailScene, makeupScene, dressScene, cookScene, gardenScene, photoScene, partyScene].forEach(s => s.classList.remove('active'));
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
    } else if (state.petType === 'hamster') {
      return `
        <div class="hamster-ear-l"></div>
        <div class="hamster-ear-r"></div>
        <div class="hamster-ear-inner-l"></div>
        <div class="hamster-ear-inner-r"></div>
        <div class="chibi-body">
          <div class="hamster-cheek-l"></div>
          <div class="hamster-cheek-r"></div>
          <div class="chibi-belly"></div>
          <div class="chibi-eyes"><div class="chibi-eye eye-l"></div><div class="chibi-eye eye-r"></div></div>
          <div class="chibi-nose"></div>
          <div class="chibi-mouth"></div>
          <div class="chibi-blush-l"></div>
          <div class="chibi-blush-r"></div>
          <div class="hamster-whiskers">
            <div class="hamster-whisker"></div><div class="hamster-whisker"></div>
            <div class="hamster-whisker"></div><div class="hamster-whisker"></div>
          </div>
        </div>
        <div class="chibi-legs"><div class="chibi-leg"></div><div class="chibi-leg"></div></div>
        <div class="hamster-tail"></div>
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

  // ──────────── LIVING ROOM CLEANING ────────────
  // Mess only appears when you press the Clean button.
  // Once cleaned, it stays clean until you press Clean again.
  const messItems = $$('.mess-item');
  const livingRoom = document.querySelector('.living-room');
  const cleanSparklesCont = $('#lr-clean-sparkles');

  let cleaningMode = false;
  let cleanCount = 0;
  const cleanModeBar = $('#clean-mode-bar');
  const cleanMeter = $('#clean-meter');
  const cleanCountEl = $('#clean-count');

  function hideAllMess() {
    messItems.forEach(item => {
      item.classList.remove('visible', 'cleaning');
    });
    if (livingRoom) livingRoom.classList.remove('messy', 'very-messy', 'cleaning-mode');
  }

  function openCleanMode() {
    if (actionLocked) return;
    actionLocked = true;
    sfxClick();
    cleaningMode = true;
    cleanCount = 0;
    cleanCountEl.textContent = '0';
    cleanMeter.style.width = '0%';

    // Show all mess items
    messItems.forEach(item => {
      item.classList.remove('cleaning');
      item.classList.add('visible');
    });

    // Enter cleaning mode
    livingRoom.classList.add('cleaning-mode');
    gameScreen.classList.add('game-cleaning');
    cleanModeBar.classList.remove('hidden');

    showSpeech(pick(['Time to tidy up! 🧹', 'Let\'s clean!', 'Spotless incoming!']), 2000);
  }

  function cleanMessItem(item) {
    if (!item.classList.contains('visible')) return;
    if (item.classList.contains('cleaning')) return;

    sfxPop();

    // Spawn sparkle at the item's position
    const rect = item.getBoundingClientRect();
    const parentRect = cleanSparklesCont.getBoundingClientRect();
    for (let i = 0; i < 3; i++) {
      const sp = document.createElement('span');
      sp.className = 'clean-sparkle';
      sp.textContent = pick(['✨', '🫧', '💫', '🧹']);
      sp.style.left = (rect.left - parentRect.left + rand(-10, 10)) + 'px';
      sp.style.top = (rect.top - parentRect.top + rand(-10, 10)) + 'px';
      sp.style.animationDelay = (i * 0.1) + 's';
      cleanSparklesCont.appendChild(sp);
      setTimeout(() => sp.remove(), 900);
    }

    // Animate item away
    item.classList.remove('visible');
    item.classList.add('cleaning');
    setTimeout(() => item.classList.remove('cleaning'), 500);

    // Boost cleanliness
    state.cleanliness = clamp(state.cleanliness + 5);

    // Track progress
    cleanCount++;
    if (cleanCountEl) cleanCountEl.textContent = cleanCount;

    const stillVisible = Array.from(messItems).filter(m => m.classList.contains('visible')).length;
    const progress = Math.round(((messItems.length - stillVisible) / messItems.length) * 100);
    if (cleanMeter) cleanMeter.style.width = Math.min(progress, 100) + '%';

    if (stillVisible === 0) {
      showSpeech(pick(['Sparkly clean! ✨', 'The room looks great!', 'So tidy! 🫧']), 2000);
      setTimeout(() => exitCleanMode(), 800);
    } else {
      showSpeech(pick(['Clean clean!', 'Tidy up! 🧹', 'Spotless!', 'Good as new!', 'Shiny! ✨']), 1200);
    }

    updateUI();
    saveGame();
  }

  function exitCleanMode() {
    cleaningMode = false;
    actionLocked = false;
    livingRoom.classList.remove('cleaning-mode');
    gameScreen.classList.remove('game-cleaning');
    cleanModeBar.classList.add('hidden');

    // Hide any remaining mess
    hideAllMess();

    if (cleanCount > 0) {
      sfxHappy();
      state.hearts += Math.floor(cleanCount / 3);
      spawnSparkles(4);
      showSpeech(pick(['All tidy! ✨', 'Clean and fresh!', 'Great job cleaning! 🫧']), 2500);
      spawnConfetti(10);
      updateUI();
      saveGame();
    }
  }

  // Attach click handlers to mess items (only works in cleaning mode)
  messItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!cleaningMode) return;
      cleanMessItem(item);
    });
  });

  // Done button
  $('#clean-done').addEventListener('click', exitCleanMode);

  // Start with a clean room
  hideAllMess();

  // ──────────── GAME LOOP: STAT DECAY ────────────
  // Every 3 seconds stats gently decay. Each pet type decays differently:
  //   Dog: cleanliness drops faster (gets dirty playing)
  //   Cat: grooming drops faster (fur care matters)
  //   Bird: hunger drops faster (tiny tummy)
  function startDecay() {
    if (decayInterval) clearInterval(decayInterval);
    decayInterval = setInterval(() => {
      let hd = 1.5, cd = 1.0, fd = 1.2, gd = 0.8;

      if (state.petType === 'dog')   { cd = 1.8; fd = 0.9; }
      if (state.petType === 'cat')   { gd = 1.5; hd = 1.8; }
      if (state.petType === 'bird')  { hd = 2.2; gd = 0.6; }
      if (state.petType === 'hamster') { hd = 2.0; fd = 1.0; cd = 0.8; }

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
    // Sticker-book accessory
    if (state.equippedAccessory) {
      const acc = ACCESSORIES.find(a => a.id === state.equippedAccessory);
      if (acc) {
        const el = document.createElement('div');
        el.className = acc.cssClass;
        accessoryOvl.appendChild(el);
      }
    }
    // Wardrobe outfit
    if (state.equippedOutfit) {
      const outfit = OUTFITS.find(o => o.id === state.equippedOutfit);
      if (outfit) {
        const el = document.createElement('div');
        el.className = outfit.cssClass;
        accessoryOvl.appendChild(el);
      }
    }
    // Makeup
    renderMakeupOnto(accessoryOvl, state.makeup);
  }

  function renderMakeupOnto(container, makeup) {
    if (!makeup) return;
    container.querySelectorAll('.mu-layer').forEach(e => e.remove());
    const wrap = document.createElement('div');
    wrap.className = 'mu-layer';

    if (makeup.blush) {
      const l = document.createElement('div'); l.className = 'mu-blush mu-blush-l'; l.style.background = makeup.blush;
      const r = document.createElement('div'); r.className = 'mu-blush mu-blush-r'; r.style.background = makeup.blush;
      wrap.appendChild(l); wrap.appendChild(r);
    }
    if (makeup.lipstick) {
      const lip = document.createElement('div'); lip.className = 'mu-lipstick'; lip.style.background = makeup.lipstick;
      wrap.appendChild(lip);
    }
    if (makeup.eyeshadow) {
      const l = document.createElement('div'); l.className = 'mu-eyeshadow mu-eyeshadow-l'; l.style.background = makeup.eyeshadow;
      const r = document.createElement('div'); r.className = 'mu-eyeshadow mu-eyeshadow-r'; r.style.background = makeup.eyeshadow;
      wrap.appendChild(l); wrap.appendChild(r);
    }
    if (makeup.eyeliner) {
      const l = document.createElement('div'); l.className = 'mu-eyeliner mu-eyeliner-l'; l.style.borderColor = makeup.eyeliner;
      const r = document.createElement('div'); r.className = 'mu-eyeliner mu-eyeliner-r'; r.style.borderColor = makeup.eyeliner;
      wrap.appendChild(l); wrap.appendChild(r);
    }
    if (makeup.lashes) {
      const l = document.createElement('div'); l.className = 'mu-lashes mu-lashes-l'; l.style.borderColor = makeup.lashes;
      const r = document.createElement('div'); r.className = 'mu-lashes mu-lashes-r'; r.style.borderColor = makeup.lashes;
      wrap.appendChild(l); wrap.appendChild(r);
    }
    if (makeup.sparkle) {
      const gl = document.createElement('div'); gl.className = 'mu-sparkle'; gl.style.color = makeup.sparkle;
      gl.innerHTML = '✦ ✧ ✦';
      wrap.appendChild(gl);
    }
    container.appendChild(wrap);
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

    // Hamster loves seeds, stores food in cheeks!
    if (state.petType === 'hamster') {
      if (snack === 'seeds') { hg = 35; fg = 12; }
      if (snack === 'kibble') { hg = 22; }
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

  // ── PET TRICKS GAME (Park Scene) ──
  // Pet asks you to do a trick — tap the right trick button!
  const tricks = [
    { id: 'sit',   emoji: '🐾', label: 'Sit',      ask: ['Sit!', 'Can you sit?', 'Sit down!', 'Sit, please!'] },
    { id: 'jump',  emoji: '⬆️', label: 'Jump',     ask: ['Jump!', 'Jump high!', 'Hop hop!', 'Jump up!'] },
    { id: 'spin',  emoji: '🌀', label: 'Spin',     ask: ['Spin!', 'Do a spin!', 'Twirl around!', 'Spin spin!'] },
    { id: 'shake', emoji: '🤝', label: 'Shake',    ask: ['Shake!', 'Shake paws!', 'Gimme paw!', 'High five!'] },
  ];
  let playClicks = 0;
  let playGoal = 5;
  let playActive = false;
  let currentTrick = null;
  let trickTimeout = null;

  function openPlay() {
    if (actionLocked) return;
    actionLocked = true;
    sfxClick();
    playClicks = 0;
    playGoal = 5;
    playActive = true;
    currentTrick = null;
    $('#play-clicks').textContent = '0';
    $('#trick-result').textContent = '';
    $('#park-back').style.display = 'none';

    // Draw pet in park
    drawPetInto(parkPetContainer, 'park-chibi-pet');

    // Park speech
    parkSpeechText.textContent = pick(['Trick time!', 'I know tricks! 🎪', 'Watch me!', 'Let\'s do tricks!']);
    parkSpeech.classList.remove('hidden');

    $('#play-title').textContent = 'Trick Time! 🎪';

    // Enable all trick buttons
    $$('.btn-trick').forEach(b => {
      b.disabled = false;
      b.classList.remove('btn-trick-correct', 'btn-trick-wrong', 'btn-trick-active');
    });

    // Switch to park scene
    showScreen(parkScene);

    // Start first trick after short delay
    setTimeout(() => askNextTrick(), 800);
  }

  function askNextTrick() {
    if (!playActive) return;

    // Pick a random trick
    currentTrick = pick(tricks);

    // Show the prompt
    const prompt = pick(currentTrick.ask);
    $('#trick-prompt').textContent = `${currentTrick.emoji} ${prompt}`;
    $('#trick-prompt').classList.add('trick-prompt-bounce');
    setTimeout(() => $('#trick-prompt').classList.remove('trick-prompt-bounce'), 500);

    // Highlight pet speech with the trick request
    parkSpeechText.textContent = prompt;
    parkSpeech.classList.remove('hidden');

    // Flash the correct button briefly as a hint for the first trick
    if (playClicks === 0) {
      const hintBtn = document.querySelector(`.btn-trick[data-trick="${currentTrick.id}"]`);
      if (hintBtn) {
        hintBtn.classList.add('btn-trick-hint');
        setTimeout(() => hintBtn.classList.remove('btn-trick-hint'), 600);
      }
    }

    // Auto-timeout: if player doesn't pick in 4 seconds, show encouragement
    clearTimeout(trickTimeout);
    trickTimeout = setTimeout(() => {
      if (playActive && currentTrick) {
        $('#trick-result').textContent = '⏰ Hurry! Tap the right trick!';
      }
    }, 4000);
  }

  function handleTrickClick(trickId) {
    if (!playActive || !currentTrick) return;
    clearTimeout(trickTimeout);

    const pPet = $('#park-chibi-pet');

    if (trickId === currentTrick.id) {
      // CORRECT!
      playClicks++;
      sfxPop();
      $('#play-clicks').textContent = playClicks;

      // Flash the button green
      const btn = document.querySelector(`.btn-trick[data-trick="${trickId}"]`);
      if (btn) {
        btn.classList.add('btn-trick-correct');
        setTimeout(() => btn.classList.remove('btn-trick-correct'), 500);
      }

      // Pet does the trick animation
      if (pPet) {
        pPet.classList.remove('pet-happy', 'pet-trick-sit', 'pet-trick-jump', 'pet-trick-spin', 'pet-trick-shake');
        void pPet.offsetWidth;
        pPet.classList.add('pet-trick-' + trickId);
        setTimeout(() => pPet.classList.remove('pet-trick-' + trickId), 800);
      }

      // Show success message
      const petNick = state.petType === 'dog' ? 'boy' : state.petType === 'cat' ? 'kitty' : state.petType === 'hamster' ? 'hammy' : 'birdie';
      const cheers = ['Great job! ⭐', 'Amazing! 🌟', 'Good ' + petNick + '! 🎉', 'Wow! ✨', 'Purrfect! 💫'];
      $('#trick-result').textContent = pick(cheers);
      parkSpeechText.textContent = pick(['Yay!', 'I did it!', 'Treat please! 🍪', 'Woo!']);

      // Sparkles
      spawnParkSparkles(4);

      if (playClicks >= playGoal) {
        setTimeout(() => endPlay(), 600);
      } else {
        setTimeout(() => askNextTrick(), 1000);
      }
    } else {
      // WRONG trick
      sfxClick();
      const btn = document.querySelector(`.btn-trick[data-trick="${trickId}"]`);
      if (btn) {
        btn.classList.add('btn-trick-wrong');
        setTimeout(() => btn.classList.remove('btn-trick-wrong'), 400);
      }

      // Pet confused reaction
      if (pPet) {
        pPet.classList.remove('pet-happy');
        void pPet.offsetWidth;
      }

      const oops = ['Hmm, not that one!', 'Try again! 🤔', 'Oops! Wrong trick!', 'Nope, try the other one!'];
      $('#trick-result').textContent = pick(oops);
      parkSpeechText.textContent = pick(['Huh?', 'That\'s not it!', '🤔']);
    }
  }

  // Attach click handlers to trick buttons (inline, since script is at end of body)
  $$('.btn-trick').forEach(btn => {
    btn.addEventListener('click', () => handleTrickClick(btn.dataset.trick));
  });

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
    currentTrick = null;
    clearTimeout(trickTimeout);
    actionLocked = false;

    state.fun         = clamp(state.fun + 30);
    state.hunger      = clamp(state.hunger - 5);
    state.cleanliness = clamp(state.cleanliness - 5);
    state.hearts     += 2;

    sfxHappy();

    // Disable trick buttons
    $$('.btn-trick').forEach(b => b.disabled = true);

    // Show victory in the park
    parkSpeechText.textContent = pick(['That was FUN! 🎉', 'I\'m a trick master!', 'WHEEE!', 'Best tricks ever! 🎈', 'I deserve treats!']);
    parkSpeech.classList.remove('hidden');
    $('#trick-prompt').textContent = '🏆 All tricks done!';
    $('#trick-result').textContent = '⭐ Amazing trick session! ⭐';
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
      showSpeech(pick(['That was so fun!', 'I love tricks!', 'Let\'s do more tricks! 🎈']), 2500);
    }, 2800);
  }

  function leavePark() {
    playActive = false;
    currentTrick = null;
    clearTimeout(trickTimeout);
    actionLocked = false;
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
  const NPC_HAMSTER_NAMES = ['Peanut', 'Cheeks', 'Nibbles', 'Squeaky', 'Boba', 'Poppy', 'Hazel', 'Acorn'];

  function getNpcNames() {
    if (state.petType === 'dog') return NPC_DOG_NAMES;
    if (state.petType === 'cat') return NPC_CAT_NAMES;
    if (state.petType === 'hamster') return NPC_HAMSTER_NAMES;
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
        : state.petType === 'hamster'
          ? ['Adventure time! 🐹', 'So much to explore!', 'Squeak squeak!', 'Tiny steps, big world!']
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
    } else if (state.petType === 'hamster') {
      return ['Squeak! 🐹', '*wiggles nose*', 'Eep eep!', '*stuffs cheeks*', 'Hi hi hi!', '*tiny wave*', 'Wheek! 💕'];
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
    if (state.petType === 'hamster') return ['Wheee tiny slide! 🐹', 'Watch me roll!', '*zooms through tube*', 'So fun!'];
    return ['Wheee! 🐦', 'Chirp chirp!', 'Fly high!', 'My turn!'];
  }

  function getPlayerMeetLines() {
    if (state.petType === 'dog') return ['PLAYGROUND!! 🐕', 'BEST DAY EVER!', 'Let\'s GO!', 'I wanna slide!'];
    if (state.petType === 'cat') return ['A playground? 🐱', 'I suppose...', 'Not bad!', 'Interesting.'];
    if (state.petType === 'hamster') return ['Tiny playground! 🐹', 'I fit in the tube!', 'Squeak squeak!', 'This is amazing!'];
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
      : state.petType === 'hamster'
      ? ['✨', '🐹', '💨']
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

  // ──────────── NAIL SALON ────────────
  let nailActive = false;
  let selectedNailColor = '#ff6b8a';
  let pawsPainted = 0;

  function openNails() {
    if (actionLocked) return;
    actionLocked = true;
    sfxClick();
    nailActive = true;
    pawsPainted = 0;
    $('#ns-paws-count').textContent = '0';
    $('#nail-back').style.display = 'none';

    // Draw pet in salon
    drawPetInto(nailPetContainer, 'nail-chibi-pet');

    // Speech
    const lines = state.petType === 'dog'
      ? ['Ooh pretty colors!', 'Paint my paws! 🐾', 'I want sparkles!']
      : state.petType === 'cat'
        ? ['Fancy nails? Yes please! 💅', 'Make me pretty!', 'Hmm, what color?']
        : state.petType === 'hamster'
          ? ['Tiny paw makeover! 🐹', 'My little nails!', 'Squeak! Pretty colors!']
        : ['Paint my feet! 🐦', 'Pretty talons! ✨', 'Ooh shiny!'];
    nsSpeechText.textContent = pick(lines);
    nsSpeech.style.display = '';

    // Reset paw visuals to current saved nail colors
    for (let i = 0; i < 4; i++) {
      const paw = $(`#ns-paw-${i}`);
      paw.classList.remove('just-painted');
      const nails = paw.querySelectorAll('.ns-nail');
      const savedColor = state.nailColors[i];
      nails.forEach(n => {
        n.classList.remove('painted', 'sparkle-nail');
        if (savedColor) {
          if (savedColor === 'sparkle') {
            n.style.background = 'linear-gradient(135deg,#fbbf24,#f472b6,#a78bfa,#38bdf8)';
            n.classList.add('painted', 'sparkle-nail');
          } else {
            n.style.background = savedColor;
            n.classList.add('painted');
          }
          n.style.borderColor = 'rgba(0,0,0,.2)';
        } else {
          n.style.background = 'transparent';
          n.style.borderColor = 'transparent';
        }
      });
    }

    // Reset color picker
    $$('.ns-color-btn').forEach(b => b.classList.remove('ns-color-active'));
    const defaultBtn = document.querySelector('.ns-color-btn[data-color="#ff6b8a"]');
    if (defaultBtn) defaultBtn.classList.add('ns-color-active');
    selectedNailColor = '#ff6b8a';

    showScreen(nailScene);
  }

  function paintPaw(pawIndex) {
    if (!nailActive) return;
    sfxPop();

    const paw = $(`#ns-paw-${pawIndex}`);
    const nails = paw.querySelectorAll('.ns-nail');

    // Apply selected color to all nails on this paw
    nails.forEach(n => {
      n.classList.remove('sparkle-nail');
      if (selectedNailColor === 'sparkle') {
        n.style.background = 'linear-gradient(135deg,#fbbf24,#f472b6,#a78bfa,#38bdf8)';
        n.classList.add('painted', 'sparkle-nail');
      } else {
        n.style.background = selectedNailColor;
        n.classList.add('painted');
      }
      n.style.borderColor = 'rgba(0,0,0,.2)';
    });

    // Save the color
    const wasPainted = state.nailColors[pawIndex] !== null;
    state.nailColors[pawIndex] = selectedNailColor;

    // Animate paw
    paw.classList.remove('just-painted');
    void paw.offsetWidth;
    paw.classList.add('just-painted');

    // Count newly painted paws this session
    if (!wasPainted) {
      pawsPainted++;
      $('#ns-paws-count').textContent = pawsPainted;
    }

    // Sparkle particles
    spawnNailSparkles(3);

    // Pet reactions
    const pPet = $('#nail-chibi-pet');
    if (pPet) {
      pPet.classList.remove('pet-happy');
      void pPet.offsetWidth;
      pPet.classList.add('pet-happy');
    }

    const reactions = ['Ooh pretty!', 'I love it! 💕', 'So fancy! ✨', 'More more!', 'Beautiful! 💅', 'Wow! 🌟'];
    nsSpeechText.textContent = pick(reactions);

    // Check if all 4 paws are painted
    const allPainted = state.nailColors.every(c => c !== null);
    if (allPainted && pawsPainted >= 4) {
      setTimeout(() => endNailSession(), 800);
    }

    saveGame();
  }

  function spawnNailSparkles(count) {
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle-particle';
      s.textContent = pick(['✨', '💅', '💫', '🌟', '💕']);
      s.style.left = rand(20, 80) + '%';
      s.style.top = rand(10, 50) + '%';
      s.style.animationDelay = (i * 0.1) + 's';
      nsParticles.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }
  }

  function endNailSession() {
    sfxHappy();
    spawnConfetti(20);
    spawnNailSparkles(8);

    state.grooming = clamp(state.grooming + 15);
    state.fun      = clamp(state.fun + 10);
    state.hearts  += 2;

    nsSpeechText.textContent = pick(['GORGEOUS! 💅✨', 'I\'m so pretty!', 'Best nails ever! 🌟', 'Fashion icon! 💕']);
    $('#nail-back').style.display = 'inline-block';

    updateUI();
    saveGame();

    // Auto-return after a pause
    setTimeout(() => {
      nailActive = false;
      actionLocked = false;
      showScreen(gameScreen);
      spawnSparkles(6);
      petBounce();
      showSpeech(pick(['Look at my nails! 💅', 'So pretty! ✨', 'I feel fancy!']), 2500);
    }, 2500);
  }

  function leaveNailSalon() {
    nailActive = false;
    actionLocked = false;
    saveGame();
    showScreen(gameScreen);
  }

  // Color picker handler
  $$('.ns-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sfxClick();
      $$('.ns-color-btn').forEach(b => b.classList.remove('ns-color-active'));
      btn.classList.add('ns-color-active');
      selectedNailColor = btn.dataset.color;
    });
  });

  // Paw click handlers
  $$('.ns-paw').forEach(paw => {
    paw.addEventListener('click', () => {
      const idx = parseInt(paw.dataset.paw);
      paintPaw(idx);
    });
  });

  // ──────────── MAKEUP VANITY ────────────
  const MAKEUP_PALETTES = {
    blush: [
      { color: '#ffb3c1', label: 'Rose Pink' },
      { color: '#ff8fab', label: 'Coral' },
      { color: '#f4978e', label: 'Peach' },
      { color: '#e5989b', label: 'Dusty Rose' },
      { color: '#d4a5a5', label: 'Mauve' },
      { color: '#c9705d', label: 'Terracotta' },
      { color: '#ff6b6b', label: 'Berry' },
      { color: '#ffc2d1', label: 'Baby Pink' },
    ],
    lipstick: [
      { color: '#e63946', label: 'Classic Red' },
      { color: '#ff006e', label: 'Hot Pink' },
      { color: '#c9184a', label: 'Berry' },
      { color: '#ff758f', label: 'Coral' },
      { color: '#a4133c', label: 'Wine' },
      { color: '#ff4d6d', label: 'Fuchsia' },
      { color: '#ffb3c6', label: 'Nude Pink' },
      { color: '#d62839', label: 'Crimson' },
    ],
    eyeshadow: [
      { color: '#c8b6ff', label: 'Lavender' },
      { color: '#ffc8dd', label: 'Pink' },
      { color: '#a2d2ff', label: 'Sky Blue' },
      { color: '#bde0fe', label: 'Baby Blue' },
      { color: '#cdb4db', label: 'Lilac' },
      { color: '#ffd6a5', label: 'Peach Gold' },
      { color: '#caffbf', label: 'Mint' },
      { color: '#fdffb6', label: 'Champagne' },
      { color: '#9b5de5', label: 'Purple' },
      { color: '#f15bb5', label: 'Magenta' },
    ],
    eyeliner: [
      { color: '#000000', label: 'Black' },
      { color: '#3d405b', label: 'Charcoal' },
      { color: '#4a3728', label: 'Brown' },
      { color: '#5e60ce', label: 'Blue' },
      { color: '#7b2d8e', label: 'Purple' },
      { color: '#2d6a4f', label: 'Forest' },
    ],
    lashes: [
      { color: '#1a1a2e', label: 'Natural' },
      { color: '#000000', label: 'Bold Black' },
      { color: '#4a3728', label: 'Brown' },
      { color: '#7b2d8e', label: 'Purple Drama' },
      { color: '#0077b6', label: 'Blue Pop' },
    ],
    sparkle: [
      { color: '#ffd700', label: 'Gold Glitter' },
      { color: '#c0c0c0', label: 'Silver' },
      { color: '#ff69b4', label: 'Pink Glitter' },
      { color: '#e0aaff', label: 'Fairy Dust' },
      { color: '#00f5d4', label: 'Mermaid' },
      { color: '#f72585', label: 'Glam' },
    ],
  };

  let currentMuCat = 'blush';

  const btnMakeup = $('#btn-makeup');
  btnMakeup.addEventListener('click', openMakeup);

  function openMakeup() {
    if (actionLocked) return;
    actionLocked = true;
    sfxClick();
    showScreen(makeupScene);
    drawPetInto(mvPetPreview, 'mv-chibi-pet');
    renderMakeupPreview();
    mvSpeechText.textContent = pick(['Glam time! 💄', 'Let\'s get gorgeous!', 'Beauty queen! 👑', 'Sparkle mode! ✨', 'Ooh fancy! 💋']);
    currentMuCat = 'blush';
    renderMuPalette('blush');
    updateMuCurrentLabel();
    $$('.mv-cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === 'blush'));
  }

  $$('.mv-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sfxClick();
      currentMuCat = btn.dataset.cat;
      $$('.mv-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMuPalette(btn.dataset.cat);
    });
  });

  function renderMuPalette(cat) {
    const palette = $('#mv-palette');
    palette.innerHTML = '';
    const colors = MAKEUP_PALETTES[cat] || [];
    // "Remove" option for this category
    const removeBtn = document.createElement('button');
    removeBtn.className = 'mv-swatch mv-swatch-remove' + (!state.makeup[cat] ? ' active' : '');
    removeBtn.innerHTML = '✕';
    removeBtn.title = 'Remove ' + cat;
    removeBtn.addEventListener('click', () => {
      state.makeup[cat] = null;
      sfxClick();
      renderMuPalette(cat);
      renderMakeupPreview();
      updateMuCurrentLabel();
      updateAccessory();
      saveGame();
    });
    palette.appendChild(removeBtn);

    colors.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'mv-swatch' + (state.makeup[cat] === c.color ? ' active' : '');
      btn.style.background = c.color;
      btn.title = c.label;
      btn.addEventListener('click', () => {
        state.makeup[cat] = c.color;
        sfxPop();
        renderMuPalette(cat);
        renderMakeupPreview();
        updateMuCurrentLabel();
        updateAccessory();
        saveGame();
        mvSpeechText.textContent = pick(['Ooh pretty!', 'Love it! 💕', 'Stunning!', 'Gorgeous! ✨', 'Yes queen! 👑', 'Slay! 💅']);
      });
      palette.appendChild(btn);
    });
  }

  function renderMakeupPreview() {
    mvMakeupOverlay.innerHTML = '';
    renderMakeupOnto(mvMakeupOverlay, state.makeup);
  }

  function updateMuCurrentLabel() {
    const active = Object.entries(state.makeup).filter(([, v]) => v);
    if (active.length === 0) {
      $('#mv-current').textContent = 'No makeup yet — tap a color!';
    } else {
      const labels = { blush: '🩷 Blush', lipstick: '💋 Lips', eyeshadow: '👁️ Shadow', eyeliner: '✏️ Liner', lashes: '🦋 Lashes', sparkle: '✨ Glitter' };
      $('#mv-current').textContent = 'Wearing: ' + active.map(([k]) => labels[k]).join(', ');
    }
  }

  $('#mv-clear').addEventListener('click', () => {
    state.makeup = { blush: null, lipstick: null, eyeshadow: null, eyeliner: null, lashes: null, sparkle: null };
    sfxClick();
    renderMuPalette(currentMuCat);
    renderMakeupPreview();
    updateMuCurrentLabel();
    updateAccessory();
    saveGame();
    mvSpeechText.textContent = pick(['Fresh face!', 'All clean! 🧽', 'Natural beauty!']);
  });

  $('#makeup-back').addEventListener('click', () => {
    actionLocked = false;
    showScreen(gameScreen);
    drawPet();
    updateAccessory();
    showSpeech(pick(['Looking fab! 💄', 'So pretty! ✨', 'Gorgeous! 💕']), 2500);
  });

  // ──────────── DRESS UP / WARDROBE ────────────
  function openDressUp() {
    if (actionLocked) return;
    actionLocked = true;
    sfxClick();

    drawPetInto(dressPetContainer, 'dress-chibi-pet');
    drawPetInto(dressMirrorPet, 'dress-mirror-chibi');

    wrSpeechText.textContent = pick(['Dress me up!', 'What should I wear?', 'Fashion time! 👗', 'Ooh, outfits!']);
    updateDressPreview();

    // Build the items grid
    const grid = $('#wr-items-grid');
    grid.innerHTML = '';

    // "None" option
    const noneBtn = document.createElement('button');
    noneBtn.className = 'wr-item-btn' + (!state.equippedOutfit ? ' equipped' : '');
    noneBtn.innerHTML = '<span class="wr-item-icon">❌</span><span>None</span>';
    noneBtn.addEventListener('click', () => {
      state.equippedOutfit = null;
      sfxClick();
      updateDressPreview();
      updateAccessory();
      saveGame();
      openDressUp();
    });
    grid.appendChild(noneBtn);

    OUTFITS.forEach(outfit => {
      const owned = state.ownedOutfits.includes(outfit.id);
      const equipped = state.equippedOutfit === outfit.id;
      const btn = document.createElement('button');
      btn.className = 'wr-item-btn' + (owned ? ' owned' : '') + (equipped ? ' equipped' : '');
      btn.innerHTML = `<span class="wr-item-icon">${outfit.icon}</span><span>${outfit.label}</span>` +
        (owned ? '<span class="wr-item-cost">Owned ✓</span>' : `<span class="wr-item-cost">❤️ ${outfit.cost}</span>`);

      btn.addEventListener('click', () => {
        if (!owned) {
          // Buy it
          if (state.hearts >= outfit.cost) {
            state.hearts -= outfit.cost;
            state.ownedOutfits.push(outfit.id);
            sfxSticker();
            wrSpeechText.textContent = pick(['New outfit! 🎉', 'Yay! Shopping!', 'Love it!']);
            spawnWardrobeSparkles(4);
          } else {
            wrSpeechText.textContent = pick(['Need more hearts! 💔', 'Too expensive...', 'Keep earning hearts!']);
            sfxClick();
            return;
          }
        }
        // Equip/toggle
        if (state.equippedOutfit === outfit.id) {
          state.equippedOutfit = null;
        } else {
          state.equippedOutfit = outfit.id;
        }
        sfxPop();
        updateDressPreview();
        updateAccessory();
        saveGame();
        openDressUp(); // refresh grid
      });
      grid.appendChild(btn);
    });

    $('#wr-hearts').textContent = state.hearts;
    showScreen(dressScene);
  }

  function updateDressPreview() {
    // Update the preview accessory on the dress-up pet
    dressAccOvl.innerHTML = '';
    if (state.equippedOutfit) {
      const outfit = OUTFITS.find(o => o.id === state.equippedOutfit);
      if (outfit) {
        const el = document.createElement('div');
        el.className = outfit.cssClass;
        dressAccOvl.appendChild(el);
      }
    }
  }

  function spawnWardrobeSparkles(count) {
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle-particle';
      s.textContent = pick(['✨', '👗', '💫', '🌟', '👑']);
      s.style.left = rand(20, 80) + '%';
      s.style.top = rand(10, 50) + '%';
      s.style.animationDelay = (i * 0.1) + 's';
      wrParticles.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }
  }

  function leaveDressUp() {
    actionLocked = false;
    showScreen(gameScreen);
    drawPet(); // redraw with outfit
  }

  // ──────────── COOKING MINI-GAME ────────────
  const RECIPES = [
    { name: 'Cookie',    emoji: '🍪', needs: ['flour', 'egg', 'sugar'],            hunger: 20, fun: 10 },
    { name: 'Cake',      emoji: '🎂', needs: ['flour', 'egg', 'sugar', 'butter'],  hunger: 30, fun: 15 },
    { name: 'Brownie',   emoji: '🍫', needs: ['flour', 'egg', 'chocolate'],         hunger: 25, fun: 12 },
    { name: 'Fruit Tart', emoji: '🥧', needs: ['flour', 'butter', 'fruit'],         hunger: 22, fun: 10 },
    { name: 'Muffin',    emoji: '🧁', needs: ['flour', 'egg', 'fruit'],             hunger: 18, fun: 8 },
    { name: 'Fudge',     emoji: '🍬', needs: ['sugar', 'butter', 'chocolate'],      hunger: 15, fun: 12 },
  ];

  let cookActive = false;
  let addedIngredients = [];
  let cookPhase = 'pick'; // 'pick' | 'mix' | 'bake' | 'done'

  function openCook() {
    if (actionLocked) return;
    actionLocked = true;
    sfxClick();
    cookActive = true;
    cookPhase = 'pick';
    addedIngredients = [];

    drawPetInto(cookPetContainer, 'cook-chibi-pet');
    ktSpeechText.textContent = pick(['Let\'s bake!', 'Chef mode! 👨‍🍳', 'Yummy time!', 'I wanna cook!']);

    // Reset UI
    $('#kt-title').textContent = '🧁 Let\'s Cook!';
    $('#kt-hint').textContent = 'Tap ingredients to add them to the bowl!';
    $('#kt-status').textContent = '';
    $('#kt-bowl-mix').style.height = '0';
    $('#kt-bowl-mix').style.background = '#f5deb3';
    $('#kt-bowl').classList.remove('mixing');
    $('#kt-oven').classList.remove('baking');
    $('#kt-result-plate').classList.remove('show');
    $('#kt-result-food').textContent = '';
    $('#cook-back').style.display = 'none';
    $('#kt-actions').style.display = 'none';
    $('#btn-bake').style.display = 'none';

    $$('.kt-ingr').forEach(b => {
      b.classList.remove('added');
      b.disabled = false;
    });

    showScreen(cookScene);
  }

  function addIngredient(ingr, btn) {
    if (cookPhase !== 'pick' || !cookActive) return;
    if (addedIngredients.includes(ingr)) return;

    sfxPop();
    addedIngredients.push(ingr);
    btn.classList.add('added');

    // Fill the bowl
    const fill = Math.min(addedIngredients.length * 7, 28);
    $('#kt-bowl-mix').style.height = fill + 'px';

    // Color the mix based on ingredients
    const colors = { flour: '#f5deb3', egg: '#ffe4a0', sugar: '#fff8e0', butter: '#ffd700', chocolate: '#8b4513', fruit: '#ff6b8a' };
    const last = colors[ingr] || '#f5deb3';
    $('#kt-bowl-mix').style.background = last;

    ktSpeechText.textContent = pick(['Ooh, ' + ingr + '!', 'Good choice!', 'Yum yum!', 'More more!']);

    // Show pet reaction
    const pPet = $('#cook-chibi-pet');
    if (pPet) { pPet.classList.remove('pet-happy'); void pPet.offsetWidth; pPet.classList.add('pet-happy'); }

    // Spawn a floating ingredient emoji
    const emojiMap = { flour: '🌾', egg: '🥚', sugar: '🍬', butter: '🧈', chocolate: '🍫', fruit: '🍓' };
    const em = document.createElement('span');
    em.className = 'sparkle-particle';
    em.textContent = emojiMap[ingr] || '✨';
    em.style.left = '50%'; em.style.top = '30%';
    ktParticles.appendChild(em);
    setTimeout(() => em.remove(), 1000);

    // Show mix button after 2+ ingredients
    if (addedIngredients.length >= 2) {
      $('#kt-actions').style.display = 'flex';
    }

    $('#kt-status').textContent = addedIngredients.length + ' ingredient' + (addedIngredients.length > 1 ? 's' : '') + ' added';
  }

  function mixBowl() {
    if (cookPhase !== 'pick' || addedIngredients.length < 2) return;
    cookPhase = 'mix';
    sfxClick();

    // Disable ingredients
    $$('.kt-ingr').forEach(b => b.disabled = true);

    // Mixing animation
    $('#kt-bowl').classList.add('mixing');
    $('#kt-hint').textContent = 'Mixing...';
    ktSpeechText.textContent = pick(['Stir stir!', 'Mix it up! 🥄', 'Round and round!']);

    setTimeout(() => {
      $('#kt-bowl').classList.remove('mixing');
      cookPhase = 'bake';
      $('#kt-hint').textContent = 'Ready to bake!';
      $('#btn-bake').style.display = 'inline-block';
      document.querySelector('.btn-mix').style.display = 'none';
      ktSpeechText.textContent = pick(['Into the oven!', 'Bake it! 🔥', 'Smells good already!']);
    }, 1500);
  }

  function bakeTreat() {
    if (cookPhase !== 'bake') return;
    cookPhase = 'baking';
    sfxClick();

    $('#kt-oven').classList.add('baking');
    $('#btn-bake').style.display = 'none';
    $('#kt-hint').textContent = 'Baking... 🔥';
    ktSpeechText.textContent = pick(['I can smell it!', 'Almost done!', 'Yummy yummy!']);

    setTimeout(() => {
      $('#kt-oven').classList.remove('baking');
      cookPhase = 'done';

      // Find the best matching recipe
      const result = findRecipe(addedIngredients);

      // Show result
      $('#kt-result-plate').classList.add('show');
      $('#kt-result-food').textContent = result.emoji;
      $('#kt-hint').textContent = 'You made: ' + result.name + '!';
      $('#kt-status').textContent = '⭐ ' + result.name + ' for ' + state.petName + '!';
      ktSpeechText.textContent = pick(['YUM! ' + result.emoji, 'Delicious!', 'Best chef ever! 👨‍🍳', 'I love it!']);

      // Apply stats
      state.hunger = clamp(state.hunger + result.hunger);
      state.fun    = clamp(state.fun + result.fun);
      state.hearts += 1;

      sfxHappy();
      spawnConfetti(15);

      // Sparkles
      for (let i = 0; i < 5; i++) {
        const s = document.createElement('span');
        s.className = 'sparkle-particle';
        s.textContent = pick(['✨', result.emoji, '🌟', '💫']);
        s.style.left = rand(20, 80) + '%'; s.style.top = rand(10, 50) + '%';
        s.style.animationDelay = (i * 0.1) + 's';
        ktParticles.appendChild(s);
        setTimeout(() => s.remove(), 1200);
      }

      // Pet happy
      const pPet = $('#cook-chibi-pet');
      if (pPet) { pPet.classList.remove('pet-happy'); void pPet.offsetWidth; pPet.classList.add('pet-happy'); }

      $('#cook-back').style.display = 'inline-block';
      updateUI();
      saveGame();

      // Auto-return
      setTimeout(() => {
        if (cookPhase === 'done') leaveKitchen();
      }, 3500);
    }, 2500);
  }

  function findRecipe(ingredients) {
    // Check which recipe matches best
    let bestMatch = null;
    let bestScore = 0;
    RECIPES.forEach(recipe => {
      const matched = recipe.needs.filter(n => ingredients.includes(n)).length;
      const score = matched / recipe.needs.length;
      if (score > bestScore || (score === bestScore && matched > (bestMatch ? bestMatch.needs.length : 0))) {
        bestScore = score;
        bestMatch = recipe;
      }
    });
    if (bestMatch && bestScore >= 0.5) return bestMatch;
    // Fallback: mystery treat
    return { name: 'Mystery Treat', emoji: '🍬', needs: [], hunger: 12, fun: 6 };
  }

  function leaveKitchen() {
    cookActive = false;
    cookPhase = 'pick';
    actionLocked = false;
    showScreen(gameScreen);
    spawnSparkles(4);
    petBounce();
    showSpeech(pick(['That was yummy!', 'Best chef! 👨‍🍳', 'Cook again soon!']), 2500);
  }

  // Ingredient click handlers
  $$('.kt-ingr').forEach(btn => {
    btn.addEventListener('click', () => addIngredient(btn.dataset.ingr, btn));
  });

  // ──────────── GARDEN ────────────
  const SEEDS = [
    { name: 'Carrot',     emoji: '🥕', stages: ['🌱', '🌿', '🥕'], harvestHunger: 15, harvestFun: 5 },
    { name: 'Strawberry', emoji: '🍓', stages: ['🌱', '🌿', '🍓'], harvestHunger: 12, harvestFun: 8 },
    { name: 'Sunflower',  emoji: '🌻', stages: ['🌱', '🌿', '🌻'], harvestHunger: 5,  harvestFun: 15 },
    { name: 'Tomato',     emoji: '🍅', stages: ['🌱', '🌿', '🍅'], harvestHunger: 14, harvestFun: 6 },
  ];
  let gardenAction = 'plant'; // 'plant' | 'water' | 'harvest'

  function openGarden() {
    if (actionLocked) return;
    actionLocked = true;
    sfxClick();
    drawPetInto(gardenPetContainer, 'garden-chibi-pet');
    gdSpeechText.textContent = pick(['Garden time! 🌱', 'Let\'s grow stuff!', 'I love the garden!']);
    gardenAction = 'plant';
    $$('.gd-act-btn').forEach(b => b.classList.remove('active'));
    $('#gd-btn-plant').classList.add('active');
    renderGardenPlots();
    showScreen(gardenScene);
  }

  function renderGardenPlots() {
    for (let i = 0; i < 4; i++) {
      const plot = $(`#gd-plot-${i}`);
      const plantEl = $(`#gd-plant-${i}`);
      const data = state.gardenPlots[i];
      plot.classList.remove('planted', 'watered');
      if (!data) {
        plantEl.textContent = '';
      } else {
        plot.classList.add('planted');
        if (data.watered) plot.classList.add('watered');
        const seed = SEEDS.find(s => s.name === data.seed);
        plantEl.textContent = seed ? seed.stages[Math.min(data.stage, 2)] : '🌱';
      }
    }
  }

  function gardenPlotClick(idx) {
    const data = state.gardenPlots[idx];
    if (gardenAction === 'plant') {
      if (data) { gdSpeechText.textContent = 'Already planted!'; return; }
      const seed = pick(SEEDS);
      state.gardenPlots[idx] = { seed: seed.name, stage: 0, watered: false };
      sfxPop();
      gdSpeechText.textContent = pick(['Planted ' + seed.emoji + '!', 'Grow grow!', 'Seed in the ground!']);
    } else if (gardenAction === 'water') {
      if (!data) { gdSpeechText.textContent = 'Plant something first!'; return; }
      if (data.stage >= 2) { gdSpeechText.textContent = 'Ready to harvest!'; return; }
      data.watered = true;
      data.stage = Math.min(data.stage + 1, 2);
      sfxSplash();
      gdSpeechText.textContent = pick(['Splash! 💧', 'Growing nicely!', 'Water water!']);
      // Spawn water drops
      const em = document.createElement('span'); em.className = 'sparkle-particle'; em.textContent = '💧';
      em.style.left = (25 + idx * 18) + '%'; em.style.top = '40%';
      gdParticles.appendChild(em); setTimeout(() => em.remove(), 1000);
    } else if (gardenAction === 'harvest') {
      if (!data || data.stage < 2) { gdSpeechText.textContent = data ? 'Not ready yet!' : 'Nothing here!'; return; }
      const seed = SEEDS.find(s => s.name === data.seed);
      state.gardenPlots[idx] = null;
      state.hunger = clamp(state.hunger + (seed ? seed.harvestHunger : 10));
      state.fun = clamp(state.fun + (seed ? seed.harvestFun : 5));
      state.hearts += 1;
      sfxHappy();
      gdSpeechText.textContent = pick(['Harvested ' + (seed ? seed.emoji : '🌱') + '!', 'Yummy! Fresh food!', 'From garden to plate!']);
      spawnConfetti(10);
    }
    renderGardenPlots();
    updateUI();
    saveGame();
  }

  $$('.gd-act-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      gardenAction = btn.dataset.act;
      $$('.gd-act-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sfxClick();
    });
  });
  $$('.gd-plot').forEach(plot => {
    plot.addEventListener('click', () => gardenPlotClick(parseInt(plot.dataset.plot)));
  });

  function leaveGarden() { actionLocked = false; showScreen(gameScreen); }

  // ──────────── PHOTO BOOTH ────────────
  let pbBg = 'stars';
  let pbProp = 'crown';

  function openPhotoBooth() {
    if (actionLocked) return;
    actionLocked = true;
    sfxClick();
    drawPetInto(photoPetContainer, 'photo-chibi-pet');
    // Show outfit on photo pet
    photoAccOvl.innerHTML = '';
    if (state.equippedOutfit) {
      const outfit = OUTFITS.find(o => o.id === state.equippedOutfit);
      if (outfit) { const el = document.createElement('div'); el.className = outfit.cssClass; photoAccOvl.appendChild(el); }
    }
    setPbBackdrop(pbBg);
    setPbProp(pbProp);
    renderPhotoGallery();
    showScreen(photoScene);
  }

  function setPbBackdrop(bg) {
    pbBg = bg;
    const bd = $('#pb-backdrop');
    bd.className = 'pb-backdrop bg-' + bg;
    $$('.pb-bg-btn').forEach(b => b.classList.toggle('pb-bg-active', b.dataset.bg === bg));
  }
  function setPbProp(prop) {
    pbProp = prop;
    const propEl = $('#pb-prop');
    const propMap = { none: '', crown: '👑', star: '⭐', flower: '🌸', heart: '💖', sparkle: '✨' };
    propEl.textContent = propMap[prop] || '';
    $$('.pb-prop-btn').forEach(b => b.classList.toggle('pb-prop-active', b.dataset.prop === prop));
  }

  function snapPhoto() {
    sfxSticker();
    // Flash
    const flash = $('#pb-flash');
    flash.classList.add('active');
    setTimeout(() => flash.classList.remove('active'), 200);
    // Save to gallery
    const photo = { bg: pbBg, prop: pbProp, pet: state.petType, name: state.petName };
    state.photoGallery.unshift(photo);
    if (state.photoGallery.length > 8) state.photoGallery.pop();
    state.fun = clamp(state.fun + 8);
    state.hearts += 1;
    renderPhotoGallery();
    updateUI();
    saveGame();
    // Sparkles
    for (let i = 0; i < 4; i++) {
      const s = document.createElement('span'); s.className = 'sparkle-particle';
      s.textContent = pick(['📸', '✨', '💫', '🌟']); s.style.left = rand(20, 80) + '%'; s.style.top = rand(10, 50) + '%';
      $('#pb-particles').appendChild(s); setTimeout(() => s.remove(), 1200);
    }
  }

  function renderPhotoGallery() {
    const gal = $('#pb-gallery');
    gal.innerHTML = '';
    state.photoGallery.forEach(p => {
      const div = document.createElement('div');
      div.className = 'pb-gallery-item';
      const propMap = { none: '', crown: '👑', star: '⭐', flower: '🌸', heart: '💖', sparkle: '✨' };
      const bgMap = { stars: '⭐', hearts: '💕', rainbow: '🌈', beach: '🏖️', space: '🚀' };
      div.innerHTML = `${bgMap[p.bg] || ''}${propMap[p.prop] || ''}<br>${p.pet === 'dog' ? '🐕' : p.pet === 'cat' ? '🐱' : '🐦'}`;
      gal.appendChild(div);
    });
  }

  $$('.pb-bg-btn').forEach(b => b.addEventListener('click', () => { sfxClick(); setPbBackdrop(b.dataset.bg); }));
  $$('.pb-prop-btn').forEach(b => b.addEventListener('click', () => { sfxClick(); setPbProp(b.dataset.prop); }));
  $('#btn-snap').addEventListener('click', snapPhoto);

  function leavePhotoBooth() { actionLocked = false; showScreen(gameScreen); }

  // ──────────── VISITING FRIENDS ────────────
  let visitorActive = false;
  let visitorTimer = null;

  let visitorFirstTime = true;

  function startVisitorSystem() {
    visitorFirstTime = true;
    scheduleVisitor();
  }

  function scheduleVisitor() {
    clearTimeout(visitorTimer);
    // First visitor comes quickly (3-6s), then every 20-40s
    const delay = visitorFirstTime ? rand(3000, 6000) : rand(20000, 40000);
    visitorTimer = setTimeout(() => {
      // Only need game screen active and no visitor currently present
      if (gameScreen.classList.contains('active') && !visitorActive) {
        visitorFirstTime = false;
        showDoorbell();
      }
      scheduleVisitor();
    }, delay);
  }

  function showDoorbell() {
    const bell = $('#lr-doorbell');
    bell.style.display = 'block';
    sfxEvent();
    if (!actionLocked) {
      showSpeech(pick(['Someone\'s at the door! 🔔', 'Ding dong!', 'A visitor!']), 2500);
    }
    // Auto-hide after 12s if not clicked
    setTimeout(() => { if (bell.style.display === 'block' && !visitorActive) bell.style.display = 'none'; }, 12000);
  }

  function answerDoor() {
    const bell = $('#lr-doorbell');
    bell.style.display = 'none';
    visitorActive = true;
    sfxHappy();

    const spot = $('#lr-visitor-spot');
    spot.innerHTML = '';

    // Create visitor pet
    const wrap = document.createElement('div');
    wrap.className = 'visitor-pet';

    const speech = document.createElement('div');
    speech.className = 'visitor-speech';
    const names = state.petType === 'dog' ? ['Biscuit', 'Mochi', 'Waffles'] : state.petType === 'cat' ? ['Mittens', 'Pudding', 'Noodle'] : state.petType === 'hamster' ? ['Cheeks', 'Nibbles', 'Boba'] : ['Kiwi', 'Pip', 'Mango'];
    const name = pick(names);
    speech.textContent = name + ': ' + pick(['Hi! 👋', 'Let\'s hang out!', 'Nice place!', 'Hey friend!']);
    wrap.appendChild(speech);

    const cont = document.createElement('div');
    cont.className = 'pet-container';
    const pet = document.createElement('div');
    pet.className = `chibi-pet ${state.petType}`;
    pet.innerHTML = getPetHTML();
    pet.style.filter = 'hue-rotate(' + rand(20, 60) + 'deg)';
    cont.appendChild(pet);
    wrap.appendChild(cont);
    spot.appendChild(wrap);

    showSpeech(pick(['A friend is visiting! 💕', name + ' came to play!', 'Yay, a visitor!']), 3000);
    state.fun = clamp(state.fun + 10);
    state.hearts += 1;
    updateUI();
    saveGame();

    // Visitor leaves after 15s
    setTimeout(() => {
      spot.innerHTML = '';
      visitorActive = false;
      showSpeech(pick(['Bye bye, ' + name + '! 👋', 'Come back soon!', 'That was fun!']), 2000);
    }, 15000);
  }

  $('#lr-doorbell').addEventListener('click', answerDoor);

  // ──────────── PARTY SYSTEM ────────────
  let partyActive = false;
  let partyMusicTimer = null;
  let partyGuestCount = 0;
  let partyVibe = 0;
  let partyTheme = '';
  let partyGiftsLeft = 0;

  const PARTY_NAMES = {
    dog: ['Biscuit', 'Mochi', 'Waffles', 'Nugget', 'Coco', 'Toffee'],
    cat: ['Mittens', 'Pudding', 'Noodle', 'Luna', 'Muffin', 'Whiskers'],
    bird: ['Kiwi', 'Pip', 'Mango', 'Sunny', 'Chirp', 'Feathers'],
    hamster: ['Cheeks', 'Nibbles', 'Boba', 'Squeaky', 'Hazel', 'Acorn'],
  };

  const PARTY_DECO = {
    birthday: ['🎈', '🎁', '🎂', '🎀', '🎊', '⭐', '🎉', '✨'],
    dance:    ['🪩', '💜', '✨', '🎶', '💫', '🌟', '🔮', '💎'],
    tea:      ['🌸', '🫖', '☕', '🧁', '🍰', '🌺', '🎀', '🦋'],
    pool:     ['🏖️', '🐚', '🌊', '🍉', '🌴', '☀️', '🐠', '🦀'],
  };

  const PARTY_GIFTS = [
    { emoji: '🧸', label: 'Teddy Bear', hearts: 3 },
    { emoji: '🎨', label: 'Art Set', hearts: 2 },
    { emoji: '📚', label: 'Story Book', hearts: 2 },
    { emoji: '🧩', label: 'Puzzle', hearts: 2 },
    { emoji: '🪀', label: 'Yoyo', hearts: 1 },
    { emoji: '🎸', label: 'Tiny Guitar', hearts: 3 },
    { emoji: '🏀', label: 'Mini Ball', hearts: 2 },
    { emoji: '👑', label: 'Party Crown', hearts: 4 },
    { emoji: '🌈', label: 'Rainbow Toy', hearts: 3 },
    { emoji: '🎪', label: 'Circus Ticket', hearts: 2 },
  ];

  const VIBE_LEVELS = [
    { min: 0,  label: 'Warming up...', emoji: '😊' },
    { min: 20, label: 'Getting fun!', emoji: '😄' },
    { min: 40, label: 'Party mode!', emoji: '🥳' },
    { min: 60, label: 'ON FIRE!', emoji: '🔥' },
    { min: 80, label: 'LEGENDARY!!', emoji: '🤩' },
  ];

  // Open party planner
  $('#lr-invite-btn').addEventListener('click', () => {
    if (actionLocked) return;
    actionLocked = true;
    sfxClick();
    partyPicker.style.display = '';
    $('#party-outfit-picker').style.display = 'none';
    partyStatus.style.display = 'none';
    $('#party-vibe').style.display = 'none';
    $('#party-actions').style.display = 'none';
    $('#party-gift-popup').style.display = 'none';
    partyGuests.innerHTML = '';
    partyHost.innerHTML = '';
    partyDecos.innerHTML = '';
    partyMusic.innerHTML = '';
    $('#party-reactions').innerHTML = '';
    $('#party-gifts').innerHTML = '';
    $('#party-disco-lights').innerHTML = '';
    partyRoom.className = 'party-room';
    partyGuestCount = 0;
    partyVibe = 0;
    partyGiftsLeft = 0;
    showScreen(partyScene);
  });

  // Theme selection → show outfit picker
  let pendingPartyTheme = '';
  let partyOutfitChoice = null;

  $$('.btn-party-theme').forEach(btn => {
    btn.addEventListener('click', () => {
      sfxClick();
      pendingPartyTheme = btn.dataset.theme;
      showPartyOutfitPicker();
    });
  });

  function showPartyOutfitPicker() {
    partyPicker.style.display = 'none';
    $('#party-outfit-picker').style.display = '';
    partyOutfitChoice = state.equippedOutfit;

    const grid = $('#party-outfit-grid');
    grid.innerHTML = '';

    // "Current" option (whatever you have on or none)
    const noneBtn = document.createElement('button');
    noneBtn.className = 'party-outfit-opt' + (!partyOutfitChoice ? ' selected' : '');
    noneBtn.innerHTML = '<span class="po-icon">🐾</span><span class="po-label">None</span>';
    noneBtn.addEventListener('click', () => {
      partyOutfitChoice = null;
      grid.querySelectorAll('.party-outfit-opt').forEach(b => b.classList.remove('selected'));
      noneBtn.classList.add('selected');
      sfxClick();
    });
    grid.appendChild(noneBtn);

    OUTFITS.forEach(outfit => {
      const btn = document.createElement('button');
      btn.className = 'party-outfit-opt' + (partyOutfitChoice === outfit.id ? ' selected' : '');
      btn.innerHTML = '<span class="po-icon">' + outfit.icon + '</span><span class="po-label">' + outfit.label + '</span>';
      btn.addEventListener('click', () => {
        partyOutfitChoice = outfit.id;
        grid.querySelectorAll('.party-outfit-opt').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        sfxPop();
      });
      grid.appendChild(btn);
    });
  }

  $('#party-go-btn').addEventListener('click', () => {
    sfxHappy();
    // Equip chosen outfit
    state.equippedOutfit = partyOutfitChoice;
    if (partyOutfitChoice && !state.ownedOutfits.includes(partyOutfitChoice)) {
      state.ownedOutfits.push(partyOutfitChoice);
    }
    updateAccessory();
    saveGame();
    $('#party-outfit-picker').style.display = 'none';
    startParty(pendingPartyTheme);
  });

  function startParty(theme) {
    partyActive = true;
    partyTheme = theme;
    partyVibe = 0;
    partyPicker.style.display = 'none';
    $('#party-outfit-picker').style.display = 'none';
    partyStatus.style.display = '';
    $('#party-vibe').style.display = '';
    $('#party-actions').style.display = '';

    partyRoom.className = 'party-room theme-' + theme;

    const themeLabels = { birthday: '🎂 Birthday', dance: '💃 Dance', tea: '🫖 Tea', pool: '🏖️ Pool' };
    $('#party-status-theme').textContent = themeLabels[theme] || theme;

    // Host pet with outfit and makeup
    drawPetInto(partyHost, 'party-host-pet');
    addOutfitToPetEl(partyHost, state.equippedOutfit);
    addMakeupToPetEl(partyHost, state.makeup);

    // Disco lights for dance theme
    if (theme === 'dance') {
      const lights = $('#party-disco-lights');
      lights.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const l = document.createElement('div');
        l.className = 'disco-light';
        lights.appendChild(l);
      }
    }

    // Scatter decorations
    const decos = PARTY_DECO[theme] || PARTY_DECO.birthday;
    partyDecos.innerHTML = '';
    for (let i = 0; i < 12; i++) {
      const d = document.createElement('div');
      d.className = 'party-deco-item';
      d.textContent = pick(decos);
      d.style.left = rand(5, 90) + '%';
      d.style.top = rand(3, 50) + '%';
      d.style.animationDelay = (rand(0, 20) / 10) + 's';
      d.style.fontSize = (rand(10, 20) / 10) + 'rem';
      partyDecos.appendChild(d);
    }

    // Set up gift pile
    partyGiftsLeft = rand(2, 4);
    const giftsEl = $('#party-gifts');
    giftsEl.innerHTML = '';
    for (let i = 0; i < partyGiftsLeft; i++) {
      const g = document.createElement('div');
      g.className = 'party-gift-item';
      g.textContent = '🎁';
      g.addEventListener('click', () => openGift(g));
      giftsEl.appendChild(g);
    }

    // Set theme-specific snacks on the table
    const snackSets = {
      birthday: ['🎂', '🍕', '🧁', '🍩', '🍪', '🥤', '🍬'],
      dance:    ['🍕', '🌭', '🥤', '🍿', '🍫', '🧃', '🍭'],
      tea:      ['🫖', '☕', '🧁', '🍰', '🍪', '🍯', '🥐'],
      pool:     ['🍉', '🍦', '🧃', '🍹', '🌽', '🍓', '🥥'],
    };
    const snacks = snackSets[theme] || snackSets.birthday;
    const snacksEl = $('#party-snacks');
    snacksEl.innerHTML = '';
    snacks.forEach((s, i) => {
      const span = document.createElement('span');
      span.className = 'party-snack';
      span.textContent = s;
      span.style.animationDelay = (i * 0.2) + 's';
      snacksEl.appendChild(span);
    });

    // Guests arrive one by one
    partyGuestCount = 0;
    const guestNames = [...(PARTY_NAMES[state.petType] || PARTY_NAMES.dog)];
    const numGuests = rand(3, 5);

    for (let i = 0; i < numGuests && i < guestNames.length; i++) {
      setTimeout(() => {
        if (!partyActive) return;
        addPartyGuest(guestNames[i]);
        partyGuestCount++;
        $('#party-status-guests').textContent = partyGuestCount + ' friends';
        sfxEvent();
        addPartyVibe(5);
      }, 1000 * (i + 1));
    }

    startPartyMusic();
    updateVibeBar();
  }

  // Outfit choices guests can wear to parties
  const GUEST_OUTFIT_IDS = OUTFITS.map(o => o.id);

  function addOutfitToPetEl(parentEl, outfitId) {
    const old = parentEl.querySelector('.party-pet-outfit');
    if (old) old.remove();
    if (!outfitId) return;
    const outfit = OUTFITS.find(o => o.id === outfitId);
    if (!outfit) return;
    const ovl = document.createElement('div');
    ovl.className = 'party-pet-outfit';
    const el = document.createElement('div');
    el.className = outfit.cssClass;
    ovl.appendChild(el);
    const cont = parentEl.querySelector('.pet-container');
    if (cont) cont.appendChild(ovl);
  }

  function addMakeupToPetEl(parentEl, makeup) {
    const cont = parentEl.querySelector('.pet-container');
    if (!cont) return;
    const ovl = document.createElement('div');
    ovl.className = 'party-pet-outfit';
    renderMakeupOnto(ovl, makeup);
    cont.appendChild(ovl);
  }

  function randomGuestMakeup() {
    const mu = { blush: null, lipstick: null, eyeshadow: null, eyeliner: null, lashes: null, sparkle: null };
    const cats = Object.keys(MAKEUP_PALETTES);
    const numItems = rand(1, 3);
    const chosen = [];
    while (chosen.length < numItems) {
      const c = pick(cats);
      if (!chosen.includes(c)) chosen.push(c);
    }
    chosen.forEach(cat => {
      mu[cat] = pick(MAKEUP_PALETTES[cat]).color;
    });
    return mu;
  }

  function addPartyGuest(name) {
    const guest = document.createElement('div');
    guest.className = 'party-guest idle';
    guest.dataset.name = name;

    const cont = document.createElement('div');
    cont.className = 'pet-container';
    const pet = document.createElement('div');
    pet.className = 'chibi-pet ' + state.petType;
    pet.innerHTML = getPetHTML();
    pet.style.filter = 'hue-rotate(' + rand(15, 80) + 'deg) saturate(' + (rand(80, 130) / 100) + ')';
    cont.appendChild(pet);
    guest.appendChild(cont);

    // Give guest a random outfit and makeup
    const guestOutfit = pick(GUEST_OUTFIT_IDS);
    addOutfitToPetEl(guest, guestOutfit);
    addMakeupToPetEl(guest, randomGuestMakeup());

    const tag = document.createElement('div');
    tag.className = 'party-guest-name';
    tag.textContent = name;
    guest.appendChild(tag);

    // Tap a guest to interact
    guest.addEventListener('click', () => tapGuest(guest));

    guest.style.opacity = '0';
    guest.style.transform = 'translateY(30px)';
    partyGuests.appendChild(guest);

    requestAnimationFrame(() => {
      guest.style.transition = 'opacity .5s, transform .5s';
      guest.style.opacity = '1';
      guest.style.transform = 'translateY(0)';
    });
  }

  function tapGuest(guest) {
    if (!partyActive) return;
    const reactions = ['❤️', '😂', '🎉', '⭐', '🥳', '💕', '😍', '🙌'];
    spawnGuestReaction(guest, pick(reactions));
    sfxClick();
    addPartyVibe(3);

    // Random guest dialogue
    const name = guest.dataset.name;
    const sayings = [
      name + ': This is awesome!',
      name + ': Best party ever!',
      name + ': Yay! 🎉',
      name + ': I love this!',
      name + ': So fun!',
      name + ': Let\'s goooo!',
    ];
    const tag = guest.querySelector('.party-guest-name');
    const original = tag.textContent;
    tag.textContent = pick(sayings);
    setTimeout(() => { tag.textContent = original; }, 2000);
  }

  function spawnGuestReaction(el, emoji) {
    const r = document.createElement('div');
    r.className = 'guest-reaction';
    r.textContent = emoji;
    el.style.position = 'relative';
    el.appendChild(r);
    setTimeout(() => r.remove(), 900);
  }

  function spawnPartyReaction(emoji, x, y) {
    const r = document.createElement('div');
    r.className = 'party-reaction';
    r.textContent = emoji;
    r.style.left = (x || rand(20, 80)) + '%';
    r.style.top = (y || rand(30, 60)) + '%';
    $('#party-reactions').appendChild(r);
    setTimeout(() => r.remove(), 1300);
  }

  // ── Action: Dance ──
  $('#btn-party-dance').addEventListener('click', () => {
    if (!partyActive) return;
    sfxHappy();
    addPartyVibe(8);

    // Host dances
    partyHost.classList.remove('dancing');
    void partyHost.offsetWidth;
    partyHost.classList.add('dancing');
    setTimeout(() => partyHost.classList.remove('dancing'), 3000);

    // All guests dance
    partyGuests.querySelectorAll('.party-guest').forEach(g => {
      g.classList.remove('idle', 'dancing');
      void g.offsetWidth;
      g.classList.add('dancing');
      spawnGuestReaction(g, pick(['💃', '🕺', '🎶', '✨']));
      setTimeout(() => { g.classList.remove('dancing'); g.classList.add('idle'); }, 2500);
    });

    // Spawn dance emojis
    for (let i = 0; i < 5; i++) {
      setTimeout(() => spawnPartyReaction(pick(['💃', '🕺', '🎶', '🪩', '✨']), rand(10, 90), rand(20, 60)), i * 200);
    }

    cooldownBtn($('#btn-party-dance'), 3000);
  });

  // ── Action: Serve Treats ──
  $('#btn-party-treat').addEventListener('click', () => {
    if (!partyActive) return;
    sfxClick();
    addPartyVibe(6);

    const treatEmojis = { birthday: '🍰', dance: '🍕', tea: '🧁', pool: '🍦' };
    const treat = treatEmojis[partyTheme] || '🍰';

    // Each guest eats
    partyGuests.querySelectorAll('.party-guest').forEach((g, i) => {
      setTimeout(() => {
        g.classList.add('eating');
        spawnGuestReaction(g, treat);
        setTimeout(() => g.classList.remove('eating'), 2000);
      }, i * 300);
    });

    for (let i = 0; i < 4; i++) {
      setTimeout(() => spawnPartyReaction(pick([treat, '😋', '🤤', '😍']), rand(15, 85), rand(25, 55)), i * 250);
    }

    cooldownBtn($('#btn-party-treat'), 4000);
  });

  // ── Action: Confetti ──
  $('#btn-party-confetti').addEventListener('click', () => {
    if (!partyActive) return;
    sfxHappy();
    addPartyVibe(7);

    const confettiEmojis = ['🎊', '🎉', '✨', '⭐', '💫', '🌟'];
    for (let i = 0; i < 12; i++) {
      setTimeout(() => spawnPartyReaction(pick(confettiEmojis), rand(5, 95), rand(10, 70)), i * 80);
    }

    partyGuests.querySelectorAll('.party-guest').forEach(g => {
      spawnGuestReaction(g, pick(['🎊', '🎉', '🥳']));
    });

    cooldownBtn($('#btn-party-confetti'), 3000);
  });

  // ── Action: Open Gift ──
  $('#btn-party-gift').addEventListener('click', () => {
    if (!partyActive) return;
    const gifts = $('#party-gifts').querySelectorAll('.party-gift-item:not(.opened)');
    if (gifts.length === 0) {
      spawnPartyReaction('📦 No gifts left!', 50, 40);
      return;
    }
    openGift(gifts[0]);
  });

  function openGift(giftEl) {
    if (!partyActive || giftEl.classList.contains('opened')) return;
    giftEl.classList.add('opened');
    sfxEvent();

    const gift = pick(PARTY_GIFTS);
    const popup = $('#party-gift-popup');
    popup.style.display = '';
    $('#gift-box-anim').textContent = '🎁';
    $('#gift-reveal').innerHTML = gift.emoji + '<br>' + gift.label + '<br><span style="color:var(--coral);font-size:.7rem;">+' + gift.hearts + ' hearts!</span>';

    state.hearts += gift.hearts;
    addPartyVibe(10);
    saveGame();
    updateUI();

    setTimeout(() => { popup.style.display = 'none'; }, 2500);

    for (let i = 0; i < 6; i++) {
      setTimeout(() => spawnPartyReaction(pick(['🎁', '✨', '⭐', gift.emoji]), rand(20, 80), rand(20, 60)), 600 + i * 150);
    }
  }

  // ── Action: Music Boost ──
  $('#btn-party-music').addEventListener('click', () => {
    if (!partyActive) return;
    sfxHappy();
    addPartyVibe(5);

    // Burst of music notes
    const notes = ['🎵', '🎶', '♪', '♫', '🎸', '🥁', '🎹', '🎺'];
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const note = document.createElement('div');
        note.className = 'music-note';
        note.textContent = pick(notes);
        note.style.left = rand(10, 90) + '%';
        note.style.bottom = rand(15, 40) + '%';
        note.style.fontSize = rand(12, 24) / 10 + 'rem';
        partyMusic.appendChild(note);
        setTimeout(() => note.remove(), 3500);
      }, i * 100);
    }

    partyGuests.querySelectorAll('.party-guest').forEach(g => {
      spawnGuestReaction(g, pick(['🎵', '🎶', '🎤']));
    });

    cooldownBtn($('#btn-party-music'), 2500);
  });

  // Tap host to make them dance
  partyHost.addEventListener('click', () => {
    if (!partyActive) return;
    sfxClick();
    addPartyVibe(4);
    partyHost.classList.remove('dancing');
    void partyHost.offsetWidth;
    partyHost.classList.add('dancing');
    spawnPartyReaction(pick(['⭐', '💃', '✨', '🌟']), 50, 35);
    setTimeout(() => partyHost.classList.remove('dancing'), 3000);
  });

  function cooldownBtn(btn, ms) {
    btn.classList.add('on-cooldown');
    setTimeout(() => btn.classList.remove('on-cooldown'), ms);
  }

  // ── Vibe meter ──
  function addPartyVibe(amount) {
    partyVibe = Math.min(100, partyVibe + amount);
    updateVibeBar();
  }

  function updateVibeBar() {
    $('#party-vibe-fill').style.width = partyVibe + '%';
    let level = VIBE_LEVELS[0];
    for (const l of VIBE_LEVELS) {
      if (partyVibe >= l.min) level = l;
    }
    $('#party-vibe-level').textContent = level.emoji + ' ' + level.label;
  }

  function startPartyMusic() {
    const notes = ['🎵', '🎶', '♪', '♫'];
    const spawn = () => {
      if (!partyActive) return;
      const note = document.createElement('div');
      note.className = 'music-note';
      note.textContent = pick(notes);
      note.style.left = rand(10, 90) + '%';
      note.style.bottom = rand(10, 30) + '%';
      note.style.animationDuration = rand(25, 40) / 10 + 's';
      partyMusic.appendChild(note);
      setTimeout(() => note.remove(), 4000);
      if (partyActive) setTimeout(spawn, rand(600, 1200));
    };
    spawn();
  }

  function endParty() {
    partyActive = false;
    clearInterval(partyMusicTimer);
    $('#party-gift-popup').style.display = 'none';

    // Rewards scale with vibe level
    const vibeBonus = Math.floor(partyVibe / 10);
    const funBonus = 20 + partyGuestCount * 5 + vibeBonus * 3;
    const heartBonus = 3 + partyGuestCount + vibeBonus;
    state.fun = clamp(state.fun + funBonus);
    state.hearts += heartBonus;
    updateUI();
    saveGame();

    actionLocked = false;
    showScreen(gameScreen);

    const vibeMsg = partyVibe >= 80 ? 'LEGENDARY party!' : partyVibe >= 60 ? 'Amazing party!' : partyVibe >= 40 ? 'Great party!' : 'Nice party!';
    showSpeech(vibeMsg + ' +' + heartBonus + ' hearts! 💕', 3500);
    spawnSparkles(10);
  }

  $('#btn-party-back').addEventListener('click', () => {
    sfxClick();
    endParty();
  });

  // ──────────── BIRTHDAY SURPRISE ────────────
  let bdayActive = false;
  let bdayTimer = null;

  const BDAY_GIFTS = [
    { emoji: '🧸', label: 'Teddy Bear', hearts: 5 },
    { emoji: '🎨', label: 'Art Set', hearts: 3 },
    { emoji: '👑', label: 'Golden Crown', hearts: 6 },
    { emoji: '🌈', label: 'Rainbow Toy', hearts: 4 },
    { emoji: '🎸', label: 'Tiny Guitar', hearts: 4 },
    { emoji: '🍰', label: 'Birthday Cake', hearts: 3 },
    { emoji: '📷', label: 'Camera', hearts: 5 },
    { emoji: '🎪', label: 'Circus Tickets', hearts: 4 },
    { emoji: '🧩', label: 'Puzzle Box', hearts: 3 },
    { emoji: '🎠', label: 'Snow Globe', hearts: 5 },
  ];

  function scheduleBdaySurprise() {
    clearTimeout(bdayTimer);
    // Check every 60-120 seconds for a surprise
    const delay = rand(60000, 120000);
    bdayTimer = setTimeout(() => {
      if (!gameScreen.classList.contains('active') || actionLocked || bdayActive || phoneOpen) {
        scheduleBdaySurprise();
        return;
      }
      // Trigger on pet's actual birthday (monthly anniversary) or random chance
      const today = new Date().toDateString();
      if (state.lastBdaySurprise === today) {
        scheduleBdaySurprise();
        return;
      }

      let shouldTrigger = false;

      // Monthly birthday: if createdAt exists, check if today's date matches creation day
      if (state.createdAt) {
        const created = new Date(state.createdAt);
        const now = new Date();
        if (now.getDate() === created.getDate()) {
          shouldTrigger = true;
        }
      }

      // Random surprise: ~15% chance each check
      if (!shouldTrigger && Math.random() < 0.15) {
        shouldTrigger = true;
      }

      if (shouldTrigger) {
        triggerBdaySurprise();
      } else {
        scheduleBdaySurprise();
      }
    }, delay);
  }

  function triggerBdaySurprise() {
    bdayActive = true;
    state.lastBdaySurprise = new Date().toDateString();
    saveGame();

    const overlay = $('#bday-overlay');
    overlay.style.display = '';

    const banner = $('#bday-banner');
    const confetti = $('#bday-confetti');
    const friends = $('#bday-friends');
    const gifts = $('#bday-gifts');
    const message = $('#bday-message');
    const thanksBtn = $('#bday-thanks');

    // Reset everything
    banner.className = 'bday-banner';
    confetti.innerHTML = '';
    friends.innerHTML = '';
    gifts.innerHTML = '';
    message.className = 'bday-message';
    message.textContent = '';
    thanksBtn.style.display = 'none';

    // Play sound
    sfxHappy();

    // Step 1: Confetti starts falling
    spawnBdayConfetti();

    // Step 2: Banner appears (0.5s)
    setTimeout(() => {
      banner.textContent = '🎂 Happy Birthday, ' + state.petName + '! 🎂';
      banner.classList.add('show');
      sfxEvent();
    }, 500);

    // Step 3: Friends walk in one by one (1.5s, 2s, 2.5s)
    const friendNames = getFriendNamesForType();
    const numFriends = 3;
    for (let i = 0; i < numFriends; i++) {
      setTimeout(() => {
        addBdayFriend(friendNames[i], i);
      }, 1500 + i * 500);
    }

    // Step 4: Friends say happy birthday (3.5s)
    setTimeout(() => {
      friends.querySelectorAll('.bday-friend-speech').forEach((s, i) => {
        setTimeout(() => s.classList.add('show'), i * 300);
      });
      sfxSticker();
    }, 3500);

    // Step 5: Gifts appear (5s)
    setTimeout(() => {
      const numGifts = 3;
      for (let i = 0; i < numGifts; i++) {
        const gift = document.createElement('div');
        gift.className = 'bday-gift-box';
        gift.textContent = pick(['🎁', '🎀', '🎊']);
        gift.dataset.idx = i;
        const giftData = BDAY_GIFTS[rand(0, BDAY_GIFTS.length - 1)];
        gift.dataset.emoji = giftData.emoji;
        gift.dataset.label = giftData.label;
        gift.dataset.hearts = giftData.hearts;
        gift.addEventListener('click', () => openBdayGift(gift));
        gifts.appendChild(gift);
        setTimeout(() => gift.classList.add('show'), i * 200);
      }
      message.textContent = 'Tap the gifts to open them! 🎁';
      message.classList.add('show');
    }, 5000);

    // Step 6: Show thanks button after a bit
    setTimeout(() => {
      thanksBtn.style.display = '';
    }, 6000);
  }

  function getFriendNamesForType() {
    const names = {
      dog: ['Biscuit', 'Mochi', 'Waffles'],
      cat: ['Mittens', 'Pudding', 'Noodle'],
      bird: ['Kiwi', 'Pip', 'Mango'],
      hamster: ['Cheeks', 'Nibbles', 'Boba'],
    };
    return names[state.petType] || names.dog;
  }

  function addBdayFriend(name, idx) {
    const friend = document.createElement('div');
    friend.className = 'bday-friend';

    const speech = document.createElement('div');
    speech.className = 'bday-friend-speech';
    const bdayMessages = [
      'Happy Birthday!! 🎂',
      'HAPPY BDAY!! 🥳',
      'Yay!! Party time! 🎉',
      'Best day ever!! 💕',
      'Happy Birthday ' + state.petName + '! 🎈',
      'We love you!! 💗',
    ];
    speech.textContent = pick(bdayMessages);
    friend.appendChild(speech);

    const cont = document.createElement('div');
    cont.className = 'pet-container';
    const pet = document.createElement('div');
    pet.className = 'chibi-pet ' + state.petType;
    pet.innerHTML = getPetHTML();
    pet.style.filter = 'hue-rotate(' + rand(15, 80) + 'deg)';
    cont.appendChild(pet);
    friend.appendChild(cont);

    const tag = document.createElement('div');
    tag.style.cssText = 'font-size:.55rem;font-weight:700;color:#fff;text-shadow:1px 1px 2px rgba(0,0,0,.5);text-align:center;margin-top:2px;';
    tag.textContent = name;
    friend.appendChild(tag);

    $('#bday-friends').appendChild(friend);

    // Trigger enter animation
    requestAnimationFrame(() => friend.classList.add('enter'));
  }

  function spawnBdayConfetti() {
    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bcb', '#a855f7', '#f97316'];
    const container = $('#bday-confetti');
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        if (!bdayActive) return;
        const piece = document.createElement('div');
        piece.className = 'bday-confetti-piece';
        piece.style.left = rand(0, 100) + '%';
        piece.style.background = pick(colors);
        piece.style.width = rand(5, 10) + 'px';
        piece.style.height = rand(5, 10) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = rand(20, 40) / 10 + 's';
        piece.style.animationDelay = rand(0, 5) / 10 + 's';
        container.appendChild(piece);
        setTimeout(() => piece.remove(), 5000);
      }, i * 60);
    }
    // Keep spawning confetti while active
    setTimeout(() => { if (bdayActive) spawnBdayConfetti(); }, 3500);
  }

  function openBdayGift(giftEl) {
    if (giftEl.classList.contains('opened')) return;
    giftEl.classList.add('opened');
    sfxSticker();

    const hearts = parseInt(giftEl.dataset.hearts);
    const emoji = giftEl.dataset.emoji;
    const label = giftEl.dataset.label;

    // Show reveal
    const reveal = document.createElement('div');
    reveal.className = 'bday-gift-reveal';
    reveal.textContent = emoji + ' ' + label + ' +' + hearts + '❤️';
    reveal.style.left = giftEl.offsetLeft + 'px';
    reveal.style.bottom = '0';
    $('#bday-gifts').appendChild(reveal);
    setTimeout(() => reveal.remove(), 1600);

    state.hearts += hearts;
    state.fun = clamp(state.fun + 10);
    updateUI();
    saveGame();
  }

  function closeBdaySurprise() {
    bdayActive = false;
    $('#bday-overlay').style.display = 'none';
    sfxHappy();
    showSpeech('Best birthday EVER!! 🎂💕 Thank you friends!', 4000);
    spawnSparkles(10);
    scheduleBdaySurprise();
  }

  $('#bday-thanks').addEventListener('click', closeBdaySurprise);

  // ──────────── PET PHONE ────────────
  let phoneOpen = false;
  let phoneGameActive = false;
  let phoneGameScore = 0;
  let phoneGameTimer = null;
  let phoneGameSpawnTimer = null;

  function closeAllPhoneScreens() {
    $('#phone-popup').style.display = 'none';
    $('#phone-closet').style.display = 'none';
    $('#phone-game').style.display = 'none';
    $('#phone-texts').style.display = 'none';
    phoneOpen = false;
    stopPhoneGame();
  }

  function openPhone() {
    closeAllPhoneScreens();
    phoneOpen = true;
    $('#phone-popup').style.display = '';
    // Update clock
    const now = new Date();
    $('#phone-time').textContent = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    sfxClick();
  }

  $('#lr-phone').addEventListener('click', () => {
    if (phoneOpen) { closeAllPhoneScreens(); return; }
    openPhone();
  });

  // Home buttons go back to app grid
  ['#phone-home-btn', '#closet-home', '#game-home', '#texts-home'].forEach(sel => {
    $(sel).addEventListener('click', () => openPhone());
  });

  // ── Closet App (free dress up) ──
  function openPhoneCloset() {
    closeAllPhoneScreens();
    phoneOpen = true;
    $('#phone-closet').style.display = '';
    sfxClick();

    const grid = $('#phone-closet-grid');
    grid.innerHTML = '';

    // None option
    const noneBtn = document.createElement('button');
    noneBtn.className = 'phone-outfit-btn' + (!state.equippedOutfit ? ' equipped' : '');
    noneBtn.innerHTML = '<span class="phone-outfit-icon">❌</span><span class="phone-outfit-label">None</span>';
    noneBtn.addEventListener('click', () => {
      state.equippedOutfit = null;
      sfxClick();
      updateAccessory();
      drawPet();
      saveGame();
      openPhoneCloset();
    });
    grid.appendChild(noneBtn);

    OUTFITS.forEach(outfit => {
      const equipped = state.equippedOutfit === outfit.id;
      const btn = document.createElement('button');
      btn.className = 'phone-outfit-btn' + (equipped ? ' equipped' : '');
      btn.innerHTML = '<span class="phone-outfit-icon">' + outfit.icon + '</span>' +
        '<span class="phone-outfit-label">' + outfit.label + '</span>' +
        (equipped ? '<span class="phone-outfit-tag">Wearing</span>' : '<span class="phone-outfit-tag">Free!</span>');

      btn.addEventListener('click', () => {
        // Free! No hearts needed from the phone closet
        if (!state.ownedOutfits.includes(outfit.id)) {
          state.ownedOutfits.push(outfit.id);
        }
        state.equippedOutfit = equipped ? null : outfit.id;
        sfxPop();
        updateAccessory();
        drawPet();
        saveGame();
        openPhoneCloset();
      });
      grid.appendChild(btn);
    });
  }

  $('#phone-app-dress').addEventListener('click', openPhoneCloset);
  $('#closet-back').addEventListener('click', openPhone);

  // ── Game App (Catch Stars) ──
  function openPhoneGame() {
    closeAllPhoneScreens();
    phoneOpen = true;
    $('#phone-game').style.display = '';
    sfxClick();

    phoneGameScore = 0;
    $('#phone-game-score').textContent = '0';
    $('#phone-game-field').innerHTML = '';
    $('#phone-game-start').style.display = '';
  }

  function startPhoneGame() {
    phoneGameActive = true;
    phoneGameScore = 0;
    $('#phone-game-score').textContent = '0';
    $('#phone-game-start').style.display = 'none';
    $('#phone-game-field').innerHTML = '';

    // Spawn stars and bombs
    let spawnDelay = 900;
    const spawn = () => {
      if (!phoneGameActive) return;
      spawnPhoneGameItem();
      spawnDelay = Math.max(350, spawnDelay - 15);
      phoneGameSpawnTimer = setTimeout(spawn, spawnDelay);
    };
    spawn();

    // 30 second game
    phoneGameTimer = setTimeout(() => endPhoneGame(), 30000);
  }

  function spawnPhoneGameItem() {
    const field = $('#phone-game-field');
    const isBomb = Math.random() < 0.2;
    const el = document.createElement('div');
    el.className = isBomb ? 'phone-game-bomb' : 'phone-game-star';
    el.textContent = isBomb ? '💣' : pick(['⭐', '🌟', '✨', '💫']);
    el.style.left = rand(5, 80) + '%';
    el.style.top = rand(5, 75) + '%';

    el.addEventListener('click', () => {
      if (!phoneGameActive) return;
      if (isBomb) {
        // Bomb = lose points
        phoneGameScore = Math.max(0, phoneGameScore - 3);
        el.textContent = '💥';
        sfxClick();
      } else {
        phoneGameScore++;
        el.textContent = '+1';
        el.style.color = '#ffd54f';
        sfxPop();
      }
      $('#phone-game-score').textContent = phoneGameScore;
      setTimeout(() => el.remove(), 200);
    });

    field.appendChild(el);
    // Auto-remove after 2s if not tapped
    setTimeout(() => { if (el.parentNode) el.remove(); }, 2000);
  }

  function endPhoneGame() {
    phoneGameActive = false;
    clearTimeout(phoneGameTimer);
    clearTimeout(phoneGameSpawnTimer);

    const field = $('#phone-game-field');
    const over = document.createElement('div');
    over.className = 'phone-game-over';
    over.innerHTML = '<span>Game Over!</span><span>Score: ' + phoneGameScore + '</span>' +
      '<span style="font-size:.6rem;color:#69f0ae;">+' + Math.floor(phoneGameScore / 2) + ' fun!</span>' +
      '<button id="phone-game-retry">Play Again</button>';
    field.appendChild(over);

    state.fun = clamp(state.fun + Math.floor(phoneGameScore / 2));
    if (phoneGameScore >= 10) state.hearts += 1;
    if (phoneGameScore >= 20) state.hearts += 2;
    updateUI();
    saveGame();

    over.querySelector('#phone-game-retry').addEventListener('click', () => {
      startPhoneGame();
    });
  }

  function stopPhoneGame() {
    phoneGameActive = false;
    clearTimeout(phoneGameTimer);
    clearTimeout(phoneGameSpawnTimer);
  }

  $('#phone-app-game').addEventListener('click', openPhoneGame);
  $('#game-back').addEventListener('click', openPhone);
  $('#phone-game-start').addEventListener('click', startPhoneGame);

  // ── Texting App ──
  const TEXT_FRIENDS = {
    dog: [
      { name: 'Biscuit', avatar: '🐕', personality: 'energetic' },
      { name: 'Mochi', avatar: '🐶', personality: 'shy' },
      { name: 'Waffles', avatar: '🦮', personality: 'goofy' },
    ],
    cat: [
      { name: 'Mittens', avatar: '🐱', personality: 'sassy' },
      { name: 'Pudding', avatar: '😺', personality: 'sweet' },
      { name: 'Noodle', avatar: '🐈', personality: 'goofy' },
    ],
    bird: [
      { name: 'Kiwi', avatar: '🐦', personality: 'energetic' },
      { name: 'Pip', avatar: '🐤', personality: 'shy' },
      { name: 'Mango', avatar: '🦜', personality: 'sassy' },
    ],
    hamster: [
      { name: 'Cheeks', avatar: '🐹', personality: 'goofy' },
      { name: 'Nibbles', avatar: '🐿️', personality: 'sweet' },
      { name: 'Boba', avatar: '🐁', personality: 'energetic' },
    ],
  };

  const TEXT_CONVOS = {
    energetic: {
      greetings: ['HIII!! 🎉🎉', 'OMG HI!!', 'YOOO whats up!! 🤩', 'I WAS JUST ABOUT TO TEXT YOU!! 😆'],
      responses: {
        'Hey!': ['HEYYY! I missed you so much!!', 'What are we doing today?! I wanna PLAY! 🏃'],
        'What are you doing?': ['Running around in CIRCLES! 🌀', 'I found a STICK! Best. Day. EVER!! 🤩'],
        'Wanna hang out?': ['YES YES YES!! When?! NOW?! 🤯', 'I\'ll be there in 0.2 seconds!! 💨'],
        'Tell me a joke': ['Why did the dog sit in the shade? Because he didn\'t want to be a HOT DOG! 🌭😂😂', 'That was SO funny right?! RIGHT?! 🤣'],
        'What\'s your fave food?': ['EVERYTHING!! But especially TREATS!! 🍖🤤', 'I once ate 47 treats in one minute!! New record!! 🏆'],
        'Send me a selfie': ['📸 *blurry photo because I can\'t stop moving*', 'WAIT let me pose-- *falls over* ok here 🤳😂'],
        'What should we do this weekend?': ['ADVENTURE!! Let\'s explore EVERYWHERE!! 🗺️🏃', 'Obstacle course!! Trampoline park!! EVERYTHING!! 🤸‍♂️🎢'],
        'I\'m bored': ['BORED?! HOW?! Let\'s go run!! Or jump!! Or BOTH!! 🏃💨', 'I have 500 ideas!! Idea 1: ZOOMIES!! 🌀🌀🌀'],
        'Do you have any pets?': ['I have a pet ROCK and it\'s my BEST FRIEND!! (after you) 🪨❤️', 'I tried to adopt a butterfly but it flew away 🦋😭 SO FAST'],
        'What\'s your dream?': ['To run SO FAST that I break the sound barrier!! 💨💥 SONIC BOOM!!', 'To have an unlimited treat dispenser!! And a TRAMPOLINE HOUSE!! 🤩'],
        'You\'re so funny': ['REALLY?! That makes me SO HAPPY!! 🥹💕 *zoomies of joy*', 'I\'m gonna do a happy dance!! 💃🕺💃🕺 WOOOOO!!'],
        'What music do you like?': ['LOUD FAST MUSIC!! 🎸🔥 Makes me wanna RUN!!', 'I like to howl along to EVERYTHING!! 🎤🐕 AWOOOOO!!'],
        'Bye!': ['NOOO don\'t gooo 😭 ok bye!! MISS YOU ALREADY!! 💕💕'],
      },
    },
    shy: {
      greetings: ['oh.. hi 🥺', 'h-hello...', 'um.. hi there 👋', '...you remembered me? 🥹'],
      responses: {
        'Hey!': ['oh hi... how are you? 🥺', '...I was just thinking about you actually'],
        'What are you doing?': ['just sitting in my cozy spot... 🧸', 'reading a tiny book... it\'s nice 📖'],
        'Wanna hang out?': ['r-really? with me? 🥹', 'I\'d like that... maybe we could be quiet together? 💗'],
        'Tell me a joke': ['um.. why do bees have sticky hair? because they use honeycombs... 🐝', '...was that ok? 👉👈'],
        'What\'s your fave food?': ['I like warm soup... it feels like a hug for my tummy 🍜🥺', 'tiny sandwiches with the crusts cut off... 🥪'],
        'Send me a selfie': ['oh no I\'m not good at photos... 📸😳', 'o-ok... *hides half face behind paw* here... 🙈'],
        'What should we do this weekend?': ['maybe... a blanket fort? just us? 🏰🥺', 'we could read together... I have a really good book... 📚'],
        'I\'m bored': ['oh... I could share my favorite show? it\'s about bunnies 🐰', 'want me to tell you a story? ...I wrote one about us 📝🥺'],
        'Are you ok?': ['...yeah... I just get nervous sometimes 🥺', 'I\'m better now that you\'re here... 💗'],
        'You\'re my best friend': ['...r-really? 🥹', 'no one\'s ever said that to me before... *happy tears* 😭💗'],
        'What\'s your dream?': ['to have a little garden... with flowers and a reading nook 🌷📖', 'to be brave enough to say hi first one day... 🥺✨'],
        'What music do you like?': ['soft piano music... 🎹 it helps me feel calm', 'I like rain sounds... is that weird? 🌧️🥺'],
        'Bye!': ['oh... ok... come back soon please 🥺💕'],
      },
    },
    goofy: {
      greetings: ['*trips over nothing* HI! 😅', 'ayooo 🤪', 'bloop bloop 🫧', 'guess who just walked into a door? THIS GUY 🚪😂'],
      responses: {
        'Hey!': ['*does a backflip* ...ok I didn\'t actually but IMAGINE 🤸', 'hewwo fren!! 🤪'],
        'What are you doing?': ['I just tried to catch my own tail for 20 minutes 🌀😂', 'I ate a lemon. I do NOT recommend 🍋😵'],
        'Wanna hang out?': ['only if we can wear silly hats 🎩🤡', 'I\'ll bring the whoopee cushions!! 💨😂'],
        'Tell me a joke': ['what do you call a sleeping dinosaur? a DINO-SNORE 🦖😴 hehehehe', 'I don\'t know any jokes but here\'s a funny face: 🤪🥴😜'],
        'What\'s your fave food?': ['I once put ketchup on ice cream and... it was actually ok?? 🍦🫠', 'CHEESE!! I could eat a whole WHEEL of cheese 🧀🤤 actually I did once'],
        'Send me a selfie': ['*sends photo upside down* wait how do I flip this 🙃📸', '*sends blurry photo of ceiling* oops 📸 *sends another one of my nostril* OOPS 👃'],
        'What should we do this weekend?': ['prank call the pizza place and order 100 pizzas 🍕😂 jk... unless? 👀', 'let\'s build a pillow fort and then DESTROY IT 🏰💥 MUAHAHAHA'],
        'I\'m bored': ['hi bored I\'m Waffles 😂😂 get it?? GET IT??', 'let\'s see how many marshmallows fit in my mouth 🤔 current record is 12'],
        'Say something random': ['purple monkey dishwasher 🐒🍽️ ...I don\'t know why I said that', 'did you know that if you say "grapefruit" 10 times fast it stops sounding real?? 🍇 try it'],
        'What\'s your dream?': ['to become a PROFESSIONAL pillow fighter 🛏️⚔️', 'to teach a fish how to ride a bicycle 🐟🚲 it\'s possible I BELIEVE'],
        'You\'re so funny': ['*takes a bow and falls off stage* thank you thank you 🎭😂', 'my comedy is 90% accidents and 10% snacks 🤪🍪'],
        'What music do you like?': ['I only listen to songs about FOOD 🎵🍕', 'I made a song! It goes: BOOP BOOP BOOP 🎤 ...that\'s it that\'s the whole song'],
        'Bye!': ['*waves with both paws and falls over* BYE!! 🤣💕'],
      },
    },
    sassy: {
      greetings: ['oh, it\'s you 💅', 'hey bestie 💁', 'finally you text me 😏', 'I was about to unfriend you for taking so long 💅'],
      responses: {
        'Hey!': ['took you long enough 💅✨', 'well well well... missed me? 😏'],
        'What are you doing?': ['being fabulous, obviously 💅', 'judging everyone from my window perch 🪟👀'],
        'Wanna hang out?': ['hmm... I GUESS I could make time for you 💁', 'only if there\'s treats involved 🍣✨'],
        'Tell me a joke': ['I don\'t do jokes. I AM the entertainment 💅', 'fine. knock knock. who\'s there? me. the star 🌟'],
        'What\'s your fave food?': ['only the FINEST cuisine 🍣✨ nothing from a can', 'sushi. and it better be fresh or I\'m sending it BACK 🍱💅'],
        'Send me a selfie': ['you couldn\'t handle this level of beauty 📸💅', 'ok but only my good side... which is ALL my sides 💁✨'],
        'What should we do this weekend?': ['spa day. non-negotiable 🧖💅', 'shopping, obviously. I need a new look for every day of the week 🛍️'],
        'I\'m bored': ['sounds like a YOU problem 💅', 'maybe try being as interesting as me? just a thought 😏✨'],
        'Do you like my outfit?': ['hmm... it\'s giving... effort 💁', 'it\'s cute I GUESS... but have you seen MY wardrobe? 👗✨'],
        'Who\'s your crush?': ['myself, obviously 💅🪞', 'wouldn\'t YOU like to know 😏 ...ok fine it\'s nobody I\'m too iconic to settle'],
        'What\'s your dream?': ['world domination, but make it fashion 👑💅', 'to have my own reality show. I\'d be the STAR obviously 🌟📺'],
        'What music do you like?': ['only songs about being a boss 🎵👑', 'I have a playlist called "Songs That Describe Me" and it\'s just Beyonce 💃'],
        'You\'re so pretty': ['I KNOW 💅✨ but thanks for noticing', 'finally someone with TASTE around here 💁💕'],
        'Bye!': ['ugh already? fine. don\'t forget about me 💋✨'],
      },
    },
    sweet: {
      greetings: ['hi friend!! 🌸💗', 'hello sunshine! ☀️', 'aww it\'s you!! 💕', 'I just made you a friendship bracelet!! 📿💗'],
      responses: {
        'Hey!': ['I baked you tiny cookies! 🍪💗', 'how are you?? I hope you\'re having the BEST day! 🌸'],
        'What are you doing?': ['making friendship bracelets for everyone! 📿💗', 'watching the clouds... that one looks like a heart! ☁️💕'],
        'Wanna hang out?': ['I would LOVE that!! I\'ll make us cocoa! ☕💗', 'yes please!! picnic in the garden? 🌷🧺'],
        'Tell me a joke': ['what did the blanket say? don\'t worry, I\'ve got you covered! 🤗', 'hehe that one always makes me giggle 🤭💕'],
        'What\'s your fave food?': ['anything homemade with love! 🍪💗', 'my grandma\'s apple pie... I saved you a slice!! 🥧🥰'],
        'Send me a selfie': ['ok!! 📸🌸 *sends photo with flower crown filter*', 'here\'s me and a ladybug I made friends with! 🐞💕'],
        'What should we do this weekend?': ['let\'s have a picnic and invite EVERYONE!! 🧺🌸', 'we could plant flowers together! I\'ll bring the seeds! 🌱💗'],
        'I\'m bored': ['let\'s make friendship bracelets for ALL our friends! 📿✨', 'I could teach you how to make paper stars! they\'re so cute ⭐💗'],
        'Are you ok?': ['aww you\'re so sweet for asking!! I\'m great! 🥰💗', 'I am now! talking to you always makes me smile 🌸😊'],
        'You\'re my best friend': ['REALLY?! 🥹💗 you\'re MY best friend too!! forever and ever!!', '*happy tears* I\'m going to make you the BIGGEST friendship bracelet!! 📿💕💕'],
        'What\'s your dream?': ['to open a little bakery where everything is free!! 🧁💗', 'to make everyone in the whole world smile at least once 🌍😊✨'],
        'What music do you like?': ['happy songs that make you wanna spin around! 🎵💃', 'lullabies... they\'re so peaceful and warm 🎶🌙💗'],
        'I love you': ['I LOVE YOU TOO!! SO MUCH!! 💗💗💗 *biggest hug ever* 🤗', 'awww my heart is SO FULL right now 🥹💕💕💕 you\'re the best!!'],
        'Bye!': ['aww bye bye! you\'re the best friend ever!! 💗🌸 sending hugs!! 🤗'],
      },
    },
  };

  let currentChatFriend = null;

  function openPhoneTexts() {
    closeAllPhoneScreens();
    phoneOpen = true;
    $('#phone-texts').style.display = '';
    $('#phone-contacts').style.display = '';
    $('#phone-chat').style.display = 'none';
    sfxClick();

    const contacts = $('#phone-contacts');
    contacts.innerHTML = '';

    const friends = TEXT_FRIENDS[state.petType] || TEXT_FRIENDS.dog;
    friends.forEach(friend => {
      const convo = TEXT_CONVOS[friend.personality];
      const el = document.createElement('div');
      el.className = 'phone-contact';
      el.innerHTML = '<span class="phone-contact-avatar">' + friend.avatar + '</span>' +
        '<div class="phone-contact-info"><span class="phone-contact-name">' + friend.name + '</span>' +
        '<span class="phone-contact-preview">' + pick(convo.greetings) + '</span></div>' +
        '<div class="phone-contact-dot"></div>';
      el.addEventListener('click', () => openChat(friend));
      contacts.appendChild(el);
    });
  }

  function openChat(friend) {
    currentChatFriend = friend;
    const convo = TEXT_CONVOS[friend.personality];
    $('#phone-contacts').style.display = 'none';
    $('#phone-chat').style.display = '';

    const header = $('#phone-chat-header');
    header.textContent = friend.avatar + ' ' + friend.name;
    header.addEventListener('click', openPhoneTexts, { once: true });

    const messages = $('#phone-chat-messages');
    messages.innerHTML = '';

    // Friend sends initial greeting
    setTimeout(() => {
      addChatMsg(pick(convo.greetings), 'them');
      showChatOptions(friend);
    }, 500);
  }

  function addChatMsg(text, who) {
    const messages = $('#phone-chat-messages');
    const msg = document.createElement('div');
    msg.className = 'chat-msg ' + who;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    if (who === 'them') sfxEvent();
  }

  function showChatOptions(friend) {
    const convo = TEXT_CONVOS[friend.personality];
    const options = $('#phone-chat-options');
    options.innerHTML = '';

    const choices = Object.keys(convo.responses);
    // Show 3 random choices so they fit on the small phone screen
    const shuffled = [...choices].sort(() => Math.random() - 0.5).slice(0, 3);
    shuffled.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'chat-option';
      btn.textContent = choice;
      btn.addEventListener('click', () => {
        addChatMsg(choice, 'me');
        options.innerHTML = '';
        sfxClick();

        // Friend replies after a short delay
        const replies = convo.responses[choice];
        const reply = Array.isArray(replies) ? replies : [replies];
        let delay = 800;
        reply.forEach((r, i) => {
          setTimeout(() => {
            addChatMsg(r, 'them');
            if (i === reply.length - 1) {
              // Show more options unless they said bye
              if (choice === 'Bye!') {
                state.fun = clamp(state.fun + 5);
                state.hearts += 1;
                updateUI();
                saveGame();
                setTimeout(() => {
                  addChatMsg('(+1 ❤️ for chatting!)', 'them');
                }, 600);
              } else {
                setTimeout(() => showChatOptions(friend), 400);
              }
            }
          }, delay * (i + 1));
        });
      });
      options.appendChild(btn);
    });
  }

  $('#phone-app-text').addEventListener('click', openPhoneTexts);
  $('#texts-back').addEventListener('click', openPhone);

  // Close phone when clicking outside or pressing escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && phoneOpen) closeAllPhoneScreens();
  });

  // ──────────── SEASONS & HOLIDAYS ────────────
  function updateSeasonalDecorations() {
    const seasonEl = $('#lr-season');
    if (!seasonEl) return;
    seasonEl.innerHTML = '';

    const month = new Date().getMonth(); // 0-11
    let decos = [];

    if (month === 11 || month === 0 || month === 1) {
      // Winter: snowflakes
      decos = ['❄️', '⛄', '❄️', '🎄', '❄️', '⛄'];
    } else if (month >= 2 && month <= 4) {
      // Spring: flowers
      decos = ['🌸', '🌷', '🌼', '🦋', '🌸', '🌷'];
    } else if (month >= 5 && month <= 7) {
      // Summer: sunny
      decos = ['☀️', '🌺', '🍉', '🦩', '🌴', '🍦'];
    } else {
      // Fall: autumn
      decos = ['🍂', '🍁', '🎃', '🍂', '🍁', '🌰'];
    }

    // Holiday overrides
    if (month === 9) decos = ['🎃', '👻', '🦇', '🕸️', '🎃', '💀']; // October: Halloween
    if (month === 11) decos = ['🎄', '🎅', '⭐', '🎁', '❄️', '🔔']; // December: Christmas
    if (month === 1) decos = ['💕', '💖', '❤️', '💝', '💕', '🌹']; // February: Valentine's

    const positions = [
      { top: '6%', left: '5%' }, { top: '4%', right: '8%' },
      { bottom: '35%', left: '3%' }, { bottom: '38%', right: '5%' },
      { top: '15%', left: '40%' }, { top: '10%', right: '30%' },
    ];

    decos.forEach((d, i) => {
      const el = document.createElement('div');
      el.className = 'season-deco';
      el.textContent = d;
      const pos = positions[i % positions.length];
      Object.assign(el.style, pos);
      el.style.animationDelay = (i * 0.2) + 's';
      seasonEl.appendChild(el);
    });
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
      nailColors: state.nailColors,
      ownedOutfits: state.ownedOutfits,
      equippedOutfit: state.equippedOutfit,
      gardenPlots: state.gardenPlots,
      photoGallery: state.photoGallery,
      makeup: state.makeup,
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
      state.nailColors       = data.nailColors || [null, null, null, null];
      state.ownedOutfits     = data.ownedOutfits || [];
      state.equippedOutfit   = data.equippedOutfit || null;
      state.gardenPlots      = data.gardenPlots || [null, null, null, null];
      state.photoGallery     = data.photoGallery || [];
      state.makeup           = data.makeup || { blush: null, lipstick: null, eyeshadow: null, eyeliner: null, lashes: null, sparkle: null };
      return true;
    } catch (_) { return false; }
  }

  function resetGame() {
    try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
    state = {
      petType: null, petName: 'Buddy',
      hunger: 70, cleanliness: 70, fun: 70, grooming: 70,
      hearts: 0, stickers: [], equippedAccessory: null, happyStreak: 0, nailColors: [null, null, null, null], ownedOutfits: [], equippedOutfit: null, gardenPlots: [null, null, null, null], photoGallery: [],
      makeup: { blush: null, lipstick: null, eyeshadow: null, eyeliner: null, lashes: null, sparkle: null },
      createdAt: null, lastBdaySurprise: null,
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
    startVisitorSystem();
    updateSeasonalDecorations();
    scheduleBdaySurprise();
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
    state.createdAt = Date.now();
    state.lastBdaySurprise = null;
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
  btnNails.addEventListener('click', openNails);
  const btnClean = $('#btn-clean');
  btnClean.addEventListener('click', openCleanMode);
  const btnDress = $('#btn-dress');
  btnDress.addEventListener('click', openDressUp);
  const btnCook = $('#btn-cook');
  btnCook.addEventListener('click', openCook);
  const btnGarden = $('#btn-garden');
  btnGarden.addEventListener('click', openGarden);
  const btnPhoto = $('#btn-photo');
  btnPhoto.addEventListener('click', openPhotoBooth);

  // Back button from dress-up
  $('#dress-back').addEventListener('click', leaveDressUp);

  // Back button from kitchen
  $('#cook-back').addEventListener('click', leaveKitchen);

  // Mix and Bake buttons
  $('#btn-mix').addEventListener('click', mixBowl);
  $('#btn-bake').addEventListener('click', bakeTreat);

  // Back button from garden
  $('#garden-back').addEventListener('click', leaveGarden);

  // Back button from photo booth
  $('#photo-back').addEventListener('click', leavePhotoBooth);

  // Back button from nail salon
  $('#nail-back').addEventListener('click', () => {
    leaveNailSalon();
  });

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
    if (e.key === '7') btnNails.click();
    if (e.key === '8') btnClean.click();
    if (e.key === '9') btnDress.click();
    if (e.key === '0') btnCook.click();
  });

  // ──────────── INIT ────────────
  // Check for saved game; if found, skip to game screen.
  if (loadGame()) {
    // Saved game exists — go straight to game
    launchGame();
  }
  // Otherwise stay on splash screen (default active).

})();
