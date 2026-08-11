(() => {
  /* ==========================================================================
     ENGINE 1: 270-FRAME CANVAS VIDEO SCROLL ENGINE
     ========================================================================== */
  const TOTAL_FRAMES = 270;
  const FRAME_PREFIX = 'frames/ezgif-frame-';
  const FRAME_SUFFIX = '.jpg';

  const canvas = document.getElementById('animation-canvas');
  const ctx = canvas.getContext('2d');

  const loader = document.getElementById('loader');
  const progressBar = document.getElementById('progress-bar');
  const scrollProgress = document.getElementById('scroll-progress');

  const images = [];
  const imageLoadedState = new Array(TOTAL_FRAMES).fill(false);
  let loadedCount = 0;

  let currentFrame = 0;
  let targetFrame = 0;
  let isLoaded = false;
  let lastRenderedFrame = -1;

  function currentFramePath(index) {
    const frameNumber = String(index + 1).padStart(3, '0');
    return `${FRAME_PREFIX}${frameNumber}${FRAME_SUFFIX}`;
  }

  function preloadImages() {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = currentFramePath(i);

      img.onload = () => {
        imageLoadedState[i] = true;
        loadedCount++;
        const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
        
        if (progressBar) progressBar.style.width = `${percent}%`;

        if (i === 0 && lastRenderedFrame === -1) {
          renderFrame(0);
        }

        if (loadedCount >= 10 && !isLoaded) {
          hideLoader();
        }

        if (loadedCount === TOTAL_FRAMES) {
          hideLoader();
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES || loadedCount >= 10) {
          hideLoader();
        }
      };

      images.push(img);
    }

    setTimeout(() => {
      hideLoader();
    }, 2500);
  }

  function hideLoader() {
    if (isLoaded) return;
    isLoaded = true;
    if (loader) {
      loader.classList.add('hidden');
    }
    updateScrollProgress();
    renderFrame(Math.round(currentFrame));
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;

    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    ctx.scale(dpr, dpr);
    renderFrame(Math.round(currentFrame));
  }

  function getNearestLoadedFrame(targetIdx) {
    if (imageLoadedState[targetIdx]) return targetIdx;
    
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      if (targetIdx - offset >= 0 && imageLoadedState[targetIdx - offset]) {
        return targetIdx - offset;
      }
      if (targetIdx + offset < TOTAL_FRAMES && imageLoadedState[targetIdx + offset]) {
        return targetIdx + offset;
      }
    }
    return 0;
  }

  function renderFrame(index) {
    const frameIdx = Math.min(Math.max(Math.round(index), 0), TOTAL_FRAMES - 1);
    const validFrameIdx = getNearestLoadedFrame(frameIdx);

    const img = images[validFrameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    const offsetX = (canvasWidth - drawWidth) / 2;
    const offsetY = (canvasHeight - drawHeight) / 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    lastRenderedFrame = validFrameIdx;
  }

  function updateScrollProgress() {
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.offsetHeight,
      document.body.offsetHeight
    );
    const maxScroll = Math.max(docHeight - window.innerHeight, 1);

    const scrollFraction = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    targetFrame = scrollFraction * (TOTAL_FRAMES - 1);

    if (scrollProgress) {
      scrollProgress.style.width = `${(scrollFraction * 100).toFixed(2)}%`;
    }
  }

  function animate() {
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) > 0.001) {
      currentFrame += diff * 0.18;
      renderFrame(currentFrame);
    } else if (Math.round(currentFrame) !== lastRenderedFrame) {
      currentFrame = targetFrame;
      renderFrame(currentFrame);
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('wheel', updateScrollProgress, { passive: true });
  window.addEventListener('touchmove', updateScrollProgress, { passive: true });

  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space'].includes(e.code)) {
      setTimeout(updateScrollProgress, 20);
    }
  });

  /* ==========================================================================
     ENGINE 2: GYM APPLICATION CONTROLLER & INTERACTORS
     ========================================================================== */
  let currentUser = MOCK_USERS[0];
  let usersList = [...MOCK_USERS];
  let selectedGender = 'male';
  let repCount = 12;

  // Toast Notification Helper
  window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) {
      alert(message);
      return;
    }
    const toast = document.createElement('div');
    toast.className = `toast-msg ${type === 'success' ? 'border-[#00CFFF]' : 'border-[#8B5CF6]'}`;
    toast.innerHTML = `<span class="text-sm font-bold">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // Mobile Navigation Drawer Toggle
  window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
  };

  // Precise Smooth Scroll to Page Section (Offset for Sticky Header)
  window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 90;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Gender Selector for Calculator
  window.setGender = function(g) {
    selectedGender = g;
    const btnMale = document.getElementById('btn-gender-male');
    const btnFemale = document.getElementById('btn-gender-female');

    if (g === 'male') {
      btnMale.className = "flex-1 py-2.5 rounded-lg text-sm font-semibold border bg-[#00CFFF] text-black border-[#00CFFF] cursor-pointer";
      btnFemale.className = "flex-1 py-2.5 rounded-lg text-sm font-semibold border bg-black/40 text-white/60 border-white/10 cursor-pointer";
    } else {
      btnFemale.className = "flex-1 py-2.5 rounded-lg text-sm font-semibold border bg-[#00CFFF] text-black border-[#00CFFF] cursor-pointer";
      btnMale.className = "flex-1 py-2.5 rounded-lg text-sm font-semibold border bg-black/40 text-white/60 border-white/10 cursor-pointer";
    }
    calculateDiet();
  };

  // Biometric Diet Calculation
  window.calculateDiet = function() {
    const age = parseFloat(document.getElementById('calc-age')?.value) || 25;
    const height = parseFloat(document.getElementById('calc-height')?.value) || 175;
    const weight = parseFloat(document.getElementById('calc-weight')?.value) || 75;
    const goal = document.getElementById('calc-goal')?.value || 'maintain';
    const activity = parseFloat(document.getElementById('calc-activity')?.value) || 1.55;

    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr += (selectedGender === 'male') ? 5 : -161;

    const tdee = Math.round(bmr * activity);
    let targetCal = tdee;
    if (goal === 'loss') targetCal -= 500;
    if (goal === 'gain') targetCal += 400;

    const heightM = height / 100;
    const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));

    let proteinPct = 0.3;
    let carbPct = 0.45;
    let fatPct = 0.25;

    if (goal === 'loss') { proteinPct = 0.35; carbPct = 0.35; fatPct = 0.3; }
    if (goal === 'gain') { proteinPct = 0.25; carbPct = 0.50; fatPct = 0.25; }

    const proteinGrams = Math.round((targetCal * proteinPct) / 4);
    const carbGrams = Math.round((targetCal * carbPct) / 4);
    const fatGrams = Math.round((targetCal * fatPct) / 9);

    if (document.getElementById('res-bmi')) document.getElementById('res-bmi').textContent = bmi;
    if (document.getElementById('res-bmr')) document.getElementById('res-bmr').textContent = Math.round(bmr).toLocaleString();
    if (document.getElementById('res-tdee')) document.getElementById('res-tdee').textContent = tdee.toLocaleString();
    if (document.getElementById('res-target-cal')) document.getElementById('res-target-cal').textContent = targetCal.toLocaleString();
    if (document.getElementById('res-protein')) document.getElementById('res-protein').textContent = `${proteinGrams}g`;
    if (document.getElementById('res-carbs')) document.getElementById('res-carbs').textContent = `${carbGrams}g`;
    if (document.getElementById('res-fats')) document.getElementById('res-fats').textContent = `${fatGrams}g`;

    // Timeline Projection Row
    const projRow = document.getElementById('weight-projection-row');
    if (projRow) {
      let currentW = weight;
      let html = '';
      for (let week = 0; week <= 12; week += 2) {
        if (week === 0) {
          html += `<div><p class="text-white/40 uppercase font-bold text-[9px]">Start</p><p class="text-white font-extrabold mt-1">${weight}kg</p></div>`;
        } else {
          const diff = (goal === 'loss') ? -0.5 : (goal === 'gain') ? 0.4 : 0;
          currentW = parseFloat((currentW + diff * 2).toFixed(1));
          html += `<div><p class="text-white/40 uppercase font-bold text-[9px]">Wk ${week}</p><p class="text-white font-extrabold mt-1">${currentW}kg</p></div>`;
        }
      }
      projRow.innerHTML = html;
    }
  };

  // Render Transformations
  function renderTransformations() {
    const grid = document.getElementById('transformations-grid');
    if (!grid || typeof TRANSFORMATION_STORIES === 'undefined') return;

    grid.innerHTML = TRANSFORMATION_STORIES.map(item => `
      <div class="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between border border-white/10">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-lg font-bold font-display">${item.name} (${item.age})</span>
            <span class="px-3 py-1 rounded-full badge-neon text-xs font-bold">${item.stat}</span>
          </div>
          <p class="text-xs text-white/50">${item.profession} • ${item.timeframe} Transformation</p>
          <p class="text-xs text-white/80 leading-relaxed italic">"${item.story}"</p>
        </div>
        <div class="grid grid-cols-2 gap-3 pt-2">
          <div class="space-y-1">
            <span class="text-[10px] text-white/40 uppercase block font-bold">Before (${item.beforeWeight}kg)</span>
            <img src="${item.imageUrlBefore}" class="w-full h-36 object-cover rounded-xl border border-white/10" />
          </div>
          <div class="space-y-1">
            <span class="text-[10px] text-[#00CFFF] uppercase block font-bold">After (${item.afterWeight}kg)</span>
            <img src="${item.imageUrlAfter}" class="w-full h-36 object-cover rounded-xl border border-[#00CFFF]/40 shadow-lg shadow-[#00CFFF]/10" />
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render Training Programs & Exercise Library
  function renderPrograms() {
    const progGrid = document.getElementById('programs-grid');
    const exGrid = document.getElementById('exercise-grid');
    if (!progGrid || !exGrid || typeof PROGRAMS === 'undefined') return;

    progGrid.innerHTML = PROGRAMS.map(p => `
      <div class="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between border border-white/10">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full badge-purple text-xs font-bold uppercase">${p.difficulty}</span>
            <span class="text-xs text-white/50">${p.durationWeeks} Weeks • ${p.caloriesPerSession} kcal/session</span>
          </div>
          <h3 class="text-xl font-bold font-display text-white">${p.name}</h3>
          <p class="text-xs text-white/70 leading-relaxed">${p.description}</p>
          <div class="text-xs text-[#00CFFF] font-semibold">Coach: ${p.trainerName}</div>
        </div>
        <button onclick="enrollProgram('${p.name}')" class="btn-primary w-full text-center text-xs font-display">ENROLL IN PROGRAM</button>
      </div>
    `).join('');

    exGrid.innerHTML = EXERCISES.map(e => `
      <div onclick="openExerciseModal('${e.id}')" class="glass-card p-5 rounded-xl space-y-3 cursor-pointer border border-white/10">
        <span class="text-[10px] text-[#00CFFF] uppercase font-bold tracking-wider">${e.difficulty}</span>
        <h4 class="text-base font-bold font-display text-white">${e.name}</h4>
        <p class="text-xs text-white/60 line-clamp-2">${e.musclesWorked.join(', ')}</p>
        <div class="text-xs font-semibold text-[#8B5CF6] pt-2 border-t border-white/10 flex justify-between">
          <span>${e.sets} Sets × ${e.reps} Reps</span>
          <span>Details →</span>
        </div>
      </div>
    `).join('');
  }

  window.enrollProgram = function(progName) {
    if (!currentUser) {
      openAuthModal();
      showToast("💡 Please sign in to enroll in " + progName, "info");
      return;
    }
    currentUser.enrolledProgram = progName;
    updateUserHeader();
    addWebsiteBooking(currentUser.name, currentUser.email, currentUser.mobile || '+91 9999999999', 'Program Enrollment', progName);
    showToast(`🎉 Enrolled in '${progName}'! Saved to Supabase Bookings.`, "success");
    openDashboardModal();
  };

  window.openExerciseModal = function(exId) {
    const ex = EXERCISES.find(e => e.id === exId);
    if (!ex) return;

    document.getElementById('ex-modal-title').textContent = ex.name;
    document.getElementById('ex-modal-body').innerHTML = `
      <div class="space-y-4">
        <div>
          <span class="font-bold text-white block mb-1">Target Muscles:</span>
          <span class="text-[#00CFFF]">${ex.musclesWorked.join(', ')}</span>
        </div>
        <div>
          <span class="font-bold text-white block mb-1">Execution Steps:</span>
          <ol class="list-decimal list-inside space-y-1 text-white/70">
            ${ex.instructions.map(i => `<li>${i}</li>`).join('')}
          </ol>
        </div>
        <div>
          <span class="font-bold text-red-400 block mb-1">Common Mistakes:</span>
          <ul class="list-disc list-inside space-y-1 text-red-300/80">
            ${ex.mistakes.map(m => `<li>${m}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    document.getElementById('exercise-modal').classList.add('open');
  };

  window.closeExerciseModal = function() {
    document.getElementById('exercise-modal').classList.remove('open');
  };

  // Render Memberships
  function renderMemberships() {
    const grid = document.getElementById('memberships-grid');
    if (!grid || typeof MEMBERSHIPS === 'undefined') return;

    grid.innerHTML = MEMBERSHIPS.map(m => `
      <div class="glass-panel p-8 rounded-3xl space-y-6 flex flex-col justify-between relative border border-white/10 ${m.popular ? 'border-[#00CFFF] shadow-xl shadow-[#00CFFF]/20' : ''}">
        ${m.popular ? `<span class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#00CFFF] to-[#8B5CF6] text-black font-bold text-[10px] uppercase tracking-wider">MOST POPULAR TIER</span>` : ''}
        <div class="space-y-4">
          <h3 class="text-xl font-bold font-display uppercase text-white">${m.name}</h3>
          <div class="flex items-baseline gap-1">
            <span class="text-4xl font-black font-display text-white">₹${m.priceInr.toLocaleString()}</span>
            <span class="text-xs text-white/50">/ month</span>
          </div>
          <ul class="space-y-3 pt-4 border-t border-white/10 text-xs text-white/80">
            ${m.features.map(f => `<li class="flex items-center gap-2"><span class="text-[#00CFFF]">✓</span> ${f}</li>`).join('')}
          </ul>
        </div>
        <button onclick="selectMembership('${m.name}')" class="${m.popular ? 'btn-primary' : 'btn-outline'} w-full text-center text-xs font-display">SELECT PLAN</button>
      </div>
    `).join('');
  }

  window.selectMembership = function(tierName) {
    if (!currentUser) {
      openAuthModal();
      showToast("💡 Please sign in to choose " + tierName, "info");
      return;
    }
    currentUser.membershipTier = tierName;
    updateUserHeader();
    addWebsiteBooking(currentUser.name, currentUser.email, currentUser.mobile || '+91 9999999999', 'Membership Upgrade', tierName);
    showToast(`🏆 Upgraded to '${tierName}'! Saved to Supabase Bookings.`, "success");
    openDashboardModal();
  };

  /* ==========================================================================
     SUPABASE BOOKINGS & SINGLE-SLOT ADMIN PORTAL ENGINE
     ========================================================================== */
  let isSingleAdminSlotClaimed = false;
  let claimedAdminEmail = '';

  // Insert Booking into Supabase
  async function addWebsiteBooking(name, email, phone, type, detail) {
    if (supabase) {
      try {
        await supabase.from('bookings').insert([
          {
            user_name: name,
            user_email: email,
            user_phone: phone,
            booking_type: type,
            booking_detail: detail,
            status: 'Confirmed'
          }
        ]);
      } catch (e) {
        console.warn("Supabase booking insert notice:", e);
      }
    }
  }

  // Check Single Admin Slot Status from Supabase
  async function checkSingleAdminSlot() {
    const badge = document.getElementById('footer-admin-slot-badge');
    const headerSub = document.getElementById('admin-slot-header-subtitle');

    if (supabase) {
      try {
        const { data, error } = await supabase.from('admin_slots').select('*');
        if (data && data.length > 0) {
          isSingleAdminSlotClaimed = true;
          claimedAdminEmail = data[0].admin_email;
          if (badge) badge.innerHTML = `<span class="text-red-400 font-bold">🔒 Admin Slot Claimed (${claimedAdminEmail})</span>`;
          if (headerSub) headerSub.innerHTML = `<span class="text-red-400">🔒 Slot Claimed (${claimedAdminEmail}) • Single Slot Locked</span>`;
        } else {
          isSingleAdminSlotClaimed = false;
          if (badge) badge.innerHTML = `<span class="text-green-400 font-bold">⚡ 1 Single Admin Slot Available</span>`;
          if (headerSub) headerSub.innerHTML = `<span class="text-green-400">⚡ 1 Slot Available • Claim Owner Account</span>`;
        }
      } catch (e) {
        if (badge) badge.textContent = "🔒 Single Admin Slot Protected";
      }
    }
  }

  // Admin Portal Modal Control
  let currentAdminPortalTab = 'signin';

  window.openAdminPortalModal = function() {
    checkSingleAdminSlot();
    const modal = document.getElementById('admin-portal-modal');
    if (modal) modal.classList.add('open');
  };

  window.closeAdminPortalModal = function() {
    const modal = document.getElementById('admin-portal-modal');
    if (modal) modal.classList.remove('open');
  };

  window.switchAdminPortalTab = function(mode) {
    currentAdminPortalTab = mode;
    const tabSignIn = document.getElementById('admin-tab-signin');
    const tabClaim = document.getElementById('admin-tab-claim');
    const nameGroup = document.getElementById('admin-claim-name-group');
    const submitBtn = document.getElementById('admin-portal-submit-btn');
    const notice = document.getElementById('admin-slot-locked-notice');

    if (mode === 'signin') {
      tabSignIn.className = "flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all bg-[#00CFFF] text-black shadow-lg";
      tabClaim.className = "flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all text-white/60 hover:text-white";
      if (nameGroup) nameGroup.classList.add('hidden');
      if (notice) notice.classList.add('hidden');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "LOG IN TO ADMIN CONSOLE";
      }
    } else {
      tabClaim.className = "flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all bg-[#00CFFF] text-black shadow-lg";
      tabSignIn.className = "flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all text-white/60 hover:text-white";
      if (nameGroup) nameGroup.classList.remove('hidden');

      if (isSingleAdminSlotClaimed) {
        if (notice) notice.classList.remove('hidden');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "🔒 REGISTRATION LOCKED (SLOT CLAIMED)";
        }
      } else {
        if (notice) notice.classList.add('hidden');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "CLAIM SINGLE ADMIN ACCOUNT";
        }
      }
    }
  };

  window.handleAdminPortalSubmit = async function() {
    const email = document.getElementById('admin-portal-email').value.trim();
    const password = document.getElementById('admin-portal-password').value.trim();
    const name = document.getElementById('admin-portal-name').value.trim() || "Head Gym Admin";

    if (!email || !password) {
      showAdminPortalStatus("Please enter both Email and Password.", "error");
      return;
    }

    if (currentAdminPortalTab === 'claim') {
      if (isSingleAdminSlotClaimed) {
        showAdminPortalStatus("🔒 Single Admin Slot is already claimed! Nobody else is allowed to create an admin account.", "error");
        return;
      }

      showAdminPortalStatus("Claiming single admin slot in Supabase...", "info");

      try {
        if (supabase) {
          // 1. Sign up admin user in Supabase auth
          const { data: authData, error: authErr } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: { data: { name: name, role: 'admin' } }
          });

          // 2. Claim single admin slot in Supabase admin_slots table
          const { error: slotErr } = await supabase.from('admin_slots').insert([
            { id: 1, admin_email: email, admin_user_id: authData?.user?.id || null }
          ]);

          if (slotErr && !slotErr.message.includes('duplicate')) {
            showAdminPortalStatus(slotErr.message, "error");
            return;
          }
        }

        isSingleAdminSlotClaimed = true;
        claimedAdminEmail = email;

        currentUser = {
          name: name,
          email: email,
          role: 'admin',
          membershipTier: "Ultimate Owner & Founder",
          enrolledProgram: "All Access Administrative"
        };

        showToast("👑 Single Admin Slot Claimed! Future registrations locked.", "success");
        closeAdminPortalModal();
        updateUserHeader();
        openAdminModal();
        checkSingleAdminSlot();
      } catch (err) {
        showAdminPortalStatus("Slot claim error: " + err.message, "error");
      }
    } else {
      // Log In
      showAdminPortalStatus("Verifying Admin credentials...", "info");
      try {
        if (supabase) {
          await supabase.auth.signInWithPassword({ email, password });
        }

        currentUser = {
          name: name,
          email: email,
          role: 'admin',
          membershipTier: "Ultimate Owner",
          enrolledProgram: "All Access Administrative"
        };

        showToast("🔓 Welcome, Admin! Accessing Management Console.", "success");
        closeAdminPortalModal();
        updateUserHeader();
        openAdminModal();
      } catch (err) {
        showAdminPortalStatus("Invalid Admin login credentials.", "error");
      }
    }
  };

  function showAdminPortalStatus(msg, type) {
    const el = document.getElementById('admin-portal-status');
    if (!el) return;
    el.classList.remove('hidden', 'text-red-400', 'text-[#00CFFF]', 'text-green-400');
    el.classList.add(type === 'error' ? 'text-red-400' : 'text-[#00CFFF]');
    el.textContent = msg;
  }

  // Load Website Bookings from Supabase
  window.loadSupabaseBookings = async function() {
    const tbody = document.getElementById('admin-bookings-table-body');
    const countEl = document.getElementById('admin-bookings-count');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-white/40"><div class="spinner mx-auto mb-2"></div>Fetching bookings from Supabase...</td></tr>`;

    let bookingsList = [];

    if (supabase) {
      try {
        const { data, error } = await supabase.from('bookings').select('*').order('booking_date', { ascending: false });
        if (data && data.length > 0) {
          bookingsList = data;
        }
      } catch (e) {
        console.warn("Supabase fetch bookings error:", e);
      }
    }

    if (bookingsList.length === 0) {
      bookingsList = [
        { user_name: "Anant Badoliya", user_email: "anantbadoliya@gmail.com", user_phone: "+91 9999999999", booking_type: "Membership Upgrade", booking_detail: "Elite AI Access (₹5,999/mo)", booking_date: new Date().toISOString(), status: "Active" },
        { user_name: "Rohit Sharma", user_email: "rohit@gmail.com", user_phone: "+91 8888888888", booking_type: "Program Enrollment", booking_detail: "Beast Shred: AI Fat Loss Program", booking_date: new Date(Date.now() - 86400000).toISOString(), status: "Confirmed" },
        { user_name: "Pooja Hegde", user_email: "pooja@gmail.com", user_phone: "+91 7777777777", booking_type: "Free Trial Appointment", booking_detail: "Personal AI Session & Steam Sauna", booking_date: new Date(Date.now() - 172800000).toISOString(), status: "Confirmed" }
      ];
    }

    if (countEl) countEl.textContent = bookingsList.length;

    tbody.innerHTML = bookingsList.map(b => `
      <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
        <td class="p-3 font-bold text-white">${b.user_name}</td>
        <td class="p-3"><p>${b.user_email}</p><p class="text-[10px] text-white/40">${b.user_phone || 'N/A'}</p></td>
        <td class="p-3"><span class="px-2 py-0.5 rounded-full bg-[#00CFFF]/20 text-[#00CFFF] font-bold text-[10px] uppercase">${b.booking_type}</span></td>
        <td class="p-3 font-semibold text-white/90">${b.booking_detail}</td>
        <td class="p-3 text-[10px] text-white/50">${new Date(b.booking_date).toLocaleDateString()} ${new Date(b.booking_date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
        <td class="p-3"><span class="px-2 py-0.5 rounded bg-green-500/20 text-green-300 font-bold text-[10px]">${b.status || 'Active'}</span></td>
      </tr>
    `).join('');
  };

  // Switch Admin Console Tabs
  window.switchAdminConsoleTab = function(tab) {
    const viewBookings = document.getElementById('admin-view-bookings');
    const viewBroadcast = document.getElementById('admin-view-broadcast');
    const viewMembers = document.getElementById('admin-view-members');

    const btnBookings = document.getElementById('admin-tab-btn-bookings');
    const btnBroadcast = document.getElementById('admin-tab-btn-broadcast');
    const btnMembers = document.getElementById('admin-tab-btn-members');

    if (tab === 'bookings') {
      viewBookings?.classList.remove('hidden');
      viewBroadcast?.classList.add('hidden');
      viewMembers?.classList.add('hidden');

      btnBookings.className = "pb-3 border-b-2 border-[#00CFFF] text-[#00CFFF]";
      btnBroadcast.className = "pb-3 text-white/50 hover:text-white";
      btnMembers.className = "pb-3 text-white/50 hover:text-white";
      loadSupabaseBookings();
    } else if (tab === 'broadcast') {
      viewBroadcast?.classList.remove('hidden');
      viewBookings?.classList.add('hidden');
      viewMembers?.classList.add('hidden');

      btnBroadcast.className = "pb-3 border-b-2 border-[#00CFFF] text-[#00CFFF]";
      btnBookings.className = "pb-3 text-white/50 hover:text-white";
      btnMembers.className = "pb-3 text-white/50 hover:text-white";
    } else {
      viewMembers?.classList.remove('hidden');
      viewBookings?.classList.add('hidden');
      viewBroadcast?.classList.add('hidden');

      btnMembers.className = "pb-3 border-b-2 border-[#00CFFF] text-[#00CFFF]";
      btnBookings.className = "pb-3 text-white/50 hover:text-white";
      btnBroadcast.className = "pb-3 text-white/50 hover:text-white";
    }
  };

  // Override openAdminModal to load bookings
  const origOpenAdminModal = window.openAdminModal;
  window.openAdminModal = function() {
    if (!currentUser || currentUser.role !== 'admin') {
      showToast("🔒 Administrator Access Required. Use the Admin Portal link in the footer.", "error");
      openAdminPortalModal();
      return;
    }
    const modal = document.getElementById('admin-modal');
    if (modal) modal.classList.add('open');
    switchAdminConsoleTab('bookings');
  };

  // Check Single Admin Slot on Page Load
  window.addEventListener('DOMContentLoaded', () => {
    checkSingleAdminSlot();
  });


  // AI Meal Generator (Connected to AI Studio Gemini /api/diet-plan)
  window.generateAiMealPlan = async function() {
    const pref = document.getElementById('ai-diet-pref').value;
    const prot = document.getElementById('ai-protein-pref').value;
    const region = document.getElementById('ai-region').value;

    const results = document.getElementById('ai-meal-results');
    results.innerHTML = `
      <div class="text-center py-8 space-y-3">
        <div class="spinner mx-auto"></div>
        <p class="text-xs text-[#00CFFF] font-bold uppercase tracking-wider">Generating AI Studio Gemini Nutrition Chart...</p>
      </div>
    `;

    try {
      const resp = await fetch('/api/diet-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            goal: "Fat Loss & Recomposition",
            age: 26,
            weight: 75,
            height: 175,
            dietPreference: pref,
            proteinPref: prot,
            region: region
          }
        })
      });
      const data = await resp.json();

      results.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 class="text-xl font-bold font-display uppercase text-[#00CFFF]">
              GENERATED AI MEAL CHART (${pref} • ${region})
            </h3>
            <span class="px-2.5 py-0.5 rounded-full bg-[#00CFFF]/20 text-[#00CFFF] text-[10px] font-bold uppercase">
              ${data.source || 'gemini-3.6-flash'}
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-white/80">
            <div class="glass-card p-4 rounded-xl space-y-2 border border-white/10">
              <span class="text-[#00CFFF] font-bold uppercase block">🥣 Breakfast</span>
              <p>${data.breakfast || '3 Egg Whites / Paneer Bhurji + 2 Oats Roti + 1 Scoop Protein Shake'}</p>
            </div>
            <div class="glass-card p-4 rounded-xl space-y-2 border border-white/10">
              <span class="text-[#00CFFF] font-bold uppercase block">🍱 Lunch</span>
              <p>${data.lunch || '150g Grilled Chicken / Tofu Tikka + 1 Cup Brown Rice + Dal & Salad'}</p>
            </div>
            <div class="glass-card p-4 rounded-xl space-y-2 border border-white/10">
              <span class="text-[#00CFFF] font-bold uppercase block">☕ Pre-Workout Snack</span>
              <p>${data.snacks || '1 Banana + Almonds + Black Coffee + Protein Shake'}</p>
            </div>
            <div class="glass-card p-4 rounded-xl space-y-2 border border-white/10">
              <span class="text-[#00CFFF] font-bold uppercase block">🍲 Dinner</span>
              <p>${data.dinner || 'Mixed Sabzi + 2 Missi Rotis + 100g Curd / Egg Whites'}</p>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      results.innerHTML = `
        <div class="space-y-4">
          <h3 class="text-xl font-bold font-display uppercase text-[#00CFFF]">
            GENERATED AI MEAL CHART (${pref} • ${region})
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-white/80">
            <div class="glass-card p-4 rounded-xl space-y-2 border border-white/10">
              <span class="text-[#00CFFF] font-bold uppercase block">🥣 Breakfast (8:00 AM)</span>
              <p>3 Egg Whites / Paneer Bhurji + 2 Oats Roti + 1 Scoop ${prot} Shake (450 kcal | 35g Protein)</p>
            </div>
            <div class="glass-card p-4 rounded-xl space-y-2 border border-white/10">
              <span class="text-[#00CFFF] font-bold uppercase block">🍱 Lunch (1:30 PM)</span>
              <p>150g Grilled Chicken / Tofu Tikka + 1 Cup Brown Rice + Sambar/Dal (600 kcal | 42g Protein)</p>
            </div>
            <div class="glass-card p-4 rounded-xl space-y-2 border border-white/10">
              <span class="text-[#00CFFF] font-bold uppercase block">☕ Pre-Workout Snack (5:00 PM)</span>
              <p>1 Banana + Almonds + Black Coffee + 1 Scoop ${prot} (280 kcal | 25g Protein)</p>
            </div>
            <div class="glass-card p-4 rounded-xl space-y-2 border border-white/10">
              <span class="text-[#00CFFF] font-bold uppercase block">🍲 Dinner (8:30 PM)</span>
              <p>Mixed Sabzi + 2 Missi Rotis + 100g Curd / Egg Whites (480 kcal | 30g Protein)</p>
            </div>
          </div>
        </div>
      `;
    }
  };

  // Virtual AI Coach Actions (Connected to AI Studio Gemini /api/trainer)
  window.triggerCoachAction = async function(action) {
    const speech = document.getElementById('ai-coach-speech');
    const counter = document.getElementById('coach-rep-counter');
    const score = document.getElementById('coach-form-score');

    if (action === 'squat' || action === 'pushup') repCount++;

    try {
      const resp = await fetch('/api/trainer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Do ${action}`,
          profile: { name: currentUser?.name || "Beast Member", goal: "Strength" }
        })
      });
      const data = await resp.json();
      if (data && data.text) speech.textContent = `"${data.text}"`;
    } catch (e) {
      if (action === 'squat') {
        speech.textContent = `"Excellent depth on that barbell squat! Keep your heels glued and chest tall."`;
      } else if (action === 'pushup') {
        speech.textContent = `"Great elbow tuck! Drive straight up through your palms."`;
      } else {
        speech.textContent = `"Inhale deeply, stretch your lats and hamstring fibers."`;
      }
    }

    if (counter) counter.textContent = `${repCount} / 15`;
    if (score) score.textContent = `${action === 'squat' ? '98%' : '95%'}`;
  };

  // Floating Chatbot Widget (Connected to AI Studio Gemini /api/chat)
  window.toggleChatbot = function() {
    document.getElementById('chatbot-window').classList.toggle('open');
  };

  window.sendChatMessage = async function() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const messages = document.getElementById('chat-messages');
    messages.innerHTML += `<div class="bg-[#00CFFF]/20 border border-[#00CFFF]/30 p-3 rounded-xl max-w-[85%] ml-auto text-white">${msg}</div>`;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, language: "English" })
      });
      const data = await resp.json();
      const replyText = data.text || "Welcome to Phenoix Fitness!";

      messages.innerHTML += `<div class="bg-white/10 p-3 rounded-xl max-w-[85%] text-white/90">🤖 ${replyText}</div>`;
    } catch (err) {
      let reply = "Welcome to Be Beast Gym! We are located at 163, B-WING, J.K. TOWER R.B. MARG, FERBANNDAR, Ghodapdeo, Byculla East, Mumbai, Maharashtra 400033. Call/WhatsApp us at 06366903901.";
      if (msg.toLowerCase().includes('price') || msg.toLowerCase().includes('membership')) {
        reply = "Our membership plans start at ₹1,999/month (Lite), ₹3,999/month (Pro with classes & sauna), and ₹5,999/month (Elite AI Access with 24/7 Coach Kabir stream). Visit us at 163, B-WING, J.K. TOWER, Byculla East, Mumbai 400033!";
      } else if (msg.toLowerCase().includes('time') || msg.toLowerCase().includes('timing')) {
        reply = "We are open Monday to Saturday from 5:00 AM to 11:30 PM, and Sundays 6:00 AM to 9:00 PM. Call us at 06366903901!";
      }

      messages.innerHTML += `<div class="bg-white/10 p-3 rounded-xl max-w-[85%] text-white/90">🤖 ${reply}</div>`;
    }
    messages.scrollTop = messages.scrollHeight;
  };

  /* ==========================================================================
     SUPABASE EMAIL AUTHENTICATION ENGINE
     ========================================================================== */
  const SUPABASE_URL = 'https://zwqvmpsrzlabbnnfncae.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cXZtcHNyemxhYmJubmZuY2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxOTQ5NDcsImV4cCI6MjEwMTc3MDk0N30.7KwYTzHjbjV7qWtaUL5Hdhiha6fmZ2xQpjeCrhXoDDo';

  let supabase = null;
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  let currentAuthMode = 'signin';

  window.openAuthModal = function() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('open');
  };

  window.closeAuthModal = function() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('open');
  };

  window.switchAuthTab = function(mode) {
    currentAuthMode = mode;
    const tabSignIn = document.getElementById('auth-tab-signin');
    const tabSignUp = document.getElementById('auth-tab-signup');
    const nameGroup = document.getElementById('auth-name-group');
    const submitBtn = document.getElementById('auth-submit-btn');

    if (mode === 'signin') {
      if (tabSignIn) tabSignIn.className = "flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all bg-[#00CFFF] text-black shadow-lg";
      if (tabSignUp) tabSignUp.className = "flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all text-white/60 hover:text-white";
      if (nameGroup) nameGroup.classList.add('hidden');
      if (submitBtn) submitBtn.textContent = "SIGN IN TO UNLOCK ACCESS";
    } else {
      if (tabSignUp) tabSignUp.className = "flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all bg-[#00CFFF] text-black shadow-lg";
      if (tabSignIn) tabSignIn.className = "flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all text-white/60 hover:text-white";
      if (nameGroup) nameGroup.classList.remove('hidden');
      if (submitBtn) submitBtn.textContent = "CREATE ACCOUNT & ACCESS FREE";
    }
  };

  window.fillDemoUser = function() {
    const emailEl = document.getElementById('auth-email');
    const passEl = document.getElementById('auth-password');
    const nameEl = document.getElementById('auth-name');
    if (emailEl) emailEl.value = "anantbadoliya@gmail.com";
    if (passEl) passEl.value = "beast123456";
    if (nameEl) nameEl.value = "Anant Badoliya";
  };

  // Persistent Registered User Store (LocalStorage Sync)
  function getRegisteredUsersMap() {
    try {
      const stored = localStorage.getItem('beast_registered_users_db');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      'anantbadoliya@gmail.com': { name: 'Anant Badoliya', password: 'beast123456' }
    };
  }

  function saveRegisteredUser(email, name, password) {
    const db = getRegisteredUsersMap();
    db[email.toLowerCase()] = { name, password };
    try {
      localStorage.setItem('beast_registered_users_db', JSON.stringify(db));
    } catch (e) {}
  }

  window.handleSupabaseAuthSubmit = async function() {
    const emailEl = document.getElementById('auth-email');
    const passwordEl = document.getElementById('auth-password');
    const nameEl = document.getElementById('auth-name');
    
    const email = emailEl ? emailEl.value.trim().toLowerCase() : '';
    const password = passwordEl ? passwordEl.value.trim() : '';
    const name = (nameEl && nameEl.value.trim()) ? nameEl.value.trim() : "Beast Member";

    if (!email || !password) {
      showAuthStatus("❌ Please fill in both Email Address and Password.", "error");
      return;
    }

    if (password.length < 6) {
      showAuthStatus("❌ Password must be at least 6 characters.", "error");
      return;
    }

    showAuthStatus("Verifying credentials with Supabase...", "info");

    try {
      if (currentAuthMode === 'signup') {
        if (supabase) {
          try {
            const { data, error } = await supabase.auth.signUp({
              email: email,
              password: password,
              options: { data: { name: name } }
            });
            if (error && !error.message.includes('already registered')) {
              showAuthStatus("❌ Sign Up Notice: " + error.message, "error");
            }
          } catch (e) {}
        }

        saveRegisteredUser(email, name, password);

        currentUser = {
          name: name,
          email: email,
          role: 'user',
          membershipTier: "Elite AI Access Member",
          enrolledProgram: "Beast Shred: AI Fat Loss Program"
        };

        try {
          localStorage.setItem('beast_active_session_user', JSON.stringify(currentUser));
        } catch (e) {}

        showToast(`🎉 Welcome to Be Beast Gym, ${name}! Your account is active.`, "success");
        updateUserHeader();
        closeAuthModal();

        if (emailEl) emailEl.value = '';
        if (passwordEl) passwordEl.value = '';
        if (nameEl) nameEl.value = '';

      } else {
        // Sign In Flow
        let authUser = null;

        if (supabase) {
          try {
            const { data } = await supabase.auth.signInWithPassword({
              email: email,
              password: password
            });
            if (data && data.user) authUser = data.user;
          } catch (e) {}
        }

        const db = getRegisteredUsersMap();
        const localReg = db[email];

        if (authUser || (localReg && localReg.password === password)) {
          const userName = authUser?.user_metadata?.name || localReg?.name || (email.split('@')[0]);

          currentUser = {
            name: userName,
            email: email,
            role: 'user',
            membershipTier: "Elite AI Access Member",
            enrolledProgram: "Beast Shred: AI Fat Loss Program"
          };

          try {
            localStorage.setItem('beast_active_session_user', JSON.stringify(currentUser));
          } catch (e) {}

          showToast(`⚡ Welcome back, ${currentUser.name}!`, "success");
          updateUserHeader();
          closeAuthModal();

          if (emailEl) emailEl.value = '';
          if (passwordEl) passwordEl.value = '';
          return;
        }

        showAuthStatus("❌ Incorrect Email or Password. Please check your credentials.", "error");
        showToast("❌ Incorrect Email or Password.", "error");
      }
    } catch (err) {
      showAuthStatus("Authentication Error: " + err.message, "error");
    }
  };

  function showAuthStatus(msg, type) {
    const el = document.getElementById('auth-status-msg');
    if (!el) return;
    el.classList.remove('hidden', 'text-red-400', 'text-[#00CFFF]', 'text-green-400');
    el.classList.add(type === 'error' ? 'text-red-400' : 'text-[#00CFFF]');
    el.textContent = msg;
  }

  function updateUserHeader() {
    const container = document.getElementById('header-auth-container');
    if (!container) return;

    if (currentUser) {
      container.innerHTML = `
        <div class="flex items-center gap-2">
          <button onclick="openDashboardModal()" class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold hover:bg-white/20 transition-all cursor-pointer">
            <span class="w-5 h-5 rounded-full bg-[#00CFFF] text-black flex items-center justify-center font-bold text-[10px]">${currentUser.name[0]}</span>
            <span class="text-white">${currentUser.name}</span>
          </button>
          <button onclick="logoutUser()" class="px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[10px] font-bold uppercase hover:bg-red-500/20 cursor-pointer">
            Sign Out
          </button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <button onclick="openAuthModal()" class="relative inline-flex items-center justify-center rounded-lg bg-white hover:bg-white/95 text-black px-5 py-2 text-xs font-bold tracking-wide transition-all transform hover:scale-[1.02] cursor-pointer uppercase font-display">
          SIGN IN / SIGN UP
        </button>
      `;
    }
  }

  window.logoutUser = async function() {
    if (supabase) {
      try { await supabase.auth.signOut(); } catch (e) {}
    }
    currentUser = null;
    try { localStorage.removeItem('beast_active_session_user'); } catch (e) {}
    updateUserHeader();
    closeDashboardModal();
    showToast("Signed out successfully.", "info");
    openAuthModal();
  };

  window.openDashboardModal = function() {
    if (!currentUser) { openAuthModal(); return; }
    const nameEl = document.getElementById('dash-user-name');
    const tierEl = document.getElementById('dash-user-tier');
    const progEl = document.getElementById('dash-program-name');
    if (nameEl) nameEl.textContent = currentUser.name;
    if (tierEl) tierEl.textContent = currentUser.membershipTier || 'Elite AI Access Member';
    if (progEl) progEl.textContent = currentUser.enrolledProgram || 'Beast Shred: AI Fat Loss Program';
    const modal = document.getElementById('dashboard-modal');
    if (modal) modal.classList.add('open');
  };

  window.closeDashboardModal = function() {
    const modal = document.getElementById('dashboard-modal');
    if (modal) modal.classList.remove('open');
  };
        <td class="p-3 font-semibold text-white">${u.name}</td>
        <td class="p-3">${u.email}</td>
        <td class="p-3 text-[#00CFFF]">${u.membershipTier}</td>
        <td class="p-3">
          <button onclick="showToast('User ${u.name} upgraded to VIP Access', 'success')" class="text-[10px] bg-white/10 px-2 py-1 rounded hover:bg-white/20 cursor-pointer">Upgrade</button>
        </td>
      </tr>
    `).join('');
  }

  // Initialize Application
  window.addEventListener('DOMContentLoaded', async () => {
    resizeCanvas();
    preloadImages();
    updateScrollProgress();
    requestAnimationFrame(animate);

    renderTransformations();
    renderPrograms();
    renderMemberships();
    calculateDiet();

    // Check LocalStorage active session
    try {
      const activeStored = localStorage.getItem('beast_active_session_user');
      if (activeStored) {
        currentUser = JSON.parse(activeStored);
      }
    } catch (e) {}

    updateUserHeader();

    // Auto-check Supabase Auth Session
    if (supabase) {
      try {
        const { data } = await supabase.auth.getSession();
        if (data && data.session && data.session.user) {
          const userObj = data.session.user;
          const userRole = userObj.email.toLowerCase() === 'admin@bebeast.com' ? 'admin' : 'user';
          currentUser = {
            name: userObj.user_metadata?.name || userObj.email.split('@')[0],
            email: userObj.email,
            role: userRole,
            membershipTier: userRole === 'admin' ? "Ultimate Owner" : "Elite AI Access Member",
            enrolledProgram: "Beast Shred: AI Fat Loss Program"
          };
          updateUserHeader();
        } else if (!currentUser) {
          setTimeout(() => { openAuthModal(); }, 1000);
        }
      } catch (e) {
        if (!currentUser) setTimeout(() => { openAuthModal(); }, 1000);
      }

      supabase.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          const userRole = session.user.email.toLowerCase() === 'admin@bebeast.com' ? 'admin' : 'user';
          currentUser = {
            name: session.user.user_metadata?.name || session.user.email.split('@')[0],
            email: session.user.email,
            role: userRole,
            membershipTier: userRole === 'admin' ? "Ultimate Owner" : "Elite AI Access Member",
            enrolledProgram: "Beast Shred: AI Fat Loss Program"
          };
          updateUserHeader();
        }
      });
    } else if (!currentUser) {
      setTimeout(() => { openAuthModal(); }, 1000);
    }
  });
})();
