document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const scenarioScreen = document.getElementById('scenario-screen');
    const resultScreen = document.getElementById('result-screen');
    const startBtn = document.getElementById('start-btn');
    const scenarioContainer = document.getElementById('scenario-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress');
    const restartBtn = document.getElementById('restart-btn');
    const shareBtn = document.getElementById('share-btn');
    const riskProfileText = document.getElementById('risk-profile-text');
    const riskDescription = document.getElementById('risk-description');
    const suggestedInvestments = document.getElementById('suggested-investments');
    const scorePointer = document.getElementById('score-pointer');
    const playerAvatar = document.getElementById('player-avatar');
    const finalAvatar = document.getElementById('final-avatar');
    const levelValue = document.getElementById('level-value');
    const currentLevel = document.getElementById('current-level');
    const finalLevel = document.getElementById('final-level');
    const achievementName = document.getElementById('achievement-name');
    const characters = document.querySelectorAll('.character');

    // Background images for scenarios
    const backgroundImages = {
        mountain: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
        storm: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe',
        path: 'https://images.unsplash.com/photo-1475066392170-59d55d96fe51',
        treasure: 'https://images.unsplash.com/photo-1586864387789-628af9feed72',
        supplies: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
        debt: 'https://images.unsplash.com/photo-1579621970590-9d624316904b',
        experience: 'https://images.unsplash.com/photo-1516750105099-4b8a83e217ee',
        goal: 'https://images.unsplash.com/photo-1602501437125-442c9090d6ec',
        risk: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9',
        map: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86'
    };
    
    // State variables
    let currentScenarioIndex = 0;
    let userAnswers = new Array(scenarios.length).fill(null);
    let totalScore = 0;
    let selectedCharacter = null;

    // Initialize the app
    function init() {
        bindEvents();
    }

    // Bind event listeners
    function bindEvents() {
        // Character selection
        characters.forEach(character => {
            character.addEventListener('click', () => {
                selectCharacter(character);
            });
        });

        startBtn.addEventListener('click', startGame);
        prevBtn.addEventListener('click', showPreviousScenario);
        nextBtn.addEventListener('click', handleNextButton);
        restartBtn.addEventListener('click', restartGame);
        shareBtn.addEventListener('click', shareResult);
    }

    // Select a character
    function selectCharacter(character) {
        // Remove 'selected' class from all characters
        characters.forEach(char => {
            char.classList.remove('selected');
        });
        
        // Add 'selected' class to the chosen character
        character.classList.add('selected');
        
        // Store selected character type
        selectedCharacter = character.getAttribute('data-character');
        
        // Enable start button
        startBtn.disabled = false;
    }

    // Start the game
    function startGame() {
        welcomeScreen.classList.remove('active');
        scenarioScreen.classList.add('active');
        
        // Set the player avatar based on selected character
        setPlayerAvatar();
        
        showScenario(0);
        updateNavButtons();
    }

    // Set player avatar based on selected character
    function setPlayerAvatar() {
        let avatarImage;
        
        switch(selectedCharacter) {
            case 'conservative':
                avatarImage = 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1700460183.1709251200&semt=ais';
                break;
            case 'balanced':
                avatarImage = 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60112.jpg?size=338&ext=jpg&ga=GA1.1.1700460183.1709251200&semt=ais';
                break;
            case 'adventurous':
                avatarImage = 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60113.jpg?size=338&ext=jpg&ga=GA1.1.1700460183.1709251200&semt=ais';
                break;
        }
        
        playerAvatar.style.backgroundImage = `url('${avatarImage}')`;
    }

    // Show the current scenario
    function showScenario(index) {
        currentScenarioIndex = index;
        const scenario = scenarios[index];
        
        // Update level indicators
        levelValue.textContent = index + 1;
        currentLevel.textContent = index + 1;
        
        // Calculate progress percentage
        const progressPercentage = ((index + 1) / scenarios.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // Get background image for current scenario
        const bgImage = backgroundImages[scenario.background] || 'https://images.unsplash.com/photo-1579621970795-87facc2f976d';

        // Create scenario HTML
        let scenarioHTML = `
            <div class="scenario" style="background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('${bgImage}?auto=format&fit=crop&w=800&q=60'); background-size: cover; background-position: center; background-blend-mode: overlay;">
                <h3>${scenario.title}</h3>
                <p>${scenario.description}</p>
                <ul class="choices">
        `;

        // Add choices
        scenario.choices.forEach((choice, choiceIndex) => {
            const isSelected = userAnswers[index] === choiceIndex;
            scenarioHTML += `
                <li class="choice ${isSelected ? 'selected' : ''}" data-index="${choiceIndex}">
                    ${choice.text}
                </li>
            `;
        });

        scenarioHTML += `
                </ul>
            </div>
        `;

        scenarioContainer.innerHTML = scenarioHTML;

        // Add click event listeners to choices
        const choiceElements = scenarioContainer.querySelectorAll('.choice');
        choiceElements.forEach(choiceElement => {
            choiceElement.addEventListener('click', () => {
                const choiceIndex = parseInt(choiceElement.getAttribute('data-index'));
                selectChoice(choiceIndex);
            });
        });

        updateNavButtons();
    }

    // Select a choice for the current scenario
    function selectChoice(choiceIndex) {
        userAnswers[currentScenarioIndex] = choiceIndex;
        
        // Highlight selected choice
        const choices = scenarioContainer.querySelectorAll('.choice');
        choices.forEach((choice, index) => {
            if (index === choiceIndex) {
                choice.classList.add('selected');
            } else {
                choice.classList.remove('selected');
            }
        });

        updateNavButtons();
    }

    // Show the previous scenario
    function showPreviousScenario() {
        if (currentScenarioIndex > 0) {
            showScenario(currentScenarioIndex - 1);
        }
    }

    // Handle next button click
    function handleNextButton() {
        if (currentScenarioIndex < scenarios.length - 1) {
            showScenario(currentScenarioIndex + 1);
        } else {
            calculateResult();
        }
    }

    // Update navigation buttons
    function updateNavButtons() {
        prevBtn.disabled = currentScenarioIndex === 0;
        
        if (currentScenarioIndex === scenarios.length - 1) {
            nextBtn.textContent = 'مشاهده نتیجه';
            nextBtn.disabled = userAnswers[currentScenarioIndex] === null;
        } else {
            nextBtn.textContent = 'قدم بعدی';
            nextBtn.disabled = userAnswers[currentScenarioIndex] === null;
        }
    }

    // Calculate game result
    function calculateResult() {
        totalScore = 0;
        
        // Calculate total score
        userAnswers.forEach((selectedChoiceIndex, scenarioIndex) => {
            if (selectedChoiceIndex !== null) {
                const selectedChoice = scenarios[scenarioIndex].choices[selectedChoiceIndex];
                totalScore += selectedChoice.score;
            }
        });

        // Find matching risk profile
        const matchedProfile = riskProfiles.find(profile => 
            totalScore >= profile.range.min && totalScore <= profile.range.max
        );

        // Display result screen
        scenarioScreen.classList.remove('active');
        resultScreen.classList.add('active');

        // Set final avatar
        finalAvatar.style.backgroundImage = playerAvatar.style.backgroundImage;

        // Update result screen content
        riskProfileText.textContent = matchedProfile.title;
        riskDescription.textContent = matchedProfile.description;
        achievementName.textContent = matchedProfile.achievement;

        // Set final level based on score
        let finalLevelText;
        if (totalScore < 20) {
            finalLevelText = "مسافر مبتدی";
        } else if (totalScore < 30) {
            finalLevelText = "سیاح با تجربه";
        } else if (totalScore < 40) {
            finalLevelText = "ماجراجوی حرفه‌ای";
        } else {
            finalLevelText = "استاد سرمایه‌گذاری";
        }
        finalLevel.textContent = finalLevelText;

        // Calculate pointer position (as percentage from left)
        const minPossibleScore = 10; // Minimum possible score
        const maxPossibleScore = 50; // Maximum possible score
        const scorePercentage = ((totalScore - minPossibleScore) / (maxPossibleScore - minPossibleScore)) * 100;
        
        // Position the pointer with animation
        setTimeout(() => {
            scorePointer.style.left = `${scorePercentage}%`;
        }, 500);

        // Display suggested investments
        let investmentsHTML = '';
        matchedProfile.suggestedInvestments.forEach(investment => {
            investmentsHTML += `<div class="investment-item">${investment}</div>`;
        });
        
        suggestedInvestments.innerHTML = investmentsHTML;
    }

    // Share result function
    function shareResult() {
        // This could be implemented with actual sharing functionality
        // For now, we'll just show an alert
        alert('این ویژگی در نسخه‌های بعدی اضافه خواهد شد.');
    }

    // Restart the game
    function restartGame() {
        currentScenarioIndex = 0;
        userAnswers = new Array(scenarios.length).fill(null);
        totalScore = 0;
        
        resultScreen.classList.remove('active');
        welcomeScreen.classList.add('active');
        
        // Reset character selection
        characters.forEach(char => {
            char.classList.remove('selected');
        });
        
        selectedCharacter = null;
        startBtn.disabled = true;
    }

    // Initialize the app
    init();
}); 