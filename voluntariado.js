document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.brand').forEach((brand) => {
  brand.innerHTML = '<img src="kc-logo.webp" alt="Kukama Compost" width="900" height="277" decoding="async" style="display:block;width:auto;height:56px;max-width:210px;object-fit:contain" />';
});

document.querySelectorAll('.back-link').forEach((link) => {
  link.addEventListener('click', () => {
    link.classList.remove('link-clicked');
    void link.offsetWidth;
    link.classList.add('link-clicked');
  });
});

const questions = [
  {
    id: 'nombre',
    type: 'text',
    title: 'Empecemos por conocerte. ¿Cuál es tu nombre completo?',
    hint: 'Escribe tus nombres y apellidos.',
    placeholder: 'Tu nombre completo',
    required: true
  },
  {
    id: 'documento',
    type: 'text',
    title: '¿Cuál es tu DNI o documento de identidad?',
    hint: 'Este dato nos ayuda a registrar tu carta de compromiso.',
    placeholder: 'Ej. 12345678',
    required: true
  },
  {
    id: 'correo',
    type: 'email',
    title: '¿Cuál es tu correo electrónico?',
    hint: 'Usa un correo que revises con frecuencia.',
    placeholder: 'nombre@correo.com',
    required: true
  },
  {
    id: 'telefono',
    type: 'tel',
    title: '¿Cuál es tu número de WhatsApp o teléfono?',
    hint: 'Lo usaremos para coordinar actividades de voluntariado.',
    placeholder: 'Ej. 987 654 321',
    required: true
  },
  {
    id: 'area',
    type: 'options',
    title: '¿En qué área te gustaría participar?',
    hint: 'Elige el área que más se acerque a tus intereses.',
    required: true,
    options: [
      ['📢', 'Marketing y Comunicación', 'Contenido, redes sociales y comunicación.'],
      ['🚚', 'Operaciones y Logística', 'Organización de actividades y soporte en campo.'],
      ['🛍️', 'Comercial', 'Ferias, productos y contacto con aliados.'],
      ['🤝', 'Recursos Humanos', 'Acompañamiento, bienestar y coordinación.'],
      ['🌿', 'Social y Comunitaria', 'Trabajo con comunidades y actividades educativas.'],
      ['🌱', 'Educación ambiental', 'Talleres, sensibilización y aprendizaje práctico.']
    ]
  },
  {
    id: 'disponibilidad',
    type: 'options',
    title: '¿Cuál es tu disponibilidad?',
    hint: 'Selecciona la opción que mejor describe tus tiempos.',
    required: true,
    options: [
      ['📅', 'Entre semana', 'Puedo apoyar de lunes a viernes.'],
      ['☀️', 'Fines de semana', 'Tengo más tiempo sábado o domingo.'],
      ['✨', 'Según actividades o eventos', 'Puedo sumarme cuando haya convocatorias.']
    ]
  },
  {
    id: 'motivacion',
    type: 'textarea',
    title: '¿Por qué deseas ser voluntario/a en Kukama Compost?',
    hint: 'No buscamos una respuesta perfecta. Queremos conocer tu motivación.',
    placeholder: 'Cuéntanos brevemente qué te mueve a participar...',
    maxLength: 500,
    required: true
  },
  {
    id: 'aceptacion',
    type: 'commitment',
    title: 'Carta de compromiso',
    hint: 'Lee y acepta el compromiso para enviar tu carta.',
    required: true
  }
];

const answers = {};
let currentQuestion = 0;

const welcomeScreen = document.getElementById('welcome-screen');
const formScreen = document.getElementById('form-screen');
const finishScreen = document.getElementById('finish-screen');
const questionContainer = document.getElementById('question-container');
const counter = document.getElementById('wizard-counter');
const percentCounter = document.getElementById('wizard-percent');
const progressBar = document.getElementById('wizard-progress-bar');
const progressTrack = progressBar.parentElement;
const nextButton = document.getElementById('next-question');
const previousButton = document.getElementById('previous-question');

