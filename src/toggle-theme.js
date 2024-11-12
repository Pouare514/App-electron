function toggleTheme() {
  const body = document.body;
  body.classList.toggle('dark-theme');
  const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
});