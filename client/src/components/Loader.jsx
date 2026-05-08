const Loader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="w-24 h-24 rounded-full border-4 border-[#1e3a5f]/10 border-t-[#1e3a5f] animate-spin"></div>
        
        {/* Inner Ring - Opposite Spin */}
        <div className="absolute w-16 h-16 rounded-full border-4 border-[#c8922a]/10 border-t-[#c8922a] animate-[spin_1.5s_linear_infinite_reverse]"></div>
        
        {/* Central Logo Symbol */}
        <div className="absolute flex items-center justify-center">
           <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <span className="text-white font-black text-[10px]">MSA</span>
           </div>
        </div>
      </div>
      
      {/* Text with pulsing effect */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="text-sm font-black text-[#1e3a5f] uppercase tracking-[0.3em] animate-pulse">
          Initializing
        </p>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-[#c8922a] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-[#c8922a] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-[#c8922a] rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Decorative element */}
      <p className="absolute bottom-10 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
        Academic Advising System
      </p>
    </div>
  );
};

export default Loader;
