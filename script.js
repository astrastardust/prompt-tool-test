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