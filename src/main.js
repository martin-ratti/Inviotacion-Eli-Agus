// Configuración de la cuenta regresiva
const targetDate = new Date('2027-02-20T21:00:00-03:00').getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = Math.max(0, targetDate - now);

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
  if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
  if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
  if (secsEl) secsEl.textContent = String(s).padStart(2, '0');
}

// Iniciar cuenta regresiva
updateCountdown();
setInterval(updateCountdown, 1000);

// Observador para animaciones al hacer scroll (Fade-in)
const observerOptions = {
  threshold: 0.15,
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach((el) => {
  fadeInObserver.observe(el);
});

// Manejo del Formulario de RSVP
const rsvpForm = document.getElementById('rsvp-form');
const rsvpMsg = document.getElementById('rsvp-msg');

if (rsvpForm) {
  rsvpForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (rsvpMsg) {
      rsvpMsg.classList.remove('hidden');
    }
    // Opcional: Aquí se podría integrar un envío real a una API o base de datos.
  });
}

// Copiar alias al portapapeles
const copyAliasBtn = document.getElementById('copy-alias-btn');

if (copyAliasBtn) {
  copyAliasBtn.addEventListener('click', () => {
    const aliasText = 'agus.eli.casamiento';
    navigator.clipboard.writeText(aliasText)
      .then(() => {
        alert('Alias copiado: ' + aliasText + ' ✨');
      })
      .catch((err) => {
        console.error('Error al copiar el alias: ', err);
      });
  });
}
