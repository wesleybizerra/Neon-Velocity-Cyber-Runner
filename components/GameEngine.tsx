import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MatchResult } from '@/types';

interface GameEngineProps {
  onGameOver: (result: MatchResult) => void;
  isPaused: boolean;
}

const GameEngine: React.FC<GameEngineProps> = ({ onGameOver, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);

  const state = useRef({
    player: { y: 200, velocity: 0, width: 40, height: 40, jumpCount: 0 },
    obstacles: [] as any[],
    orbs: [] as any[],
    score: 0,
    distance: 0,
    speed: 5,
    frames: 0,
    isEnded: false
  });

  const jump = useCallback(() => {
    if (state.current.player.jumpCount < 2 && !state.current.isEnded) {
      state.current.player.velocity = -12;
      state.current.player.jumpCount++;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  const update = () => {
    if (isPaused || state.current.isEnded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    state.current.frames++;
    state.current.distance += state.current.speed / 10;
    state.current.score = Math.floor(state.current.distance + state.current.orbs.length * 10);

    state.current.player.velocity += 0.6;
    state.current.player.y += state.current.player.velocity;

    const floorY = canvas.height - state.current.player.height - 20;
    if (state.current.player.y > floorY) {
      state.current.player.y = floorY;
      state.current.player.velocity = 0;
      state.current.player.jumpCount = 0;
    }

    if (state.current.frames % 120 === 0) {
      state.current.obstacles.push({
        x: canvas.width,
        y: floorY,
        width: 30,
        height: 40,
        type: 'spike'
      });
      state.current.speed += 0.1;
    }

    if (state.current.frames % 45 === 0) {
      state.current.orbs.push({
        x: canvas.width,
        y: floorY - 60 - Math.random() * 100,
        radius: 8,
        collected: false
      });
    }

    state.current.obstacles.forEach((obs) => {
      obs.x -= state.current.speed;
      if (
        state.current.player.y + state.current.player.height > obs.y &&
        state.current.player.y < obs.y + obs.height &&
        40 + state.current.player.width > obs.x &&
        40 < obs.x + obs.width
      ) {
        endGame();
      }
    });

    state.current.orbs.forEach((orb) => {
      orb.x -= state.current.speed;
      const dx = (orb.x) - (40 + state.current.player.width / 2);
      const dy = (orb.y) - (state.current.player.y + state.current.player.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < orb.radius + 20 && !orb.collected) {
        orb.collected = true;
      }
    });

    state.current.obstacles = state.current.obstacles.filter(o => o.x > -50);
    state.current.orbs = state.current.orbs.filter(o => o.x > -50 && !o.collected);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#050515');
    bgGrad.addColorStop(1, '#150525');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#7000ff33';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i - (state.current.frames % 40), 0);
      ctx.lineTo(i - (state.current.frames % 40), canvas.height);
      ctx.stroke();
    }

    ctx.fillStyle = '#00f2ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f2ff';
    ctx.fillRect(40, state.current.player.y, state.current.player.width, state.current.player.height);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ff0055';
    state.current.obstacles.forEach(obs => {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff0055';
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
    ctx.shadowBlur = 0;

    state.current.orbs.forEach(orb => {
      if (!orb.collected) {
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f0ff00';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#f0ff00';
        ctx.fill();
        ctx.closePath();
      }
    });
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#fff';
    ctx.font = '20px Orbitron';
    ctx.fillText(`Score: ${state.current.score}`, 20, 40);
  };

  const endGame = () => {
    if (state.current.isEnded) return;
    state.current.isEnded = true;
    const result: MatchResult = {
      score: state.current.score,
      coinsEarned: Math.floor(state.current.score / 10),
      xpEarned: Math.floor(state.current.score / 5),
      orbsCollected: Math.floor(state.current.score / 20)
    };
    onGameOver(result);
  };

  const loop = () => {
    update();
    draw();
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPaused]);

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl bg-black">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-auto cursor-pointer"
        onClick={jump}
      />
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <h2 className="text-4xl font-orbitron text-cyan-400 neon-text">PAUSADO</h2>
        </div>
      )}
      <div className="absolute bottom-4 left-4 text-xs text-cyan-400 font-rajdhani">
        ESPAÇO ou CLIQUE para Pular (Pulo Duplo Ativo)
      </div>
    </div>
  );
};

export default GameEngine;