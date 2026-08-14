const progress = document.createElement('div');
progress.className = 'scroll-progress';
const optimizedTopicImages = {
  'compostaje.jpg': 'compostaje.webp',
  'educacion-ambiental.jpg': 'educacion-ambiental.webp',
  'comercio-con-sentido.jpg': 'comercio-con-sentido.webp'
};
const topicHeroImage = document.querySelector('.topic-hero .hero-image');
if (topicHeroImage) {
  const sourceName = topicHeroImage.getAttribute('src');
  if (optimizedTopicImages[sourceName]) topicHeroImage.src = optimizedTopicImages[sourceName];
  topicHeroImage.decoding = 'async';
  topicHeroImage.fetchPriority = 'high';
}
document.querySelectorAll('.brand img').forEach((logo) => {
  logo.src = 'kc-logo.webp';
  logo.width = 900;
  logo.height = 277;
});
const sharedFooterScript = document.createElement('script');
sharedFooterScript.src = 'footer-global.js';
document.body.appendChild(sharedFooterScript);
document.body.prepend(progress);

const sections = document.querySelectorAll('.topic-hero, .intro, .topics, .closing');
sections.forEach((section) => section.classList.add('reveal-topic'));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
sections.forEach((section) => observer.observe(section));

const feedback = document.createElement('div');
feedback.className = 'topic-feedback';
feedback.setAttribute('role', 'status');
const topics = document.querySelector('.topics');
if (topics) topics.insertAdjacentElement('afterend', feedback);

document.querySelectorAll('.topic').forEach((card) => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-pressed', 'false');
  const activate = () => {
    document.querySelectorAll('.topic').forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-pressed', 'false');
    });
    card.classList.add('is-active');
    card.setAttribute('aria-pressed', 'true');
    feedback.innerHTML = `<strong>${card.querySelector('h3').textContent}</strong><span>${card.querySelector('p').textContent}</span>`;
    feedback.classList.add('is-visible');
  };
  card.addEventListener('click', activate);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
    }
  });
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
  });
});

document.querySelector('.back-link')?.addEventListener('click', (event) => {
  event.currentTarget.classList.add('link-clicked');
});

const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();