function showScreen(screen) {
  [welcomeScreen, formScreen, finishScreen].forEach((item) => item.classList.remove('active'));
  screen.classList.add('active');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

function renderQuestion() {
  const question = questions[currentQuestion];
  const questionNumber = String(currentQuestion + 1).padStart(2, '0');
  const total = String(questions.length).padStart(2, '0');
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  counter.textContent = `${questionNumber} / ${total}`;
  percentCounter.textContent = `${Math.round(progress)}%`;
  progressBar.style.width = `${progress}%`;
  progressTrack.setAttribute('aria-valuenow', String(Math.round(progress)));
  previousButton.style.visibility = currentQuestion === 0 ? 'hidden' : 'visible';
  nextButton.innerHTML = currentQuestion === questions.length - 1 ? 'Generar carta <span>✓</span>' : 'Continuar <span>→</span>';

  let content = `
    <article class="wizard-question">
      <div class="question-number">${questionNumber}</div>
      <h2 id="question-title">${question.title}</h2>
      <p class="question-hint" id="question-hint">${question.hint}</p>
  `;

  if (question.type === 'text' || question.type === 'email' || question.type === 'tel') {
    content += `
      <input id="answer-input" class="wizard-input" type="${question.type}" placeholder="${question.placeholder}" value="${escapeHtml(answers[question.id] || '')}" aria-labelledby="question-title" aria-describedby="question-hint wizard-error" autocomplete="${question.id === 'nombre' ? 'name' : question.id === 'correo' ? 'email' : question.id === 'telefono' ? 'tel' : 'off'}" />
    `;
  }

  if (question.type === 'textarea') {
    content += `
      <textarea id="answer-input" class="wizard-input wizard-textarea" placeholder="${question.placeholder}" aria-labelledby="question-title" aria-describedby="question-hint writing-counter wizard-error">${escapeHtml(answers[question.id] || '')}</textarea>
      <div class="writing-meter"><span></span><small id="writing-counter">0/${question.maxLength || 500} caracteres</small></div>
    `;
  }

  if (question.type === 'options') {
    content += '<div class="wizard-options">';
    question.options.forEach((option) => {
      const selected = answers[question.id] === option[1] ? 'selected' : '';
      content += `
        <button class="wizard-option ${selected}" type="button" data-value="${escapeHtml(option[1])}">
          <strong>${option[0]} ${option[1]}</strong>
          <small>${option[2]}</small>
        </button>
      `;
    });
    content += '</div>';
  }

  if (question.type === 'commitment') {
    content += `
      <div class="commitment-card">
        <p>Declaro que participaré de forma voluntaria y responsable en las actividades acordadas con Kukama Compost. Me comprometo a respetar a las personas, comunidades, saberes y territorio; cumplir las orientaciones de seguridad; y comunicar cualquier cambio en mi disponibilidad.</p>
        <button class="commitment-toggle ${answers.aceptacion ? 'selected' : ''}" type="button" data-value="Acepto la Carta de Compromiso">
          ${answers.aceptacion ? 'Compromiso aceptado' : 'Acepto esta Carta de Compromiso'}
        </button>
      </div>
    `;
  }

  content += '<p class="wizard-error" id="wizard-error" role="alert">Por favor, completa esta pregunta para continuar.</p></article>';
  questionContainer.innerHTML = content;

  bindCurrentQuestion();
}

function bindCurrentQuestion() {
  const question = questions[currentQuestion];
  const input = document.getElementById('answer-input');

  if (input) {
    if (question.maxLength) input.maxLength = question.maxLength;
    input.focus();
    input.addEventListener('input', () => {
      answers[question.id] = input.value.trim();
      updateWritingMeter();
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && question.type !== 'textarea') {
        event.preventDefault();
        nextQuestion();
      }
    });
    updateWritingMeter();
  }

  document.querySelectorAll('.wizard-option').forEach((button) => {
    button.addEventListener('click', () => {
      answers[question.id] = button.dataset.value;
      document.querySelectorAll('.wizard-option').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
    });
  });

  document.querySelectorAll('.commitment-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      answers.aceptacion = 'Acepto la Carta de Compromiso';
      button.classList.add('selected');
      button.textContent = 'Compromiso aceptado';
    });
  });
}

function updateWritingMeter() {
  const meter = document.querySelector('.writing-meter span');
  const counter = document.getElementById('writing-counter');
  const input = document.getElementById('answer-input');
  if (!meter || !input) return;

  const question = questions[currentQuestion];
  const limit = question.maxLength || 500;
  const currentLength = input.value.length;
  const percent = Math.min(100, Math.round((currentLength / limit) * 100));
  meter.style.width = `${percent}%`;
  if (counter) counter.textContent = `${currentLength}/${limit} caracteres`;
  document.querySelector('.writing-meter')?.classList.toggle('is-full', currentLength >= limit);
}

