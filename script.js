document.addEventListener('DOMContentLoaded', () => {
  // 1. Custom Inversion Cursor Logic
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // Efek membesar saat kursor berada di atas tautan interaktif
  const interactables = document.querySelectorAll('a, .redacted');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '80px';
      cursor.style.height = '80px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '40px';
      cursor.style.height = '40px';
    });
  });

  // 2. Instagram Embed Initialization
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
});