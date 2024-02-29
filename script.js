document.addEventListener('DOMContentLoaded', () => {
    const promptsContainer = document.getElementById('prompts');
    const promptForm = document.getElementById('prompt-form');
    const titleInput = document.getElementById('prompt-title');
    const templateInput = document.getElementById('prompt-template');

    let prompts = JSON.parse(localStorage.getItem('prompts')) || [];

    // Function to render prompts to the UI
    function renderPrompts() {
        promptsContainer.innerHTML = '';
        prompts.forEach((prompt, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${prompt.title} <button onclick="editPrompt(${index})">Edit</button>`;
            promptsContainer.appendChild(li);
        });
    }

    // Save prompt to local storage
    function savePrompts() {
        localStorage.setItem('prompts', JSON.stringify(prompts));
    }

    // Submit form to add or update a prompt
    promptForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newPrompt = {
            title: titleInput.value,
            template: templateInput.value
        };
        prompts.push(newPrompt);
        savePrompts();
        renderPrompts();
        titleInput.value = '';
        templateInput.value = '';
    });

    // Edit a prompt
    window.editPrompt = function(index) {
        const prompt = prompts[index];
        titleInput.value = prompt.title;
        templateInput.value = prompt.template;
        // Update instead of add
        document.getElementById('prompt-form').onsubmit = function(e) {
            e.preventDefault();
            prompt.title = titleInput.value;
            prompt.template = templateInput.value;
            savePrompts();
            renderPrompts();
            // Reset form to default behavior
            promptForm.onsubmit = addPrompt;
            titleInput.value = '';
            templateInput.value = '';
        };
    };

    // Initially render saved prompts
    renderPrompts();
});

// Function to add a new prompt (default form behavior)
function addPrompt(e) {
    e.preventDefault();
    // Implementation would be similar to the submit event listener above
}

// Continuing from the previous code...

// Function to open a prompt for filling in the slots and copying to the clipboard
function fillAndCopyPrompt(index) {
    const prompt = prompts[index];
    const slotRegex = /{{(.*?)}}/g;
    let match;
    let slots = [];
    while ((match = slotRegex.exec(prompt.template)) !== null) {
        slots.push(match[1]);
    }

    if (slots.length > 0) {
        const filledSlots = {};
        let filledPrompt = prompt.template;
        slots.forEach(slot => {
            const slotValue = prompt(slot, `Enter value for ${slot}`);
            filledSlots[slot] = slotValue;
            filledPrompt = filledPrompt.replace(`{{${slot}}}`, slotValue);
        });

        // Copy filled prompt to clipboard
        navigator.clipboard.writeText(filledPrompt).then(() => {
            alert('Prompt copied to clipboard!');
        }, (err) => {
            console.error('Could not copy prompt to clipboard: ', err);
        });
    } else {
        // If no slots, just copy the original prompt
        navigator.clipboard.writeText(prompt.template).then(() => {
            alert('Prompt copied to clipboard!');
        }, (err) => {
            console.error('Could not copy prompt to clipboard: ', err);
        });
    }
}

// Adding a copy button to each prompt in the renderPrompts function
function renderPrompts() {
    promptsContainer.innerHTML = '';
    prompts.forEach((prompt, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${prompt.title} <button onclick="editPrompt(${index})">Edit</button> <button onclick="fillAndCopyPrompt(${index})">Fill & Copy</button>`;
        promptsContainer.appendChild(li);
    });
}

// Make sure to call renderPrompts() again if not already called after modifications to include the Fill & Copy button.