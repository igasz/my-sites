document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('form');

      form.addEventListener('submit', function (event) {
        event.preventDefault();

        const imie = document.getElementById('imie').value.trim();
        const nazwisko = document.getElementById('nazwisko').value.trim();
        const email = document.getElementById('email').value.trim();
        const wiadomosc = document.getElementById('wiadomosc').value.trim();
        const temat = document.getElementById('temat').value;

        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!emailValid) {
          alert('Proszę podać poprawny adres E-mail.');
          return;
        }

        if (!imie) {
          alert('Proszę wpisać imie.');
          return;
        }

        if (!nazwisko) {
          alert('Proszę wpisać nazwisko.');
          return;
        }

        if (!wiadomosc) {
          alert('Proszę wpisać treść wiadomości.');
          return;
        }

        if (!temat) {
          alert('Proszę wybrać temat wiadomości.');
          return;
        }

        alert('Dostałam wiadomość! Dziękuję za kontakt');

        form.reset();
      });
});