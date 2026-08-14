const globalFooter = document.querySelector('footer');
if (globalFooter) {
  const footerStyles = document.createElement('link');
  footerStyles.rel = 'stylesheet';
  footerStyles.href = 'footer-global.css';
  document.head.appendChild(footerStyles);
  globalFooter.classList.add('global-footer');
  globalFooter.innerHTML = `<a class="footer-brand" href="index.html" aria-label="Recargar página"><img src="kc-logo.webp" alt="Kukama Compost" width="900" height="277" loading="lazy" decoding="async"></a><p class="footer-phrase">Transformamos residuos en vida.</p><div class="footer-social" aria-label="Redes sociales"><a href="https://www.facebook.com/share/1BZ14UUNkr/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><span></span></a><a href="https://www.instagram.com/kukama_compost?igsh=bjlyejZka3kzY3Jl" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><span></span></a><a href="https://wa.link/kd4itp" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><span></span></a></div><p class="footer-rights">Todos los derechos reservados ©${new Date().getFullYear()} Kukama Compost - Iquitos - Perú.</p>`;
  globalFooter.querySelector('.footer-brand').addEventListener('click', (event) => { event.preventDefault(); window.location.reload(); });
}
