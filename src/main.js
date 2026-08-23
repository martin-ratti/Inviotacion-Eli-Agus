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
      fadeInObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach((el) => {
  fadeInObserver.observe(el);
});

// Manejo del Formulario de RSVP
const rsvpForm = document.getElementById('rsvp-form');
const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
const rsvpDetails = document.getElementById('rsvp-details');
const menuSelect = document.getElementById('menu-select');
const specialMenuCountContainer = document.getElementById('special-menu-count-container');

if (attendanceRadios.length > 0) {
  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'yes') {
        if (rsvpDetails) rsvpDetails.classList.remove('hidden');
        if (typeof updateTotal === 'function') updateTotal();
      } else {
        if (rsvpDetails) rsvpDetails.classList.add('hidden');
        const paymentTotalSection = document.getElementById('payment-total-section');
        if (paymentTotalSection) paymentTotalSection.classList.add('hidden');
      }
    });
  });
}

if (menuSelect && specialMenuCountContainer) {
  menuSelect.addEventListener('change', (e) => {
    if (e.target.value !== 'normal') {
      specialMenuCountContainer.classList.remove('hidden');
    } else {
      specialMenuCountContainer.classList.add('hidden');
    }
  });
}

if (rsvpForm) {
  rsvpForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const btnSubmit = document.getElementById('btn-submit-rsvp');
    const originalText = btnSubmit ? btnSubmit.textContent : 'Enviar respuesta';
    if (btnSubmit) {
      btnSubmit.textContent = 'Enviando...';
      btnSubmit.disabled = true;
    }
    
    const nombreInput = document.getElementById('guest-name')?.value.trim();
    const nombre = nombreInput ? nombreInput : '-';
    
    const asisteVal = document.querySelector('input[name="attendance"]:checked')?.value;
    const asiste = asisteVal === 'yes' ? 'Sí' : 'No';
    const mayores = parseInt(document.getElementById('adults-count')?.value) || 0;
    const menores = parseInt(document.getElementById('kids-count')?.value) || 0;
    const total = (mayores * PRICE_ADULT) + (menores * PRICE_CHILD);
    
    const menuEl = document.getElementById('menu-select');
    let menu = '-';
    let cantMenuEspecial = '-';
    
    if (asisteVal === 'yes' && menuEl) {
       menu = menuEl.options[menuEl.selectedIndex].text;
       if (menuEl.value !== 'normal') {
          cantMenuEspecial = document.getElementById('special-menu-count')?.value || '-';
       } else {
          cantMenuEspecial = 'N/A';
       }
    }
    
    const aclaracionesInput = document.getElementById('rsvp-notes')?.value.trim();
    const aclaraciones = aclaracionesInput ? aclaracionesInput : '-';
    
    const payload = {
      nombre,
      asiste,
      mayores: asisteVal === 'yes' ? mayores : 0,
      menores: asisteVal === 'yes' ? menores : 0,
      total: asisteVal === 'yes' ? total : 0,
      menu,
      cantMenuEspecial,
      aclaraciones
    };

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxprt3uP2Psq6DfIo0K9gdoiqQW33SD4CeFLqvnqkLkjKsWGoI7MUPpUpfw6mjrGdw/exec';

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      if (asisteVal === 'no') {
        showToast('¡Qué pena! Gracias por avisar.');
      } else {
        showToast('¡Respuesta enviada! Te esperamos.');
        
        // Lanzar confetti si asiste
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#9caa8b', '#cfd7c4', '#c97a51', '#e4c4ad'] 
          });
        }
      }
      
      const finalTotal = total; // Guardamos el total antes de resetear
      
      rsvpForm.reset();
      
      if (rsvpDetails) rsvpDetails.classList.add('hidden');
      const specialMenuCnt = document.getElementById('special-menu-count-container');
      if (specialMenuCnt) specialMenuCnt.classList.add('hidden');
      
      const transferSection = document.getElementById('transfer-section');
      if (asisteVal === 'yes' && finalTotal > 0) {
        if (transferSection) {
          transferSection.classList.remove('hidden');
          
          // Update the amount explicitly for the final view
          const paymentAmountEl = document.getElementById('payment-total-amount');
          const paymentSecEl = document.getElementById('payment-total-section');
          if (paymentAmountEl) paymentAmountEl.textContent = `$ ${finalTotal.toLocaleString('es-AR')}`;
          if (paymentSecEl) paymentSecEl.classList.remove('hidden');
          
          // Smooth scroll to transfer section and trigger animation
          setTimeout(() => {
            transferSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            transferSection.classList.remove('opacity-0', 'translate-y-10');
            transferSection.classList.add('opacity-100', 'translate-y-0');
          }, 100);
        }
      } else {
        if (transferSection) {
          transferSection.classList.add('hidden', 'opacity-0', 'translate-y-10');
          transferSection.classList.remove('opacity-100', 'translate-y-0');
        }
      }
    } catch (error) {
      showToast('Hubo un error al enviar. Por favor, intenta nuevamente.');
      console.error('Error enviando RSVP:', error);
    } finally {
      if (btnSubmit) {
        btnSubmit.textContent = originalText;
        btnSubmit.disabled = false;
      }
    }
  });
}

// Función para mostrar el toast
function showToast(message) {
  const toast = document.getElementById('toast-success');
  const toastMsg = document.getElementById('toast-message');
  
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.remove('-translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    
    if (toast.hideTimeout) clearTimeout(toast.hideTimeout);
    
    toast.hideTimeout = setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('-translate-y-20', 'opacity-0');
    }, 4000);
  }
}

// Copiar alias al portapapeles
const copyAliasBtn = document.getElementById('copy-alias-btn');

if (copyAliasBtn) {
  copyAliasBtn.addEventListener('click', () => {
    const aliasText = 'cbu.tarjeta.agus.eli';
    navigator.clipboard.writeText(aliasText)
      .then(() => {
        showToast('Alias copiado: ' + aliasText);
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

  const isAttending = document.querySelector('input[name="attendance"]:checked')?.value === 'yes';
  if (!isAttending) {
    if (paymentTotalSection) paymentTotalSection.classList.add('hidden');
    return;
  }
  
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

