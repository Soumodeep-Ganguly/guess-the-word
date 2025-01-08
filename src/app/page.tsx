"use client"

import { Heart, HeartSolid, Redo } from '@/components/icons';
import React, { useState, useEffect, ChangeEvent } from 'react';

const GuessTheWord: React.FC = () => {
  const [points, setPoints] = useState<number>(0);
  const [word, setWord] = useState<string>('');
  const [hint, setHint] = useState<string>('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [tries, setTries] = useState<number>(6);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    makeNewWord()
  }, []);

  const makeNewWord = async (retry = 0) => {
    try {
      const response = await fetch('/api/generate-word-with-open-ai');
      const data = await response.json();
      setWord(data?.word?.toLowerCase() || "");
      setHint(data?.hint || "");
      setGameOver(false)
      setGuessedLetters([])
    } catch(err) {
      if(retry < 5) makeNewWord(retry + 1)
      else setError(true)
    }
  }

  const handleGuess = (letter: string): void => {
    if (gameOver || !letter) return;
    if (guessedLetters.includes(letter)) return;

    setGuessedLetters((prev) => [...prev, letter]);

    if (!word.includes(letter)) {
      setTries((prev) => prev - 1);
    }

    if (tries - 1 <= 0 && !word.includes(letter)) {
      console.log("GAME OVER")
      setGameOver(true);
    } else if (word.split('').every((char) => guessedLetters.includes(char) || char === letter)) {
      console.log("COMPLETE")
      setGameOver(true);
      setPoints(points + 1)
    }
  };

  if(error) return <div className="max-w-md mx-auto p-4 mt-10 text-[#e63946]">
    <h1 className="text-xl font-bold mb-4 text-center">Opps! We crashed. Try after sometime.</h1>
  </div>

  return (
    <div className="max-w-md mx-auto p-4 mt-10">

      <div className='flex text-xl'>
        <div>
          Points: {points}
        </div>
        <div className='ml-auto'>
          <div className='flex'>
            {Array.from({ length: 6 }).map((_, i) =>
              i < tries ? (
                <HeartSolid key={i} className="w-5 h-5 text-[#e63946]" />
              ) : (
                <Heart key={i} className="w-5 h-5 text-[#83c5be]" />
              )
            )}
          </div>
        </div>
      </div>

      <h1 className="text-xl font-bold mb-4 text-center">Guess The Word</h1>

      <div className="flex justify-center mb-4">
        <span className="text-xl font-bold text-[#fb5607]">
          {word.split('').map((char, index) => (
            <span key={index}>{guessedLetters.includes(char) ? char : '_'} </span>
          ))}
        </span>
      </div>
      {hint !== "" && <div className='py-2'>
        💡 Hint: {hint}
      </div>}
      <div className="flex justify-center mb-4 text-[#415a77]">
        <span className="text-xl font-bold mr-2">Guessed Letters:</span>
        <span className="text-xl font-bold">{guessedLetters.join(', ')}</span>
      </div>

      <div className="flex justify-center mb-4">
        {gameOver ? (
          <div className="text-xl font-bold">
            {tries === 0 ? 
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#e63946] mb-4">Game Over! You lost with {points} points.</h2>
              <div className='flex justify-center'>
                <button
                  className="px-4 py-2 bg-[#e63946] text-[#edf6f9] rounded-lg text-lg flex"
                  onClick={() => {
                    makeNewWord()
                    setPoints(0)
                    setTries(6)
                  }}
                >
                  <Redo className='size-5 mr-1 mt-1' color='currentColor' /> Start Over
                </button>
              </div>
            </div>
            : 
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">🎉 Level Clear! 🎉</h2>
              <div className='flex justify-center'>
                <button
                  className="px-4 py-2 ml-3 bg-[#006d77] text-[#edf6f9] rounded-lg text-lg"
                  onClick={() => makeNewWord()}
                >
                  Next Level
                </button>
              </div>
            </div>}
          </div>
        ) : (
          <input
            type="text"
            className="w-12 h-12 text-center text-2xl font-bold text-gray-800 bg-gray-100 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400"
            maxLength={1}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleGuess(e.target.value.toLowerCase());
              e.target.value = ''; // Clear input after each guess
            }}
            placeholder="A"
          />
        )}
      </div>
    </div>
  );
};

export default GuessTheWord;