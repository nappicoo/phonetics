/* ==========================================================
   PHONETICS QUIZ — LOGIC & DATA
   ========================================================== */

/* ---------- QUESTIONS (Based on your Answer Key) ---------- */
const QUESTIONS = [
  { 
    section: "Phonetics Basics", 
    q: "What is the primary focus of articulatory phonetics?", 
    options: ["How speech sounds are perceived by the ear", "How speech sounds are represented in writing", "How speech sounds are produced by the vocal organs", "How speech sounds change over time"], 
    correct: 2 // C
  },
  { 
    section: "Consonants", 
    q: "Which of the following is a bilabial consonant?", 
    options: ["/p/", "/t/", "/k/", "/f/"], 
    correct: 0 // A
  },
  { 
    section: "Consonants", 
    q: "What is the place of articulation for /t/ and /d/?", 
    options: ["Velar", "Alveolar", "Palatal", "Dental"], 
    correct: 1 // B
  },
  { 
    section: "Consonants", 
    q: "Which of these is a voiceless sound?", 
    options: ["/b/", "/d/", "/s/", "/g/"], 
    correct: 2 // C
  },
  { 
    section: "Vowels", 
    q: "How is the vowel sound in the word 'beat' classified?", 
    options: ["Low back", "High back", "High front", "Mid central"], 
    correct: 2 // C
  },
  { 
    section: "Vowels", 
    q: "What does a diphthong consist of?", 
    options: ["Three consonants in a row", "Two vowel qualities in one syllable", "A vowel followed by a nasal", "A completely silent letter"], 
    correct: 1 // B
  },
  { 
    section: "Consonants", 
    q: "Which of these is a fricative sound?", 
    options: ["/m/", "/b/", "/f/", "/w/"], 
    correct: 2 // C
  },
  { 
    section: "Consonants", 
    q: "What is the manner of articulation for /m/ and /n/?", 
    options: ["Plosive", "Nasal", "Lateral", "Affricate"], 
    correct: 1 // B
  },
  { 
    section: "Vowels", 
    q: "The schwa sound /ə/ is typically found in...", 
    options: ["Stressed syllables", "Unstressed syllables", "Only at the end of words", "Words with two syllables"], 
    correct: 1 // B
  },
  { 
    section: "Anatomy", 
    q: "Which organ is NOT part of the vocal tract?", 
    options: ["Larynx", "Liver", "Pharynx", "Oral cavity"], 
    correct: 1 // B
  },
  { 
    section: "Phonology", 
    q: "What is assimilation in phonetics?", 
    options: ["Dropping a sound at the end of a word", "A sound changing to become more like a neighboring sound", "Adding a vowel to break up consonant clusters", "Moving the stress to a different syllable"], 
    correct: 1 // B
  },
  { 
    section: "Vowels", 
    q: "What is the most common vowel sound in the English language?", 
    options: ["/i:/", "/ə/ (schwa)", "/u:/", "/æ/"], 
    correct: 1 // B
  },
  { 
    section: "Vowels", 
    q: "Which of the following determines the type of vowel sound?", 
    options: ["Tongue height", "Lip position", "Tongue position", "Vocal fold vibration"], 
    correct: 2 // C (as per user text) 
  },
  { 
    section: "Vowels", 
    q: "What are the three categories of tongue height?", 
    options: ["Front, central, back", "Rounded, unrounded, neutral", "High, mid, low", "Voiced, voiceless, nasal"], 
    correct: 2 // C (as per user text)
  },
  { 
    section: "Vowels", 
    q: "What does a rounded vowel mean?", 
    options: ["The lips are rounded during pronunciation.", "The tongue is always low.", "The airflow is completely blocked.", "The sound is always voiceless."], 
    correct: 0 // A (as per user text)
  }
];

/* ---------- QUOTES ---------- */
const QUOTES = [
  { t: "The limits of my language mean the limits of my world.", a: "Ludwig Wittgenstein" },
  { t: "Language is the blood of the soul into which thoughts run and out of which they grow.", a: "Oliver Wendell Holmes" },
  { t: "To learn a language is to have one more window from which to look at the world.", a: "Chinese Proverb" },
  { t: "A different language is a different vision of life.", a: "Federico Fellini" },
  { t: "Change your language and you change your thoughts.", a: "Karl Albrecht" },
  { t: "Knowledge of languages is the doorway to wisdom.", a: "Roger Bacon" },
  { t: "Learning is a treasure that will follow its owner everywhere.", a: "Chinese Proverb" }
];

