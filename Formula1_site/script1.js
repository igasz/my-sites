const pitstop = document.getElementById('pitstop');

        window.addEventListener('scroll', () => {
        const sectionTop = pitstop.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight / 2) {
            pitstop.classList.add('active');
        }
        });