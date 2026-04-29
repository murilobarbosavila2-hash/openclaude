/* =============================================
   Rejane Beauty — Application Logic
   ============================================= */

// ── Google Apps Script API ─────────────────────
const API_URL = 'https://script.google.com/macros/s/AKfycbzi0N2tnMUyCxvWHI6ZwAbynp-X-O1Z4Qa8wCezo83Zqp914szyoHcT6vfI9c8FWeYx/exec';

// ── Dados Reais ────────────────────────────────
const PROFESSIONALS = [
  { id: 1, name: 'Rejane', specialty: 'Manicure, Depilação & Cabelo', emoji: '💇‍♀️', rating: 5.0 },
];

const SERVICES = {
  1: [
    // — Manicure e Pedicure —
    { id: 's1', name: 'Pé',             price: 40,  duration: 90,  icon: '🦶', category: 'Manicure e Pedicure' },
    { id: 's2', name: 'Mão',            price: 30,  duration: 60,  icon: '💅', category: 'Manicure e Pedicure' },
    { id: 's3', name: 'Pé e Mão',       price: 50,  duration: 120, icon: '✨', category: 'Manicure e Pedicure' },
    // — Depilação —
    { id: 's4', name: 'Virilha Completa',price: 50,  duration: 30,  icon: '🌸', category: 'Depilação' },
    { id: 's5', name: 'Meia Perna',      price: 50,  duration: 30,  icon: '🦵', category: 'Depilação' },
    { id: 's6', name: 'Perna Inteira',   price: 100, duration: 60,  icon: '🦵', category: 'Depilação' },
    { id: 's7', name: 'Buço',            price: 15,  duration: 20,  icon: '✋', category: 'Depilação' },
    { id: 's8', name: 'Axilas',          price: 20,  duration: 30,  icon: '🙆‍♀️', category: 'Depilação' },
    // — Cabelo —
    { id: 's9',  name: 'Tintura com sua tinta', price: 30,  duration: 75,  icon: '🎨', category: 'Cabelo' },
    { id: 's10', name: 'Escova',                price: 40,  duration: 60,  icon: '💆‍♀️', category: 'Cabelo' },
    { id: 's11', name: 'Hidratação e Escova',   price: 60,  duration: 120, icon: '💧', category: 'Cabelo' },
    { id: 's12', name: 'Botox',                 price: 60,  duration: 120, icon: '💎', category: 'Cabelo' },
    { id: 's13', name: 'Selamento',             price: 100, duration: 180, icon: '🔥', category: 'Cabelo', pricePrefix: 'A partir de' },
    { id: 's14', name: 'Progressiva',           price: 180, duration: 240, icon: '✂️', category: 'Cabelo', pricePrefix: 'A partir de' },
  ],
};

const WORK_START = 9;   // 9:00
const WORK_END   = 19;  // 19:00
const SLOT_INTERVAL = 30; // minutes

// ── State ──────────────────────────────────────
const state = {
  currentStep: 1,
  selectedPro: null,
  selectedService: null,
  selectedDate: null,
  selectedTime: null,
  weekOffset: 0,
  bookings: JSON.parse(localStorage.getItem('elise_bookings') || '[]'),
};

// ── DOM References ─────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const elBtnBack      = $('#btn-back');
const elBtnDashboard = $('#btn-dashboard');
const elProgressTrack = $('#progress-track');
const elProgressBar  = $('#progress-bar');

// ── Helpers ────────────────────────────────────
const WEEKDAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function formatDate(d) {
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}
function isSameDay(a, b) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}
function isToday(d) { return isSameDay(d, new Date()); }
function isTomorrow(d) {
  const t = new Date(); t.setDate(t.getDate()+1);
  return isSameDay(d, t);
}
function saveBookings() {
  localStorage.setItem('elise_bookings', JSON.stringify(state.bookings));
}

