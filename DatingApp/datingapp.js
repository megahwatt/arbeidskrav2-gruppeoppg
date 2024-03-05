const scoreElement = document.getElementById('score');
const nameElement = document.querySelector('.name');
const locationElement = document.querySelector('.location');
const profileImgElement = document.querySelector('.profile-card img');
const notInterestedBtn = document.getElementById('not-interested');
const interestedBtn = document.getElementById('interested');
const editBtn = document.getElementById('edit-profile');
const messageElement = document.getElementById('message');

let score = 10;
let likedProfiles = [];

// Function to update score
function updateScore() {
    score--;
    scoreElement.textContent = score;
    if (score <= 0) {
        const response = prompt("Out of swipes! Would you like to swipe more? Yes/No");
        if (response && response.toLowerCase() === "yes") {
            score = 10;
            scoreElement.textContent = score;
            messageElement.textContent = "";
            notInterestedBtn.disabled = false;
            interestedBtn.disabled = false;
        } else {
            messageElement.textContent = "Come back later when you're ready to swipe more!";
            notInterestedBtn.disabled = true;
            interestedBtn.disabled = true;
        }
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
    fetchRandomUser('');
});

// Event listener for edit button
editBtn.addEventListener('click', () => {
    const newName = prompt("Enter new name:");
    const newLocation = prompt("Enter new location:");
    // Update profile information
    nameElement.textContent = newName;
    locationElement.textContent = newLocation;
    // Update information in likedProfiles array
    likedProfiles = likedProfiles.map(profile => {
        if (profile.name === nameElement.textContent) {
            return {
                ...profile,
                name: newName,
                location: newLocation
            };
        }
        return profile;
    });
    // Update information in localStorage
    localStorage.setItem('likedProfiles', JSON.stringify(likedProfiles));
});

// Event listeners for swipe buttons
notInterestedBtn.addEventListener('click', () => {
    updateScore();
    fetchRandomUser(getSelectedGender()); // Fetch next random user based on selected gender
});

interestedBtn.addEventListener('click', () => {
    updateScore();
    likedProfiles.push({
        name: nameElement.textContent,
        location: locationElement.textContent
    }); // Add the current user to likedProfiles array
    messageElement.textContent = "Added to your liked profiles!";
    fetchRandomUser(getSelectedGender()); // Fetch next random user based on selected gender
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
