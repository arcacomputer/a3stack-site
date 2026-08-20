const nav = document.querySelector('.site-nav');
const updateNav = () => nav?.classList.toggle('scrolled', window.scrollY > 20);
updateNav();
window.addEventListener('scroll', updateNav, { passive: true });

for (const table of document.querySelectorAll('.doc-content table')) {
  table.setAttribute('tabindex', '0');
  table.setAttribute('aria-label', 'Scrollable data table');
}

document.addEventListener('click', async (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest('[data-copy-code]');
  if (!button) return;

  const block = button.closest('.code-block');
  const code = block?.querySelector('pre code')?.textContent?.trim();
  if (!code) return;

  try {
    await navigator.clipboard.writeText(code);
    button.classList.add('is-copied');
    button.querySelector('span').textContent = 'Copied';
    window.setTimeout(() => {
      button.classList.remove('is-copied');
      button.querySelector('span').textContent = 'Copy';
    }, 2000);
  } catch {
    button.querySelector('span').textContent = 'Copy failed';
    window.setTimeout(() => {
      button.querySelector('span').textContent = 'Copy';
    }, 2000);
  }
});
