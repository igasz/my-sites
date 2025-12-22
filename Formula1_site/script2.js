const races = document.querySelectorAll(".race");

const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
    entry.target.classList.add("show");
    }
});
}, {
threshold: 0.2
});

races.forEach(race => {
observer.observe(race);
});