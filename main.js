document.addEventListener('DOMContentLoaded', () => {

  /* ============ AOS ============ */
  if (window.AOS) {
    AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic' });
  }

  /* ============ Header scroll state ============ */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    const backTop = document.getElementById('back-to-top');
    if (window.scrollY > 600) {
      backTop.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      backTop.classList.add('opacity-0', 'pointer-events-none');
    }
  };
  document.addEventListener('scroll', onScroll);
  onScroll();

  document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============ Mobile burger menu ============ */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
    } else {
      mobileMenu.style.maxHeight = '0px';
    }
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.style.maxHeight = '0px';
    });
  });

  /* ============ Animated counters ============ */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ============ Gallery filter ============ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  /* ============ Lightbox ============ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src.replace('w=800', 'w=1600');
      lightboxImg.alt = img.alt;
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  });
  const closeLightbox = () => {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  };
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ============ Testimonial carousel ============ */
  const track = document.getElementById('testi-track');
  const slides = track.children;
  const dotsWrap = document.getElementById('testi-dots');
  let current = 0;

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Avis ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }
  const dots = dotsWrap.querySelectorAll('.testi-dot');

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }
  document.getElementById('testi-prev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('testi-next').addEventListener('click', () => goTo(current + 1));

  let autoSlide = setInterval(() => goTo(current + 1), 6000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.parentElement.addEventListener('mouseleave', () => { autoSlide = setInterval(() => goTo(current + 1), 6000); });

  /* ============ FAQ accordion ============ */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ============ Devis simulator ============ */
  const typeBtns = document.querySelectorAll('.type-btn');
  const guestsInput = document.getElementById('guests');
  const guestsValue = document.getElementById('guests-value');
  const priceLow = document.getElementById('price-low');
  const priceHigh = document.getElementById('price-high');
  const optionChecks = document.querySelectorAll('.option-check input');

  let typeMultiplier = 1.0;
  const BASE_PER_GUEST = 22000; // FCFA per guest, base cost (venue, staff, coordination)

  function formatFCFA(n) {
    return Math.round(n / 1000) * 1000 + ' F';
  }

  function computeQuote() {
    const guests = parseInt(guestsInput.value, 10);
    guestsValue.textContent = guests;

    let optionsTotal = 0;
    optionChecks.forEach(chk => { if (chk.checked) optionsTotal += parseInt(chk.value, 10); });

    const base = guests * BASE_PER_GUEST * typeMultiplier + optionsTotal;
    const low = base * 0.9;
    const high = base * 1.18;

    priceLow.textContent = formatFCFA(low);
    priceHigh.textContent = formatFCFA(high);
  }

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      typeMultiplier = parseFloat(btn.dataset.value);
      computeQuote();
    });
  });
  guestsInput.addEventListener('input', computeQuote);
  optionChecks.forEach(chk => chk.addEventListener('change', computeQuote));
  computeQuote();

  /* ============ Contact form (no backend — demo confirmation) ============ */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
    formSuccess.classList.remove('hidden');
    contactForm.reset();
    setTimeout(() => formSuccess.classList.add('hidden'), 6000);
  });

  /* ============ Mini FAQ chatbot (rule-based, no external API) ============ */
  const chatToggle = document.getElementById('chat-toggle');
  const chatPanel = document.getElementById('chat-panel');
  const chatClose = document.getElementById('chat-close');
  const chatBody = document.getElementById('chat-body');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatQuick = document.getElementById('chat-quick');

  const responses = {
    prix: "Le budget dépend surtout du nombre d'invités et du type de cérémonie. Essayez notre simulateur de devis juste au-dessus de la galerie pour une estimation immédiate en FCFA.",
    delai: "Nous recommandons de nous contacter 6 à 9 mois avant pour une organisation complète, et au moins 2 mois avant pour une prestation simple.",
    tradi: "Oui, la dot et les rites coutumiers font partie de notre cœur de métier : coordination avec les deux familles, protocole, tenues et symboles respectés.",
    contact: "Bien sûr ! Remplissez le formulaire dans la section Contact ou écrivez-nous directement sur WhatsApp via le bouton vert ci-dessous.",
    civil: "Nous accompagnons aussi les mariages civils : constitution du dossier, témoins, timing à la mairie et registre — sans stress le jour J.",
    default: "Je peux répondre aux questions sur les prix, les délais, la dot ou le mariage civil. Pour tout le reste, le plus simple est de nous écrire via le formulaire de contact ou WhatsApp."
  };

  function addMessage(text, who) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg ' + who;
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function botReply(key) {
    setTimeout(() => addMessage(responses[key] || responses.default, 'bot'), 350);
  }

  function matchKeyword(text) {
    const t = text.toLowerCase();
    if (/(prix|coût|cout|budget|tarif|combien)/.test(t)) return 'prix';
    if (/(délai|delai|temps|quand|avance)/.test(t)) return 'delai';
    if (/(dot|tradi|coutum)/.test(t)) return 'tradi';
    if (/(civil|mairie|registre)/.test(t)) return 'civil';
    if (/(contact|parler|humain|personne|whatsapp|appel)/.test(t)) return 'contact';
    return 'default';
  }

  chatToggle.addEventListener('click', () => {
    chatPanel.classList.toggle('hidden');
  });
  chatClose.addEventListener('click', () => chatPanel.classList.add('hidden'));

  chatQuick.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-q]');
    if (!btn) return;
    addMessage(btn.textContent, 'user');
    botReply(btn.dataset.q);
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = chatInput.value.trim();
    if (!value) return;
    addMessage(value, 'user');
    botReply(matchKeyword(value));
    chatInput.value = '';
  });

});
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    const backTop = document.getElementById('back-to-top');
    if (window.scrollY > 600) {
      backTop.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      backTop.classList.add('opacity-0', 'pointer-events-none');
    }
  };
  document.addEventListener('scroll', onScroll);
  onScroll();

  document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============ Mobile burger menu ============ */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
    } else {
      mobileMenu.style.maxHeight = '0px';
    }
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.style.maxHeight = '0px';
    });
  });

  /* ============ Animated counters ============ */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ============ Gallery filter ============ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  /* ============ Lightbox ============ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src.replace('w=800', 'w=1600');
      lightboxImg.alt = img.alt;
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  });
  const closeLightbox = () => {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  };
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ============ Testimonial carousel ============ */
  const track = document.getElementById('testi-track');
  const slides = track.children;
  const dotsWrap = document.getElementById('testi-dots');
  let current = 0;

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Avis ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }
  const dots = dotsWrap.querySelectorAll('.testi-dot');

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }
  document.getElementById('testi-prev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('testi-next').addEventListener('click', () => goTo(current + 1));

  let autoSlide = setInterval(() => goTo(current + 1), 6000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.parentElement.addEventListener('mouseleave', () => { autoSlide = setInterval(() => goTo(current + 1), 6000); });

  /* ============ FAQ accordion ============ */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ============ Devis simulator ============ */
  const typeBtns = document.querySelectorAll('.type-btn');
  const guestsInput = document.getElementById('guests');
  const guestsValue = document.getElementById('guests-value');
  const priceLow = document.getElementById('price-low');
  const priceHigh = document.getElementById('price-high');
  const optionChecks = document.querySelectorAll('.option-check input');

  let typeMultiplier = 1.0;
  const BASE_PER_GUEST = 22000; // FCFA per guest, base cost (venue, staff, coordination)

  function formatFCFA(n) {
    return Math.round(n / 1000) * 100 + ' F';
  }

  function computeQuote() {
    const guests = parseInt(guestsInput.value, 10);
    guestsValue.textContent = guests;

    let optionsTotal = 0;
    optionChecks.forEach(chk => { if (chk.checked) optionsTotal += parseInt(chk.value, 10); });

    const base = guests * BASE_PER_GUEST * typeMultiplier + optionsTotal;
    const low = base * 0.9;
    const high = base * 1.18;

    priceLow.textContent = formatFCFA(low);
    priceHigh.textContent = formatFCFA(high);
  }

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      typeMultiplier = parseFloat(btn.dataset.value);
      computeQuote();
    });
  });
  guestsInput.addEventListener('input', computeQuote);
  optionChecks.forEach(chk => chk.addEventListener('change', computeQuote));
  computeQuote();

  /* ============ Contact form (no backend — demo confirmation) ============ */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
    formSuccess.classList.remove('hidden');
    contactForm.reset();
    setTimeout(() => formSuccess.classList.add('hidden'), 6000);
  });

  /* ============ Mini FAQ chatbot (rule-based, no external API) ============ */
  const chatToggle = document.getElementById('chat-toggle');
  const chatPanel = document.getElementById('chat-panel');
  const chatClose = document.getElementById('chat-close');
  const chatBody = document.getElementById('chat-body');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatQuick = document.getElementById('chat-quick');

  const responses = {
    prix: "Le budget dépend surtout du nombre d'invités et du type de cérémonie. Essayez notre simulateur de devis juste au-dessus de la galerie pour une estimation immédiate en FCFA.",
    delai: "Nous recommandons de nous contacter 6 à 9 mois avant pour une organisation complète, et au moins 2 mois avant pour une prestation simple.",
    tradi: "Oui, la dot et les rites coutumiers font partie de notre cœur de métier : coordination avec les deux familles, protocole, tenues et symboles respectés.",
    contact: "Bien sûr ! Remplissez le formulaire dans la section Contact ou écrivez-nous directement sur WhatsApp via le bouton vert ci-dessous.",
    civil: "Nous accompagnons aussi les mariages civils : constitution du dossier, témoins, timing à la mairie et registre — sans stress le jour J.",
    default: "Je peux répondre aux questions sur les prix, les délais, la dot ou le mariage civil. Pour tout le reste, le plus simple est de nous écrire via le formulaire de contact ou WhatsApp."
  };

  function addMessage(text, who) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg ' + who;
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function botReply(key) {
    setTimeout(() => addMessage(responses[key] || responses.default, 'bot'), 350);
  }

  function matchKeyword(text) {
    const t = text.toLowerCase();
    if (/(prix|coût|cout|budget|tarif|combien)/.test(t)) return 'prix';
    if (/(délai|delai|temps|quand|avance)/.test(t)) return 'delai';
    if (/(dot|tradi|coutum)/.test(t)) return 'tradi';
    if (/(civil|mairie|registre)/.test(t)) return 'civil';
    if (/(contact|parler|humain|personne|whatsapp|appel)/.test(t)) return 'contact';
    return 'default';
  }

  chatToggle.addEventListener('click', () => {
    chatPanel.classList.toggle('hidden');
  });
  chatClose.addEventListener('click', () => chatPanel.classList.add('hidden'));

  chatQuick.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-q]');
    if (!btn) return;
    addMessage(btn.textContent, 'user');
    botReply(btn.dataset.q);
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = chatInput.value.trim();
    if (!value) return;
    addMessage(value, 'user');
    botReply(matchKeyword(value));
    chatInput.value = '';
  });

});
