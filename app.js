// Sample data for available card sets (could be loaded from a server)
const cardSets = [
  { name: "Basic Geography", file: "cards-set1.json" },
  { name: "Simple Math", file: "cards-set2.json" }
];

let currentCardSet = null;
let currentIndex = 0;

function loadCardSets() {
  const setList = document.getElementById('set-list');
  cardSets.forEach(set => {
      const li = document.createElement('li');
      li.textContent = set.name;
      li.addEventListener('click', () => loadCardsFromSet(set.file));
      setList.appendChild(li);
  });
}

async function loadCardsFromSet(file) {
  try {
      const response = await fetch(file);
      currentCardSet = await response.json();
      currentIndex = 0; // Reset to first card
      renderCurrentCard();
  } catch (error) {
      console.error("Error loading card set:", error);
  }
}

function renderCurrentCard() {
  if (!currentCardSet || currentIndex < 0 || currentIndex >= currentCardSet.cards.length) return;

  const setsContainer = document.getElementById('sets-container');
  setsContainer.innerHTML = ''; // Clear previous content

  const cardData = currentCardSet.cards[currentIndex];
  const cardElement = createCard(cardData.front, cardData.back);
  setsContainer.appendChild(cardElement);

  // Add navigation buttons
  const navButtonsDiv = document.createElement('div');
  navButtonsDiv.className = 'navigation-buttons';

  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
          currentIndex--;
          renderCurrentCard();
      }
  });

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.addEventListener('click', () => {
      if (currentIndex < currentCardSet.cards.length - 1) {
          currentIndex++;
          renderCurrentCard();
      }
  });

  navButtonsDiv.appendChild(prevButton);
  navButtonsDiv.appendChild(nextButton);

  setsContainer.appendChild(navButtonsDiv);
}

function createCard(frontContent, backContent) {
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card');

  const frontSpan = document.createElement('span');
  frontSpan.textContent = frontContent;
  frontSpan.className = 'front';

  const backSpan = document.createElement('span');
  backSpan.textContent = backContent;
  backSpan.className = 'back';
  backSpan.style.display = 'none';

  cardDiv.appendChild(frontSpan);
  cardDiv.appendChild(backSpan);

  let isFlipped = false;
  cardDiv.addEventListener('click', () => {
      if (isFlipped) {
          frontSpan.style.display = '';
          backSpan.style.display = 'none';
      } else {
          frontSpan.style.display = 'none';
          backSpan.style.display = '';
      }
      cardDiv.classList.toggle('flipped');
      isFlipped = !isFlipped;
  });

  return cardDiv;
}

// Load the card sets list on page load
loadCardSets();