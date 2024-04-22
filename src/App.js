import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [isErasing, setIsErasing] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800 * 2;
    canvas.height = 600 * 2;
    canvas.style.width = '800px';
    canvas.style.height = '600px';

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.globalCompositeOperation = 'source-over';
    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = isErasing ? 'rgba(0,0,0,1)' : color;
      contextRef.current.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
    }
  }, [color, isErasing]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = lineWidth;
    }
  }, [lineWidth]);

  const toggleEraser = () => {
    setIsErasing(!isErasing);
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  return (
    <div className="App">
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} disabled={isErasing} />
      <input type="range" min="1" max="10" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} />
      <button onClick={() => contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)}>Clear All</button>
      <button onClick={toggleEraser}>{isErasing ? 'Switch to Pencil' : 'Switch to Eraser'}</button>
    </div>
  );
}

export default App;
