// Al recargar, inicia siempre desde la parte superior de la página.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) window.scrollTo(0, 0);
});

const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-nav');
const header = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('.main-nav a');

const artisanLink = document.querySelector('.community .button-outline');
if (artisanLink) {
  artisanLink.href = 'comunidades.html';
  artisanLink.removeAttribute('target');
  artisanLink.removeAttribute('rel');
}

document.querySelectorAll('.brand').forEach((brand) => {
  brand.innerHTML = '<img src="kc-logo.webp" alt="Kukama Compost" width="900" height="277" decoding="async" style="display:block;width:auto;height:56px;max-width:210px;object-fit:contain" />';
});

document.querySelectorAll('.brand').forEach((brand) => {
  brand.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.reload();
  });
});

const scrollTopButton = document.createElement('button');
scrollTopButton.className = 'scroll-top-button';
scrollTopButton.type = 'button';
scrollTopButton.setAttribute('aria-label', 'Volver al inicio');
scrollTopButton.innerHTML = '<span aria-hidden="true">↑</span>';
document.body.appendChild(scrollTopButton);

const updateScrollTopButton = () => {
  scrollTopButton.classList.toggle('is-visible', window.scrollY > 350);
};

scrollTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', updateScrollTopButton, { passive: true });
updateScrollTopButton();

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  link.classList.remove('nav-clicked');
  void link.offsetWidth;
  link.classList.add('nav-clicked');
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const localNavLinks = [...navLinks].filter((link) => link.hash && document.querySelector(link.hash));
const updateHeaderState = () => {
  header.classList.toggle('header-scrolled', window.scrollY > 12);
};

const activeSectionObserver = new IntersectionObserver((entries) => {
  const visibleEntry = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visibleEntry) return;

  localNavLinks.forEach((link) => {
    link.classList.toggle('active', link.hash === `#${visibleEntry.target.id}`);
  });
}, { rootMargin: '-38% 0px -54% 0px', threshold: [0, .2, .5, .8] });

localNavLinks.forEach((link) => activeSectionObserver.observe(document.querySelector(link.hash)));
updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

const year = document.getElementById('year');
year.parentElement.textContent = `Todos los derechos reservados ©${new Date().getFullYear()} Kukama Compost - Iquitos - Perú.`;

const emailJsConfig = Object.freeze({
  serviceId: 'service_ntqjv7v',
  templateId: 'template_bajnupk',
  publicKey: 'RxhkAEVKHQx5i8pCh'
});
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = form.querySelector('.form-message');
  const submitButton = form.querySelector('[type="submit"]');
  const originalButtonContent = submitButton.innerHTML;
  const formData = new FormData(form);

  if (formData.get('sitio_web')) return;

  submitButton.disabled = true;
  submitButton.setAttribute('aria-busy', 'true');
  submitButton.textContent = 'Enviando…';
  message.textContent = 'Enviando tu mensaje…';

  try {
    const interestSelect = form.elements.interes;
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: emailJsConfig.serviceId,
        template_id: emailJsConfig.templateId,
        user_id: emailJsConfig.publicKey,
        template_params: {
          nombre: String(formData.get('nombre')).trim(),
          correo: String(formData.get('correo')).trim(),
          telefono: String(formData.get('telefono')).trim(),
          interes: interestSelect.options[interestSelect.selectedIndex].text,
          otro_interes: String(formData.get('otro_interes') || '').trim() || 'No proporcionada'
        }
      })
    });

    if (!response.ok) throw new Error(`EmailJS respondió con estado ${response.status}`);

    message.textContent = '¡Gracias! Tu mensaje fue enviado correctamente.';
    form.reset();
    const extraField = form.querySelector('.other-interest-field');
    const extraInput = form.querySelector('#other-interest');
    extraField.hidden = true;
    extraInput.required = false;
    extraInput.value = '';
  } catch (error) {
    console.error('No se pudo enviar el formulario de contacto.', error);
    message.textContent = 'No pudimos enviar tu mensaje. Revisa tu conexión e inténtalo nuevamente.';
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute('aria-busy');
    submitButton.innerHTML = originalButtonContent;
  }
});

const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const loginLink = document.querySelector('.login-link');
const closeLogin = document.getElementById('close-login');
let loginTrigger = null;

function openLoginModal() {
  loginTrigger = document.activeElement;
  loginModal.hidden = false;
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  loginForm.elements.usuario.focus();
}

function closeLoginModal() {
  loginModal.hidden = true;
  loginForm.reset();
  loginForm.querySelector('.login-message').textContent = '';
  if (loginTrigger instanceof HTMLElement) loginTrigger.focus();
}

loginLink.addEventListener('click', openLoginModal);
closeLogin.addEventListener('click', closeLoginModal);

loginModal.addEventListener('click', (event) => {
  if (event.target === loginModal) closeLoginModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !loginModal.hidden) closeLoginModal();
  if (event.key === 'Tab' && !loginModal.hidden) {
    const focusable = [...loginModal.querySelectorAll('button, input, select, textarea, a[href]')]
      .filter((element) => !element.disabled && !element.hidden);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loginForm.querySelector('.login-message').textContent = 'Acceso de prueba listo. Luego lo conectamos con Firebase.';
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));

const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

