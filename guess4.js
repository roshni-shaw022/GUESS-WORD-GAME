window.onload = function () {
  const playerName = localStorage.getItem("playerName");
  if (playerName) {
    document.getElementById("player-name").innerText = `👋 Welcome, ${playerName}!`;
  } else {
    // If user skips login, redirect
    window.location.href = "login.html";
  }
};
 function toggleHelpBox() {
    const box = document.getElementById("help-popup");
    box.classList.toggle("show");
}

function toggleStatsBox() {
  const popup = document.getElementById("stats-popup");
  const name = localStorage.getItem("playerName") || "Player";
  const allStats = JSON.parse(localStorage.getItem("guessStats") || "{}");
  const stats = allStats[name] || { played: 0, wins: 0, losses: 0 };

  document.getElementById("stat-name").textContent = name;
  document.getElementById("stat-played").textContent = stats.played;
  document.getElementById("stat-wins").textContent = stats.wins;
  document.getElementById("stat-losses").textContent = stats.losses;

  popup.classList.toggle("hidden");
}
let database=["HOPE","KING","SHOP","VERY","BORN","NAVY","CORE","MANY","LIKE","LOVE","LOST","GIFT","SHIP","WANT","LONG","MUCH","HOST","HOLD","HALT","HAVE","HAND","HIDE","ACID","AUNT","ATOM","BOTH","BODY","BACK","BATH","BELT","BONE","BIKE","BORN","BEAM","BOND","BORE","BEND","BARS","BULK","COME","CARE","COST","CAKE","CLUB","CAST","CORN","CROP","CALM","CASE","CITY","DOWN","DRAG","DONE","DUAL","DROP","DISH","DATE","DENY","EACH","EXAM","EASY","EXIT","EAST","EVIL","EARN","FILM","FLOW","FUEL","FIVE","FLAT","FOLK","FAME","FAIL","FLAG","GAME","GLUE","GRAY","GOLF","GAIN","GOLD","GERM","GOAT","GIRL","GIVE","GRAB","HEAT","HEAD","HOLY","HUNT","HATE","HURT","HARM","HINT","IDEA","ICON","IRON","ITEM","JUST","JUNK","JOKE","JERK","KNOW","KITE","KNOT","KEPT","LIST","LATE","LAWS","LEFT","LAKE","LACK","LOSE","LOST","LIFT","LOUD","LOAN","LAST","LAND","LOCK","LADY","LOAD","LEAF","LANE","LENS","MEAN","MORE","MARK","MALE","MILD","MASK","MONK","MAID","MADE","NEXT","NEXT","NOSE","NEAR","NODE","ONLY","OXEN","ONCE","OVER","ONES","OILY","OVEN","PART","PLAY","PUSH","PARK","PURE","PLAN","PICK","POET","PACE","PLOT","PRAY","PINE","PATH","PAIR","PAST","PAID","PAIN","POLE","QUIT","QUIZ","READ","ROCK","RISK","RIDE","REST","RAIN","RACE","RISE","RICE","ROSE","ROPE","RING","RANK","RUGE","RAGE","RIPE","SOME","SUCH","SIDE","SURE","SOUP","STAR","SAFE","SALT","SPOT","SORT","STEP","SIGN","SAFE","SHOW","SKIN","SOUL","SKIN","SALE","SIZE","SEAT","TIME","TURN","TERM","TRIP","TINY","TAIL","TEAR","USER","UNIT","UPON","UREA","UNDO","VIEW","VAST","VERB","VOTE","WIND","WAKE","WIFE","WEST","WEAR","WISE","WEAK","WRAP","YEAR","YARD","YOUR","YOLK","YAWN","ZERO","ZINC","ZONE"]
const targetWord=database[Math.floor(Math.random() *database.length)];
//const targetWord='WING'
let currentRowIndex = 0;
function startGame() {
    const welcome = document.getElementById("welcome-screen");
    welcome.style.animation = "fadeOut 1s ease forwards";

    setTimeout(() => {
        welcome.style.display = "none";
        const firstBox = document.querySelector('.chances .box');
        if (firstBox) firstBox.focus(); // Autofocus to the first input
    }, 1000);
}
function focusNextRow() {
    const allRows = document.querySelectorAll('.chances');
    if (currentRowIndex < allRows.length) {
        const nextRowBoxes = allRows[currentRowIndex].querySelectorAll('.box');
        if (nextRowBoxes.length > 0) {
            nextRowBoxes[0].focus();
        }
    }
}

function updateStats(win) {
  const player = localStorage.getItem("playerName");
  let allStats = JSON.parse(localStorage.getItem("guessStats") || "{}");

  if (!allStats[player]) {
    allStats[player] = { played: 0, wins: 0, losses: 0 };
  }

  allStats[player].played += 1;
  if (win) allStats[player].wins += 1;
  else allStats[player].losses += 1;

  localStorage.setItem("guessStats", JSON.stringify(allStats));
}

