import React, { useState, useEffect, useRef } from 'react';
import './Home.css';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  size: number;
}

interface Watermark {
  id: number;
  text: string;
  left: number;
  duration: number;
  delay: number;
}

const MAX_PARTICLES = 400; // 最大粒子数量
const THROTTLE_DELAY = 150; // 点击节流时间（毫秒）
const WATERMARK_WORDS = ['健康', '平安', '暴富', '幸福']; // 水印词汇

const Home: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [watermarks, setWatermarks] = useState<Watermark[]>([]);
  const [titleScale, setTitleScale] = useState(0);
  const animationRef = useRef<number | null>(null);
  const particleIdRef = useRef(0);
  const lastClickTimeRef = useRef(0);
  const watermarkIdRef = useRef(0);

  // 标题缩放动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleScale(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 动态生成水印 - 每隔一段时间添加一个新水印
  useEffect(() => {
    const addWatermark = () => {
      const newWatermark: Watermark = {
        id: watermarkIdRef.current++,
        text: WATERMARK_WORDS[Math.floor(Math.random() * WATERMARK_WORDS.length)],
        left: Math.random() * 80 + 10, // 10% 到 90% 的位置
        duration: 12, // 12秒的持续时间
        delay: 0, // 不需要延迟，因为是动态添加的
      };

      setWatermarks(prev => [...prev, newWatermark]);

      // 12秒后移除这个水印（动画完成后）
      setTimeout(() => {
        setWatermarks(prev => prev.filter(w => w.id !== newWatermark.id));
      }, 12000);
    };

    // 立即添加第一个水印
    addWatermark();

    // 每2.5秒添加一个新水印
    const interval = setInterval(addWatermark, 1500);

    return () => clearInterval(interval);
  }, []);

  // 粒子动画循环
  useEffect(() => {
    const animate = () => {
      setParticles(prev => {
        // 过滤并更新粒子
        const updated = prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.5, // 重力
            vx: p.vx * 0.99, // 空气阻力
            life: p.life - 2, // 加快消失速度
          }))
          .filter(p => p.life > 0);

        // 如果粒子数超过最大值，移除最旧的粒子
        if (updated.length > MAX_PARTICLES) {
          return updated.slice(updated.length - MAX_PARTICLES);
        }

        return updated;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // 创建烟花效果（带节流）
  const createFireworks = (clientX: number, clientY: number) => {
    const now = Date.now();

    // 节流控制
    if (now - lastClickTimeRef.current < THROTTLE_DELAY) {
      return;
    }
    lastClickTimeRef.current = now;

    // 如果粒子太多，不再添加
    if (particles.length > MAX_PARTICLES * 0.8) {
      return;
    }

    const colors = [
      '#FFD700', // 金色
      '#FF6B6B', // 红色
      '#FF8C42', // 橙色
      '#FFA07A', // 浅橙
      '#FFE66D', // 黄色
      '#FF1744', // 深红
      '#FFB300', // 琥珀金
    ];

    const newParticles: Particle[] = [];
    const particleCount = 35; // 减少粒子数量

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 5 + Math.random() * 5;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      newParticles.push({
        id: particleIdRef.current++,
        x: clientX,
        y: clientY,
        vx,
        vy,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 80, // 减少生命周期
        size: 3 + Math.random() * 3,
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  };

  return (
    <div className="home-container">
      {/* 背景水印 */}
      <div className="watermark-container">
        {watermarks.map(watermark => (
          <div
            key={watermark.id}
            className="watermark-text"
            style={{
              left: `${watermark.left}%`,
              animationDuration: `${watermark.duration}s`,
              animationDelay: `${watermark.delay}s`,
            }}
          >
            {watermark.text}
          </div>
        ))}
      </div>

      {/* 背景装饰 */}
      <div className="background-decor">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* 烟花粒子 */}
      <div className="particles-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              transform: `translate(${particle.x}px, ${particle.y}px)`,
              backgroundColor: particle.color,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.life / 80,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}
      </div>

      {/* 主要内容 */}
      <div className="content-wrapper">
        <div
          className="title-wrapper"
          onClick={(e) => createFireworks(e.clientX, e.clientY)}
          style={{ transform: `scale(${titleScale})` }}
        >
          <h1 className="title">
            <span className="title-number">2026</span>
            <span className="title-text">马年大吉</span>
            <span className="title-text">新年快乐</span>
          </h1>
          <div className="title-glow"></div>
        </div>

        <div className="blessing-wrapper">
          <div className="blessing-line line-1">
            愿新的一年
          </div>
          <div className="blessing-line line-2">
            平安喜乐 · 万事顺遂
          </div>
          <div className="blessing-line line-3">
            心想事成 · 万事胜意
          </div>
        </div>

        <div className="decorative-elements">
          <div className="chinese-knot left"></div>
          <div className="chinese-knot right"></div>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="bottom-decoration">
        <div className="wave"></div>
      </div>
    </div>
  );
};

export default Home;
