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
  const chatToggle = document.getElementById('chatToggleBtn');
  const chatPanel = document.getElementById('chatWindow');
  const chatClose = document.getElementById('closeChatBtn');
  const chatBody = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');

  // Ouvre ou ferme la fenêtre de chat
  chatToggle?.addEventListener('click', () => {
    chatPanel?.classList.remove('hidden');
    chatToggle.style.display = 'none';
  });

  chatClose?.addEventListener('click', () => {
    chatPanel?.classList.add('hidden');
    chatToggle.style.display = 'block';
  });

  function addMessage(text, sender, id = null) {
    if (!text.trim()) return;
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    if (id) messageDiv.id = id;
    messageDiv.textContent = text;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  async function getAiResponse(userMessage) {
    const apiKey = "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"; // à configurer séparément, ne jamais commit la vraie clé
const url = "https://api.groq.com/openai/v1/chat/completions";
    const systemPrompt = `Tu es l'assistant virtuel de 'Ever After Events', une agence d'organisation de mariages de luxe. 
        Ton rôle est de répondre aux questions des clients sur nos services, de manière professionnelle, chaleureuse et concise.
        RÈGLE STRICTE : Si la question de l'utilisateur n'a absolument AUCUN rapport avec l'organisation de mariage, l'événementiel, ou notre agence, tu dois poliment lui rappeler que tu es l'assistant d'une agence de mariage et lui demander comment tu peux l'aider à planifier son événement. Ne réponds pas aux requêtes hors sujet.`;

    const payload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error(`Erreur HTTP: ${response.status}`);
        return "Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.";
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse.";
    } catch (error) {
      console.error("Erreur API:", error);
      return "Erreur de connexion. Vérifiez votre réseau.";
    }
  }

  async function handleSend() {
    const userText = chatInput.value;
    if (userText.trim() === '') return;

    addMessage(userText, 'user');
    chatInput.value = '';

    const loadingId = 'loading-' + Date.now();
    addMessage("Rédaction en cours...", 'bot', loadingId);

    const aiResponse = await getAiResponse(userText);

    const loadingMsg = document.getElementById(loadingId);
    if (loadingMsg) loadingMsg.remove();
    addMessage(aiResponse, 'bot');
  }

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSend();
  });

  sendBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    handleSend();
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
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
    console.log(isOpen);
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
