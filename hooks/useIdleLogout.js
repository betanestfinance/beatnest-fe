// hooks/useIdleLogout.js
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext'; 

const IDLE_TIMEOUT = 30 * 60 * 1000; 

const useIdleLogout = () => {
  const { user, logout } = useAuth(); 
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (user) {
        logout();
      }
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    if (!user) return; 
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); 

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user]); 
};

export default useIdleLogout;
