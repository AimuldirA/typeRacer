import React, { useState } from 'react';

const JoinGame = () => {
    const players = [
            { name: "Bat", color: "272835" },  
            { name: "Anu", color: "0000FF" },  
            { name: "Saraa", color: "FF0000" },
            { name: "Guest", color: "008000" }        
    ];

    const [positions, setPositions] = useState(players.map(() => 0));
    const [raceStarted, setRaceStarted ] = useState(false);

    const startRace = () => {
        setRaceStarted(true);
        const interval = setInterval(() => {
            setPositions((prev) =>
                prev.map((pos) => Math.min(pos + Math.random() * 5, 100))
            );
        }, 100);
        setTimeout(() => clearInterval(interval), 8000);
    };

    return (
        <div className="flex flex-col items-center space-y-6 px-40">
            <h1 className="text-5xl text-secondary">TypeRacer</h1>
            <div className="bg-secondary p-3 w-auto rounded-sm px-6">
                <div className="bg-primary rounded-sm flex space-x-6 p-3 text-xl">
                    <div>
                        <p>Room Code</p>
                        <p>URL</p>
                    </div>
                    <div>
                        <p>10254</p>
                        <p>https://play.typeracer.com?rt=2kuqi8gl5e</p>
                    </div>
                </div>
            </div>
            <div className="bg-accent h-auto w-full p-10 space-y-4">
                {players.map((player, index) => (
                    <div key={index} className="flex items-center space-x-4">
                        <p>{player.name}</p>
                        <div className="relative w-full flex items-center">
                            <div className="absolute bottom-0 w-full border-t-2  border-black"></div>
                            <img
                                className="mr-auto relative z-10"
                                width="30"
                                height="30"
                                src={`https://img.icons8.com/ios-glyphs/30/${player.color}/horseback-riding.png`}
                                alt="horseback-riding"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className='space-x-3 ml-auto'>
                <button className='bg-secondary text-lg text-primary p-2 rounded-sm'>LEAVE RACE</button>
            </div>
        </div>
    );
};

export default JoinGame;


