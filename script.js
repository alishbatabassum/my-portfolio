
/* ===== CUSTOM CURSOR ===== */
(() => {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.setAttribute('aria-hidden','true');
  const trail = document.createElement('div');
  trail.className = 'cursor-trail';
  trail.setAttribute('aria-hidden','true');
  document.body.append(cursor, trail);

  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;
  window.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });

  const animate = () => {
    tx += (x - tx) * 0.18;
    ty += (y - ty) * 0.18;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
    trail.style.left = `${tx}px`;
    trail.style.top = `${ty}px`;
    requestAnimationFrame(animate);
  };
  animate();

  const interactive = 'a, button, .project-card, .skill-card, .service-card, .education-card, .journey-card, .contact-link, .contact-form, .editor-window, input, textarea';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactive)) cursor.classList.add('is-hover');
  });
  document.addEventListener('mouseout', e => {
    if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(interactive)) {
      cursor.classList.remove('is-hover');
    }
  });
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    trail.style.opacity = '.42';
  });
})();
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const root = document.documentElement;
const nav = $('#nav');
const navLinks = $('#navLinks');
const navToggle = $('#navToggle');
const themeToggle = $('#themeToggle');
const progress = $('#scrollProgress');
const backTop = $('#backTop');
const toast = $('#toast');

/* Mobile navigation */
function closeMenu(){
  navLinks.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded','false');
  navToggle.setAttribute('aria-label','Open menu');
}
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
$$('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));

/* Dark / light mode */
const savedTheme = localStorage.getItem('alishba-theme');
if(savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
function updateThemeButton(){
  const light = root.dataset.theme === 'light';
  themeToggle.innerHTML = `<span class="theme-icon">${light ? '☾' : '☼'}</span>`;
  themeToggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  themeToggle.title = light ? 'Switch to dark mode' : 'Switch to light mode';
}
updateThemeButton();
themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('alishba-theme', root.dataset.theme);
  updateThemeButton();
});

/* Reveal on scroll */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
$$('.reveal').forEach(el => observer.observe(el));

/* Active nav + scroll progress */
function updateScrollUI(){
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  nav.classList.toggle('scrolled', y > 20);
  backTop.classList.toggle('show', y > 550);

  let current = 'home';
  $$('main section[id]').forEach(section => {
    if(section.getBoundingClientRect().top <= 150) current = section.id;
  });
  $$('.nav-links a').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}
window.addEventListener('scroll', updateScrollUI, {passive:true});
updateScrollUI();

/* Back to top */
backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

/* Footer year */
$('#year').textContent = new Date().getFullYear();

/* Placeholder links: user adds final URLs */
let toastTimer;
function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
$$('.project-placeholder').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    showToast(`Add your ${link.dataset.linkName || 'link'} in index.html.`);
  });
});

/* Contact form opens the visitor's email client */
const form = $('#contactForm');
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const message = $('#message').value.trim();
  if(!name || !email || !message) return;
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`Hello Alishba,\n\nName: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:alishbatabassum900@gmail.com?subject=${subject}&body=${body}`;
  $('#formNote').textContent = 'Your email app should open with the message prepared.';
  form.reset();
});

window.addEventListener('keydown', event => {
  if(event.key === 'Escape') closeMenu();
});