/* ---------- STATE ---------- */
let order = [];              
let current = 0;             
let answers = {};            

/* ---------- ELEMENTS ---------- */
const $ = (id) => document.getElementById(id);
const views = { start: $('view-start'), quiz: $('view-quiz'), results: $('view-results') };

/* ---------- VIEW SWITCH ---------- */
function showView(name) {
  Object.values(views).forEach(v => v.classList.remove('active'));
  views[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- QUOTES ROTATION ---------- */
let quoteIndex = 0;
function renderQuote(targetTextId, targetAuthorId) {
  const q = QUOTES[quoteIndex % QUOTES.length];
  const t = document.getElementById(targetTextId);
  const a = document.getElementById(targetAuthorId);
  if (!t) return;
  t.style.opacity = 0;
  if (a) a.style.opacity = 0;
  setTimeout(() => {
    t.textContent = '"' + q.t + '"';
    if (a) a.textContent = '— ' + q.a;
    t.style.opacity = 1;
    if (a) a.style.opacity = 1;
  }, 300);
  quoteIndex++;
}

function startQuoteRotation() {
  renderQuote('start-quote-text', 'start-quote-author');
  renderQuote('quiz-quote-text', 'quiz-quote-author');
  setInterval(() => {
    renderQuote('start-quote-text', 'start-quote-author');
    renderQuote('quiz-quote-text', 'quiz-quote-author');
  }, 10000);
}
startQuoteRotation();

/* ---------- QUIZ START ---------- */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz() {
  order = shuffle(QUESTIONS.map((_, i) => i));
  current = 0;
  answers = {};
  showView('quiz');
  renderQuestion();
  updateHUD();
}

/* ---------- RENDER QUESTION ---------- */
function renderQuestion() {
  const qIdx = order[current];
  const q = QUESTIONS[qIdx];

  $('section-label').textContent = q.section;
  $('question-text').textContent = q.q;

  const optBox = $('options');
  optBox.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  const saved = answers[current];

  q.options.forEach((optText, i) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.type = 'button';
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span><span>${optText}</span>`;

    if (saved) {
      btn.classList.add('disabled');
      if (i === q.correct) btn.classList.add('correct');
      else if (i === saved.chosen) btn.classList.add('wrong');
    } else {
      btn.addEventListener('click', () => selectAnswer(i));
    }

    optBox.appendChild(btn);
  });

  // Feedback
  const fb = $('feedback');
  fb.className = 'feedback';
  fb.textContent = '';
  if (saved) {
    fb.classList.add('show', saved.isCorrect ? 'ok' : 'no');
    fb.textContent = saved.isCorrect
      ? '✓ Correct! Well done.'
      : '✗ Incorrect. Correct answer: ' + letters[q.correct] + ') ' + q.options[q.correct];
  }

  // Nav buttons
  const prevBtn = $('btn-prev');
  const nextBtn = $('btn-next');
  prevBtn.disabled = current === 0;
  const isLast = current === order.length - 1;
  nextBtn.textContent = isLast ? '🎀 See Results' : 'Next →';
  nextBtn.classList.toggle('finish', isLast && !!saved);

  if (window.innerWidth < 600) {
    document.querySelector('.question-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ---------- SELECT ANSWER ---------- */
function selectAnswer(chosenIdx) {
  if (answers[current]) return;

  const qIdx = order[current];
  const q = QUESTIONS[qIdx];
  const isCorrect = chosenIdx === q.correct;

  answers[current] = { chosen: chosenIdx, isCorrect };

  // Visual feedback
  const opts = document.querySelectorAll('#options .option');
  opts.forEach((btn, i) => {
    btn.classList.add('disabled');
    btn.onclick = null;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === chosenIdx) btn.classList.add('wrong');
  });

  const fb = $('feedback');
  const letters = ['A', 'B', 'C', 'D'];
  fb.classList.add('show', isCorrect ? 'ok' : 'no');
  fb.textContent = isCorrect
    ? '✓ Correct! Well done.'
    : '✗ Incorrect. Correct answer: ' + letters[q.correct] + ') ' + q.options[q.correct];

  const nextBtn = $('btn-next');
  const isLast = current === order.length - 1;
  if (isLast) nextBtn.classList.add('finish');

  updateHUD();
}

/* ---------- HUD ---------- */
function updateHUD() {
  const total = order.length;
  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter(a => a.isCorrect).length;
  const wrongCount = answeredCount - correctCount;
  const accuracy = answeredCount === 0 ? 0 : Math.round((correctCount / answeredCount) * 100);

  $('current-q').textContent = current + 1;
  $('total-q').textContent = total;
  $('stat-accuracy').textContent = accuracy + '%';
  $('stat-correct').textContent = correctCount;
  $('stat-wrong').textContent = wrongCount;
  $('stat-left').textContent = total - answeredCount;
  $('stat-total').textContent = total;

  const pct = (answeredCount / total) * 100;
  $('progress-fill').style.width = pct + '%';
}

/* ---------- NAVIGATION ---------- */
function goNext() {
  if (!answers[current]) {
    const opts = $('options');
    opts.classList.add('shake');
    setTimeout(() => opts.classList.remove('shake'), 400);
    return;
  }
  if (current < order.length - 1) {
    current++;
    renderQuestion();
    updateHUD();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    showResults();
  }
}

function goPrev() {
  if (current > 0) {
    current--;
    renderQuestion();
    updateHUD();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ---------- RESULTS ---------- */
function showResults() {
  const total = order.length;
  const correctCount = Object.values(answers).filter(a => a.isCorrect).length;
  const wrongCount = total - correctCount;
  const percent = Math.round((correctCount / total) * 100);

  $('score-big').textContent = correctCount + '/' + total;
  $('score-percent').textContent = percent + '%';
  $('res-correct').textContent = correctCount;
  $('res-wrong').textContent = wrongCount;
  $('res-accuracy').textContent = percent + '%';

  // Feedback
  let title, text;
  if (correctCount >= 13) {
    title = '🌟 Excellent!';
    text = 'Outstanding work! You demonstrate a very strong understanding of phonetics. Keep it up!';
  } else if (correctCount >= 10) {
    title = '✨ Good job!';
    text = 'Solid performance! You have a good grasp of most concepts. Review the items you missed and try again.';
  } else if (correctCount >= 7) {
    title = '📚 Keep studying';
    text = 'You are on the right track. Focus on the areas you missed below and review your notes.';
  } else {
    title = '💪 Don\'t give up!';
    text = 'Phonetics can be tricky! Review the correct answers below, study the explanations, and try the quiz again.';
  }
  $('fb-title').textContent = title;
  $('fb-text').textContent = text;

  // Mistakes list
  const mistakes = $('mistakes-list');
  mistakes.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  const wrongEntries = [];
  order.forEach((qIdx, i) => {
    const ans = answers[i];
    if (ans && !ans.isCorrect) {
      wrongEntries.push({ qIdx, ans, qNumber: i + 1 });
    }
  });

  if (wrongEntries.length === 0) {
    mistakes.innerHTML = '<div class="mistakes-empty">🎉 Perfect score — no mistakes to review!</div>';
  } else {
    wrongEntries.forEach(({ qIdx, ans, qNumber }) => {
      const q = QUESTIONS[qIdx];
      const card = document.createElement('div');
      card.className = 'mistake-card';
      card.innerHTML = `
        <div class="mistake-num">Question ${qNumber} · ${q.section}</div>
        <div class="mistake-q">${escapeHtml(q.q)}</div>
        <div class="mistake-ans your">
          <b>Your answer:</b> <span>${letters[ans.chosen]}) ${escapeHtml(q.options[ans.chosen])}</span>
        </div>
        <div class="mistake-ans right">
          <b>Correct answer:</b> <span>${letters[q.correct]}) ${escapeHtml(q.options[q.correct])}</span>
        </div>
      `;
      mistakes.appendChild(card);
    });
  }

  showView('results');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ---------- EVENT LISTENERS ---------- */
$('start-btn').addEventListener('click', startQuiz);
$('btn-prev').addEventListener('click', goPrev);
$('btn-next').addEventListener('click', goNext);
$('btn-restart').addEventListener('click', () => {
  if (confirm('Restart the quiz? All current progress will be lost.')) startQuiz();
});
$('btn-restart-results').addEventListener('click', startQuiz);

/* ---------- KEYBOARD ---------- */
document.addEventListener('keydown', (e) => {
  if (!views.quiz.classList.contains('active')) return;

  if (e.key === 'Enter') {
    e.preventDefault();
    goNext();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    goPrev();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    goNext();
  } else if (['1', '2', '3', '4'].includes(e.key)) {
    const idx = parseInt(e.key) - 1;
    const opts = document.querySelectorAll('#options .option');
    if (opts[idx] && !opts[idx].classList.contains('disabled')) {
      selectAnswer(idx);
    }
  }
});
