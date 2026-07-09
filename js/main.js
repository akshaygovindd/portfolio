document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- HELPERS: metric counters & image alt text ---------- */
function renderMetric(text){
  const match = text.match(/[\d,]+\.?\d+/);
  if(!match) return `<span class="metric">${text}</span>`;
  const numStr = match[0];
  const prefix = text.slice(0, match.index);
  const suffix = text.slice(match.index + numStr.length);
  return `<span class="metric">${prefix}<span class="counter" data-target="${numStr}">0</span>${suffix}</span>`;
}

function animateCounter(el, duration = 1200){
  const targetStr = el.dataset.target;
  const target = parseFloat(targetStr.replace(/,/g, ''));
  if(isNaN(target) || prefersReducedMotion){ el.textContent = targetStr; return; }
  const decimals = targetStr.includes('.') ? targetStr.split('.')[1].length : 0;
  const start = performance.now();
  function step(ts){
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = decimals ? current.toFixed(decimals) : Math.round(current).toLocaleString();
    if(progress < 1) requestAnimationFrame(step);
    else el.textContent = targetStr;
  }
  requestAnimationFrame(step);
}

function initCounters(){
  const counters = document.querySelectorAll('#project-grid .counter');
  if(!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

function altFromPath(path, projectName){
  const filename = path.split('/').pop().replace(/\.[^.]+$/, '');
  const label = filename.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `${projectName} — ${label}`;
}

/* ---------- RENDER: EXPERIENCE + EDUCATION (combined timeline) ---------- */
function renderExperience(){
  const timeline = [
    { type: 'education', title: EDUCATION[0].degree, org: EDUCATION[0].school, location: EDUCATION[0].location, date: EDUCATION[0].date, bullets: [] },
    ...EXPERIENCE.map(e => ({ type: 'work', ...e })),
    { type: 'education', title: EDUCATION[1].degree, org: EDUCATION[1].school, location: EDUCATION[1].location, date: EDUCATION[1].date, bullets: [] }
  ];
  const el = document.getElementById('experience-list');
  el.innerHTML = timeline.map(item => `
    <div class="timeline-item reveal">
      <div class="exp-card">
        <div class="exp-head">
          <h3>${item.title}</h3>
          <span class="date">${item.date}</span>
        </div>
        <div class="exp-org">${item.org} · ${item.location} ${item.type === 'education' ? '<span class="role-badge">Education</span>' : ''}</div>
        ${item.bullets.length ? `<ul class="exp-list">${item.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
      </div>
    </div>
  `).join('');
}

/* ---------- RENDER: SKILLS ---------- */
function renderSkills(){
  const el = document.getElementById('skills-grid');
  el.innerHTML = SKILLS.map(group => `
    <div class="skill-card reveal">
      <h4>${group.category}</h4>
      <div class="tagrow">
        ${group.items.map(i => `<span class="tag">${i}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

/* ---------- RENDER: PROJECTS ---------- */
function renderProjects(){
  const el = document.getElementById('project-grid');
  el.innerHTML = PROJECTS.map(p => `
    <button class="project-card reveal" data-project="${p.id}" data-role="${p.role}" aria-haspopup="dialog">
      ${p.images.length ? `<div class="proj-thumb"><img src="${p.images[0]}" alt="${altFromPath(p.images[0], p.name)}" loading="lazy"></div>` : ''}
      <div class="proj-top">
        <div class="proj-title-row">
          <h3>${p.name}</h3>
          <span class="role-badge">${p.role}</span>
        </div>
        <span class="proj-arrow">view details ↗</span>
      </div>
      <div class="proj-stack">
        ${p.stack.map(s => `<span class="tag">${s}</span>`).join('')}
      </div>
      <p class="proj-desc">${p.shortDesc}</p>
      <div class="proj-metrics">
        ${p.metrics.map(renderMetric).join('')}
      </div>
    </button>
  `).join('');

  el.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.project));
  });

  initCounters();
}

/* ---------- PROJECT FILTER ---------- */
function initProjectFilter(){
  const container = document.getElementById('project-filter');
  if(!container) return;
  const roles = ['All', 'Data Analyst', 'Data Engineer'];
  container.innerHTML = roles.map((r, i) => `<button class="filter-btn${i === 0 ? ' active' : ''}" data-role="${r}">${r}</button>`).join('');

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const role = btn.dataset.role;
      document.querySelectorAll('.project-card').forEach(card => {
        const cardRole = card.dataset.role;
        const match = role === 'All' || cardRole === role || cardRole === 'Both';
        card.classList.toggle('filtered-out', !match);
      });
    });
  });
}

/* ---------- RENDER: CONTACT ---------- */
function renderContact(){
  document.getElementById('contact-email').textContent = CONTACT.email;
  document.getElementById('contact-email').href = `mailto:${CONTACT.email}`;
  document.getElementById('contact-phone').textContent = CONTACT.phone;
  document.getElementById('contact-phone').href = `tel:+1${CONTACT.phone.replace(/\D/g,'')}`;
  document.getElementById('contact-linkedin').textContent = CONTACT.linkedinLabel;
  document.getElementById('contact-linkedin').href = CONTACT.linkedin;
  document.getElementById('contact-github').textContent = CONTACT.githubLabel;
  document.getElementById('contact-github').href = CONTACT.github;
  document.getElementById('contact-location').textContent = CONTACT.location;
  document.getElementById('resume-link').href = 'assets/resume.pdf';
  document.getElementById('resume-link-mobile').href = 'assets/resume.pdf';
}

/* ---------- PROJECT MODAL ---------- */
const modalOverlay = document.getElementById('modal-overlay');
const modalPanel = document.getElementById('modal-panel');
let lastFocusedEl = null;

function openModal(projectId){
  const p = PROJECTS.find(x => x.id === projectId);
  if(!p) return;

  const gallery = p.images.length
    ? p.images.map(src => `<div class="shot"><img src="${src}" alt="${altFromPath(src, p.name)}" loading="lazy"></div>`).join('')
    : `<div class="shot">screenshot coming soon</div><div class="shot">screenshot coming soon</div>`;

  const decisions = p.decisions.length ? `
    <div class="modal-section-title">Technical decisions</div>
    <div class="modal-decisions">
      ${p.decisions.map(d => `<div class="decision"><h5>${d.title}</h5><p>${d.detail}</p></div>`).join('')}
    </div>
  ` : '';

  const architecture = p.architecture ? `
    <div class="modal-section-title">Architecture</div>
    <div class="modal-architecture">
      ${p.architecture.map((stage, i) => `
        <div class="arch-stage">${stage}</div>${i < p.architecture.length - 1 ? '<span class="arch-arrow">→</span>' : ''}
      `).join('')}
    </div>
  ` : '';

  const githubStats = p.githubStats ? `
    <div class="modal-github-stats">
      <span>${p.githubStats.commits} commits</span>
      <span>${p.githubStats.language}</span>
      <span>Updated ${p.githubStats.updated}</span>
    </div>
  ` : '';

  modalPanel.innerHTML = `
    <button class="modal-close" aria-label="Close project details">×</button>
    <div class="modal-title-row">
      <h2 class="modal-title">${p.name}</h2>
      <span class="role-badge">${p.role}</span>
    </div>
    <div class="modal-stack">${p.stack.map(s => `<span class="tag">${s}</span>`).join('')}</div>
    <div class="modal-desc">${p.longDesc.map(par => `<p>${par}</p>`).join('')}</div>
    <div class="modal-metrics">${p.metrics.map(renderMetric).join('')}</div>
    ${architecture}
    <div class="modal-section-title">Screenshots</div>
    <div class="modal-gallery">${gallery}</div>
    ${decisions}
    <div class="modal-links">
      <a class="btn btn-ghost" href="${p.github}" target="_blank" rel="noopener">↗ View on GitHub</a>
      ${p.demo ? `<a class="btn btn-primary" href="${p.demo}" target="_blank" rel="noopener">↗ Live demo</a>` : ''}
    </div>
    ${githubStats}
  `;

  modalPanel.querySelector('.modal-close').addEventListener('click', closeModal);
  modalPanel.querySelectorAll('.counter').forEach(c => animateCounter(c));

  lastFocusedEl = document.activeElement;
  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalPanel.querySelector('.modal-close').focus();
}

function closeModal(){
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if(lastFocusedEl) lastFocusedEl.focus();
}

modalOverlay.addEventListener('click', (e) => {
  if(e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox-overlay');
  const lightboxOpen = lightbox && lightbox.classList.contains('open');
  if(e.key === 'Escape' && modalOverlay.classList.contains('open') && !lightboxOpen) closeModal();
});

// Focus trap: keep Tab cycling inside the modal while it's open
document.addEventListener('keydown', (e) => {
  if(e.key !== 'Tab' || !modalOverlay.classList.contains('open')) return;
  const focusable = modalPanel.querySelectorAll('button, a[href]');
  if(!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if(e.shiftKey && document.activeElement === first){
    e.preventDefault();
    last.focus();
  } else if(!e.shiftKey && document.activeElement === last){
    e.preventDefault();
    first.focus();
  }
});

/* ---------- LIGHTBOX ---------- */
function initLightbox(){
  const overlay = document.getElementById('lightbox-overlay');
  const img = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  if(!overlay) return;

  function openLightbox(src, alt){
    img.src = src;
    img.alt = alt;
    overlay.classList.add('open');
  }
  function closeLightbox(){
    overlay.classList.remove('open');
  }

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => { if(e.target === overlay) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && overlay.classList.contains('open')) closeLightbox(); });
  document.addEventListener('click', (e) => {
    const shotImg = e.target.closest('.modal-gallery .shot img');
    if(shotImg) openLightbox(shotImg.src, shotImg.alt);
  });
}

/* ---------- NAV: mobile toggle + smooth scroll + active link ---------- */
function initNav(){
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if(!target) return;
      e.preventDefault();
      links.classList.remove('open');
      toggle.classList.remove('open');
      const navH = document.querySelector('header').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navH + 1;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  const sections = ['home','projects','experience','skills','about','contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  const navAnchors = document.querySelectorAll('.navlinks a');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => io.observe(s));
}

/* ---------- SCROLL REVEAL ---------- */
function initReveal(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

/* ---------- HERO HEADLINE SCRAMBLE-DECODE ---------- */
function scrambleReveal(el, finalText, { charDelay = 40, scrambleTime = 380, stagger = 30 } = {}){
  const glitchChars = "!<>-_\\/[]{}=+*^?#01";
  el.setAttribute('aria-label', finalText);
  el.innerHTML = finalText.split('').map(ch =>
    `<span class="scramble-char" aria-hidden="true">${ch === ' ' ? '&nbsp;' : ch}</span>`
  ).join('');

  el.querySelectorAll('.scramble-char').forEach((span, i) => {
    const target = finalText[i];
    if(target === ' ') return;
    setTimeout(() => {
      let ticks = 0;
      const maxTicks = Math.round(scrambleTime / charDelay);
      const interval = setInterval(() => {
        ticks++;
        if(ticks >= maxTicks){
          clearInterval(interval);
          span.textContent = target;
          span.classList.add('settled');
        } else {
          span.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
      }, charDelay);
    }, i * stagger);
  });
}

function initHeadlineScramble(){
  const h1 = document.querySelector('.hero-content h1');
  if(!h1 || prefersReducedMotion) return;
  scrambleReveal(h1, h1.textContent.trim(), { charDelay: 32, scrambleTime: 290, stagger: 24 });
}

/* ---------- HERO SVG LINE CHART (3 layered trend lines) ---------- */
function initHeroChart(){
  const lines = [...document.querySelectorAll('.hero-line')];
  const dots = [...document.querySelectorAll('.hero-dot')];
  if(!lines.length) return;

  if(prefersReducedMotion){
    lines.forEach(l => { l.style.strokeDasharray = 'none'; });
    dots.forEach(d => { d.style.display = 'none'; });
    return;
  }

  // back line draws in first (slower reveal), front line last (snappier) —
  // reads as the foreground trend "arriving" after the ambient depth layers.
  const order = [2, 1, 0]; // indices into `lines`, back-to-front z order is 3,2,1 in the DOM already
  lines.forEach((path, i) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    const drawIndex = order.indexOf(i);
    path.animate(
      [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
      { duration: 1400 + i * 300, delay: drawIndex * 250, easing: 'ease-out', fill: 'forwards' }
    );

    const dot = dots[i];
    if(!dot) return;
    const loopDuration = 4200 + i * 2600;
    const phaseOffset = i * 700;
    let start = null;
    function step(ts){
      if(start === null) start = ts - phaseOffset;
      const elapsed = Math.max(0, ts - start) % loopDuration;
      const progress = elapsed / loopDuration;
      const point = path.getPointAtLength(progress * length);
      dot.setAttribute('cx', point.x);
      dot.setAttribute('cy', point.y);
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* ---------- CONTACT FORM (mailto, no backend) ---------- */
function initContactForm(){
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
  });
}

/* ---------- INIT ---------- */
renderExperience();
renderSkills();
renderProjects();
renderContact();
initNav();
initReveal();
initHeadlineScramble();
initHeroChart();
initContactForm();
initProjectFilter();
initLightbox();