function toggleLeaderboard() {
  const popup = document.getElementById("leaderboard-popup");
  const allStats = JSON.parse(localStorage.getItem("guessStats") || "{}");

  const sorted = Object.entries(allStats)
    .filter(([name, data]) => data && data.played > 0)
    .map(([name, data]) => ({
      name,
      wins: data.wins,
      played: data.played
    }))
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 3);

  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";

  if (sorted.length === 0) {
    list.innerHTML = "<li>No players yet!</li>";
  } else {
    sorted.forEach((entry, index) => {
      list.innerHTML += `<li><strong>${index+1}. ${entry.name}</strong> – ${entry.wins} win(s) out of ${entry.played}</li>`;
    });
  }

  popup.classList.toggle("hidden");
}

function getCurrentGuess() {
    const currentRow = document.querySelectorAll('.chances')[currentRowIndex];
    const boxes = currentRow.querySelectorAll('.box');
    return Array.from(boxes).map(box => box.value.toUpperCase()).join('');
}

function displayResult(correctPositions, misplacedLetters) {
    const currentRow = document.querySelectorAll('.chances')[currentRowIndex];
    currentRow.querySelector('.circle-correct').textContent = correctPositions;
    currentRow.querySelector('.circle-incorrect').textContent = misplacedLetters;
    //boxes.forEach(box => box.disabled = true);
    if(correctPositions===4){
        updateStats(true);
        showCustomAlert("🎉 CONGRATULATIONS!<br>IT'S A SUCCESSFUL GUESS!");
        const allInputs = document.querySelectorAll('.box');
        allInputs.forEach(input => input.disabled = true);
        setTimeout(() => {
        location.reload(); // Reloads the page
    }, 8000);
    return; // 3-second delay
        
     }
    
}
function handelKey(event) {
    if (event.key === "Enter") {
        const guess = getCurrentGuess();
        if (guess.length !== 4) {
            alert("Enter 4 letters first!");
            return;
        }

        // Check the guess
        const result = evaluateGuess(guess);
        displayResult(result.correctPositions, result.misplacedLetters);

        const currentRow = document.querySelectorAll('.chances')[currentRowIndex];
        const inputs = currentRow.querySelectorAll('.box');
        inputs.forEach(input => input.disabled = true);
        if(result.correctPositions===4){
            return;
        }

        // Move to the NEXT row
        currentRowIndex++;
        if (currentRowIndex >=8 ) {
            updateStats(false);
            showCustomAlert(`😓 HARD LUCK!<br>BETTER LUCK NEXT TIME.<br>Correct word was: <strong>${targetWord}</strong>`);
            const allInputs = document.querySelectorAll('.box');
            allInputs.forEach(input => input.disabled = true);
            setTimeout(() => {
            location.reload(); // Reloads the page
            }, 8000); // 3-second delay
        
            console.log("All guesses used up.");
        } else {
            //moveNext();
            focusNextRow();
            console.log(`Move to row "${currentRowIndex + 1}"`);
        }
    }
    if(event.key==="Backspace"){
        if(event.target.value!==""){
             event.target.value="";
        }
       else{
            const prev=event.target.previousElementSibling;
            if(prev && prev.classList.contains("box"))
            {
                prev.focus();
                prev.value=""
            }
            
            }
            return;
        }
       
        if (/^[a-zA-Z]$/.test(event.key)) {
            moveNext();
    
            }
}
function evaluateGuess(guess) {
    let correctPositions = 0;
    let misplacedLetters = 0;

    const targetArr = targetWord.split('');
    const guessArr = guess.split('');

    // ✅ Correct Positions
    guessArr.forEach((char, idx) => {
        if (char === targetWord[idx]) {
            correctPositions++;
            targetArr[idx] = null;
        }
    });
    // ✅ Misplaced
    guessArr.forEach((char, idx) => {
        if (char !== targetWord[idx] && targetArr.includes(char)) {
            misplacedLetters++;
            targetArr[targetArr.indexOf(char)] = null;
        }
    });

    return { correctPositions, misplacedLetters };
}
function moveNext(){
                event.preventDefault();  // Prevent default typing
                event.target.value = event.key.toUpperCase();  // Set uppercase letter

                const next = event.target.nextElementSibling;
                if (next && next.classList.contains("box")) {
                     next.focus(); // Move to next box
                    }
                }
function isLetter(event) {
  if (!/^[a-zA-Z]$/.test(event.key)) {
    event.preventDefault();
    console.warn("⚠️ Only letters (A–Z) are allowed.");
}
}
function showCustomAlert(message) {
  const alertBox = document.getElementById("custom-alert");
  const messageBox = document.getElementById("alert-message");

  messageBox.innerHTML = message;
  alertBox.classList.remove("hidden");

  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 5000); // Hide after 3 seconds
}
document.addEventListener("DOMContentLoaded", () => {
  const icon = document.getElementById("stats-icon");
  if (icon) {
    icon.addEventListener("click", toggleStatsBox);
  }

  const playBtn = document.getElementById("play-button");
  if (playBtn) {
    playBtn.addEventListener("click", startGame);
  }

  // 👇 Hide welcome screen if already played before and page reloaded
  const welcomeScreen = document.getElementById("welcome-screen");
  if (welcomeScreen && welcomeScreen.style.display === "none") {
    const firstBox = document.querySelector('.chances .box');
    if (firstBox) firstBox.focus();
  }
});