function showToast(msg) {
  const container = $('#toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── Navigation ─────────────────────────────────
function goToStep(n) {
  $$('.step').forEach(s => s.classList.remove('step--active'));
  const isDashboard = n === 'dashboard';
  const isSuccess   = n === 'success';
  const stepId = isDashboard ? 'step-dashboard' : isSuccess ? 'step-success' : `step-${n}`;
  const el = $(`#${stepId}`);
  el.classList.add('step--active');
  // Force re-animation
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = '';

  // Update header
  if (isDashboard || isSuccess) {
    elProgressTrack.classList.add('hidden');
    elBtnBack.classList.toggle('hidden', isSuccess);
  } else {
    elProgressTrack.classList.remove('hidden');
    elBtnBack.classList.toggle('hidden', n === 1);
    state.currentStep = n;
    updateProgress(n);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(step) {
  const pct = ((step - 1) / 3) * 100;
  elProgressBar.style.setProperty('--progress', pct + '%');
  $$('.progress-step').forEach(ps => {
    const s = parseInt(ps.dataset.step);
    ps.classList.toggle('active', s === step);
    ps.classList.toggle('done', s < step);
  });
}

// ── Step 1: Render Professionals ───────────────
function renderProfessionals() {
  const grid = $('#professionals-grid');
  grid.innerHTML = PROFESSIONALS.map(p => `
    <div class="pro-card" data-id="${p.id}" tabindex="0" id="pro-card-${p.id}">
      <div class="pro-avatar">${p.emoji}</div>
      <div class="pro-details">
        <div class="pro-name">${p.name}</div>
        <div class="pro-specialty">${p.specialty}</div>
        <div class="pro-rating">
          ${'★'.repeat(Math.floor(p.rating))}${p.rating % 1 >= 0.5 ? '½' : ''}
          <span style="color:var(--clr-text-muted);margin-left:2px">${p.rating}</span>
        </div>
      </div>
      <div class="pro-arrow">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.pro-card').forEach(card => {
    card.addEventListener('click', () => selectProfessional(parseInt(card.dataset.id)));
    card.addEventListener('keydown', e => { if(e.key==='Enter') selectProfessional(parseInt(card.dataset.id)); });
  });
}

function selectProfessional(id) {
  state.selectedPro = PROFESSIONALS.find(p => p.id === id);
  renderServices();
  goToStep(2);
}

// ── Step 2: Render Services (grouped by category) ──
function formatPrice(svc) {
  const prefix = svc.pricePrefix ? svc.pricePrefix + ' ' : '';
  return `${prefix}R$ ${svc.price},00`;
}

function renderServices() {
  const pro = state.selectedPro;
  $('#step2-subtitle').innerHTML = `Veja o que <strong>${pro.name}</strong> pode fazer por você`;

  // Badge
  $('#selected-pro-badge').innerHTML = `
    <div class="badge-avatar">${pro.emoji}</div>
    <div class="badge-info">
      <div class="badge-name">${pro.name}</div>
      <div class="badge-spec">${pro.specialty} · ★ ${pro.rating}</div>
    </div>
  `;

  // Group services by category
  const services = SERVICES[pro.id] || [];
  const categories = [];
  const catMap = {};
  services.forEach(s => {
    const cat = s.category || 'Outros';
    if (!catMap[cat]) { catMap[cat] = []; categories.push(cat); }
    catMap[cat].push(s);
  });

  const CATEGORY_ICONS = {
    'Manicure e Pedicure': '💅',
    'Depilação': '🌸',
    'Cabelo': '💇‍♀️',
  };

  const list = $('#services-list');
  let html = '';
  categories.forEach(cat => {
    html += `<div class="service-category-header">
      <span class="cat-icon">${CATEGORY_ICONS[cat] || '📋'}</span>
      <span class="cat-label">${cat}</span>
    </div>`;
    catMap[cat].forEach(s => {
      html += `
        <div class="service-card" data-id="${s.id}" id="service-${s.id}">
          <div class="service-icon">${s.icon}</div>
          <div class="service-info">
            <div class="service-name">${s.name}</div>
            <div class="service-duration">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              ${s.duration} min
            </div>
          </div>
          <div class="service-price">${formatPrice(s)}</div>
          <div class="arrow-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>`;
    });
  });
  list.innerHTML = html;

  list.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const svc = services.find(s => s.id === card.dataset.id);
      selectService(svc);
    });
  });
}

function selectService(svc) {
  state.selectedService = svc;
  state.weekOffset = 0;
  renderCalendar();
  goToStep(3);
}

// ── Step 3: Calendar & Time Slots ──────────────
function getWeekDays(offset) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const start = new Date(today);
  start.setDate(start.getDate() + offset * 7);
  if (offset === 0) {
    // start from today
  } else {
    const dow = start.getDay();
    const diff = dow === 0 ? 1 : (dow === 1 ? 0 : 1 - dow);
    start.setDate(start.getDate() + diff);
  }
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

