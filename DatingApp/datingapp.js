const scoreElement = document.getElementById('score');
const nameElement = document.querySelector('.name');
const locationElement = document.querySelector('.location');
const profileImgElement = document.querySelector('.profile-card img');
const notInterestedBtn = document.getElementById('not-interested');
const interestedBtn = document.getElementById('interested');
const messageElement = document.getElementById('message');

let score = 10;

// Function to update score
function updateScore() {
    score--;
    scoreElement.textContent = score;
    if (score <= 0) {
        messageElement.textContent = "Out of swipes! Would you like to swipe more?";
        notInterestedBtn.disabled = true;
        interestedBtn.disabled = true;
    }
}

