const nav = document.querySelector('.site-nav');
const updateNav = () => nav?.classList.toggle('scrolled', window.scrollY > 20);
updateNav();
window.addEventListener('scroll', updateNav, { passive: true });

for (const table of document.querySelectorAll('.doc-content table')) {
  table.setAttribute('tabindex', '0');
  table.setAttribute('aria-label', 'Scrollable data table');
}

const mobileNav = document.querySelector('.mobile-nav');
const mobileNavToggle = mobileNav?.querySelector('[data-mobile-nav-toggle]');
const updateMobileNavName = () => {
  mobileNavToggle?.setAttribute('aria-label', mobileNav?.open ? 'Close navigation menu' : 'Open navigation menu');
};
mobileNav?.addEventListener('toggle', updateMobileNavName);
mobileNav?.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !mobileNav.open) return;
  mobileNav.open = false;
  updateMobileNavName();
  mobileNavToggle?.focus();
});
updateMobileNavName();

document.addEventListener('click', async (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest('[data-copy-code]');
  if (!button) return;

  const block = button.closest('.code-block');
  const code = block?.querySelector('pre code')?.textContent?.trim();
  const status = block?.querySelector('[data-copy-status]');
  if (!code) return;

  const reset = () => {
    button.classList.remove('is-copied');
    button.querySelector('span').textContent = 'Copy';
    if (status) status.textContent = '';
  };

  try {
    await navigator.clipboard.writeText(code);
    button.classList.add('is-copied');
    button.querySelector('span').textContent = 'Copied';
    if (status) status.textContent = 'Code copied to clipboard';
  } catch {
    button.querySelector('span').textContent = 'Copy failed';
    if (status) status.textContent = 'Could not copy code to clipboard';
  }
  window.setTimeout(reset, 2000);
});
