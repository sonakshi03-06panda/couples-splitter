/**
 * Animation Utilities for Retro Game-Style Effects
 */

/**
 * Play a success animation and optionally trigger sound
 */
export function playSuccessAnimation(x: number = window.innerWidth / 2, y: number = window.innerHeight / 2) {
  // Create visual feedback at position
  const element = document.createElement('div');
  element.textContent = '✓';
  element.style.position = 'fixed';
  element.style.left = x + 'px';
  element.style.top = y + 'px';
  element.style.fontSize = '3rem';
  element.style.fontWeight = 'bold';
  element.style.color = '#A8D77B';
  element.style.pointerEvents = 'none';
  element.style.zIndex = '5000';
  element.style.animation = 'popupIconBounce 0.5s ease-out forwards';
  
  document.body.appendChild(element);
  
  setTimeout(() => element.remove(), 500);
}

/**
 * Trigger a button press sound effect (optional - requires audio files)
 */
export function playClickSound() {
  // This would load and play a sound effect if available
  // For now, we use visual feedback via CSS animations
  try {
    // Optional: emit a very short beep-like sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800; // Beep frequency
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (e) {
    // Silently fail if audio context is not available
  }
}

/**
 * Add a card entrance animation to an element
 */
export function addCardEntranceAnimation(element: HTMLElement, direction: 'left' | 'right' = 'left') {
  const animationName = direction === 'left' ? 'cardSlideInLeft' : 'cardSlideInRight';
  element.style.animation = `${animationName} 0.3s ease-out`;
}

/**
 * Shake animation for error states
 */
export function shakeElement(element: HTMLElement, duration: number = 300) {
  const originalTransform = element.style.transform || '';
  const startTime = Date.now();
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = elapsed / duration;
    
    if (progress < 1) {
      const offset = Math.sin(progress * Math.PI * 8) * 4;
      element.style.transform = `${originalTransform} translateX(${offset}px)`;
      requestAnimationFrame(animate);
    } else {
      element.style.transform = originalTransform;
    }
  };
  
  animate();
}

/**
 * Pulse animation for attention-grabbing
 */
export function pulseElement(element: HTMLElement, count: number = 2) {
  const duration = 400 * count;
  element.style.animation = `pulseHighlight ${duration}ms ease-in-out`;
}

/**
 * Number pop-out animation (like in RPG gain/loss)
 */
export function createFloatingText(text: string, x: number, y: number, color: string = '#A8D77B') {
  const element = document.createElement('div');
  element.textContent = text;
  element.style.position = 'fixed';
  element.style.left = x + 'px';
  element.style.top = y + 'px';
  element.style.fontSize = '1.5rem';
  element.style.fontWeight = 'bold';
  element.style.color = color;
  element.style.pointerEvents = 'none';
  element.style.zIndex = '5000';
  element.style.fontFamily = 'Press Start 2P, monospace';
  
  // Custom float-up animation
  element.style.animation = 'floatUp 1s ease-out forwards';
  
  document.body.appendChild(element);
  
  setTimeout(() => element.remove(), 1000);
}

/**
 * Screen shake effect for major events
 */
export function shakeScreen(intensity: number = 5, duration: number = 300) {
  const startTime = Date.now();
  const body = document.body;
  const originalPosition = body.style.transform || '';
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = elapsed / duration;
    
    if (progress < 1) {
      const offsetX = (Math.random() - 0.5) * intensity * 2;
      const offsetY = (Math.random() - 0.5) * intensity * 2;
      body.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      requestAnimationFrame(animate);
    } else {
      body.style.transform = originalPosition;
    }
  };
  
  animate();
}
