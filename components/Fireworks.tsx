import React, { useEffect, useRef } from 'react';

let sharedAudioContext: AudioContext | null = null;
let lastExplosionSoundTime = 0;
const EXPLOSION_SOUND_COOLDOWN_MS = 90;

const playExplosionSound = () => {
  try {
    const now = performance.now();
    if (now - lastExplosionSoundTime < EXPLOSION_SOUND_COOLDOWN_MS || document.hidden) {
      return;
    }

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    if (!sharedAudioContext) {
      sharedAudioContext = new AudioContext();
    }
    const ctx = sharedAudioContext;

    // Resume if it was suspended by browser policies.
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.5);
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
    lastExplosionSoundTime = now;
  } catch (e) {
    // Ignore audio errors
  }
};

const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // We keep a ref to the array to modify it from event listeners
  const fireworksRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: any[] = [];
    const fireworks = fireworksRef.current;
    const launchInitialSpeed = 1.4;
    const launchAcceleration = 1.03;
    const maxParticles = 320;
    const particlesPerExplosion = 24;
    const maxConcurrentFireworks = 12;

    class Firework {
      x: number;
      y: number;
      sx: number;
      sy: number;
      tx: number;
      ty: number;
      distanceToTargetSq: number;
      coordinates: [number, number][] = [];
      coordinateCount: number = 3;
      angle: number;
      speed: number = launchInitialSpeed;
      acceleration: number = launchAcceleration;
      brightness: number;
      hue: number;
      strokeColor: string;
      targetRadius: number = 1;

      constructor(sx: number, sy: number, tx: number, ty: number) {
        this.x = sx;
        this.y = sy;
        this.sx = sx;
        this.sy = sy;
        this.tx = tx;
        this.ty = ty;
        const dx = tx - sx;
        const dy = ty - sy;
        this.distanceToTargetSq = dx * dx + dy * dy;
        this.angle = Math.atan2(ty - sy, tx - sx);
        this.brightness = random(50, 70);
        this.hue = random(0, 360);
        this.strokeColor = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
      }

      update(index: number) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        if (this.targetRadius < 8) {
          this.targetRadius += 0.3;
        } else {
          this.targetRadius = 1;
        }

        this.speed *= this.acceleration;
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        const nextX = this.x + vx;
        const nextY = this.y + vy;

        const travelledDx = nextX - this.sx;
        const travelledDy = nextY - this.sy;
        const travelledSq = travelledDx * travelledDx + travelledDy * travelledDy;

        if (travelledSq >= this.distanceToTargetSq) {
          createParticles(this.tx, this.ty);
          fireworks.splice(index, 1);
          playExplosionSound();
        } else {
          this.x = nextX;
          this.y = nextY;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    class Particle {
      x: number;
      y: number;
      coordinates: [number, number][] = [];
      coordinateCount: number = 5;
      angle: number;
      speed: number;
      friction: number = 0.95;
      gravity: number = 1;
      hue: number;
      brightness: number;
      alpha: number = 1;
      decay: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.angle = random(0, Math.PI * 2);
        this.speed = random(1, 10);
        this.hue = random(0, 360);
        this.brightness = random(50, 80);
        this.decay = random(0.015, 0.03);
        
        if (Math.random() > 0.5) {
             this.hue = 45; // Gold
             this.brightness = 80; 
        }

        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
      }

      update(index: number) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
          particles.splice(index, 1);
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.stroke();
      }
    }

    function createParticles(x: number, y: number) {
      const availableSlots = maxParticles - particles.length;
      if (availableSlots <= 0) return;

      let particleCount = Math.min(particlesPerExplosion, availableSlots);
      while (particleCount--) {
        particles.push(new Particle(x, y));
      }
    }

    function random(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const autoLaunchIntervalMin = 200;
    const autoLaunchIntervalMax = 250;
    const getAutoLaunchInterval = () => Math.floor(random(autoLaunchIntervalMin, autoLaunchIntervalMax));
    let limiterTotal = getAutoLaunchInterval();
    let limiterTick = 0;

    function loop() {
      if (!ctx || !canvas) return;

      if (document.hidden) {
        requestAnimationFrame(loop);
        return;
      }
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      let i = fireworks.length;
      while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
      }

      let j = particles.length;
      while (j--) {
        particles[j].draw();
        particles[j].update(j);
      }

      // Auto fireworks
      if (limiterTick >= limiterTotal) {
        if (fireworks.length < maxConcurrentFireworks) {
          fireworks.push(new Firework(width / 2, height, random(0, width), random(0, height / 2)));
        }
        limiterTick = 0;
        limiterTotal = getAutoLaunchInterval();
      } else {
        limiterTick++;
      }

      requestAnimationFrame(loop);
    }

    const animationId = requestAnimationFrame(loop);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    // Custom event listener for manual trigger (from background clicks in FallingParticles)
    const handleCustomTrigger = (e: Event) => {
        const customEvent = e as CustomEvent;
        const { x, y } = customEvent.detail;
        const startX = Math.random() * canvas.width;
        const startY = canvas.height;
        if (fireworks.length < maxConcurrentFireworks) {
          fireworks.push(new Firework(startX, startY, x, y));
        }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('triggerFirework', handleCustomTrigger);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('triggerFirework', handleCustomTrigger);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 mix-blend-screen"
    />
  );
};

export default Fireworks;
