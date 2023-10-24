document.addEventListener('DOMContentLoaded', function() {
    const homeButton = document.getElementById('homeButton');

    homeButton.addEventListener('click', function() {
        window.location.href = 'home.html';
    });
});
