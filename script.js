const canvas = document.querySelector('canvas');
//what is this context?
const ctx = canvas.getContext('2d');

const resolution = 10;
canvas.width = 800
canvas.height = 800

const cols = canvas.width / resolution
const rows = canvas.height / resolution

//framerate rules
let fps = 25;
let interval = 1000 / fps;
let lastTime = 0;



function buildGrid() {
    //why does it need to filled with null?
    //what is a return?
    return new Array(cols).fill(null)
    //what is map?
        .map(() => new Array(rows).fill(null)
            .map(() => Math.floor(Math.random() * 2  ))
        );

}

//what is the difference between let and const
let grid = buildGrid();
console.log(grid)

// requestAnimationFrame(update);

function update() {
    grid = nextGen(grid);
    render(grid);
    // requestAnimationFrame(update);
}

function animate(currentTime) {
  requestAnimationFrame(animate);

  const delta = currentTime - lastTime;

  if (delta >= interval) {
    lastTime = currentTime - (delta % interval); // Adjust for drift
    
    // Execute your function here
    update(); 
  }
}

requestAnimationFrame(animate);


function nextGen(grid) {
    //copy the grid because you're updating the thing you're iterating through
    //make a copy as a reference for the next generation
    //wtf is this line
    const  nextGen = grid.map(arr => [...arr]);

        for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row ++) {
            //what is this checking
            const cell = grid[col][row]
            let numNeighbours = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if(i === 0 && j === 0) {
                        //what is continue
                        continue;
                    }
                    const xCell = col + i;
                    const yCell = row + j;

                    if(xCell >= 0 && yCell >= 0 && xCell < cols && yCell < rows) {
                        currentNeighbour = grid[xCell][yCell];
                        //how does this check if it is 1?
                        //ohh so numNeighbours is 0, if the current neighbouring cell selected is alive (1) then 1 is added to numNeighbours!!
                        numNeighbours += currentNeighbour;
                    }
                }
            }

            //rules

            //if cell is alive and has less than 2 neighbours it dies
            if (cell === 1 && numNeighbours < 2) {
                //applying the change to the nextGen grid so we don't affect the grid we are looping through
                //why are there two brackets for the array
                nextGen[col][row] = 0;
            } else if (cell === 1 && numNeighbours > 3) {
                nextGen[col][row] = 0;
            } else if (cell === 0 && numNeighbours === 3) {
                nextGen[col][row] = 1;
            }

        }
    }
    return nextGen;
}

function render(grid) {
    //how is let col = 0 not forcing it to stay 0? is it a feature of let?
    //what exactly is the distinction of the brackets in a for?
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row ++) {
            //what is this checking
            const cell = grid[col][row]
            //what does beginPath do
            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution)
            //how is this ? checking if cell is alive (a 1)
            ctx.fillStyle = cell ? 'pink' : 'green';
            ctx.fill();
            //ctx.stroke();
        }
    }
}

document.addEventListener('mousemove', (event) => {
    let mouseX = event.clientX; // X-coordinate relative to the viewport
    //console.log(mouseX);
    let mouseY = event.clientY; // X-coordinate relative to the viewport
    //console.log(mouseY);
    let x = Math.floor(mouseX / resolution);
    let y = Math.floor(mouseY / resolution);
    //console.log(x, y)
    grid[x][y] = 1
    grid[x + 1][y + 1] = 1
    grid[x - 1][y - 1] = 1
});



mouseDragged();