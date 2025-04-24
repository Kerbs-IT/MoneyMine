const form = document.getElementById("form-con");
const boxContainer = document.querySelector(".game-con");
const playBtn = document.getElementById('play_btn');
const modalCon = document.querySelector('.modal-wrapper');
const countDown = document.getElementById('countdown');
const winningCon = document.querySelector('.winning-money');

const min = 0, max = 4; // min and max of the random number for plot

let reset = false;
let count = 5;
var arrCon = [];
var bombsCoor = [];

// click the play button
form.addEventListener("submit", (e) =>{

    e.preventDefault();
    console.log('submit working');

    // get the value of the form
    let bet = e.target.bet.value;
    let mines = e.target.mines.value;
    let multiplier = e.target.multiplier.value;
    let winningCount = 1;
    let totalWin = bet;

    // change the static winning
    winningCon.innerHTML = (totalWin * winningCount)*multiplier;
    // reset the boxes if they already rotated
    const boxes = document.querySelectorAll('.box');

    if(reset){
        boxes.forEach(removeClass =>{
    
            const img = removeClass.querySelector('img');
            removeClass.classList.remove('rotate');
            removeClass.removeChild(img);
    
               
        })
        
        bombsCoor = []
        reset = false;
    }

    count = 5;
    countDown.innerHTML = count; // set the count back to 5

    modalCon.classList.remove('d-none');
    
    const interval = setInterval(() => {
        countDown.innerHTML = count;
        count--;
    
        if (count < 0) {
            clearInterval(interval);
            modalCon.classList.add('d-none'); // hide the modal
        }
    }, 1000);

    // ------------------------------------------------------------------------------------------------------------------------------------------------------

    // populate the box container

    boxes.forEach(box => {
        box.addEventListener('click', (e) => {

            if(!e.target.classList.contains('rotate')){
                console.log('Clicked box:', e.target);
        
                // Rotate the clicked box
                e.target.classList.add('rotate');

                //get the data-box-row of the given box
                const coordinates = box.dataset.boxRow;
                console.log("coordinates: " + coordinates);


                // split the data-box-row since it is added as a string like 2x1 == [2,1]
                const splittedCoor = coordinates.split("x"); 
                console.log(splittedCoor.toString());

                // check if there's match
                let match = bombsCoor.find(pair => {
                    if(pair[0] == splittedCoor[0] && pair[1] == splittedCoor[1]){ // return true if the coordinates of bomb and the box is the same
                        return true;
                    }

                    return false;
                })
        
                // Add the content (gem icon) after rotation
                setTimeout(() => {
                    if(match){
                        let img = document.createElement('img');
                        img.style.height = '50px';
                        img.style.width = '50px';
                        img.src = './images/bomb-solid.svg';
                        e.target.appendChild(img);
                    
                        // show all boxes
                        boxes.forEach(revealBox => {
                            if(!revealBox.classList.contains('rotate')){
                                const revealCoor = revealBox.dataset.boxRow;
                                // split the data-box-row since it is added as a string like 2x1 == [2,1]
                                const revealSplittedCoor = revealCoor.split("x"); 
                                console.log(revealSplittedCoor.toString());

                                let revealMatch = bombsCoor.find(pair => {
                                    if(pair[0] == revealSplittedCoor[0] && pair[1] == revealSplittedCoor[1]){ // return true if the coordinates of bomb and the box is the same
                                        return true;
                                    }
                
                                    return false;
                                })

                                // let revealMatch = isBombAt(revealSplittedCoor[0],revealSplittedCoor[1]);

                                if(revealMatch){
                                    let img = document.createElement('img');
                                    img.style.height = '50px';
                                    img.style.width = '50px';
                                    img.src = './images/bomb-solid.svg';
                                    revealBox.appendChild(img);
                                }else{
                                    let img = document.createElement('img');
                                    img.style.height = '50px';
                                    img.style.width = '50px';
                                    img.src = './images/gem-solid.svg';
                                    revealBox.appendChild(img);
                                }
                            }
                        })

                        reset = true; // this mean the user click the bomb
                        
                    }else{
                        let img = document.createElement('img');
                        img.style.height = '50px';
                        img.style.width = '50px';
                        img.src = './images/gem-solid.svg';
                        e.target.appendChild(img);

                        winningCount++;

                        winningCon.innerHTML = (totalWin * winningCount)*multiplier;


                    }
                    
                }, 300); // Adjust this timing to match your rotation duration

                

            }
   
        });
    });

    generateArray(5,5); // create the 5x5 array
    console.log(arrCon);
    bombPlot(mines); // plot the bomb on the 5x5
    console.log(bombsCoor);
    

    
});


function populateBox(){
    let div = ''; 

    for(var i = 0; i < 5; i++){
        for(var j = 0; j < 5; j++){
            div = document.createElement('div');
            div.classList.add('box');
            div.dataset.boxRow = `${i}x${j}`;
            // div.innerHTML = 'X';

            boxContainer.appendChild(div);

        }
    }
}

populateBox();



// create an 2d array
function generateArray(r, c){
    for(var i = 0 ; i < r ; i++){
        arrCon[i] = [];
        for(var j = 0; j < c ; j++){
            arrCon[i][j] = '0';
        }
    }
}

// create a function for bomb plot

function bombPlot(bomb){
    for(var i = 0; i < bomb; i++){
        var randomRow = Math.floor( Math.random() * (max - min + 1)) + min;
        var randomColumn = Math.floor( Math.random() * (max - min + 1)) + min;



        let match = bombsCoor.find(pair => pair[0] === randomRow && pair[1] === randomColumn);

        // use while loop to avoid duplicate
        while(match){
            randomRow = Math.floor( Math.random() * (max - min + 1)) + min;
            randomColumn = Math.floor( Math.random() * (max - min + 1)) + min;

            match = bombsCoor.find(pair => pair[0] === randomRow && pair[1] === randomColumn);
        }
        bombsCoor.push([randomRow,randomColumn])
        arrCon[randomRow][randomColumn] = 'X';
    }
}


function isBombAt(row, col){ // check if the coor is bomb or diamond
    return bombsCoor.find(pair => pair[0] == row && pair[1] === col);
}