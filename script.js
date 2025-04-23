const form = document.getElementById("form-con");
const boxContainer = document.querySelector(".game-con");
const playBtn = document.getElementById('play_btn');
const modalCon = document.querySelector('.modal-wrapper');
const countDown = document.getElementById('countdown');
let count = 5;
var arrCon = [];
var bombsCoor = [];

// click the play button
form.addEventListener("submit", (e) =>{
    e.preventDefault();
    console.log('submit working');

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

// populate the box container

populateBox();

const boxes = document.querySelectorAll('.box');

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
            }else{
                let img = document.createElement('img');
                img.style.height = '50px';
                img.style.width = '50px';
                img.src = './images/gem-solid.svg';
                e.target.appendChild(img);
            }
            
        }, 300); // Adjust this timing to match your rotation duration

    }
   
  });
});

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
        const min = 0, max = 4;
        var randomRow = Math.floor( Math.random() * (max - min + 1)) + min;
        var randomColumn = Math.floor( Math.random() * (max - min + 1)) + min;
        bombsCoor.push([randomRow,randomColumn])
        arrCon[randomRow][randomColumn] = 'X';
    }
}

generateArray(5,5);
console.log(arrCon);
bombPlot(4);
console.log(bombsCoor);