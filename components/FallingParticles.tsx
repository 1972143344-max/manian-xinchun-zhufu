import React, { useEffect, useRef } from 'react';

interface FallingParticlesProps {
  onBackgroundClick?: (x: number, y: number) => void;
}

const FallingParticles: React.FC<FallingParticlesProps> = ({ onBackgroundClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { desynchronized: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const items: Item[] = [];
    const effects: ClickEffect[] = [];
    const isLowerPowerDevice = (navigator.hardwareConcurrency || 8) <= 4;
    const itemCount = width < 768 || isLowerPowerDevice ? 9 : 13;
    const maxEffects = 36;
    const itemHorizontalPadding = 22;
    const effectHorizontalPadding = 56;
    const itemMinSpeed = 1.5;
    const itemSpeedRange = 2.0;
    const getItemFallSpeed = () => itemMinSpeed + Math.random() * itemSpeedRange;
    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
    const getItemSpawnX = () => {
      const minX = itemHorizontalPadding;
      const maxX = Math.max(minX, width - itemHorizontalPadding);
      return minX + Math.random() * (maxX - minX);
    };
    const pushEffect = (x: number, y: number, text: string) => {
      if (effects.length >= maxEffects) {
        effects.shift();
      }
      const maxX = Math.max(effectHorizontalPadding, width - effectHorizontalPadding);
      const safeX = clamp(x, effectHorizontalPadding, maxX);
      effects.push(new ClickEffect(safeX, y, text));
    };

    const icons = {
      envelope: '🧧',
      coin: '💰',
      horse: '🐎',
      fu: '福',
    };

    const getRewardContent = (type: string) => {
      if (type === 'coin') {
        const coins = ['+888', '+666', "+168", '富贵', '发财'];
        return coins[Math.floor(Math.random() * coins.length)];
      } else if (type === 'envelope') {
        const blessings = ['大吉大利', '好运', '安康', '喜乐', '+2026'];
        return blessings[Math.floor(Math.random() * blessings.length)];
      } else if (type === 'horse') {
        const horseBlessings = ['马到成功', '一马当先', '龙马精神', '马上有钱', '马上脱单'];
        return horseBlessings[Math.floor(Math.random() * horseBlessings.length)];
      } else {
        const fus = ['福', '瑞', '寿', '禧', '吉星高照', '平安', '长乐'];
        return fus[Math.floor(Math.random() * fus.length)];
      }
    };

    class ClickEffect {
      x: number;
      y: number;
      text: string;
      alpha: number;
      life: number;
      velocity: number;
      scale: number;

      constructor(x: number, y: number, text: string) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.alpha = 1;
        this.life = 1.0;
        this.velocity = 1.5 + Math.random();
        this.scale = 0.5;
      }

      update() {
        this.y -= this.velocity;
        this.life -= 0.015;
        this.alpha = Math.max(0, this.life);

        if (this.scale < 1.2) {
          this.scale += 0.1;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);

        ctx.font = "bold 24px 'Noto Serif SC', serif";
        ctx.fillStyle = `rgba(255, 215, 0, ${this.alpha})`;
        ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
        ctx.shadowBlur = 6;

        ctx.textAlign = 'center';
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
      }
    }

    class Item {
      x: number;
      y: number;
      speed: number;
      size: number;
      text: string;
      rotation: number;
      rotSpeed: number;
      type: string;
      shimmerOffset: number;

      constructor() {
        this.x = getItemSpawnX();
        this.y = -50 - Math.random() * 800;
        this.speed = getItemFallSpeed();
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.05;
        this.shimmerOffset = Math.random() * Math.PI * 2;

        const rand = Math.random();

        if (rand < 0.35) {
          this.text = icons.envelope;
          this.type = 'envelope';
          this.size = 28 + Math.random() * 15;
        } else if (rand < 0.65) {
          this.text = icons.coin;
          this.type = 'coin';
          this.size = 34 + Math.random() * 16;
        } else if (rand < 0.85) {
          this.text = icons.horse;
          this.type = 'horse';
          this.size = 30 + Math.random() * 14;
        } else {
          this.text = icons.fu;
          this.type = 'fu';
          this.size = 24 + Math.random() * 16;
        }
      }

      update() {
        this.y += this.speed;
        this.rotation += this.rotSpeed;

        if (this.y > height - 40) {
          const reward = getRewardContent(this.type);
          pushEffect(this.x, height - 50, reward);
          this.reset();
        }
      }

      reset() {
        this.y = -60 - Math.random() * 200;
        this.x = getItemSpawnX();
        this.speed = getItemFallSpeed();
      }

      draw(now: number) {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.type === 'fu') {
          const boxSize = this.size * 1.4;

          ctx.fillStyle = '#D9001B';
          ctx.shadowColor = 'rgba(0,0,0,0.3)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.fillRect(-boxSize / 2, -boxSize / 2, boxSize, boxSize);

          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 1.5;
          const borderOffset = 4;
          ctx.strokeRect(
            -boxSize / 2 + borderOffset,
            -boxSize / 2 + borderOffset,
            boxSize - borderOffset * 2,
            boxSize - borderOffset * 2
          );

          const shimmer = 0.65 + 0.35 * Math.sin(now * 0.005 + this.shimmerOffset);
          ctx.fillStyle = `rgba(255, 215, 0, ${shimmer})`;
          ctx.font = `${this.size}px "Ma Shan Zheng", "Noto Serif SC", serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.text, 0, this.size * 0.1);
        } else {
          ctx.font = `${this.size}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.filter = 'none';

          if (this.type === 'coin') {
            ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
            ctx.shadowBlur = 10;
          } else if (this.type === 'horse') {
            // Keep the horse details while tinting it to gold.
            ctx.filter = 'sepia(1) saturate(6) hue-rotate(350deg) brightness(1.08) contrast(1.08)';
            ctx.shadowColor = 'rgba(255, 215, 0, 0.85)';
            ctx.shadowBlur = 12;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.fillText(this.text, 0, 0);
        }

        ctx.restore();
      }

      isHit(cx: number, cy: number): boolean {
        const dx = cx - this.x;
        const dy = cy - this.y;
        const hitRadius =
          this.type === 'fu' ? this.size * 0.8 : this.type === 'horse' ? this.size * 0.9 : this.size;
        return dx * dx + dy * dy < hitRadius * hitRadius;
      }
    }

    for (let i = 0; i < itemCount; i++) {
      items.push(new Item());
    }

    const handlePointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let hit = false;

      for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].isHit(clickX, clickY)) {
          hit = true;
          const reward = getRewardContent(items[i].type);
          pushEffect(items[i].x, items[i].y, reward);
          items[i].reset();
          break;
        }
      }

      if (!hit && onBackgroundClick) {
        onBackgroundClick(e.clientX, e.clientY);
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown, { passive: true });

    function loop() {
      if (!ctx || !canvas) return;

      if (document.hidden) {
        requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const now = performance.now();

      for (let i = 0; i < items.length; i++) {
        items[i].update();
        items[i].draw(now);
      }

      for (let i = effects.length - 1; i >= 0; i--) {
        effects[i].update();
        effects[i].draw();
        if (effects[i].alpha <= 0) {
          effects.splice(i, 1);
        }
      }

      requestAnimationFrame(loop);
    }

    const animId = requestAnimationFrame(loop);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      const maxX = Math.max(itemHorizontalPadding, width - itemHorizontalPadding);
      for (const item of items) {
        item.x = clamp(item.x, itemHorizontalPadding, maxX);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [onBackgroundClick]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-1 cursor-pointer"
      style={{ pointerEvents: 'auto' }}
    />
  );
};

export default FallingParticles;
