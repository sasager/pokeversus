"use strict";

// https://pokeapi.co/docs/v2#types

document.getElementById('battleButton').addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent the form from submitting

    // Grab the values entered in the input fields
    const pokemon1 = document.getElementById('pokeOne').value.trim();
    const pokemon2 = document.getElementById('pokeTwo').value.trim();

    // Ensure both inputs are provided
    if (!pokemon1 || !pokemon2) {
        alert('Please enter names for both Pokémon.');
        return;
    }

    // Call the function with the user input
    const result = await checkTypeAdvantage(pokemon1, pokemon2);

    // Display the result on the page
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

// Fetch Pokémon data function
async function fetchPokemonData(pokemonName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Pokemon:', error);
        return null;
    }
}

// Check type advantage function
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