function renderCalendar() {
  const pro = state.selectedPro;
  const svc = state.selectedService;
  $('#step3-subtitle').innerHTML = `Selecione o melhor momento para o seu <strong>${svc.name}</strong>`;
  $('#step3-summary').innerHTML = `
    <span class="sum-emoji">${pro.emoji}</span>
    <span class="sum-text"><strong>${pro.name}</strong> · ${svc.name} · ${svc.duration} min · <strong>${formatPrice(svc)}</strong></span>
  `;

  const days = getWeekDays(state.weekOffset);
  const today = new Date(); today.setHours(0,0,0,0);

  // Month label
  const months = [...new Set(days.map(d => MONTHS[d.getMonth()]))];
  const year = days[0].getFullYear();
  $('#cal-month').textContent = months.join(' / ') + ' ' + year;
  $('#cal-prev').disabled = state.weekOffset <= 0;

  // Day cells
  const row = $('#days-row');
  row.innerHTML = days.map((d, i) => {
    const isPast = d < today;
    const isSunday = d.getDay() === 0;
    const isActive = state.selectedDate && isSameDay(d, state.selectedDate);
    const cls = [
      'day-cell',
      isPast || isSunday ? 'disabled' : '',
      isActive ? 'active' : '',
      isToday(d) ? 'today' : '',
    ].filter(Boolean).join(' ');
    return `<div class="${cls}" data-idx="${i}">
      <span class="day-label">${WEEKDAYS[d.getDay()]}</span>
      <span class="day-num">${d.getDate()}</span>
    </div>`;
  }).join('');

  row.querySelectorAll('.day-cell:not(.disabled)').forEach(cell => {
    cell.addEventListener('click', () => {
      const idx = parseInt(cell.dataset.idx);
      state.selectedDate = days[idx];
      state.selectedTime = null;
      renderCalendar();
      renderTimeSlots();
    });
  });

  if (state.selectedDate) {
    renderTimeSlots();
  } else {
    $('#timeslots-grid').innerHTML = '<div class="no-slots">Selecione um dia para ver os horários</div>';
    $('#btn-continue-time').classList.add('hidden');
  }
}

