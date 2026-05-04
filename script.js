document.addEventListener('DOMContentLoaded', () => {
  // 1. Eksekusi ulang Instagram Script jika berada di halaman portfolio
  if (document.querySelector('.instagram-media')) {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else {
      const script = document.createElement('script');
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }

  // 2. Glitch Text Effect Trigger (Opsional untuk estetika)
  const glitchText = document.querySelector('.glitch');
  if (glitchText) {
    setInterval(() => {
      glitchText.classList.toggle('active');
    }, 4000);
  }
});