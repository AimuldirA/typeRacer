import { useEffect, useState } from "react";

// type CountdownModalProps = {
//     onComplete: () => void;
//   };

// export const CountdownModal: any({ onComplete }:CountdownModalProps) {
//   const [count, setCount] = useState(3);

//   useEffect(() => {
//     if (count > 0) {
//       const timer = setTimeout(() => setCount(count - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       onComplete(); // Тоолол дуусахад тоглоом эхлүүлнэ
//     }
//   }, [count]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-80 text-white text-6xl flex justify-center items-center z-50">
//       {count > 0 ? count : "START!"}
//     </div>
//   );
// }

export const CountdownModal = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const finishDelay = setTimeout(() => onComplete(), 1000);
      return () => clearTimeout(finishDelay);
    }
  }, [count]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 text-white text-6xl flex justify-center items-center z-50">
      {count > 0 ? count : 'START!'}
    </div>
  );
};