function renderTimeSlots() {
  const svc = state.selectedService;
  const pro = state.selectedPro;
  const date = state.selectedDate;
  const grid = $('#timeslots-grid');
  const now = new Date();

  // Generate all slots
  const slots = [];
  for (let h = WORK_START; h < WORK_END; h++) {
    for (let m = 0; m < 60; m += SLOT_INTERVAL) {
      const endH = h + Math.floor((m + svc.duration) / 60);
      const endM = (m + svc.duration) % 60;
      if (endH > WORK_END || (endH === WORK_END && endM > 0)) continue;
      slots.push({
        hour: h, minute: m,
        label: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`,
        endLabel: `${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}`,
      });
    }
  }

  // Check existing bookings for this professional & date
  const bookedSlots = state.bookings.filter(b =>
    b.proId === pro.id && isSameDay(new Date(b.date), date)
  );

  grid.innerHTML = slots.map(slot => {
    const slotStart = slot.hour * 60 + slot.minute;
    const slotEnd = slotStart + svc.duration;
    const taken = bookedSlots.some(b => {
      const bStart = b.startMin;
      const bEnd = bStart + b.duration;
      return slotStart < bEnd && slotEnd > bStart;
    });

    const isPast = isToday(date) && (slot.hour < now.getHours() || (slot.hour === now.getHours() && slot.minute <= now.getMinutes()));
    const isActive = state.selectedTime === slot.label;

    const cls = [
      'timeslot',
      taken ? 'taken' : '',
      isPast ? 'taken' : '',
      isActive ? 'active' : '',
    ].filter(Boolean).join(' ');

    return `<div class="${cls}" data-time="${slot.label}" data-end="${slot.endLabel}">${slot.label}</div>`;
  }).join('');

  if (slots.length === 0) {
    grid.innerHTML = '<div class="no-slots">Nenhum horário disponível neste dia</div>';
  }

  grid.querySelectorAll('.timeslot:not(.taken)').forEach(el => {
    el.addEventListener('click', () => {
      state.selectedTime = el.dataset.time;
      state.selectedTimeEnd = el.dataset.end;
      renderTimeSlots();
      $('#btn-continue-time').classList.remove('hidden');
    });
  });

  $('#btn-continue-time').classList.toggle('hidden', !state.selectedTime);
}

// ── Step 4: Booking Summary & Form ─────────────
function renderBookingSummary() {
  const { selectedPro: pro, selectedService: svc, selectedDate: date, selectedTime: time } = state;
  const card = $('#booking-summary-card');
  card.innerHTML = `
    <div class="bsc-row">
      <div class="bsc-icon">👤</div>
      <div><div class="bsc-label">Profissional</div><div class="bsc-value">${pro.name}</div></div>
    </div>
    <div class="bsc-row">
      <div class="bsc-icon">${svc.icon}</div>
      <div><div class="bsc-label">Serviço</div><div class="bsc-value">${svc.name} · ${svc.duration} min</div></div>
    </div>
    <div class="bsc-row">
      <div class="bsc-icon">📅</div>
      <div><div class="bsc-label">Data</div><div class="bsc-value">${WEEKDAYS[date.getDay()]}, ${formatDate(date)}</div></div>
    </div>
    <div class="bsc-row">
      <div class="bsc-icon">🕐</div>
      <div><div class="bsc-label">Horário</div><div class="bsc-value">${time} – ${state.selectedTimeEnd}</div></div>
    </div>
    <div class="bsc-row">
      <div class="bsc-icon">💰</div>
      <div><div class="bsc-label">Valor</div><div class="bsc-value" style="color:var(--clr-primary)">${formatPrice(svc)}</div></div>
    </div>
  `;
}

// ── Confirm Booking ────────────────────────────
function confirmBooking(name, email) {
  const { selectedPro: pro, selectedService: svc, selectedDate: date, selectedTime: time } = state;
  const priceLabel = formatPrice(svc);
  const booking = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2,6),
    clientName: name,
    clientEmail: email,
    proId: pro.id,
    proName: pro.name,
    proEmoji: pro.emoji,
    serviceName: svc.name,
    serviceIcon: svc.icon,
    price: svc.price,
    priceLabel: priceLabel,
    duration: svc.duration,
    date: date.toISOString(),
    time: time,
    timeEnd: state.selectedTimeEnd,
    startMin: parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]),
    createdAt: new Date().toISOString(),
  };
  state.bookings.push(booking);
  saveBookings();

  // POST to Google Apps Script
  sendToAPI(booking);

  renderSuccess(booking);
  goToStep('success');
  showToast('✅ Agendamento realizado com sucesso!');
}

async function sendToAPI(booking) {
  try {
    // Build ISO datetime string: combine date + time with BRT offset (-03:00)
    const d = new Date(booking.date);
    const year  = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day   = String(d.getDate()).padStart(2, '0');
    const dataHora = `${year}-${month}-${day}T${booking.time}:00-03:00`;

    const payload = {
      nome:     booking.clientName,
      email:    booking.clientEmail,
      servico:  booking.serviceName,
      dataHora: dataHora,
      duracao:  booking.duration,
    };

    console.log("Enviando agendamento:", payload);

    await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('Erro ao enviar para API:', err);
  }
}

function renderSuccess(booking) {
  $('#success-details').innerHTML = `
    <div class="sd-row"><span class="sd-label">Cliente:</span><span class="sd-value">${booking.clientName}</span></div>
    <div class="sd-row"><span class="sd-label">Profissional:</span><span class="sd-value">${booking.proName}</span></div>
    <div class="sd-row"><span class="sd-label">Serviço:</span><span class="sd-value">${booking.serviceName}</span></div>
    <div class="sd-row"><span class="sd-label">Data:</span><span class="sd-value">${formatDate(new Date(booking.date))}</span></div>
    <div class="sd-row"><span class="sd-label">Horário:</span><span class="sd-value">${booking.time} – ${booking.timeEnd}</span></div>
    <div class="sd-row"><span class="sd-label">Valor:</span><span class="sd-value">${booking.priceLabel || 'R$ ' + booking.price + ',00'}</span></div>
    <div class="sd-row"><span class="sd-label">E-mail:</span><span class="sd-value">${booking.clientEmail}</span></div>
  `;
}

// ── Event Listeners ────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProfessionals();

  // Back button
  elBtnBack.addEventListener('click', () => {
    const s = state.currentStep;
    if ($('#step-dashboard').classList.contains('step--active')) {
      goToStep(state.currentStep || 1);
      return;
    }
    if (s > 1) {
      if (s === 3) { state.selectedDate = null; state.selectedTime = null; }
      goToStep(s - 1);
    }
  });

  // Dashboard — Painel da Rejane
  elBtnDashboard.addEventListener('click', () => {
    goToStep('dashboard');
  });

  // Voltar para o site (from dashboard)
  $('#btn-back-site').addEventListener('click', () => {
    goToStep(state.currentStep || 1);
  });

  // Calendar nav
  $('#cal-prev').addEventListener('click', () => {
    state.weekOffset = Math.max(0, state.weekOffset - 1);
    state.selectedDate = null; state.selectedTime = null;
    renderCalendar();
  });
  $('#cal-next').addEventListener('click', () => {
    state.weekOffset++;
    state.selectedDate = null; state.selectedTime = null;
    renderCalendar();
  });

  // Continue from time selection
  $('#btn-continue-time').addEventListener('click', () => {
    if (!state.selectedTime) return;
    renderBookingSummary();
    goToStep(4);
  });

  // Form submit
  $('#client-form').addEventListener('submit', e => {
    e.preventDefault();
    const name  = $('#client-name').value.trim();
    const email = $('#client-email').value.trim();
    if (name.length < 3) { showToast('⚠️ Nome deve ter pelo menos 3 caracteres'); return; }
    if (!email.includes('@')) { showToast('⚠️ E-mail inválido'); return; }
    confirmBooking(name, email);
    $('#client-form').reset();
  });

  // New booking
  $('#btn-new-booking').addEventListener('click', () => {
    state.selectedPro = null;
    state.selectedService = null;
    state.selectedDate = null;
    state.selectedTime = null;
    state.weekOffset = 0;
    goToStep(1);
  });
});
