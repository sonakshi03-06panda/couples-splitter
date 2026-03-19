'use client';

interface Particle {
  id: string;
  x: number;
  y: number;
  type: 'star' | 'square' | 'checkmark' | 'sparkle';
  color: string;
  delay: number;
  duration: number;
  offsetX?: number;
  offsetY?: number;
}

interface ParticleSystemProps {
  particles: Particle[];
}

/**
 * Renders particle effects with CSS animations
 */
export function ParticleSystem({ particles }: ParticleSystemProps) {
  const getParticleContent = (type: string) => {
    switch (type) {
      case 'star':
        return '★';
      case 'square':
        return '■';
      case 'checkmark':
        return '✓';
      case 'sparkle':
        return '✨';
      default:
        return '•';
    }
  };

  const getAnimationStyle = (particle: Particle) => {
    // Calculate random horizontal offset for spread effect
    const angle = Math.random() * Math.PI * 2;
    const spreadRadius = 60 + Math.random() * 40;
    const offsetX = Math.cos(angle) * spreadRadius;
    const offsetY = particle.type === 'checkmark' || particle.type === 'square' 
      ? Math.sin(angle) * 30 
      : -Math.sin(angle) * 60;

    let animationName = 'particleFloatUp';
    if (particle.type === 'square' || particle.type === 'checkmark') {
      animationName = 'particleFall';
    }

    return {
      animationName,
      animationDuration: `${particle.duration}ms`,
      animationDelay: `${particle.delay}ms`,
      '--tx': `${offsetX}px`,
      '--ty': `${offsetY}px`,
    } as React.CSSProperties;
  };

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            position: 'fixed',
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            pointerEvents: 'none',
            zIndex: 9999,
            fontSize: particle.type === 'sparkle' ? '1.5rem' : '1.75rem',
            color: particle.color,
            fontWeight: 'bold',
            textShadow: `0 0 4px ${particle.color}`,
            willChange: 'transform opacity',
            ...getAnimationStyle(particle),
          } as React.CSSProperties}
        >
          {getParticleContent(particle.type)}
        </div>
      ))}
    </>
  );
}