function validateCurrent() {
  const question = questions[currentQuestion];
  const error = document.getElementById('wizard-error');
  const value = answers[question.id];
  let valid = true;

  if (question.required) {
    valid = Boolean(value && String(value).trim().length > 0);
  }

  if (question.id === 'correo' && valid) {
    valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!valid) error.textContent = 'Escribe un correo válido para continuar.';
  } else {
    error.textContent = 'Por favor, completa esta pregunta para continuar.';
  }

  error.classList.toggle('visible', !valid);
  document.getElementById('answer-input')?.setAttribute('aria-invalid', String(!valid));
  return valid;
}

function nextQuestion() {
  if (!validateCurrent()) return;

  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
    return;
  }

  finishWizard();
}

function previousQuestion() {
  if (currentQuestion === 0) return;
  currentQuestion -= 1;
  renderQuestion();
}

function celebrateCommitment() {
  const celebration = document.createElement('div');
  celebration.className = 'celebration';
  const icons = ['🌿', '🍃', '🌱', '♻️', '🪴', '✨'];

  for (let index = 0; index < 36; index += 1) {
    const particle = document.createElement('span');
    particle.textContent = icons[index % icons.length];
    particle.style.setProperty('--x', `${Math.random() * 100}vw`);
    particle.style.setProperty('--delay', `${Math.random() * .35}s`);
    particle.style.setProperty('--spin', `${Math.random() * 540 - 270}deg`);
    celebration.appendChild(particle);
  }

  document.body.appendChild(celebration);
  window.setTimeout(() => celebration.remove(), 2600);
}

function finishWizard() {
  document.getElementById('answer-summary').innerHTML = `
    <span>${escapeHtml(answers.nombre)}</span>
    <span>${escapeHtml(answers.area)}</span>
    <span>${escapeHtml(answers.disponibilidad)}</span>
  `;
  showScreen(finishScreen);
  renderCommitmentLetter();
  celebrateCommitment();
}

function renderCommitmentLetter() {
  let letter = document.getElementById('volunteer-letter');
  if (!letter) {
    letter = document.createElement('section');
    letter.id = 'volunteer-letter';
    letter.className = 'volunteer-letter';
    document.querySelector('main').appendChild(letter);
  }

  const today = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  letter.innerHTML = `
    <div class="letter-actions"><p>Revisa tu carta antes de descargarla.</p><div><button class="button button-primary" type="button" id="download-letter">Descargar PDF <span>↓</span></button><button class="letter-close" type="button" id="close-letter" aria-label="Cerrar vista previa">×</button></div></div>
    <article class="letter-sheet">
      <header class="letter-heading"><img src="kc-logo.webp" alt="Kukama Compost" width="900" height="277"><div><strong>Carta de compromiso</strong><span>Kukama Compost · Iquitos, Perú</span></div></header>
      <div class="letter-title"><p>Voluntariado con propósito</p><h2>Carta de compromiso de voluntariado</h2><span>Ley N.° 28238 - Ley General del Voluntariado del Perú</span></div>
      <p class="letter-date">Iquitos, ${today}</p>
      <p>Yo, <strong>${escapeHtml(answers.nombre || '________________________')}</strong>, identificado/a con DNI o documento N.° <strong>${escapeHtml(answers.documento || '____________')}</strong>, teléfono <strong>${escapeHtml(answers.telefono || '____________')}</strong> y correo electrónico <strong>${escapeHtml(answers.correo || '________________________')}</strong>, manifiesto libremente mi voluntad de participar como voluntario/a en Kukama Compost.</p>
      <section class="letter-data"><h3>Mi compromiso</h3><div><p><span>Área de participación</span><strong>${escapeHtml(answers.area || 'Por definir')}</strong></p><p><span>Disponibilidad</span><strong>${escapeHtml(answers.disponibilidad || 'Por definir')}</strong></p></div></section>
      <p>Me comprometo a actuar con responsabilidad, respeto, solidaridad y cuidado del territorio; cumplir las coordinaciones y medidas de seguridad de cada actividad; tratar con dignidad a las personas y comunidades; y comunicar oportunamente cualquier situación que limite mi participación.</p>
      <p>Comprendo que esta colaboración es libre, solidaria y no remunerada, y que no sustituye una relación laboral. Asimismo, autorizo el uso de mis datos únicamente para la organización y seguimiento de las actividades de voluntariado, conforme a la normativa aplicable.</p>
      <div class="letter-signatures"><div><span>Firma del/de la voluntario/a</span><strong>${escapeHtml(answers.nombre || '')}</strong></div><div><span>Representante de Kukama Compost</span><strong>Nombre y firma</strong></div></div>
      <footer class="letter-footer">Kukama Compost · Sembramos compromiso, transformamos territorio.</footer>
    </article>`;

  letter.hidden = true;
  document.getElementById('download-letter').addEventListener('click', downloadCommitmentPdf);
  document.getElementById('close-letter').addEventListener('click', closeLetterPreview);
}

