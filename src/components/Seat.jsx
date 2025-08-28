const Seat = ({ seatNumber, isBooked, isSelected, onClick }) => {
  const getSeatColor = () => {
    if (isBooked) return 'fill-red-400'; 
    if (isSelected) return 'fill-green-500'; 
    return 'fill-slate-300 hover:fill-blue-300'; 
  };

  const seatClasses = `
    w-10 h-10 transition-colors duration-300
    ${isBooked ? 'cursor-not-allowed' : 'cursor-pointer'}
    ${getSeatColor()}
  `;

  return (
    <div className="relative" onClick={!isBooked ? onClick : undefined}>
      <svg className={seatClasses} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/*professional SVG seat shape */}
        <path d="M20,15 C10,15 10,25 20,25 L80,25 C90,25 90,15 80,15 Z" />
        <path d="M20,30 L80,30 C85,30 85,35 80,35 L20,35 C15,35 15,30 20,30 Z" />
        <path d="M20,40 L80,40 C90,40 90,50 80,50 L20,50 C10,50 10,40 20,40 Z M15 50 L 15 85 L 85 85 L 85 50 Z" />
      </svg>
      <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-xs pointer-events-none ${isSelected || isBooked ? 'text-white' : 'text-slate-700'}`}>
        {seatNumber}
      </span>
    </div>
  );
};

export default Seat;
