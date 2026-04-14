
// ── État global ──────────────────────────────────────────────
const state = {
    projet:  null,
    surface: null,
    budget:  null,
    date:    null,
    slot:    null,
    prenom:  '', nom: '', tel: '', email: '', adresse: '', message: ''
};
let currentStep = 1;

// ── Gestion des cartes à choix ────────────────────────────────
document.querySelectorAll('.choice-card').forEach(card => {
    card.addEventListener('click', () => {
        const group = card.dataset.group;
        document.querySelectorAll(`.choice-card[data-group="${group}"]`).forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state[group] = card.dataset.val;
    });
});

// ── Navigation étapes ────────────────────────────────────────
function goToStep(n) {
    // Panels
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`panel-${n}`) || document.getElementById('panel-ok');
    if (target) target.classList.add('active');

    // Stepper bubbles
    document.querySelectorAll('.step-item').forEach(item => {
        const s = parseInt(item.dataset.step);
        item.classList.remove('active', 'done');
        if (s < n)  item.classList.add('done');
        if (s === n) item.classList.add('active');
    });

    currentStep = n;
    window.scrollTo({ top: document.querySelector('.rdv-section').offsetTop - 80, behavior: 'smooth' });
}

function nextStep(from) {
    // Validations simples
    if (from === 1 && !state.projet)  { alert('Veuillez sélectionner un type de projet.'); return; }
    if (from === 2 && (!state.surface || !state.budget)) { alert('Veuillez sélectionner une surface et un budget.'); return; }
    if (from === 3 && (!state.date || !state.slot))     { alert('Veuillez sélectionner une date et un créneau.'); return; }
    if (from === 4) {
        const p = document.getElementById('f-prenom').value.trim();
        const n = document.getElementById('f-nom').value.trim();
        const t = document.getElementById('f-tel').value.trim();
        const e = document.getElementById('f-email').value.trim();
        const a = document.getElementById('f-adresse').value.trim();
        if (!p || !n || !t || !e || !a) { alert('Veuillez remplir tous les champs obligatoires.'); return; }
        Object.assign(state, { prenom: p, nom: n, tel: t, email: e, adresse: a,
            message: document.getElementById('f-message').value.trim() });
        buildRecap();
    }
    goToStep(from + 1);
}
function prevStep(from) { goToStep(from - 1); }

// ── Soumission finale ────────────────────────────────────────
function submitRdv() {
    // Ici vous brancheriez un appel AJAX / fetch vers votre backend
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-ok').classList.add('active');
    document.querySelectorAll('.step-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.step-item').forEach(i => i.classList.add('done'));
}

// ── Récapitulatif ────────────────────────────────────────────
function buildRecap() {
    const items = [
        { icon: 'fa-tools',      label: 'Projet',      val: state.projet  },
        { icon: 'fa-ruler-combined', label: 'Surface',  val: state.surface },
        { icon: 'fa-coins',      label: 'Budget',       val: state.budget  },
        { icon: 'fa-calendar-alt', label: 'Date',       val: state.date    },
        { icon: 'fa-clock',      label: 'Créneau',      val: state.slot    },
        { icon: 'fa-user',       label: 'Nom',          val: `${state.prenom} ${state.nom}` },
        { icon: 'fa-phone',      label: 'Téléphone',    val: state.tel     },
        { icon: 'fa-envelope',   label: 'Email',        val: state.email   },
        { icon: 'fa-map-marker-alt', label: 'Adresse',  val: state.adresse },
    ];
    if (state.message) items.push({ icon: 'fa-comment', label: 'Message', val: state.message });

    document.getElementById('recap-grid').innerHTML = items.map(it => `
        <div class="recap-item">
            <div class="ri-icon"><i class="fas ${it.icon}"></i></div>
            <div class="ri-content">
                <div class="ri-label">${it.label}</div>
                <div class="ri-value">${it.val || '—'}</div>
            </div>
        </div>`).join('');
}

// ── Calendrier ───────────────────────────────────────────────
let calDate = new Date();
calDate.setDate(1);

const DAYS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin',
                'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function renderCal() {
    const yr = calDate.getFullYear();
    const mo = calDate.getMonth();
    document.getElementById('cal-month-label').textContent = `${MONTHS[mo]} ${yr}`;
    const grid = document.getElementById('cal-grid');
    grid.innerHTML = '';
    DAYS.forEach(d => { const el = document.createElement('div'); el.className = 'cal-day-name'; el.textContent = d; grid.appendChild(el); });

    // Premier jour de la semaine (lundi = 0)
    const firstDay = new Date(yr, mo, 1);
    let startWd = firstDay.getDay(); // 0=dim
    startWd = (startWd === 0) ? 6 : startWd - 1;

    for (let i = 0; i < startWd; i++) {
        const el = document.createElement('div'); el.className = 'cal-day empty'; grid.appendChild(el);
    }
    const daysInMonth = new Date(yr, mo + 1, 0).getDate();
    const today = new Date();

    for (let d = 1; d <= daysInMonth; d++) {
        const el = document.createElement('div');
        el.className = 'cal-day';
        el.textContent = d;
        const thisDate = new Date(yr, mo, d);
        const isWeekend = thisDate.getDay() === 0 || thisDate.getDay() === 6;
        const isPast = thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (isWeekend || isPast) {
            el.classList.add('disabled');
        } else {
            if (thisDate.toDateString() === today.toDateString()) el.classList.add('today');
            const dateStr = `${d < 10 ? '0'+d : d}/${(mo+1) < 10 ? '0'+(mo+1) : (mo+1)}/${yr}`;
            if (state.date === dateStr) el.classList.add('selected');
            el.addEventListener('click', () => {
                document.querySelectorAll('.cal-day').forEach(c => c.classList.remove('selected'));
                el.classList.add('selected');
                state.date = dateStr;
                document.getElementById('slots-selected-date').textContent = `Créneaux pour le ${dateStr} :`;
                // Reset slot selection
                document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
                state.slot = null;
            });
        }
        grid.appendChild(el);
    }
}

function changeMonth(dir) {
    calDate.setMonth(calDate.getMonth() + dir);
    renderCal();
}

// Créneaux
document.querySelectorAll('.slot:not(.full)').forEach(s => {
    s.addEventListener('click', () => {
        document.querySelectorAll('.slot').forEach(x => x.classList.remove('selected'));
        s.classList.add('selected');
        state.slot = s.dataset.slot;
    });
});

// Init
renderCal();

