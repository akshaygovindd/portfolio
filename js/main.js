document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- RENDER: EXPERIENCE ---------- */
function renderExperience(){
  const el = document.getElementById('experience-list');
  el.innerHTML = EXPERIENCE.map(exp => `
    <div class="timeline-item reveal">
      <div class="exp-card">
        <div class="exp-head">
          <h3>${exp.title}</h3>
          <span class="date">${exp.date}</span>
        </div>
        <div class="exp-org">${exp.org} · ${exp.location}</div>
        <ul class="exp-list">
          ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
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
    <button class="project-card reveal" data-project="${p.id}" aria-haspopup="dialog">
      <div class="proj-top">
        <h3>${p.name}</h3>
        <span class="proj-arrow">view details ↗</span>
      </div>
      <div class="proj-stack">
        ${p.stack.map(s => `<span class="tag">${s}</span>`).join('')}
      </div>
      <p class="proj-desc">${p.shortDesc}</p>
      <div class="proj-metrics">
        ${p.metrics.map(m => `<span class="metric">${m}</span>`).join('')}
      </div>
    </button>
  `).join('');

  el.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.project));
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
    ? p.images.map(src => `<div class="shot"><img src="${src}" alt="${p.name} screenshot" loading="lazy"></div>`).join('')
    : `<div class="shot">screenshot coming soon</div><div class="shot">screenshot coming soon</div>`;

  const decisions = p.decisions.length ? `
    <div class="modal-section-title">Technical decisions</div>
    <div class="modal-decisions">
      ${p.decisions.map(d => `<div class="decision"><h5>${d.title}</h5><p>${d.detail}</p></div>`).join('')}
    </div>
  ` : '';

  modalPanel.innerHTML = `
    <button class="modal-close" aria-label="Close project details">×</button>
    <h2 class="modal-title">${p.name}</h2>
    <div class="modal-stack">${p.stack.map(s => `<span class="tag">${s}</span>`).join('')}</div>
    <div class="modal-desc">${p.longDesc.map(par => `<p>${par}</p>`).join('')}</div>
    <div class="modal-metrics">${p.metrics.map(m => `<span class="metric">${m}</span>`).join('')}</div>
    <div class="modal-section-title">Screenshots</div>
    <div class="modal-gallery">${gallery}</div>
    ${decisions}
    <div class="modal-links">
      <a class="btn btn-ghost" href="${p.github}" target="_blank" rel="noopener">↗ View on GitHub</a>
      ${p.demo ? `<a class="btn btn-primary" href="${p.demo}" target="_blank" rel="noopener">↗ Live demo</a>` : ''}
    </div>
  `;

  modalPanel.querySelector('.modal-close').addEventListener('click', closeModal);

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
  if(e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});

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

  const sections = ['home','experience','skills','projects','contact']
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
  scrambleReveal(h1, h1.textContent.trim());
}

/* ---------- HERO SVG LINE CHART ---------- */
function initHeroChart(){
  const path = document.getElementById('hero-line');
  const dot = document.getElementById('hero-dot');
  if(!path || !dot) return;

  const length = path.getTotalLength();

  if(prefersReducedMotion){
    path.style.strokeDasharray = 'none';
    dot.style.display = 'none';
    return;
  }

  path.style.strokeDasharray = String(length);
  path.style.strokeDashoffset = String(length);
  path.animate(
    [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
    { duration: 1800, easing: 'ease-out', fill: 'forwards' }
  );

  const loopDuration = 6000;
  let start = null;
  function step(ts){
    if(start === null) start = ts;
    const elapsed = (ts - start) % loopDuration;
    const progress = elapsed / loopDuration;
    const point = path.getPointAtLength(progress * length);
    dot.setAttribute('cx', point.x);
    dot.setAttribute('cy', point.y);
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
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