const leafLayer = document.createElement('div');
leafLayer.className = 'ambient-leaves';
for (let index = 0; index < 16; index += 1) {
  const leaf = document.createElement('span');
  leaf.className = 'ambient-leaf';
  leaf.style.setProperty('--x', `${Math.random() * 100}vw`);
  leaf.style.setProperty('--drift', `${Math.random() * 160 - 80}px`);
  leaf.style.setProperty('--duration', `${9 + Math.random() * 9}s`);
  leaf.style.setProperty('--delay', `${Math.random() * 8}s`);
  leaf.style.setProperty('--rotation', `${Math.random() * 180}deg`);
  leafLayer.appendChild(leaf);
}
document.body.appendChild(leafLayer);

const updateScrollProgress = () => {
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = pageHeight > 0 ? (window.scrollY / pageHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
};

const animateCount = (element) => {
  if (element.dataset.counted) return;
  element.dataset.counted = 'true';

  const original = element.textContent.trim();
  const target = Number(original.replace(/\D/g, ''));
  if (!target) return;

  const prefix = original.startsWith('+') ? '+' : '';
  const suffix = original.includes('%') ? '%' : '';
  let current = 0;
  const steps = 42;
  const increment = target / steps;

  const tick = () => {
    current += increment;
    if (current >= target) {
      element.textContent = `${prefix}${target}${suffix}`;
      return;
    }
    element.textContent = `${prefix}${Math.round(current)}${suffix}`;
    requestAnimationFrame(tick);
  };

  tick();
};

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: .8 });

document.querySelectorAll('.impact-row strong').forEach((item) => countObserver.observe(item));

document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const rotateX = (y - 50) / -12;
    const rotateY = (x - 50) / 12;

    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
    card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

document.querySelectorAll('.area-list span').forEach((area) => {
  area.addEventListener('click', () => {
    area.classList.toggle('is-selected');
  });
});

document.querySelectorAll('.button, .main-nav a').forEach((element) => {
  element.addEventListener('click', (event) => {
    const burst = document.createElement('span');
    burst.className = 'click-burst';
    burst.style.left = `${event.clientX}px`;
    burst.style.top = `${event.clientY}px`;
    document.body.appendChild(burst);
    window.setTimeout(() => burst.remove(), 620);
  });
});

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

const workshopSlider = document.querySelector('.workshop-slider');
if (workshopSlider) {
  const slides = [...workshopSlider.querySelectorAll('.workshop-slide')];
  const dots = [...workshopSlider.querySelectorAll('.slider-dots button')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeSlide = 0;
  let timer = null;

  const showSlide = (index) => {
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, position) => {
      const isActive = position === activeSlide;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    dots.forEach((dot, position) => {
      const isActive = position === activeSlide;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
      dot.tabIndex = isActive ? 0 : -1;
    });
  };
  const stop = () => {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };
  const start = () => {
    stop();
    if (!reduceMotion && !document.hidden) {
      timer = window.setInterval(() => showSlide(activeSlide + 1), 3500);
    }
  };
  const selectSlide = (index) => {
    showSlide(index);
    start();
  };

  workshopSlider.querySelector('.slider-prev').addEventListener('click', () => selectSlide(activeSlide - 1));
  workshopSlider.querySelector('.slider-next').addEventListener('click', () => selectSlide(activeSlide + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => selectSlide(index)));
  dots.forEach((dot, index) => {
    dot.setAttribute('role', 'tab');
    dot.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const nextIndex = event.key === 'ArrowRight' ? index + 1 : index - 1;
      const normalizedIndex = (nextIndex + dots.length) % dots.length;
      selectSlide(normalizedIndex);
      dots[normalizedIndex].focus();
    });
  });
  workshopSlider.addEventListener('mouseenter', stop);
  workshopSlider.addEventListener('mouseleave', start);
  workshopSlider.addEventListener('focusin', stop);
  workshopSlider.addEventListener('focusout', (event) => {
    if (!workshopSlider.contains(event.relatedTarget)) start();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (!workshopSlider.matches(':hover') && !workshopSlider.contains(document.activeElement)) start();
  });
  start();
}
const lightbox = document.createElement('div');
lightbox.className = 'photo-lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', 'Foto ampliada del taller');
lightbox.innerHTML = '<div class="photo-lightbox__content"><button class="photo-lightbox__close" type="button" aria-label="Cerrar foto">×</button><img alt="" /></div>';
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector('img');
let lastWorkshopImage = null;
const closeLightbox = () => {
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
  if (lastWorkshopImage) lastWorkshopImage.focus();
};
document.querySelectorAll('.workshop-slide img').forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `Ampliar: ${image.alt}`);
  const openLightbox = () => {
    lastWorkshopImage = image;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.photo-lightbox__close').focus();
  };
  image.addEventListener('click', openLightbox);
  image.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox();
    }
  });
});
lightbox.querySelector('.photo-lightbox__close').addEventListener('click', closeLightbox);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
});
const contactInterest = document.getElementById('contact-interest');
const otherInterestField = document.querySelector('.other-interest-field');
const otherInterest = document.getElementById('other-interest');
if (contactInterest && otherInterestField && otherInterest) {
  const toggleOtherInterest = () => {
    const isOther = contactInterest.value === 'otro';
    otherInterestField.hidden = !isOther;
    otherInterest.required = isOther;
    if (isOther) otherInterest.focus();
    else otherInterest.value = '';
  };
  contactInterest.addEventListener('change', toggleOtherInterest);
  toggleOtherInterest();
}
