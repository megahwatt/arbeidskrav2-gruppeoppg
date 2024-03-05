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

// Function to fetch random user based on gender
async function fetchRandomUser(gender) {
    try {
        const response = await fetch(`https://randomuser.me/api/?gender=${gender}`);
        const data = await response.json();
        const user = data.results[0];
        nameElement.textContent = `${user.name.first} ${user.name.last}`;
        locationElement.textContent = `${user.location.city}, ${user.location.country}`;
        profileImgElement.src = user.picture.large;
    } catch (error) {
        console.error('Error fetching random user:', error);
    }
}

// Event listeners for filter buttons
document.getElementById('filter-women').addEventListener('click', () => {
    fetchRandomUser('female');
});

document.getElementById('filter-men').addEventListener('click', () => {
    fetchRandomUser('male');
});

document.getElementById('filter-both').addEventListener('click', () => {
    // Fetch random user without specifying gender (both)
    fetchRandomUser('');
});

// Event listeners for swipe buttons
notInterestedBtn.addEventListener('click', () => {
    updateScore();
    fetchRandomUser(getSelectedGender()); // Fetch next random user based on selected gender
});

interestedBtn.addEventListener('click', () => {
    updateScore();
    // Logic to handle interested user
    messageElement.textContent = "Added to your liked profiles!";
    fetchRandomUser(getSelectedGender());
    // Fetch next random user based on selected gender
});

// Function to get the selected gender for filtering
function getSelectedGender() {
    const selectedGender = document.querySelector('input[name="gender"]:checked').value;
    if (selectedGender === 'women') {
        return 'female';
    } else if (selectedGender === 'men') {
        return 'male';
    } else {
        return '';
    }
}

// Initial fetch on page load
window.addEventListener('load', () => {
    fetchRandomUser('');
});
