# Game "15-puzzle" 

 The **15-puzzle** (also called Gem Puzzle, Boss Puzzle, Game of Fifteen, Mystic Square and many others) is a sliding puzzle that consists of a frame of numbered square tiles in random order with one tile missing. The object of the puzzle is to place the tiles in order by making sliding moves that use the empty space. 
 
 Read more on [Wikipedia](https://en.wikipedia.org/wiki/15_puzzle)
 
## Try the game
 
 Play on [GitHub Pages]( https://sergiy-mykhailov.github.io/game-15-puzzle/)
  
## Usage
  
Add script into your page:
```
 <script type="application/javascript" src="js/fifteen.min.js" defer></script>
``` 
If your page has a tag with class `.fifteen-puzzle`, 
the game append to this tag.
 
Also you can add the game to any tag:
 ```
  var fifteenPuzzle = new FifteenPuzzle('body');  // append in <body>
 ```
or use any css-selector:
 ```
  var fifteenPuzzle = new FifteenPuzzle('.some-class');  // append in class .some-class
 ```
####Description:
 ```
  new FifteenPuzzle( [selector], [options]); 
 ```
Parameters:
- **selector** (string) - The css-selector.
- **options** (Object) - The default options.

Object `options`:
- **delay** (number): Animation duration of elements (default: 400 ms)
- **delayShort** (number): Animation duration on game starting (default: 80 ms)
- **elemInterval** (number): Interval between elements (default: 10 px)
- **elemSize** (number): Element size (default: 80 px)
