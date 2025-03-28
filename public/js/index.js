"use strict";

let pokemonNames = []; // Declare globally

// Fetch Pokémon names dynamically
async function fetchPokemonNames() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const data = await response.json();
        pokemonNames = data.results.map(pokemon => pokemon.name); // Extract names
    } catch (error) {
        console.error('Error fetching Pokémon names:', error);
    }
}

// Call fetchPokemonNames on page load
document.addEventListener('DOMContentLoaded', fetchPokemonNames);

document.getElementById('battleButton').addEventListener('click', async (e) => {
    e.preventDefault();

    // Ensure pokemonNames is populated
    if (pokemonNames.length === 0) {
        alert('Pokémon names are still loading. Please try again in a moment.');
        return;
    }

    const pokemon1 = document.getElementById('pokeOne').value.trim();
    const pokemon2 = document.getElementById('pokeTwo').value.trim();

    if (!pokemon1 || !pokemon2) {
        alert('Oops! Please enter names for both Pokémon.');
        return;
    }

    // Convert to lowercase for case-insensitive comparison
    if (!pokemonNames.includes(pokemon1.toLowerCase()) || !pokemonNames.includes(pokemon2.toLowerCase())) {
        alert('Oops! Please enter two valid Pokémon.');
        return;
    }

    const result = await checkTypeAdvantage(pokemon1, pokemon2);

    const resultDiv = document.getElementById('result');
    if (result.sprite) {
        resultDiv.innerHTML = `
            <h3>${result.winner} has the type advantage!</h3>
            <img src="${result.sprite}" alt="${result.winner}">
        `;
    } else {
        resultDiv.innerHTML = `<h3>${result.winner}</h3>`;
    }
});

async function fetchPokemonData(pokemonName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        return null;
    }
}

async function checkTypeAdvantage(pokemon1, pokemon2) {
    const p1Data = await fetchPokemonData(pokemon1);
    const p2Data = await fetchPokemonData(pokemon2);

    if (!p1Data || !p2Data) {
        return 'Invalid Pokémon name(s)';
    }

    const p1Types = p1Data.types.map(type => type.type.name);
    const p2Types = p2Data.types.map(type => type.type.name);

    let advantage = null;
    let winner = null;

    for (const type of p1Types) {
        const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        const typeData = await typeResponse.json();

        const doubleDamageTo = typeData.damage_relations.double_damage_to.map(t => t.name);

        if (p2Types.some(t => doubleDamageTo.includes(t))) {
            advantage = pokemon1;
            winner = p1Data;
            break;
        }
    }

    if (!advantage) {
        for (const type of p2Types) {
            const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
            const typeData = await typeResponse.json();

            const doubleDamageTo = typeData.damage_relations.double_damage_to.map(t => t.name);

            if (p1Types.some(t => doubleDamageTo.includes(t))) {
                advantage = pokemon2;
                winner = p2Data;
                break;
            }
        }
    }

    return { winner: advantage || 'No clear advantage', sprite: winner?.sprites?.front_default || null };
}
