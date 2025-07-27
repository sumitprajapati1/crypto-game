import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const GameChart = ({ multiplier }) => {
  const canvasRef = useRef(null);
  const multiplierHistory = useRef([]);

  useEffect(() => {
    multiplierHistory.current.push(multiplier);
    if (multiplierHistory.current.length > 100) {
      multiplierHistory.current.shift();
    }
    
    drawChart();
  }, [multiplier]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let y = 0; y <= height; y += height / 5) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw multiplier line
    if (multiplierHistory.current.length < 2) return;
    
    ctx.strokeStyle = '#2ecc71';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const maxMultiplier = Math.max(...multiplierHistory.current, 10);
    const xStep = width / (multiplierHistory.current.length - 1);
    
    multiplierHistory.current.forEach((value, index) => {
      const x = index * xStep;
      const y = height - (value / maxMultiplier) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  };

  return (
    <ChartContainer>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={200}
      />
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  margin: 1rem 0;
  canvas {
    width: 100%;
    height: 200px;
  }
`;

export default GameChart;