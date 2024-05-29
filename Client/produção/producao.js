var headerDiv = document.getElementById('header');
var cardsDiv = document.getElementById('cards');

headerDiv.style.display = 'flex';
headerDiv.style.justifyContent = 'space-around';

var keys = ['NUMBER', 'CHAPAS', 'QUANT.', 'CLIENTE', 'MEDIDA'];
keys.forEach(function(key) {
    var header = document.createElement('h1');
    header.textContent = key;
    header.style.margin = '20px 0';
    headerDiv.appendChild(header);
});

var card = document.createElement('div');
card.className = 'card';
card.style.borderRadius = '15px';
card.style.margin = '20px';

var cardContent = document.createElement('div');
cardContent.className = 'card-body';
cardContent.textContent = 'This is a card';

card.appendChild(cardContent);
cardsDiv.appendChild(card);