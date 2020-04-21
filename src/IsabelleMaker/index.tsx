import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { images } from './Images';
import './font.css';
import { MinusPlusButton, PlusButton } from '../FieldMaker';

const width = 1280;
const height = 720;

const IsabelleMaker = () => {
  const [imagePath, setImagePath] = useState(images[3]);
  const cvRef = useRef(null as null | HTMLCanvasElement);
  const [text, setText] = useState("Right now on #garden-science,\nit's 7:14 AM on Tuesday,\nApril 21st, 2020.");
  const imgRef = useRef(null as null | HTMLImageElement);
  const [fontSize, setFontSize] = useState(36);

  const draw = () => {
    if (!cvRef.current || !imgRef.current) {
      return;
    }
    const ctx = cvRef.current.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.drawImage(imgRef.current, 0, 0);

    // clear the text bubble
    const xStart = 275;
    const xEnd = 1015;
    const yStart = 477;
    const yEnd = 644;
    for (let y = yStart; y <= yEnd; y += 0.5) {
      ctx.beginPath();
      const c = ctx.getImageData(xStart, y, 1, 1);
      ctx.strokeStyle = `rgb(${c.data[0]},${c.data[1]},${c.data[2]})`;
      ctx.moveTo(xStart, y);
      ctx.lineTo(xEnd, y);
      ctx.stroke();
    }

    // draw the text
    const margin = (5/9) * fontSize;
    ctx.font = `${fontSize}px ACNHFont`;
    ctx.fillStyle = '#6d6652';
    const textLines = text.split(/\n/);
    console.log(textLines);
    textLines.forEach((line, index) => {
      ctx.fillText(line, xStart + 5, yStart + fontSize + ((fontSize + margin) * index));
    });
  };
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!cvRef.current || !e.currentTarget) {
      return;
    }
    imgRef.current = e.currentTarget;
    const ctx = cvRef.current.getContext('2d');
    if (!ctx) {
      return;
    }
    draw();
  };
  const updateText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget?.value);
    draw();
  };
  const updateFontSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFontSize = parseInt(e.currentTarget?.value, 10);
    if (isFinite(newFontSize) && newFontSize > 0) {
      setFontSize(newFontSize);
    }
    draw();
  };

  return <MainContainer>
    <canvas ref={cvRef} width={width} height={height}/>
    <Thumbs>
      {images.map(img => {
        const src = img === imagePath ? `${img}?${Math.random()}` : img;
        return <ThumbImage
          src={src}
          key={img}
          onLoad={img === imagePath ? onImageLoad : undefined}
          onClick={() => {
            setImagePath(img);
          }}
          style={img === imagePath ? { opacity: 1 } : {}}
        />
      })}
    </Thumbs>
    <TextareaContainer>
      <textarea value={text} onChange={updateText}/>
      <input value={fontSize} onChange={updateFontSize}/>
      <MinusPlusButton onClick={() => {
        setFontSize(Math.max(4, fontSize - 4));
      }}/>
      <PlusButton onClick={() => {
        setFontSize(fontSize + 4);
      }}/>
    </TextareaContainer>
  </MainContainer>;
};

const TextareaContainer = styled.div`
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
`;
const MainContainer = styled.div`
  font-family: ACNHFont;

  canvas {
    width: 100%;
  }
  textarea, input {
    border: none;
    border-radius: 8px;
    padding: 10px;
    font-size: 18px;
    font-family: ACNHFont;
    color: #6d6652;
    vertical-align: top;
    margin: 0 8px;

    &:focus {
      outline: none;
    }
  }

  textarea {
    height: 6em;
    width: 400px;
  }
  input {
    text-align: right;
  }
`;
const Thumbs = styled.div`
  white-space: nowrap;
  max-width: 100vw;
  overflow: auto;
`;
const ThumbImage = styled.img`
  width: 120px;
  opacity: 0.5;
`;

export default IsabelleMaker;