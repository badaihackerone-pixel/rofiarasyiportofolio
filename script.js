document.addEventListener('DOMContentLoaded', () => {
  // Typing Effect for headers
  const typeTarget = document.querySelector('.typewriter');
  if (typeTarget) {
    const text = typeTarget.getAttribute('data-text');
    typeTarget.textContent = '';
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        typeTarget.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);
  }

  // Terminal Mini-Game Logic (Contact Page)
  const terminalInput = document.getElementById('cmd-input');
  const terminalOutput = document.getElementById('terminal-output');

  if (terminalInput) {
    terminalInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        const cmd = this.value.trim().toLowerCase();
        this.value = '';
        executeCommand(cmd);
      }
    });
  }

  function executeCommand(cmd) {
    const response = document.createElement('div');
    response.innerHTML = `> ${cmd}<br>`;
    
    switch(cmd) {
      case 'help':
        response.innerHTML += `Available commands: [whoami, sudo get-contact, clear]`;
        break;
      case 'whoami':
        response.innerHTML += `guest_user`;
        break;
      case 'sudo get-contact':
        response.innerHTML += `ACCESS GRANTED.<br>Email: admin@bountyhunter.local<br>GitHub: github.com/yourusername`;
        response.style.color = '#fff';
        break;
      case 'clear':
        terminalOutput.innerHTML = '';
        return;
      default:
        response.innerHTML += `Command not found. Type 'help' for options.`;
    }
    terminalOutput.appendChild(response);
    document.getElementById('terminal').scrollTop = document.getElementById('terminal').scrollHeight;
  }
});