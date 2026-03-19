'use client';

/**
 * Example component showing all available animations
 * This is for reference and testing purposes
 */

import { useState } from 'react';
import { useCounterAnimation, useAnimateOnChange } from '@/hooks/useCounterAnimation';
import { useSuccess } from '@/hooks/useSuccess';
import { 
  playSuccessAnimation, 
  shakeElement, 
  shakeScreen,
  createFloatingText 
} from '@/lib/animations';

export function AnimationExamples() {
  const { showSuccess } = useSuccess();
  const [counter, setCounter] = useState(0);
  const animatedCounter = useCounterAnimation(counter, 1000);
  const shouldAnimate = useAnimateOnChange(counter);

  const handleButtonPress = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Button already has press animation via CSS
    // This would be for additional feedback
    playSuccessAnimation(e.clientX, e.clientY);
  };

  const handleShowSuccess = () => {
    showSuccess({
      message: 'Success Achieved!',
      icon: '✅',
      duration: 2000
    });
  };

  const handleShake = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      shakeElement(ref.current);
    }
  };

  const handleScreenShake = () => {
    shakeScreen(8, 500);
  };

  const handleFloatingText = (e: React.MouseEvent<HTMLButtonElement>) => {
    createFloatingText('+50 points!', e.clientX, e.clientY, '#A8D77B');
    setCounter(prev => prev + 50);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>🎮 Animation Examples</h1>

      {/* Button Press Animation */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Button Press Animation</h2>
        <p>Buttons automatically get a pixel-press effect (2-3px offset on click)</p>
        <button 
          className="rpg-submit-button"
          onClick={handleButtonPress}
        >
          Click For Press Effect
        </button>
      </section>

      {/* Card Entrance Animation */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Card Entrance Animations</h2>
        <div className="balance-card">
          <h3 className="balance-card-name">Example Card</h3>
          <p>Cards slide in from sides (300ms)</p>
        </div>
      </section>

      {/* Success Popup */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Success Popup</h2>
        <button 
          className="rpg-submit-button"
          onClick={handleShowSuccess}
        >
          Show Success Popup
        </button>
      </section>

      {/* Number Counter Animation */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Number Counter Animation</h2>
        <p>Animated counter: <span className={`counter-number ${shouldAnimate ? 'animating' : ''}`}>{animatedCounter.toFixed(0)}</span></p>
        <button 
          className="rpg-submit-button"
          onClick={() => setCounter(prev => prev + 100)}
        >
          Add 100
        </button>
      </section>

      {/* Shake Element */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Shake Animation</h2>
        <div 
          ref={(ref) => {
            if (ref) (ref as any).shakeRef = ref;
          }}
          className="balance-card"
          style={{ 
            backgroundColor: '#E85D54',
            color: 'white'
          }}
        >
          Error State - Shake Me!
        </div>
        <button 
          className="rpg-submit-button"
          onClick={(e) => {
            const target = e.currentTarget.previousElementSibling as HTMLDivElement;
            shakeElement(target);
          }}
        >
          Trigger Shake
        </button>
      </section>

      {/* Screen Shake */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Screen Shake</h2>
        <p>Intense effect for major events</p>
        <button 
          className="rpg-submit-button"
          onClick={handleScreenShake}
        >
          Trigger Screen Shake
        </button>
      </section>

      {/* Floating Text */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Floating Text</h2>
        <p>Click to create floating text and increment counter</p>
        <button 
          className="rpg-submit-button"
          onClick={handleFloatingText}
        >
          Floating +50!
        </button>
      </section>

      {/* Hover Effects */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Hover Effects</h2>
        <div className="balance-card game-card-hover">
          <h3 className="balance-card-name">Hover Card</h3>
          <p>Scales up 1.02x and moves up on hover</p>
        </div>
      </section>
    </div>
  );
}
