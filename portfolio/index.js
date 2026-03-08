const btnAbout = document.getElementById('btn-about');
        const btnExperience = document.getElementById('btn-experience');
        const btnProjects = document.getElementById('btn-projects');

        const secAbout = document.getElementById('about');
        const secExperience = document.getElementById('experience');
        const secProjects = document.getElementById('projects');


        function hideAllSections() {
            secAbout.classList.remove('active-section');
            secExperience.classList.remove('active-section');
            secProjects.classList.remove('active-section');
        }

        
        btnAbout.addEventListener('click', () => {
            hideAllSections(); 
            secAbout.classList.add('active-section');
        });

        btnExperience.addEventListener('click', () => {
            hideAllSections();
            secExperience.classList.add('active-section');
        });

        btnProjects.addEventListener('click', () => {
            hideAllSections();
            secProjects.classList.add('active-section');
        });

const photoStack = document.getElementById('photo-stack');

photoStack.addEventListener('click', () => {
    const topPhoto = photoStack.firstElementChild;
    photoStack.appendChild(topPhoto);
});