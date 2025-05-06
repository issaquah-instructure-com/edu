    const title = document.getElementById('title');
    const codeInput = document.getElementById('code-input');
    const accessForm = document.getElementById('access-form');
    const message = document.getElementById('message');
    const shownCode = document.getElementById('shown-code');
    const accessIframe = document.getElementById('access-iframe');

    const CODE_INTERVAL = 3 * 60 * 1000; // 10 hours

    function generateCode() {
      const digits = '0123456789';
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      function rand(str) {
        return str[Math.floor(Math.random() * str.length)];
      }
      let code = [
        rand(digits),
        rand(letters),
        rand(symbols),
        rand(digits + letters + symbols),
        rand(digits + letters + symbols)
      ];
      return code.sort(() => Math.random() - 0.5).join('');
    }

    function getCodeData() {
      const data = JSON.parse(localStorage.getItem('accessCodeData')) || {};
      if (!data.code || Date.now() > data.expires) {
        const newCode = generateCode();
        const expires = Date.now() + CODE_INTERVAL;
        const newData = { code: newCode, expires };
        localStorage.setItem('accessCodeData', JSON.stringify(newData));
        return newData;
      }
      return data;
    }

    function initializeFlipdown(expires) {
      const countdown = Math.floor(expires / 1000);
      new FlipDown(countdown).start().ifEnded(() => location.reload());
    }

    const { code, expires } = getCodeData();
    initializeFlipdown(expires);

    title.addEventListener('click', () => {
      shownCode.style.display = 'block';
      shownCode.textContent = `🔐 CODE: ${code}`;
    });

    accessForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userCode = codeInput.value.trim();
      if (userCode === code) {
        message.textContent = 'ACCESS GRANTED';
        message.style.color = '#00ff00';
        // Hide rest of page and show iframe
        document.body.innerHTML = ''; // clear the page
        document.body.appendChild(accessIframe);
        accessIframe.style.display = 'block';
      } else {
        message.textContent = '❌ ACCESS DENIED';
        message.style.color = '#ff0000';
      }
    });
