/**
 * Spawns confetti particles across the screen
 */
export function triggerConfetti() {
  if (typeof document === 'undefined') return;

  const colors = ['#eef3fa', '#7fa6d6', '#c9d6ea', '#ecd39a', '#0d1520'];
  const particleCount = 60;

  for (let i = 0; i < particleCount; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = `${Math.random() * 100}vw`;
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = `${2 + Math.random() * 2.5}s`;
    c.style.animationDelay = `${Math.random() * 0.6}s`;
    document.body.appendChild(c);

    setTimeout(() => {
      c.remove();
    }, 5500);
  }
}
