// Sélection du bouton de bascule de thème
const toggleThemeBtn = document.getElementById('toggle-theme');

toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});