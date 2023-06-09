import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const ConfirmPage = () => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const maxTime = 30 * 60;
    const minTime = 20 * 60; 
    const countdownTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime; 
    setTimer(countdownTime);

    const countdownInterval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="confirm-page">
    <div className="content">
      <h2>Your food will be delivered in</h2>
      <span className="timer">{formatTime(timer)}</span>
    </div>
    <footer className="footer">
      <Link to="/" className="link" >Go to Home</Link>
    </footer>
  </div>
);
};

export default ConfirmPage;
