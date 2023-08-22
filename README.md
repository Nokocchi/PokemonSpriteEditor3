# Pokemon Sprite Changer v3

## FAQ

### What is this?

Back when I was a wee lad, just 20 years old and in my first year of university as a Computer Science student about 7 years ago, I found a video talking about hidden features in Pokemon Gold & Silver, with one of these features being the "Pokemon Sprite Color Changer" view in the Pokedex. It allowed the user to cycle through the two main colors of each Pokemon (other than black and white) and changing their colors by using RGB sliders: https://tcrf.net/Pok%C3%A9mon_Gold_and_Silver/Debug_Menus#Legend

I was deeply inspired by this and thought to myself: I can build something like that! I still haven't, though, but we're getting there. Eventually. 

### Will you abandon this project and leave it unfinished for years until you feel inspired to pick it up again just to abandon it again, just like everything else in your life? 

Probably.

### Why is the icon a Dunsparce?

Dunsparce is my favorite Pokemon, and my Github username is the Japanese name for Dunsparce. (Second favorite is Politoed!)

### Why is Dunsparce your favorite Pokemon?

Have you seen that little bugger? So cute! It's a very forgettable Pokemon. I remember finding it in Dark Cave as a child and immediately liking it. Many children my age had never seen it before. I like how it's a rare little waspy earth snake, hiding in the dark, often forgettable and rarely liked. I want to show it some love. For a few years, I wanted to sew my own 1 meter long Dunsparce plushie but never got started. And I used Dunsparce as my lead Pokemon in HeartGold, and I freaking love how Dunsparce looks in pink instead of blue. Which is one of my main inspirations for this website in the first place.  

### Why does the "female" filter not always work? Example: Kakuna, Diamon & Pearl

The sprites are stored in a hierarchical folder structure using the folder names "female", "shiny", "frame2", "back" for all sprites that are not the main, front, male, non-shiny, frame1 sprite. Whever I downloaded this sprite directory from, they decided that for some folders, the female sprites are only included if they are different from the male sprites, and for other folders, the female sprites are always included even if they are identical to the male sprite. Or something like that. Testing seems to say that the filtering should work as intended, but the source data is inconsistent.

### Why is it called "v3"? Where are the other versions?

- 2016: Version 1.
- - Pure spaghetti code
- - Vanilla JS, css I made up on the spot and hacked until it worked
- - Everything running inside of a main function
- - Everything modifying each other
- - Writing and reading from the same canvas which is a security risk and required me to run Chrome in a special compatibility mode which has since been removed
- - The whole main method was wrapped in some weird minified color library I found on stackoverflow and picked apart by myself and tried to reverse engineer
- - I tried to use jQuery and URL modifications to navigate the sprite directories in order to avoid CORS issues, and this caused the whole page to reload every time you clicked on anything
- - Only ran locally
- - To date the most complete version, and it actually worked fairly well
- 2019: Version 2.
- - Done with university, officially a computer scientist, nice desktop computer, recently started a full stack development job.. I can do better!!
- - Wrote some horrible python scripts to generate a json file for all Pokemons, so I could use this to search and list Pokemons programatically. These python scripts had a lot of redundancy and overlap. But they actually worked quite well
- - Realized that I could just upload the sprites to my repo so that I don't need a server! Jackpot, now I can put it on Github Pages!
- - Borrowed someone's StackOverflow code for a search box and dropdown
- - Vanilla JS. But this time, the code actually looks a bit more reasonable
- - Nobody needs to know about Version 1.. I will publish this on GitHub as just "PokemonSpriteEditor". Because, surely, this will be the finaly version anyway and I will complete it this time
- - https://nokocchi.github.io/PokemonSpriteEditor/
- 2022: Version 3.
- - Okay, I didn't finish version 2. But this time, it will be different! I had been working with Google Web Toolkit for 3 years and had a lot of experience building compositional UI components. I could build something like this easily in GWT. And I wanted to learn Javascript anyway, so let's give it another shot!
- - I actually managed to write some fairly compositional Vanilla Javscript with custom HTML elements. Everything neatly packaged into their own little JS classes. Neat!
- - Coded this on my company laptop, which I wiped when it was brought to my attention that I volunteered to take on the role as company alumni. So this code is lost.
- - Eventually, I realized.. What am I doing? This seems inefficient, and not very modern. What I need is a framework like all the cool kids these days!
- 2022: Verion 4
- - After much consideration, I decided on Vue 3 with the Composition API. I don't really know what that means, but it seemed to be popular, easier to learn and better for a small static page project than React and Angular, and it should be fairly similar in coding style to GWT. Plus, with all these changing variables, sliders, colors, pixels and so on, a reactive app would be really handy!
- - Turns out, I foking hate the modern JS ecosystem. I want my types. I have never benefited from dynamic typing. I want my IntelliJ and all its features. Why do I need nvm and npm and NodeJS and webpack and libraries and bundlers and babel and VSCode extensions, and why does everything need to be configured in pure text in .json files with no error detection or suggestions or anything? 
- - After several days, I finally manage to set up a Vue project with a hacky deployment script that would push the dist folder to a separate branch which would then get deployed to GitHub Pages
- - Continuing the naming scheme, and considering that this is the REAL sequel, we are now at version 2
- - https://nokocchi.github.io/PokemonSpriteEditor2/
- 2023: Version 5 
- - I started working on a Vulkan game engine in C shortly after Version 4. I don't know Vulkan, c, or graphics in general. But I made a lot of progress! Oh, the sprite changer? uuuhhh
- - Meet Svelte! Even prettier than Vue, everybody seems to like it, and the coding style looks exactly like what I was searching for. Love at first sight!
- - Got the project set up fairly fast, but still hating modern JS ecosystem
- - Now using a proper Github action to build and deploy the page directly to Github Pages without any hacks. 
- - Using TypeScript to avoid the worst parts of JS and dynamic typing. 
- - VSCode is actually a bit better than I thought.
- - Current version, the one you are looking at right now. https://nokocchi.github.io/PokemonSpriteEditor3/

