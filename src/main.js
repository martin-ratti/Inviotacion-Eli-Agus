// Configuración de la cuenta regresiva
const targetDate = new Date('2027-03-06T20:00:00-03:00').getTime();

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
    const aliasText = 'cbu.tarjeta.agus.eli';
    navigator.clipboard.writeText(aliasText)
      .then(() => {
        alert('Alias copiado: ' + aliasText + ' ✨');
      })
      .catch((err) => {
        console.error('Error al copiar el alias: ', err);
      });
  });
}

// Lógica del Selector de Fondos
const bgSelectorToggle = document.getElementById('bg-selector-toggle');
const bgOptionsMenu = document.getElementById('bg-options-menu');
const bgOptionItems = document.querySelectorAll('.bg-option-item');

// Cargar fondo guardado
const savedTheme = localStorage.getItem('invitation-bg-theme');
if (savedTheme) {
  document.body.classList.add(savedTheme);
}

if (bgSelectorToggle && bgOptionsMenu) {
  // Toggle menú
  bgSelectorToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    bgOptionsMenu.classList.toggle('active');
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', () => {
    bgOptionsMenu.classList.remove('active');
  });

  // Evitar cerrar al hacer clic dentro del menú
  bgOptionsMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

bgOptionItems.forEach((item) => {
  item.addEventListener('click', () => {
    const theme = item.getAttribute('data-theme');
    
    // Remover temas anteriores
    document.body.classList.remove('bg-theme-1', 'bg-theme-2', 'bg-theme-3', 'bg-theme-4');
    
    if (theme) {
      document.body.classList.add(theme);
      localStorage.setItem('invitation-bg-theme', theme);
    } else {
      localStorage.removeItem('invitation-bg-theme');
    }
    
    // Cerrar menú
    if (bgOptionsMenu) {
      bgOptionsMenu.classList.remove('active');
    }
  });
});

