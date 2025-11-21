const Loader = ({ loading }: { loading: boolean }) =>
  loading ? (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-[999] animate-fadeIn">
      <div className="relative">
        
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-400/30 animate-ping"></div>

        {/* Working spinning loader */}
        <div className="h-12 w-12 rounded-full 
            border-4 border-blue-500 
            border-t-transparent 
            animate-spin">
        </div>
      </div>
    </div>
  ) : null;

export default Loader;