## TODO:

- [x] Redo this project for the 5th time in 6 years, still with no experience in JS or JS frameworks, but this time will be a success!
- [x] Set up Svelte, npm and all that jazz. Make sure sample project works
- [x] Setup Github actions to deploy project to Github Pages when main branch is updated. Without any hacks, like having a separate repo or branch for the dist folder
- [x] Correctly configure paths and and file locations such that images are accessible both locally and when deployed to Github 
- [x] Simple first setup with some buttons, image and canvas, just to learn Svelte, and make sure that basic functionality works
- [x] Keep track of the Pokemon's pixel data in some variable, which is then drawn to the canvas when updated
- [x] Run through the Pokemon's pixel data, make a map of each color and which pixels belong to this color. 
- [x] Hook up the Color Groups so that they update the pixel data of the Pokemon
- [x] Check that it's possible to change the color of the canvas by moving the slider
- [x] 3x Sliders with a textbox each for 0-255 num value
- [x] 3x Sliders with a textbox each for HSL values
- [ ] Hex color textbox with color picker
- [ ] Shared Pipette for all of these modes
- [ ] Implement the browsers standard color picker?
- [x] Shared color preview / palette for all of these modes
- [x] Make it possible to seamlessly change between color formats for each color
- [x] Add reset button to individual sliders
- [x] Add reset button to Color Picker
- [x] Add reset button to whole Pokemon
- [x] Pokemon search feature: Search by name
- [x] After picking a Pokemon, order selectable sprites by generation and game
- [x] Implement filters for back sprite, shiny, female, animation frames and so on
- [x] Make a better layout. Nothing responsive and fancy for now, but just a bit more user friendly
- [x] Implement an upload image feature
- [ ] Look into whether it is possible to link to your "your current state" so that you can share it with others and they can play around with it
- [x] Select multiple colors at the same time and change all of them at the same time. 
- - [ ] Do something similar for HSL. This will probably act weird for random colors, but work well for similar-looking colors?
- [ ] Allow importing of second pokemon as color palette
- - [ ] Use the Pokemon Selector component
- - [ ] Some kind of way to select which color should replace which color
- - [ ] Randomize which colors get replaced with which colors
- [ ] Save color palette so it can be used for other Pokemons
- [ ] Resizable canvas
- [ ] Add info page that explains how the app works
- [ ] Make a banner for the Select Pokemon screen when no pokemon has been selected. Maybe Pokemon whose colors are being changed randomly as they are flying by? Or pre-defined by me? 
