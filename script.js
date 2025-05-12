const form = document.getElementById("form-con");
const boxContainer = document.querySelector(".game-con");
const playBtn = document.getElementById('play_btn');
const modalCon = document.querySelector('.modal-wrapper');
const countDown = document.getElementById('countdown');
const winningCon = document.querySelector('.winning-money');
const balanceCon =  document.querySelector('.balance');

const betOut = document.getElementById('bet-out');



const min = 0, max = 4; // min and max of the random number for plot

let reset = false;
let count = 5;
var balance = 500;
var arrCon = [];
var bombsCoor = [];
let active = false; // check if the form is active or clicked;
let playing = false;
var currentWin = 0;
console.log("current: ",balance)
balanceCon.innerHTML = balance;

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

// create an 2d array
function generateArray(r, c){
    for(var i = 0 ; i < r ; i++){
        arrCon[i] = [];
        for(var j = 0; j < c ; j++){
            arrCon[i][j] = '0';
        }
    }
}

populateBox();
generateArray(5,5); // create the 5x5 array

const boxes = document.querySelectorAll('.box');

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

// add event listener to the boxes if click being click without clicking the play btn
boxes.forEach(box =>{
    box.addEventListener('click', () => {
        if(!active){
            Swal.fire({
                title: "Play button",
                text: "You haven't click the play btn",
                icon: "error"
              });
        }
    });
    
})
// click the play button


function updateBetButton(){
    if(!playing){
        betOut.disabled = true;
    }else{
        betOut.disabled = false;
    }
}
updateBetButton();

function handleSubmit(e){
    active = true;
    e.preventDefault();
    console.log('submit working');
    currentWin = 0;
    console.log("currentwin:",currentWin);

    // get the value of the form
    let bet = e.target.bet.value;
    let mines = e.target.mines.value;
    let multiplier = e.target.multiplier.value;
    // balance = Number(e.target.balance.value);
    let winningCount = 1;
    let totalWin = bet;

    // change the static winning
    winningCon.innerHTML = (totalWin * winningCount)*multiplier;

    if(reset){
        boxes.forEach(removeClass =>{
    
            const img = removeClass.querySelector('img');
            removeClass.classList.remove('rotate');
            if(img){
                removeClass.removeChild(img);
            }
    
               
        })
        
        bombsCoor = []
        reset = false;
    }

    if(bet <= balance){
        playing = true;
        updateBetButton();
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
                                    revealBox.classList.add('rotate');
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
                            playing = false;
                            currentWin = 0;
                            winningCount = 1;

                            balance = balance - Number(bet);
                            if(balance < 0){
                                balance = 0;
                            }

                            balanceCon.innerHTML = balance;
                            updateBetButton();
                            
                        }else{
                            let img = document.createElement('img');
                            img.style.height = '50px';
                            img.style.width = '50px';
                            img.src = './images/gem-solid.svg';
                            e.target.appendChild(img);

                            winningCount++;

                            winningCon.innerHTML = (totalWin * winningCount)* multiplier;

                            currentWin = (totalWin * winningCount)* multiplier; 

                            


                        }
                        
                    }, 300); // Adjust this timing to match your rotation duration

                    

                }
    
            });
        });

        betOut.addEventListener('click', e => {
            e.preventDefault();

            balance = balance +  Number(currentWin);
            console.log("new balance: ", balance);
            balanceCon.innerHTML = balance;
            currentWin = 0;
            winningCount = 1;
            reset = true;
            active = false;
            form.removeEventListener('submit',handleSubmit);


        });



        console.log(arrCon);
        bombPlot(mines); // plot the bomb on the 5x5
        console.log(bombsCoor);
    }else{
        Swal.fire({
            title: "Bet",
            text: "Bet must be equal or greater than the balance",
            icon: "error"
          });
    }
    

}
form.addEventListener("submit", handleSubmit);

function boxRotation(e){
    
}