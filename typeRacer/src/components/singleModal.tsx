import  { useEffect, useRef, useState } from 'react';
import { saveGameResult } from '../services/resultGame';
import { useNavigate } from 'react-router-dom';
import {  useAuthStatus } from '../hooks/checkAuts';

const SingleModal = ({ isOpen, onClose, correct, incorrect, time, words }: {
    isOpen: boolean;
    onClose: () => void;
    correct: number;
    incorrect: number;
    time: number;
    words: number;
}) => {

    const navigate = useNavigate(); 
 //   const isLoggedIn = useAuthStatus();
 const { isLoggedIn } = useAuthStatus();
    const speed = time > 0 ? parseFloat(((correct / time) * 60).toFixed(2)) : 0.00;
    const accuracy = parseFloat(((correct / (correct+incorrect)) * 100).toFixed(2));

const isFirstRun = useRef(true); // initial value нь true

useEffect(() => {
    const saveResult = async () => {
        if (isLoggedIn) {
            const userId = sessionStorage.getItem('userId');
            const language = sessionStorage.getItem('language');
            if (userId && language) {
                await saveGameResult(userId, speed, accuracy, '1-1', language);
            }
        }
    };

    // `isFirstRun` ашиглаж, зөвхөн анх удаа хадгална
    if (isFirstRun.current) {
        if (isLoggedIn && speed && accuracy) {
            saveResult();
        }
        isFirstRun.current = false; // Анхны гүйцэтгэлийг гүйцэтгэсний дараа true болгоно
    }
}, [isLoggedIn, speed, accuracy]);

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-60 z-1000">
            <div className="bg-amber-50 p-8 rounded-md shadow-lg w-1/4 text-center space-y-4 z-60">
                <h2 className="text-2xl font-bold text-secondary">The game is over!</h2>
                <p className="text-lg">✅ Correct words: <strong>{correct}</strong></p>
                <p className="text-lg">❌ In correct words: <strong>{incorrect}</strong></p>
                <p className="text-lg">⚡ Speed (WPM): <strong>{speed}</strong></p>
                <p className="text-lg">🎯 Accurancy (Accuracy): <strong>{accuracy}%</strong></p>
                <button onClick={() => navigate("/")} className="mt-4 bg-secondary text-primary px-4 py-2 rounded-sm">
                    OK
                </button>
            </div>
        </div>
    );
};

export default SingleModal;
