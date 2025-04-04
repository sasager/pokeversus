"use strict";

let pokemonNames = [];


// Fetch Pokemon names & store in pokemonNames array
async function fetchPokemonNames() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const data = await response.json();
        pokemonNames = data.results.map(pokemon => pokemon.name);
    } catch (error) {
        console.error('Error fetching Pokémon names:', error);
    }
}

// Make sure Pokemon names are fetched when page is fully loaded
document.addEventListener('DOMContentLoaded', fetchPokemonNames);

document.getElementById('battleButton').addEventListener('click', async (e) => {
    e.preventDefault(); // When the Battle button is pressed...

    // Check if Pokemon names have loaded
    if (pokemonNames.length === 0) {
        alert('Pokémon names are still loading. Please try again in a moment.');
        return;
    }

    const pokemon1 = document.getElementById('pokeOne').value.trim();
    const pokemon2 = document.getElementById('pokeTwo').value.trim();

    // Make sure neither input field is blank
    if (!pokemon1 || !pokemon2) {
        alert('Oops! Please enter names for both Pokémon.');
        return;
    }

    // Make sure both inputs are valid Pokemon names in the pokemonNames array (validation!)
    if (!pokemonNames.includes(pokemon1.toLowerCase()) || !pokemonNames.includes(pokemon2.toLowerCase())) {
        alert('Oops! Please enter two valid Pokémon.');
        return;
    }
    
    // Check which Pokemon has the type advantage
    const result = await checkTypeAdvantage(pokemon1, pokemon2);

    // Display result & sprite of winner (if applicable)
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

// Fetch data of the selected Pokemon
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

// Determine which Pokemon has the advantage
async function checkTypeAdvantage(pokemon1, pokemon2) {
    
    const p1Data = await fetchPokemonData(pokemon1); // Fetch data
    const p2Data = await fetchPokemonData(pokemon2);

    if (!p1Data || !p2Data) {
        return 'Invalid Pokémon name(s)';
    }

    const p1Types = p1Data.types.map(type => type.type.name); // Get types
    const p2Types = p2Data.types.map(type => type.type.name);

    let advantage = null;
    let winner = null;

    // Check if pokeOne has advantage over pokeTwo
    for (const type of p1Types) {
        const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        const typeData = await typeResponse.json();

        const doubleDamageTo = typeData.damage_relations.double_damage_to.map(t => t.name); // Get types pokeOne is strong against

        if (p2Types.some(t => doubleDamageTo.includes(t))) { // Check if pokeTwo matches those types
            advantage = pokemon1;
            winner = p1Data;
            break;
        }
    }

    // If no advantage is found, repeat above process for pokeTwo
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
