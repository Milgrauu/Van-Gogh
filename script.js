const cardSymbols = [
  {
    name: 'Noite Estrelada',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=thumbnail'
  },
  {
    name: 'Flores de Amendoeira',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUqaIAv9cjfBU8tSW4Cyf_dYzRbS6m7uSZ6cFAFHvm5GVi__wyEO5lDqo&s=10'
  },
  {
    name: 'Girassóis',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6yKF3eBFzwoUGENaBafEDtix9Ez6jV9liUf_kmLpvvw&s'
  },
  {
    name: 'Os Comedores de Batata',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR55McxVEy6DQVJYEtgcq99XZCt_JCM1FYJwhk29mA5Rg&s=10'
  },
  {
    name: 'Campo de Trigo com Corvos',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw05Xs9EFqWQf67hnflxne-WspXBdCVh-SJ6-0TnD2-g&s=10'
  },
  {
    name: 'Oliveiras',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg8uE0YYjZSF4Wb4Tx1l8RafrV2f4_X7dV6NKCg9TiNw&s=10'
  }
];

const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
const matchesEl = document.getElementById('matches');
const restartBtn = document.getElementById('restartBtn');
const planilhaTabela = document.getElementById('planilhaTabela');

const obrasData = [
  ['Noite Estrelada', '1889', 'Inspirada na vista noturna de Saint-Rémy, recriada com memória e imaginação.'],
  ['Flores de Amendoeira', '1890', 'Feita para celebrar o nascimento de Vincent Willem, filho de seu irmão Theo.'],
  ['Girassóis', '1888', 'Pintada para decorar a casa amarela e receber o amigo Paul Gauguin.'],
  ['Os Comedores de Batata', '1885', 'Retrata a vida e o trabalho dos camponeses que Van Gogh admirava.'],
  ['Campo de Trigo com Corvos', '1890', 'Retrata os campos de Auvers-sur-Oise; o significado específico não é conhecido com certeza.'],
  ['Oliveiras', '1889', 'Inspirada nos olivais próximos ao asilo de Saint-Rémy e no interesse do artista pela natureza.']
];

let cards = [];
let flipped = [];
let moves = 0;
let matches = 0;
let lockBoard = false;

function renderPlanilha() {
  if (!planilhaTabela) {
    return;
  }

  const tbody = planilhaTabela.querySelector('tbody');
  tbody.innerHTML = obrasData
    .map(
      (row) => `
        <tr>
          ${row.map((cell) => `<td>${cell}</td>`).join('')}
        </tr>
      `
    )
    .join('');
}

function createBoard() {
  if (!board || !movesEl || !matchesEl || !restartBtn) {
    return;
  }

  board.innerHTML = '';
  cards = [...cardSymbols, ...cardSymbols]
    .sort(() => Math.random() - 0.5)
    .map((artwork, index) => ({ id: index, artwork, matched: false }));

  cards.forEach((card) => {
    const button = document.createElement('button');
    button.className = 'memory-card';
    button.type = 'button';
    button.dataset.symbol = card.artwork.name;
    button.dataset.id = card.id;
    button.setAttribute('aria-label', 'Carta virada para baixo');

    button.innerHTML = `
      <div class="memory-card-inner">
        <div class="memory-card-back">?</div>
        <div class="memory-card-front">
          <img src="${card.artwork.image}" alt="${card.artwork.name}" loading="lazy">
        </div>
      </div>
    `;

    button.addEventListener('click', () => handleCardClick(button, card));
    board.appendChild(button);
  });

  flipped = [];
  moves = 0;
  matches = 0;
  lockBoard = false;
  movesEl.textContent = moves;
  matchesEl.textContent = matches;
}

function handleCardClick(button, card) {
  if (lockBoard || button.classList.contains('flipped') || button.classList.contains('matched')) {
    return;
  }

  button.classList.add('flipped');
  button.setAttribute('aria-label', `Obra: ${card.artwork.name}`);
  flipped.push({ button, card });

  if (flipped.length === 2) {
    moves += 1;
    movesEl.textContent = moves;

    const [first, second] = flipped;

    if (first.card.artwork.name === second.card.artwork.name) {
      first.button.classList.add('matched');
      second.button.classList.add('matched');
      first.card.matched = true;
      second.card.matched = true;
      flipped = [];
      matches += 1;
      matchesEl.textContent = matches;

      if (matches === cardSymbols.length) {
        setTimeout(() => {
          alert('Parabéns! Você venceu o jogo da memória de Van Gogh!');
        }, 300);
      }
    } else {
      lockBoard = true;
      setTimeout(() => {
        first.button.classList.remove('flipped');
        second.button.classList.remove('flipped');
        first.button.setAttribute('aria-label', 'Carta virada para baixo');
        second.button.setAttribute('aria-label', 'Carta virada para baixo');
        flipped = [];
        lockBoard = false;
      }, 700);
    }
  }
}

if (restartBtn) {
  restartBtn.addEventListener('click', createBoard);
}

if (board && movesEl && matchesEl && restartBtn) {
  createBoard();
}

renderPlanilha();
