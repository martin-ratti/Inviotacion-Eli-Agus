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

// Lógica de Precios y Total
const PRICE_ADULT = 35000; // Valor placeholder
const PRICE_CHILD = 15000; // Valor placeholder

const priceAdultDisplay = document.getElementById('price-adult-display');
const priceChildDisplay = document.getElementById('price-child-display');
const adultsInput = document.getElementById('adults-count');
const kidsInput = document.getElementById('kids-count');
const paymentTotalSection = document.getElementById('payment-total-section');
const paymentTotalAmount = document.getElementById('payment-total-amount');

// Actualizar textos de precios
if (priceAdultDisplay) priceAdultDisplay.textContent = `$ ${PRICE_ADULT.toLocaleString('es-AR')}`;
if (priceChildDisplay) priceChildDisplay.textContent = `$ ${PRICE_CHILD.toLocaleString('es-AR')}`;

function updateTotal() {
  if (!adultsInput || !kidsInput || !paymentTotalAmount) return;
  
  const adults = parseInt(adultsInput.value) || 0;
  const kids = parseInt(kidsInput.value) || 0;
  
  const total = (adults * PRICE_ADULT) + (kids * PRICE_CHILD);
  
  if (total > 0) {
    paymentTotalAmount.textContent = `$ ${total.toLocaleString('es-AR')}`;
    paymentTotalSection.classList.remove('hidden');
  } else {
    paymentTotalSection.classList.add('hidden');
  }
}

if (adultsInput && kidsInput) {
  adultsInput.addEventListener('input', updateTotal);
  kidsInput.addEventListener('input', updateTotal);
}

