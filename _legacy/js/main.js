// DEWA Approvals Dubai - Lead Portal JavaScript
// DEWA Approvals Dubai

document.addEventListener('DOMContentLoaded', () => {
  // 1. STICKY HEADER
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 2. MOBILE MENU TOGGLE
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = '#0A1628';
        navLinks.style.padding = '1.5rem';
        navLinks.style.borderBottom = '1px solid rgba(56, 189, 248, 0.2)';
      }
    });
  }

  // 3. INTERACTIVE LOAD & COST ESTIMATOR
  const loadSlider = document.getElementById('load-slider');
  const loadValDisplay = document.getElementById('load-val-display');
  const propertySelect = document.getElementById('calc-property');
  const scopeSelect = document.getElementById('calc-scope');
  
  const estPrice = document.getElementById('est-price');
  const estDays = document.getElementById('est-days');
  const estInspection = document.getElementById('est-inspection');
  const estDocs = document.getElementById('est-docs');

  function calculateEstimate() {
    if (!loadSlider || !estPrice) return;

    const loadKW = parseInt(loadSlider.value) || 35;
    if (loadValDisplay) {
      loadValDisplay.textContent = `${loadKW} kW`;
    }

    const property = propertySelect ? propertySelect.value : 'retail';
    const scope = scopeSelect ? scopeSelect.value : 'fitout';

    let basePrice = 2800;
    let days = '3 - 5 Days';
    let docs = 'SLD + Tenancy NOC + Load Schedule';

    if (scope === 'load_upgrade') {
      basePrice = 4500 + (loadKW * 35);
      days = '7 - 14 Days';
      docs = 'Substation Audit + New SLD + DEWA Sanction';
    } else if (scope === 'meter') {
      basePrice = 3200 + (loadKW * 20);
      days = '4 - 7 Days';
      docs = 'Inspection Clearance + Meter Requisition';
    } else if (scope === 'rectification') {
      basePrice = 2500;
      days = '2 - 4 Days';
      docs = 'Notice Audit + Megger Test + Re-inspection';
    } else {
      // fit-out noc
      basePrice = 2800 + (loadKW * 15);
      days = '3 - 5 Days';
      docs = 'Architectural Layout + SLD + DEWA NOC';
    }

    // Property multiplier
    if (property === 'restaurant') {
      basePrice *= 1.25;
    } else if (property === 'warehouse') {
      basePrice *= 1.35;
    } else if (property === 'villa') {
      basePrice *= 1.15;
    }

    estPrice.innerHTML = `<span style="font-size: 1.6rem; color: #E8A85C; font-weight: 700;">Custom Quote</span>`;
    if (estDays) estDays.textContent = `Flexible Pricing â€¢ Turnaround: ${days}`;
    if (estInspection) estInspection.textContent = '100% First-Pass Target';
    if (estDocs) estDocs.textContent = docs;
  }

  if (loadSlider) {
    loadSlider.addEventListener('input', calculateEstimate);
  }
  if (propertySelect) {
    propertySelect.addEventListener('change', calculateEstimate);
  }
  if (scopeSelect) {
    scopeSelect.addEventListener('change', calculateEstimate);
  }
  calculateEstimate();

  // 4. HERO FAST-TRACK LEAD FORM (WhatsApp & Instant Dispatch)
  const leadForm = document.getElementById('hero-lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('lead-name')?.value || '';
      const phone = document.getElementById('lead-phone')?.value || '';
      const email = document.getElementById('lead-email')?.value || '';
      const type = document.getElementById('lead-type')?.value || '';
      const scope = document.getElementById('lead-scope')?.value || '';
      const details = document.getElementById('lead-details')?.value || '';

      const waMsg = `Hello DEWA Approvals Dubai, I need approval assistance:%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Email:* ${encodeURIComponent(email)}%0A*Property Type:* ${encodeURIComponent(type)}%0A*Required Scope:* ${encodeURIComponent(scope)}%0A*Unit / Details:* ${encodeURIComponent(details)}%0A%0A_Sent via dewaapprovals.abbaditech.ae portal_`;

      window.open(`https://wa.me/971505546943?text=${waMsg}`, '_blank');
    });
  }

  // 5. ESTIMATOR TO WHATSAPP
  const bookEstimateBtn = document.getElementById('book-estimate-btn');
  if (bookEstimateBtn) {
    bookEstimateBtn.addEventListener('click', () => {
      const loadKW = loadSlider ? loadSlider.value : '35';
      const property = propertySelect ? propertySelect.options[propertySelect.selectedIndex].text : 'Retail';
      const scope = scopeSelect ? scopeSelect.options[scopeSelect.selectedIndex].text : 'DEWA Fit-Out NOC';
      const priceText = estPrice ? estPrice.innerText : '';

      const waMsg = `Hello DEWA Approvals Dubai DEWA Desk, I used the online approval calculator:%0A%0A*Scope:* ${encodeURIComponent(scope)}%0A*Property:* ${encodeURIComponent(property)}%0A*Load:* ${loadKW} kW%0A*Estimated Fee:* ${encodeURIComponent(priceText)}%0A%0APlease confirm requirements and process my inquiry.`;

      window.open(`https://wa.me/971505546943?text=${waMsg}`, '_blank');
    });
  }

  // 6. GALLERY FILTER TABS
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      galleryCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 7. FAQ ACCORDION
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 8. FLOATING WHATSAPP CHAT WIDGET
  const waBubbleBtn = document.getElementById('wa-bubble-btn');
  const waChatBox = document.getElementById('wa-chat-box');
  const waCloseBtn = document.getElementById('wa-close-btn');

  if (waBubbleBtn && waChatBox) {
    waBubbleBtn.addEventListener('click', () => {
      waChatBox.classList.toggle('open');
    });
  }

  if (waCloseBtn && waChatBox) {
    waCloseBtn.addEventListener('click', () => {
      waChatBox.classList.remove('open');
    });
  }

  // Quick Action buttons inside WhatsApp Widget
  const quickBtns = document.querySelectorAll('.wac-quick-btn');
  quickBtns.forEach(qBtn => {
    qBtn.addEventListener('click', () => {
      const text = qBtn.getAttribute('data-text') || 'Hello DEWA Approvals Dubai, I need technical consultation.';
      window.open(`https://wa.me/971505546943?text=${encodeURIComponent(text)}`, '_blank');
    });
  });
});

