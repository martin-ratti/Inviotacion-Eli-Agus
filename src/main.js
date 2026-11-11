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

// Feedback háptico global para todos los botones del sitio al tocarlos
document.querySelectorAll('.btn-boho, .btn-outline').forEach(btn => {
  btn.addEventListener('click', () => {
    if (navigator.vibrate) {
      try { navigator.vibrate(25); } catch (_) {}
    }
  });
});

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

// Opciones disponibles de menú
const MENU_OPTIONS = [
  { value: 'normal', label: 'Sin restricciones' },
  { value: 'celiaco', label: 'Menú Celíaco' },
  { value: 'vegetariano', label: 'Menú Vegetariano' },
  { value: 'vegano', label: 'Menú Vegano' }
];

// Estado de filas de menú
let menuRowIdCounter = 1;
let menuRows = [
  { id: 1, value: 'normal', count: 1 }
];

function getTotalGuests() {
  const adults = parseInt(document.getElementById('adults-count')?.value) || 0;
  const kids = parseInt(document.getElementById('kids-count')?.value) || 0;
  return adults + kids;
}

function updateMenuValidation() {
  const totalGuests = getTotalGuests();
  const summaryEl = document.getElementById('menu-count-summary');
  const errorMsg = document.getElementById('menu-error-message');
  const errorText = document.getElementById('menu-error-text');
  const addContainer = document.getElementById('add-menu-container');

  if (!summaryEl || !errorMsg || !errorText) return;

  if (totalGuests <= 1) {
    summaryEl.classList.add('hidden');
    errorMsg.classList.add('hidden');
    if (addContainer) addContainer.classList.add('hidden');
    return;
  }

  const assignedSum = menuRows.reduce((sum, r) => sum + (parseInt(r.count) || 0), 0);
  const remaining = totalGuests - assignedSum;

  summaryEl.classList.remove('hidden');

  // El botón "Agregar otro menú" aparece si faltan personas y quedan opciones de menú libres
  if (addContainer) {
    if (assignedSum < totalGuests && menuRows.length < MENU_OPTIONS.length) {
      addContainer.classList.remove('hidden');
    } else {
      addContainer.classList.add('hidden');
    }
  }

  // Estado del resumen visual y mensajes de error
  if (assignedSum === totalGuests) {
    summaryEl.textContent = `✓ ${totalGuests} de ${totalGuests} menús`;
    summaryEl.className = 'font-sans text-[11px] font-medium text-sage';
    errorMsg.classList.add('hidden');
    errorText.textContent = '';
  } else if (assignedSum > totalGuests) {
    const excess = assignedSum - totalGuests;
    summaryEl.textContent = `(${assignedSum} de ${totalGuests} menús)`;
    summaryEl.className = 'font-sans text-[11px] font-medium text-terra font-semibold';
    errorMsg.classList.remove('hidden');
    errorText.textContent = `Asignaste ${assignedSum} menús en total para ${totalGuests} personas (${excess} de más). Por favor ajustá las cantidades para poder enviar tu respuesta.`;
  } else {
    summaryEl.textContent = `(Faltan ${remaining} de ${totalGuests})`;
    summaryEl.className = 'font-sans text-[11px] font-medium text-clay/90';
    errorMsg.classList.add('hidden');
    errorText.textContent = '';
  }
}