document.getElementById('view-letter').addEventListener('click', () => {
  const letter = document.getElementById('volunteer-letter');
  letter.hidden = false;
  document.body.classList.add('letter-preview-open');
});

function closeLetterPreview() {
  document.getElementById('volunteer-letter').hidden = true;
  document.body.classList.remove('letter-preview-open');
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const test = `${line} ${word}`.trim();
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, y);
  return y + lineHeight;
}

function jpegToPdf(dataUrl, width, height) {
  const imageBytes = Uint8Array.from(atob(dataUrl.split(',')[1]), char => char.charCodeAt(0));
  const encoder = new TextEncoder();
  const parts = [];
  let offset = 0;
  const offsets = [0];
  const add = (value) => { const bytes = typeof value === 'string' ? encoder.encode(value) : value; parts.push(bytes); offset += bytes.length; };
  add('%PDF-1.4\n');
  const object = (number, body) => { offsets[number] = offset; add(`${number} 0 obj\n${body}\nendobj\n`); };
  object(1, '<< /Type /Catalog /Pages 2 0 R >>');
  object(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  object(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
  offsets[4] = offset; add(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`); add(imageBytes); add('\nendstream\nendobj\n');
  const stream = 'q 595.28 0 0 841.89 0 0 cm /Im0 Do Q';
  object(5, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  const xref = offset; add('xref\n0 6\n0000000000 65535 f \n');
  for (let i = 1; i <= 5; i += 1) add(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  add(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(parts, { type: 'application/pdf' });
}

async function downloadCommitmentPdf() {
  const button = document.getElementById('download-letter');
  button.disabled = true;
  button.textContent = 'Preparando PDF…';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1240; canvas.height = 1754;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Membrete dibujado en el propio PDF para funcionar también desde file://.
    ctx.save();
    ctx.translate(620, 92);
    ctx.strokeStyle = '#8ab83f'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(-190, 0, 38, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#795136'; ctx.beginPath(); ctx.ellipse(-190, 27, 25, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#77a832'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-190, 22); ctx.lineTo(-190, -20); ctx.stroke();
    ctx.fillStyle = '#8ebc43'; ctx.beginPath(); ctx.ellipse(-205, -8, 14, 7, .65, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(-176, -8, 14, 7, -.65, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ed8244'; ctx.font = '700 42px Arial'; ctx.textAlign = 'left'; ctx.fillText('KUKAMA', -140, 2);
    ctx.fillStyle = '#51301f'; ctx.font = '700 20px Arial'; ctx.letterSpacing = '7px'; ctx.fillText('C O M P O S T', -137, 29);
    ctx.restore();

    ctx.strokeStyle = '#c9dfa1'; ctx.lineWidth = 28; ctx.beginPath(); ctx.arc(920, 1430, 455, Math.PI * .95, Math.PI * 1.92); ctx.stroke();
    ctx.fillStyle = '#c9dfa1'; ctx.beginPath(); ctx.moveTo(920, 1500); ctx.lineTo(835, 1360); ctx.lineTo(920, 1240); ctx.lineTo(1005, 1360); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#c9dfa1'; ctx.beginPath(); ctx.ellipse(790, 1480, 95, 38, .7, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(1050, 1460, 100, 38, -.7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c9b8ad'; ctx.beginPath(); ctx.ellipse(920, 1765, 380, 190, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#7fbd32'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(65, 1620); ctx.lineTo(1175, 1620); ctx.stroke();
    ctx.fillStyle = '#684334'; ctx.font = 'italic 18px Arial'; ctx.textAlign = 'left'; ctx.fillText('Leydiаna Menacho farroñay - Kukama Compost'.replace('а', 'a'), 65, 1650); ctx.fillText('Correo: leydiana.mf@gmail.com', 65, 1676); ctx.fillText('Telef.: 954779746', 65, 1702); ctx.fillText('Dirección: Pasaje Iquitos 136, Punchana', 65, 1728);
    const originalLetterhead = new Image();
    originalLetterhead.src = window.KUKAMA_MEMBRETE_SVG;
    await new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error('No se pudo cargar el membrete SVG.')), 8000);
      originalLetterhead.onload = () => { window.clearTimeout(timeout); resolve(); };
      originalLetterhead.onerror = () => { window.clearTimeout(timeout); reject(new Error('No se pudo cargar el membrete SVG.')); };
    });
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalLetterhead, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#17392c'; ctx.textAlign = 'center'; ctx.font = '700 18px Arial';
  ctx.fillStyle = '#245d43'; ctx.fillText('VOLUNTARIADO CON PROPÓSITO', 620, 350);
  ctx.fillStyle = '#17392c'; ctx.font = '700 38px Arial'; ctx.fillText('CARTA DE COMPROMISO DE VOLUNTARIADO', 620, 398);
  ctx.fillStyle = '#5d7067'; ctx.font = '18px Arial'; ctx.fillText('Ley N.° 28238 - Ley General del Voluntariado del Perú', 620, 432);
  const today = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  ctx.textAlign = 'right'; ctx.fillText(`Iquitos, ${today}`, 1110, 500);
  ctx.textAlign = 'left'; ctx.fillStyle = '#17392c'; ctx.font = '22px Arial';
  let y = drawWrappedText(ctx, `Yo, ${answers.nombre}, identificado/a con DNI o documento N.° ${answers.documento}, teléfono ${answers.telefono} y correo electrónico ${answers.correo}, manifiesto libremente mi voluntad de participar como voluntario/a en Kukama Compost.`, 125, 565, 990, 34);
  y += 25; ctx.fillStyle = '#f7faef'; ctx.strokeStyle = '#dce4cf'; ctx.lineWidth = 2; ctx.fillRect(125, y, 990, 145); ctx.strokeRect(125, y, 990, 145);
  ctx.fillStyle = '#245d43'; ctx.font = '700 19px Arial'; ctx.fillText('DATOS DEL COMPROMISO', 155, y + 38);
  ctx.fillStyle = '#5d7067'; ctx.font = '18px Arial'; ctx.fillText('Área de participación', 155, y + 78); ctx.fillText('Disponibilidad', 650, y + 78);
  ctx.fillStyle = '#17392c'; ctx.font = '700 20px Arial'; ctx.fillText(answers.area || 'Por definir', 155, y + 112); ctx.fillText(answers.disponibilidad || 'Por definir', 650, y + 112);
  y += 195; ctx.font = '21px Arial';
  y = drawWrappedText(ctx, 'Me comprometo a actuar con responsabilidad, respeto, solidaridad y cuidado del territorio; cumplir las coordinaciones y medidas de seguridad de cada actividad; tratar con dignidad a las personas y comunidades; y comunicar oportunamente cualquier situación que limite mi participación.', 125, y, 990, 33);
  y += 15; y = drawWrappedText(ctx, 'Comprendo que esta colaboración es libre, solidaria y no remunerada, y que no sustituye una relación laboral. Autorizo el uso de mis datos únicamente para la organización y seguimiento de las actividades de voluntariado, conforme a la normativa aplicable.', 125, y, 990, 33);
  const signatureY = Math.min(1160, y + 90); ctx.strokeStyle = '#17392c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(180, signatureY); ctx.lineTo(500, signatureY); ctx.moveTo(740, signatureY); ctx.lineTo(1060, signatureY); ctx.stroke();
  ctx.fillStyle = '#5d7067'; ctx.font = '17px Arial'; ctx.textAlign = 'center'; ctx.fillText('Firma del/de la voluntario/a', 340, signatureY + 30); ctx.fillText('Representante de Kukama Compost', 900, signatureY + 30);
    const pdf = jpegToPdf(canvas.toDataURL('image/jpeg', .94), canvas.width, canvas.height);
    const url = URL.createObjectURL(pdf);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Carta-compromiso-${(answers.nombre || 'voluntariado').replace(/\s+/g, '-')}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 3000);
  } catch (error) {
    window.alert(`No se pudo generar el PDF: ${error.message}`);
  } finally {
    button.disabled = false;
    button.innerHTML = 'Descargar PDF <span>↓</span>';
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !document.getElementById('volunteer-letter')?.hidden) closeLetterPreview();
});

document.getElementById('start-wizard').addEventListener('click', () => {
  showScreen(formScreen);
  renderQuestion();
});

document.getElementById('exit-wizard').addEventListener('click', () => {
  window.location.href = 'index.html#inicio';
});

nextButton.addEventListener('click', nextQuestion);
previousButton.addEventListener('click', previousQuestion);
