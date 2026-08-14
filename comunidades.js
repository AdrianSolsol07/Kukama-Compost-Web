const profileContent = [
  {
    label: 'Manos que crean · 01',
    story: '“Aquí irá su experiencia, su historia y el motivo que inspira su trabajo.”',
    works: [
      ['comercio-con-sentido.webp', 'Trabajo de la primera persona'],
      ['taller-1.webp', 'Artesanía de la primera persona'],
      ['taller-2.webp', 'Creación de la primera persona']
    ]
  },
  {
    label: 'Manos que crean · 02',
    story: '“Aquí irá una segunda experiencia sobre sus saberes, aprendizajes y trabajo en la comunidad.”',
    works: [
      ['taller-2.webp', 'Trabajo de la segunda persona'],
      ['taller-3.webp', 'Artesanía de la segunda persona'],
      ['comercio-con-sentido.webp', 'Creación de la segunda persona']
    ]
  },
  {
    label: 'Manos que crean · 03',
    story: '“Aquí irá una tercera historia acerca de su oficio, su inspiración y la importancia de compartirlo.”',
    works: [
      ['taller-4.webp', 'Trabajo de la tercera persona'],
      ['comercio-con-sentido.webp', 'Artesanía de la tercera persona'],
      ['taller-1.webp', 'Creación de la tercera persona']
    ]
  }
];

const calculateAge = (birthDate, today = new Date()) => {
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayHasPassed = today.getMonth() > birthDate.getMonth()
    || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!birthdayHasPassed) age -= 1;
  return age;
};

const getAgeLabel = (birthText) => {
  const match = birthText.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return 'Por definir';

  const [, dayText, monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  const birthDate = new Date(year, month - 1, day);
  const isValidDate = birthDate.getFullYear() === year
    && birthDate.getMonth() === month - 1
    && birthDate.getDate() === day
    && birthDate <= new Date();

  return isValidDate ? `${calculateAge(birthDate)} años` : 'Fecha inválida';
};

const profileButtons = [...document.querySelectorAll('[data-profile]')];
const detailPanel = document.querySelector('#artisan-profile-detail');
const detailPhoto = detailPanel.querySelector('.profile-detail-photo');
const detailLabel = detailPanel.querySelector('.profile-detail-label');
const detailName = detailPanel.querySelector('.profile-detail-name');
const detailCommunity = detailPanel.querySelector('.profile-detail-community');
const detailBirth = detailPanel.querySelector('.profile-detail-birth');
const detailAge = detailPanel.querySelector('.profile-detail-age');
const detailStory = detailPanel.querySelector('.profile-detail-story');
const detailWorks = detailPanel.querySelector('.profile-detail-works');
const detailBack = detailPanel.querySelector('.profile-detail-back');
const directory = document.querySelector('.people-directory');
let selectedProfile = null;

const openProfile = (index) => {
  const button = profileButtons[index];
  const card = button.closest('.artisan-card');
  const summaryPhoto = card.querySelector('img');
  const profile = profileContent[index];

  selectedProfile = index;
  profileButtons.forEach((profileButton, buttonIndex) => {
    const isSelected = buttonIndex === index;
    profileButton.setAttribute('aria-expanded', String(isSelected));
    profileButton.closest('.artisan-card').classList.toggle('is-selected', isSelected);
  });

  detailPhoto.src = summaryPhoto.getAttribute('src');
  detailPhoto.alt = summaryPhoto.alt;
  detailLabel.textContent = profile.label;
  detailName.textContent = card.querySelector('h3').textContent;
  detailCommunity.textContent = card.querySelector('.artisan-card-body p').textContent;
  detailBirth.textContent = button.dataset.birth;
  detailAge.textContent = getAgeLabel(button.dataset.birth);
  detailStory.textContent = profile.story;
  detailWorks.replaceChildren(...profile.works.map(([src, alt]) => {
    const image = document.createElement('img');
    image.src = src;
    image.alt = alt;
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    return image;
  }));

  detailPanel.hidden = false;
  directory.classList.add('is-profile-view');
  detailPanel.classList.remove('is-open');
  requestAnimationFrame(() => detailPanel.classList.add('is-open'));
  directory.scrollIntoView({ behavior: 'smooth', block: 'start' });
  detailBack.focus({ preventScroll: true });
};

const closeProfile = () => {
  detailPanel.classList.remove('is-open');
  detailPanel.hidden = true;
  directory.classList.remove('is-profile-view');
  profileButtons.forEach((button) => button.setAttribute('aria-expanded', 'false'));
  document.querySelectorAll('.artisan-card.is-selected').forEach((card) => card.classList.remove('is-selected'));
  if (selectedProfile !== null) profileButtons[selectedProfile].focus();
  selectedProfile = null;
};

profileButtons.forEach((button, index) => button.addEventListener('click', () => openProfile(index)));
detailBack.addEventListener('click', closeProfile);
setInterval(() => {
  if (selectedProfile !== null) {
    detailAge.textContent = getAgeLabel(profileButtons[selectedProfile].dataset.birth);
  }
}, 6 * 60 * 60 * 1000);

const imageViewer = document.createElement('div');
imageViewer.className = 'artisan-image-viewer';
imageViewer.hidden = true;
imageViewer.setAttribute('role', 'dialog');
imageViewer.setAttribute('aria-modal', 'true');
imageViewer.setAttribute('aria-label', 'Imagen ampliada del trabajo');
imageViewer.innerHTML = '<div><button type="button" aria-label="Cerrar imagen">×</button><img src="" alt=""></div>';
document.body.appendChild(imageViewer);

const enlargedImage = imageViewer.querySelector('img');
let lastWorkImage = null;

const openImageViewer = (image) => {
  lastWorkImage = image;
  enlargedImage.src = image.src;
  enlargedImage.alt = image.alt;
  imageViewer.hidden = false;
  document.body.classList.add('gallery-open');
  imageViewer.querySelector('button').focus();
};

const closeImageViewer = () => {
  imageViewer.hidden = true;
  document.body.classList.remove('gallery-open');
  if (lastWorkImage) lastWorkImage.focus();
};

detailWorks.addEventListener('click', (event) => {
  const image = event.target.closest('img');
  if (image) openImageViewer(image);
});

detailWorks.addEventListener('keydown', (event) => {
  const image = event.target.closest('img');
  if (image && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    openImageViewer(image);
  }
});

imageViewer.querySelector('button').addEventListener('click', closeImageViewer);
imageViewer.addEventListener('click', (event) => {
  if (event.target === imageViewer) closeImageViewer();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!imageViewer.hidden) closeImageViewer();
  else if (!detailPanel.hidden) closeProfile();
});