function renderMenuRows() {
  const container = document.getElementById('menu-rows-container');
  if (!container) return;

  const totalGuests = getTotalGuests();
  const isMultiPerson = totalGuests > 1;

  if (menuRows.length === 0) {
    menuRows.push({ id: ++menuRowIdCounter, value: 'normal', count: Math.max(1, totalGuests) });
  }

  container.innerHTML = '';

  menuRows.forEach((row) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'menu-row flex items-center gap-2 animate-dropdown';
    rowEl.dataset.rowId = row.id;

    // Selector de tipo de menú
    const selectWrapper = document.createElement('div');
    selectWrapper.className = 'flex-1';

    const select = document.createElement('select');
    select.className = 'input-boho menu-type-select w-full bg-white cursor-pointer h-[48px]';
    select.required = true;

    // Opciones seleccionadas en OTRAS filas
    const selectedInOtherRows = menuRows
      .filter(r => r.id !== row.id)
      .map(r => r.value);

    // Si el valor actual está tomado por otra fila, reasignar a la primera libre
    if (selectedInOtherRows.includes(row.value)) {
      const firstFree = MENU_OPTIONS.find(opt => !selectedInOtherRows.includes(opt.value));
      if (firstFree) row.value = firstFree.value;
    }

    MENU_OPTIONS.forEach(opt => {
      if (opt.value === row.value || !selectedInOtherRows.includes(opt.value)) {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        if (opt.value === row.value) option.selected = true;
        select.appendChild(option);
      }
    });

    select.addEventListener('change', (e) => {
      row.value = e.target.value;
      renderMenuRows();
    });

    selectWrapper.appendChild(select);
    rowEl.appendChild(selectWrapper);

    // Si es más de 1 persona, selector de cantidad
    if (isMultiPerson) {
      const qtyWrapper = document.createElement('div');
      qtyWrapper.className = 'w-[74px] shrink-0';

      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.className = 'input-boho menu-qty-input text-center h-[48px] px-2 font-medium';
      qtyInput.min = '1';
      qtyInput.max = String(totalGuests);
      qtyInput.value = row.count || '1';
      qtyInput.required = true;

      qtyInput.addEventListener('input', (e) => {
        row.count = parseInt(e.target.value) || 0;
        updateMenuValidation();
      });

      qtyWrapper.appendChild(qtyInput);
      rowEl.appendChild(qtyWrapper);

      // Botón para eliminar fila si hay más de 1 fila
      if (menuRows.length > 1) {
        const btnRemove = document.createElement('button');
        btnRemove.type = 'button';
        btnRemove.className = 'btn-remove-menu shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-clay/70 hover:text-terradark hover:bg-sand/30 transition-colors';
        btnRemove.title = 'Eliminar este menú';
        btnRemove.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        `;

        btnRemove.addEventListener('click', () => {
          menuRows = menuRows.filter(r => r.id !== row.id);
          renderMenuRows();
        });

        rowEl.appendChild(btnRemove);
      }
    }

    container.appendChild(rowEl);
  });

  updateMenuValidation();
}

const btnAddMenu = document.getElementById('btn-add-menu');
if (btnAddMenu) {
  btnAddMenu.addEventListener('click', () => {
    const totalGuests = getTotalGuests();
    const assignedSum = menuRows.reduce((sum, r) => sum + (parseInt(r.count) || 0), 0);
    const takenValues = menuRows.map(r => r.value);
    const nextFree = MENU_OPTIONS.find(opt => !takenValues.includes(opt.value));

    if (nextFree) {
      menuRows.push({
        id: ++menuRowIdCounter,
        value: nextFree.value,
        count: 1
      });
      renderMenuRows();
    }
  });
}

// Inicializar filas de menú en carga
renderMenuRows();

if (attendanceRadios.length > 0) {
  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'yes') {
        if (rsvpDetails) rsvpDetails.classList.remove('hidden');
        if (typeof updateTotal === 'function') updateTotal();
        renderMenuRows();
      } else {
        if (rsvpDetails) rsvpDetails.classList.add('hidden');
        const paymentTotalSection = document.getElementById('payment-total-section');
        if (paymentTotalSection) paymentTotalSection.classList.add('hidden');
      }
    });
  });
}

if (rsvpForm) {
  rsvpForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const btnSubmit = document.getElementById('btn-submit-rsvp');
    const originalText = btnSubmit ? btnSubmit.textContent : 'Enviar respuesta';
    
    const nombreInput = document.getElementById('guest-name')?.value.trim();
    const nombre = nombreInput ? nombreInput : '-';
    
    const asisteVal = document.querySelector('input[name="attendance"]:checked')?.value;
    const asiste = asisteVal === 'yes' ? 'Sí' : 'No';
    const mayores = parseInt(document.getElementById('adults-count')?.value) || 0;
    const menores = parseInt(document.getElementById('kids-count')?.value) || 0;
    const total = (mayores * PRICE_ADULT) + (menores * PRICE_CHILD);

    // Validación de asistencia
    if (asisteVal === 'yes') {
      const totalGuests = mayores + menores;
      if (totalGuests < 1) {
        showToast('Indicá la cantidad', 'Seleccioná al menos 1 persona (mayores o menores).', 'error');
        return;
      }

      if (totalGuests > 1) {
        const assignedSum = menuRows.reduce((sum, r) => sum + (parseInt(r.count) || 0), 0);
        if (assignedSum !== totalGuests) {
          const errorMsg = document.getElementById('menu-error-message');
          const errorText = document.getElementById('menu-error-text');
          if (errorMsg && errorText) {
            errorMsg.classList.remove('hidden');
            if (assignedSum > totalGuests) {
              errorText.textContent = `Asignaste ${assignedSum} menús en total para ${totalGuests} personas (${assignedSum - totalGuests} de más). Ajustá las cantidades para poder enviar tu respuesta.`;
            } else {
              errorText.textContent = `Indicaste que asisten ${totalGuests} personas pero solo asignaste ${assignedSum} menús (faltan ${totalGuests - assignedSum}). Ajustá las cantidades o agregá otra preferencia para continuar.`;
            }
            errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          showToast('Verificá los menús', `La cantidad de menús (${assignedSum}) debe coincidir con las personas (${totalGuests}).`, 'error');
          return;
        }
      }
    }

    if (btnSubmit) {
      btnSubmit.textContent = 'Enviando...';
      btnSubmit.disabled = true;
    }
    
    const menuCounts = { normal: 0, celiaco: 0, vegetariano: 0, vegano: 0 };

    if (asisteVal === 'yes') {
      const totalGuests = mayores + menores;
      menuRows.forEach(r => {
        const count = totalGuests > 1 ? (parseInt(r.count) || 0) : 1;
        if (r.value in menuCounts) menuCounts[r.value] += count;
      });
    }
    
    const aclaracionesInput = document.getElementById('rsvp-notes')?.value.trim();
    const aclaraciones = aclaracionesInput ? aclaracionesInput : '-';
    
    const payload = {
      nombre,
      asiste,
      mayores: asisteVal === 'yes' ? mayores : 0,
      menores: asisteVal === 'yes' ? menores : 0,
      total: asisteVal === 'yes' ? total : 0,
      sinRestricciones: menuCounts.normal,
      celiaco: menuCounts.celiaco,
      vegetariano: menuCounts.vegetariano,
      vegano: menuCounts.vegano,
      aclaraciones
    };

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxprt3uP2Psq6DfIo0K9gdoiqQW33SD4CeFLqvnqkLkjKsWGoI7MUPpUpfw6mjrGdw/exec';

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      if (asisteVal === 'no') {
        showToast('¡Qué pena!', 'Gracias por avisar.');
      } else {
        showToast('¡Respuesta enviada!', 'Te esperamos.');
        
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
      menuRows = [{ id: ++menuRowIdCounter, value: 'normal', count: 1 }];
      renderMenuRows();
      
      if (rsvpDetails) rsvpDetails.classList.add('hidden');
      
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
      showToast('Hubo un error al enviar.', 'Por favor, intenta nuevamente.', 'error');
      console.error('Error enviando RSVP:', error);
    } finally {
      if (btnSubmit) {
        btnSubmit.textContent = originalText;
        btnSubmit.disabled = false;
      }
    }
  });
}

// Función para mostrar el toast estandarizado
function showToast(title, subtitle = '', type = 'success') {
  const toast = document.getElementById('toast-success');
  const toastTitle = document.getElementById('toast-title');
  const toastSubtitle = document.getElementById('toast-subtitle');
  const toastMsg = document.getElementById('toast-message');
  const iconSuccess = document.getElementById('toast-icon-success');
  const iconError = document.getElementById('toast-icon-error');
  
  if (!toast) return;

  let mainTitle = title;
  let subText = subtitle;

  // Soporte para paso de string único con salto de línea (\n)
  if (typeof title === 'string' && !subtitle) {
    if (title.includes('\n')) {
      const parts = title.split('\n');
      mainTitle = parts[0];
      subText = parts.slice(1).join('\n');
    }
  }

  if (toastTitle) {
    toastTitle.textContent = mainTitle || '';
  }
  if (toastSubtitle) {
    if (subText) {
      toastSubtitle.textContent = subText;
      toastSubtitle.classList.remove('hidden');
    } else {
      toastSubtitle.textContent = '';
      toastSubtitle.classList.add('hidden');
    }
  }
  if (toastMsg) {
    toastMsg.textContent = subText ? `${mainTitle} ${subText}` : (mainTitle || '');
  }

  // Manejo de iconos según el tipo (éxito o error)
  if (iconSuccess && iconError) {
    if (type === 'error') {
      iconSuccess.classList.add('hidden');
      iconError.classList.remove('hidden');
    } else {
      iconSuccess.classList.remove('hidden');
      iconError.classList.add('hidden');
    }
  }

  toast.classList.remove('-translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  if (toast.hideTimeout) clearTimeout(toast.hideTimeout);

  toast.hideTimeout = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('-translate-y-24', 'opacity-0');
  }, 4000);
}

// Copiar alias y CVU al portapapeles con microinteracción visual y háptica
const copyAliasBtn = document.getElementById('copy-alias-btn');
const copyCvuBtn = document.getElementById('copy-cvu-btn');

function triggerButtonFeedback(btn, successLabel) {
  if (!btn || btn.dataset.isCopying === 'true') return;
  btn.dataset.isCopying = 'true';

  const originalContent = btn.innerHTML;
  btn.classList.add('btn-copied');
  btn.innerHTML = `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="inline-block shrink-0">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${successLabel}</span>
  `;

  if (navigator.vibrate) {
    try { navigator.vibrate(35); } catch (_) {}
  }

  setTimeout(() => {
    btn.classList.remove('btn-copied');
    btn.innerHTML = originalContent;
    delete btn.dataset.isCopying;
  }, 2200);
}

function copyToClipboard(text, toastTitle, toastSubtitle, btn, successBtnLabel = '¡Copiado!') {
  const onSuccess = () => {
    showToast(toastTitle, toastSubtitle);
    if (btn) triggerButtonFeedback(btn, successBtnLabel);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(onSuccess)
      .catch(() => fallbackCopy(text, onSuccess));
  } else {
    fallbackCopy(text, onSuccess);
  }
}

function fallbackCopy(text, callback) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
    if (callback) callback();
  } catch (err) {
    console.error('Error al copiar: ', err);
  }
  document.body.removeChild(textarea);
}

if (copyAliasBtn) {
  copyAliasBtn.addEventListener('click', () => {
    const aliasEl = document.getElementById('account-alias');
    const aliasText = aliasEl ? aliasEl.textContent.trim() : 'noscasamos.eliyagus';
    copyToClipboard(aliasText, 'Alias copiado:', aliasText, copyAliasBtn, '¡Copiado!');
  });
}

if (copyCvuBtn) {
  copyCvuBtn.addEventListener('click', () => {
    const cvuEl = document.getElementById('account-cvu');
    const cvuText = cvuEl ? cvuEl.textContent.trim() : '0000003100001253125432';
    copyToClipboard(cvuText, 'CVU copiado:', cvuText, copyCvuBtn, '¡Copiado!');
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

  if (typeof renderMenuRows === 'function') {
    renderMenuRows();
  }
}

if (adultsInput && kidsInput) {
  adultsInput.addEventListener('input', updateTotal);
  kidsInput.addEventListener('input', updateTotal);
}

