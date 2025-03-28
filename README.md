# PokéVersus

Have you ever wondered which Pokémon type has the advantage in a battle? Do you find yourself forgetting which types are weak to Psychic Pokémon, or strong against Steel types? PokéVersus is here to help! Simply enter the names of two Pokémon, and PokéVersus will tell you which one has the type advantage!

This was created as a capstone project for CODE:You and aims to help Pokémon fans figure out which of two Pokémon has the upper hand in battle based on the Pokémon typing system.

## Requirements

- Retrieve data from a third-party API and use it to display something within your app.
    - When the user inputs two Pokémon names and clicks the Battle button, PokéVersus retrieves type information and the Pokémon sprite from [PokéAPI](https://pokeapi.co/) in order to display the result and sprite of the winning Pokémon.

- Use arrays, objects, sets or maps to store and retrieve information that is displayed in your app.
    - PokéVersus uses maps in order to retrive Pokémon names, types, and type damage relations.

- Create a function that accepts two or more input parameters and returns a value that is calculated or determined by the inputs.  Basic math functions don’t count (e.g. addition, etc).
    - This is the primary function of the website. The user inputs the names of two Pokémon, and PokéVersus displays the winner between the two Pokémon based on type relations.

## Resources

- Third party API: [PokéAPI](https://pokeapi.co/)
- Pokemon icon created by [Roundicons Freebies - Flaticon](https://www.flaticon.com/free-icons/pokemon) (Battle icon)
- Font by [dafont.com](https://www.dafont.com/pkmn-rbygsc.font)

## Getting Started

1. Open your terminal or Git Bash.
2. Use `cd` to navigate to the directory where you want to store the project.
3. Clone the project: `git clone https://github.com/sasager/pokeversus`
4. Navigate to the project directory: `cd pokeversus`
5. Open the project directory in VsCode: `code .`
6. Install dependencies: `npm install`
7. Use the live server VsCode extension to view the index.html page.

**Note:** You do **not** need an API key in order to use this project.

## Stretch Goals

- Troubleshoot why the background image does not show up on Firefox, but works on Chrome and Edge.

- Make PokéVersus as accessible as possible.

- Add an optional autocomplete feature.

- Add a feature to allow user to input a Pokémon type to view strengths and weaknesses against that type.

- Add a feature to allow user to input a Pokémon and display strongest/weakest pokemon against the one they chose.

- Add more pages e.g., create an account, input a single Pokémon to view info about it (weight, moves, type, etc.), user feedback form.

- Add a feature to allow user to save favorite battle combos and see battle history.