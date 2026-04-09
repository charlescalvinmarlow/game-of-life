const canvas = document.querySelector("canvas");
//what is this context? D
const ctx = canvas.getContext("2d");

const resolution = 5;
canvas.width = 800;
canvas.height = 800;

const cols = canvas.width / resolution;
const rows = canvas.height / resolution;

//framerate rules
let fps = 20;
let interval = 1000 / fps;
let lastTime = 0;

function buildGrid() {
  //why does it need to filled with null?
  //what is a return?
  return (
    new Array(cols)
      .fill(null)
      //what is map?
      //what is =>
      .map(() =>
        //new Array creates a nested 2D array
        //Math.random x 2 with a floor returns 0 or 1
        new Array(rows).fill(null).map(() => Math.floor(Math.random() * 2)),
      )
  );
}

//what is the difference between let and const
let grid = buildGrid();
console.log(grid);

function update() {
  grid = nextGen(grid);
  render(grid);
}

//run the animation according to the defined framerate
function animate(currentTime) {
  requestAnimationFrame(animate);

  const delta = currentTime - lastTime;

  if (delta >= interval) {
    lastTime = currentTime - (delta % interval); // Adjust for drift

    update();
  }
}

requestAnimationFrame(animate);

function nextGen(grid) {
  //copy the grid because you're updating the thing you're iterating through
  //make a copy as a reference for the next generation
  //wtf is this line
  const nextGen = grid.map((arr) => [...arr]);

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      //what is this checking
      //it's defining the cell as the current square of the grid as it iterates through the ++s
      const cell = grid[col][row];
      let numNeighbours = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            //what is continue
            continue;
          }
          const xCell = col + i;
          const yCell = row + j;

          if (xCell >= 0 && yCell >= 0 && xCell < cols && yCell < rows) {
            currentNeighbour = grid[xCell][yCell];
            //how does this check if it is 1?
            //ohh so numNeighbours is 0, if the current neighbouring cell selected is alive (1) then 1 is added to numNeighbours!!
            if (currentNeighbour === 1) {
                numNeighbours++;
            }
          }
        }
      }

      //rules

      //if cell is alive and has less than 2 neighbours it dies
      if (cell >= 1 && numNeighbours < 2) {
        //applying the change to the nextGen grid so we don't affect the grid we are looping through
        nextGen[col][row] = 0;
      } else if (cell >= 1 && numNeighbours > 3) {
        nextGen[col][row] = 2;
      } else if ((cell === 0 || cell === 2) && numNeighbours === 3) {
        nextGen[col][row] = 1;
      }
    }
  }
  return nextGen;
}

function render(grid) {
  //what exactly is the distinction of the brackets in a for?
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      //as the loop iterates, the col/row numbers change and are fed in to this const
      const cell = grid[col][row];
      //what does beginPath do
      ctx.beginPath();
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      //how is this ? checking if cell is alive (a 1)
      //ctx.fillStyle = cell ? "pink" : "green";
      if (cell === 0) {
        ctx.fillStyle = "Beige";
      } else if (cell === 1) {
        ctx.fillStyle = "DeepPink"
      } else {
        ctx.fillStyle = "DarkMagenta"
      }

      ctx.fill();
    //   ctx.strokeStyle = "white"
    //   ctx.lineWidth = 0.3
    //   ctx.stroke();   
    }
  }
}

document.addEventListener("mousemove", (event) => {
  let mouseX = event.clientX; // X-coordinate relative to the viewport
  //console.log(mouseX);
  let mouseY = event.clientY; // X-coordinate relative to the viewport
  //console.log(mouseY);
  let x = Math.floor(mouseX / resolution);
  let y = Math.floor(mouseY / resolution);
  //console.log(x, y)
  grid[x][y] = 1;
  grid[x + 1][y + 1] = 1;
  grid[x - 1][y - 1] = 1;
});

document.addEventListener("click", (event) =>  {
  let mouseX = event.clientX; // X-coordinate relative to the viewport
  //console.log(mouseX);
  let mouseY = event.clientY; // X-coordinate relative to the viewport
  //console.log(mouseY);
  let x = Math.floor(mouseX / resolution);
  let y = Math.floor(mouseY / resolution);

  for (let i = 0; i < cols / 4; i++) {
      grid[x + i][y + i] = 1;
      grid[x + i][y - i] = 1;
      grid[x - i][y + i] = 1;
      grid[x - i][y - i] = 1;
      grid[x - i][y] = 1;
      grid[x + i][y] = 1;
      grid[x][y + i] = 1;
      grid[x][y - i] = 1;
  }

})

// function expandCircle (currentTime) {
//   const delta = currentTime - lastTime;

//   if (delta >= interval) {
//     lastTime = currentTime - (delta % interval); // Adjust for drift

    
//   }
// }