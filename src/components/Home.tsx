import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-slate-100 dark:bg-black'>
      <div className='container mx-auto px-4 py-6 h-screen overflow-y-auto'>
        <div className='backdrop-blur-md bg-white/80 dark:bg-white/10 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-white/20 w-full max-w-2xl mx-auto'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center text-slate-800 dark:text-white mb-4 sm:mb-6'>
            Welcome to Voice Clone Studio
          </h1>

          <div className='space-y-4 sm:space-y-6'>
            <p className='text-slate-600 dark:text-white/90 text-sm sm:text-base text-center'>
              Create your own AI voice clone with just a few clicks
            </p>

            <div className='flex justify-center'>
              <button
                onClick={() => navigate("/app")}
                className='inline-block py-2 px-4 sm:py-3 sm:px-6 bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white text-sm sm:text-base font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 border border-slate-300 dark:border-white/20'
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
