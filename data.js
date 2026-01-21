let pokemonCard = document.getElementById('pokemon-card');

let allPokemon = [];
const abilityFilter = document.getElementById('abilityFilter');

async function loadPokemon() {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=70';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        renderPokemon(result.results);

        allPokemon = result.results;
        renderPokemon(allPokemon);
        loadAbilities();

    } catch (error) {
        console.log(error.message);
    }
}




function renderPokemon(pokemons) {
    pokemonCard.innerHTML = '';

    pokemons.forEach(pokemon => {
        const id = pokemon.url.split('/').filter(Boolean).pop();
        const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

        const card = document.createElement('div');
        card.className = 'pokemon';
        card.id = `pokemon-${id}`;

        card.onclick = function() {
            openDetails(id);
        }
        card.innerHTML = `
            <img src="${image}" alt="${pokemon.name}" />
            <div class="info">
                <h2>${pokemon.name}</h2>
            </div>
            <div class="extra-info" style="display:none;"></div>
        `;

        pokemonCard.appendChild(card);
    });
}




async function openDetails(id) {
    console.log(id);
    const card = document.getElementById(`pokemon-${id}`);
    const extraInfo = card.querySelector('.extra-info');

    if (card.classList.contains('active')) {
        card.classList.remove('active');
        extraInfo.style.display = 'none';
        return;
    }

    document.querySelectorAll('.pokemon.active').forEach(p => {
        p.classList.remove('active');
        p.querySelector('.extra-info').style.display = 'none';
    });

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();

        // Extract the info you want
        const types = data.types.map(t => t.type.name);
        const abilitiesHTML = data.abilities
            .map(a => `<span class="ability-tag">${a.ability.name}</span>`)
            .join(' ');
        const height = data.height / 10;
        const weight = data.weight / 10;

        extraInfo.innerHTML = `
            <p><strong>Type:</strong> ${types}</p>
            <p><strong>Height:</strong> ${height}m</p>
            <p><strong>Weight:</strong> ${weight}kg</p>
            <div class="abilities-section abilities ${types[0]}">
                    <strong>Abilities:</strong><br>
                    ${abilitiesHTML}
                </div>
        `;

        extraInfo.style.display = 'block';
        card.classList.add('active');
    } catch (error) {
        console.error("Error fetching details:", error);
    }
}




function closeCard(id) {
    const card = document.getElementById(`pokemon-${id}`);
    card.classList.remove('active');
    card.querySelector('.extra-info').style.display = 'none';
}




async function loadAbilities() {
    const response = await fetch('https://pokeapi.co/api/v2/ability?limit=100');
    const data = await response.json();

    data.results.forEach(ability => {
        const option = document.createElement('option');
        option.value = ability.name;
        option.textContent = ability.name;
        abilityFilter.appendChild(option);
    });
}

abilityFilter.addEventListener('change', async function () {
    const selectedAbility = this.value;

    if (!selectedAbility) {
        renderPokemon(allPokemon);
        return;
    }

    const response = await fetch(`https://pokeapi.co/api/v2/ability/${selectedAbility}`);
    const data = await response.json();
    const filteredPokemon = data.pokemon.map(p => p.pokemon);
    const filtered = allPokemon.filter(p =>
        filteredPokemon.some(fp => fp.name === p.name)
    );

    renderPokemon(filtered);
});




function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function () {
    const value = this.value.toLowerCase();

    const filtered = allPokemon.filter(pokemon =>
        pokemon.name.includes(value)
    );

    renderPokemon(filtered);
});

loadPokemon();



