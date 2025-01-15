// Selecciona el contenedor principal del juego y todos los elementos de los "items" (casillas de juego)


const gameContainer = document.querySelector(".container")
const allSoldierItems = document.querySelectorAll(".item")

// Carga los sonidos: el sonido del golpe (whack) y la música de fondo

const hitSound = new Audio("/sound/Dragon Ball Z Punch Sound Effect.mp3");
const backgroundMusic = new Audio("/sound/Dragon Ball Z Original Soundtrack - Solid State Scouter.mp3");
const bardockIntro = new Audio("sound/Palabras de Bardock antes de morir [sXJNvYFjVNE].mp3")
const bardockOutro = new Audio("sound/Freezer, sal de tu nave.mp3")
backgroundMusic.loop = true; // configura para que se repita automaticamente
backgroundMusic.volume = 0.3; // ajusta el volumen de la musica
hitSound.volume = 0.1;
bardockIntro.volume = 0.7;
bardockOutro.volume = 0.4;
// variables para gestionar el juego

let startGame, startTime;
let countDown = 30;
let score = 0;

// Elementos HTML donde se muestran el tiempo y el puntaje
const timeCount = document.getElementById('time-count');
const scoreCount = document.getElementById('score-count');

// Botones para iniciar y reiniciar el juego
const startButton = document.getElementById('start-game');
const restartButton = document.getElementById('restart-game');

// Evento que se activa al hacer clic en el botón de inicio del juego
startButton.addEventListener("click", () => {
    startGameLogic();
    startButton.style.display = "none";
    restartButton.style.display = "none";
    backgroundMusic.play();
    bardockIntro.play();
})

// Evento que se activa al hacer clic en el botón de reinicio
restartButton.addEventListener("click", () => {
    resetGame();
    startButton.style.display = "block";
    restartButton.style.display = "none";
})

// Evento para detectar clics dentro del contenedor del juego
gameContainer.addEventListener("click", (e) => {
// verificar si el clic ocurrió en un soldado
    if(e.target.classList.contains("soldier-clicked")){
        hitSound.currentTime = 0; //reinicia el sonido del golpe si ya se estaba reproduciendo
        hitSound.play(); //reproduce el sonido del golpe
        score++; //incrementar el puntaje
        scoreCount.innerHTML = score; // actualizar el puntaje en la pantalla
        // muestre el texto animado donde haya ocurrido el clic
        const shipElement = e.target.parentElement.previousElementSibling;
        let textElement = document.createElement("span");
        textElement.setAttribute("class", "whack-text");
        textElement.innerHTML = "Pum!";
        shipElement.appendChild(textElement);
        //eliminar el texto despues de 300 milisegundos
        setTimeout(() => {
            textElement.remove();
        }, 300);
    }
})


// Lógica principal para iniciar el juego

function startGameLogic() {
    countDown = 30; // reiniciar el contador del tiempo
    score = 0; // reiniciar el puntaje

    scoreCount.innerHTML = score;
    timeCount.innerHTML = countDown;
    
    // configura un intervalo que decrementa el contador de tiempo cada segundo

    startTime = setInterval(() => {
        timeCount.innerHTML = countDown;
        countDown--;
        if(countDown < 0){
            endGame();
        }
    }, 1000)

    // configura otro intervalo que hace aparecer a los soldados cada 600 milisegundos
    startGame = setInterval(() => {
        showSoldier();
    }, 600);
}

// funcion que termina el juego

function endGame(){
    clearInterval(startGame); // detiene el intervalo de aparición de los topos
    clearInterval(startTime); //detiene el intervalo de decremento del tiempo
    timeCount.innerHTML = "0";
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Reinicia la musica para el proximo juego
    restartButton.style.display = "block"; //muestra el boton de reinicio
    bardockOutro.play();
    Swal.fire({   title: `¡Bien hecho! <br> Tu puntaje: ${score}`,   width: 500,  padding: "3em",   color: "white",   background: "#fff url(images/1c52c923147ab5d1605d39babc4c1629.gif) no-repeat",   backdrop: `     rgba(255, 255, 255, 0)     url("")     left top     no-repeat ` });
} 
// Función que reinicia el estado del juego

function resetGame(){
    countDown = 30;
    score = 0;
    scoreCount.innerHTML = score;
    timeCount.innerHTML = countDown;

    clearInterval(startTime);
    clearInterval(startGame);

    // asegura que todos los soldados esten ocultos al reiniciar
    allSoldierItems.forEach((item =>{
        const soldier = item.querySelector(".soldier");
        soldier.classList.remove(".soldier-appear")
    }))
}

// funcion que muestra un topo al azar

function showSoldier(){
    if (countDown <= 0) {
        return;
    }
    let soldierToAppear = allSoldierItems[getRandomValue()].querySelector(".soldier");
    soldierToAppear.classList.add("soldier-appear");
    hideSoldier(soldierToAppear); // esta funcion configura la desaparición del soldado
}

// gerena un indice aleatorio para seleccionar un soldado

function getRandomValue() {
    let rand = Math.random() * allSoldierItems.length;
    return Math.floor(rand);
}

// Hace que el topo desaparezca después de 1 segundo

function hideSoldier(soldierItem) {
    setTimeout(() => {
       soldierItem.classList.remove("soldier-appear"); 
    }, 1000);
}