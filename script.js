document.addEventListener('DOMContentLoaded', () => {
    displayPrompts();
});

function savePrompt(promptText) {
    const prompts = JSON.parse(localStorage.getItem('prompts') || '[]');
    prompts.push(promptText);
    localStorage.setItem('prompts', JSON.stringify(prompts));
    displayPrompts();
}

function displayPrompts() {
    const prompts = JSON.parse(localStorage.getItem('prompts') || '[]');
    const listElement = document.getElementById('prompts-list');
    listElement.innerHTML = ''; // Clear current list
    prompts.forEach((prompt, index) => {
        const promptElement = document.createElement('div');
        promptElement.textContent = prompt;
        listElement.appendChild(promptElement);
    });
}

document.getElementById('new-prompt-btn').addEventListener('click', () => {
    const promptText = prompt('Enter new prompt text. Use {} for insertion points.');
    if (promptText) {
        savePrompt(promptText);
    }
});

// Later, you'll add more functionality here to handle the insertion points and copyin

// g to clipboard.
document.addEventListener('DOMContentLoaded', () => {
    displayPrompts();
    document.getElementById('new-prompt-btn').addEventListener('click', createNewPrompt);
});

function savePrompt(promptText) {
    const prompts = JSON.parse(localStorage.getItem('prompts') || '[]');
    prompts.push(promptText);
    localStorage.setItem('prompts', JSON.stringify(prompts));
    displayPrompts();
}

function displayPrompts() {
    const prompts = JSON.parse(localStorage.getItem('prompts') || '[]');
    const listElement = document.getElementById('prompts-list');
    listElement.innerHTML = ''; // Clear current list
    prompts.forEach((prompt, index) => {
        const promptElement = document.createElement('div');
        promptElement.textContent = prompt;
        promptElement.addEventListener('click', () => fillAndCopyPrompt(prompt));
        listElement.appendChild(promptElement);
    });
}

function createNewPrompt() {
    const promptText = prompt('Enter new prompt text. Use {} for insertion points.');
    if (promptText) {
        savePrompt(promptText);
    }
}

async function fillAndCopyPrompt(promptText) {
    let filledPrompt = promptText;
    let insertionPointIndex = filledPrompt.indexOf('{}');

    while (insertionPointIndex !== -1) {
        let userText = prompt('Enter text for the insertion point:');
        // Replace first occurrence of '{}' with userText.
        filledPrompt = filledPrompt.replace('{}', userText);
        insertionPointIndex = filledPrompt.indexOf('{}');
    }

    if (navigator.clipboard && window.isSecureContext) {
        // Use the Clipboard API to copy the text.
        try {
            await navigator.clipboard.writeText(filledPrompt);
            alert('Prompt copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    } else {
        // Clipboard API not available, provide a manual copy fallback.
        let textArea = document.createElement("textarea");
        textArea.value = filledPrompt;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            alert('Prompt copied to clipboard!');
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
    }
}