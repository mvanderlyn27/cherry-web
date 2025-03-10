import { useState } from 'react'
import './App.css'
import { LuPencil } from "react-icons/lu";
import { FaPepperHot } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";

function App() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
    const formBody = `email=${encodeURIComponent(email)}&mailingLists=${encodeURIComponent(import.meta.env.VITE_MAILING_LISTS)}`;
      const response = await fetch(import.meta.env.VITE_LOOPS_API_ENDPOINT, {
        method: "POST",
        body: formBody,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        throw new Error('Failed to join waitlist');
      }

      setSuccess(true);
      setEmail('');
      setToastMessage('Successfully joined the waitlist!');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError('Failed to join waitlist. Please try again.');
      setToastMessage('Failed to join waitlist. Please try again.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[url('/BG.png')] bg-cover bg-center bg-no-repeat bg-fixed">
      
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white z-50 animate-fade-in-down`}
        >
          {toastMessage}
        </div>
      )}
      {/* Hero Section */}
      <div className="w-full py-8 md:px-0  min-h-screen flex items-center justify-center relative">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16 xl:gap-24 max-w-6xl w-full">
          {/* Left side - Title */}
          <div className="flex flex-col relative gap-2">
            <div className="flex flex-col relative">
              <span className="text-white text-xs sm:text-sm tracking-wider absolute -top-2 right-0 font-[Kaisei_Decol]">Coming Soon</span>
              <h1 className="text-8xl lg:text-10xl xl:text-9xl text-pink-200 font-[Pinyon_Script] text-left relative">Cherry</h1>
            </div>
            <p className="text-lg md:text-xl text-white mb-6 md:mb-8 text-left font-[Kaisei_Decol]">Love, Drama, Desire<br/>—Your Choices Write the Story.</p>
            <p className="text-sm md:text-md text-white font-light mb-6 md:mb-8 text-left font-[Comme]">Join our waitlist to gain exclusive early access.</p>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 w-full max-w-full ">
              <input
                type="text"
                placeholder="Enter email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-[Comme] bg-transparent border border-[#B87CED] text-white px-4 py-2 md:p-2 rounded-full placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              {success && <p className="text-green-400 text-sm">Successfully joined the waitlist!</p>}
              <button
                type="submit"
                className="font-[Comme] text-sm text-light cursor-pointer bg-white text-[#B87CED] px-8 py-3 md:p-2 md:px-8 rounded-full transition-all duration-700 animate-[pulse-glow_2s_ease-in-out_infinite] hover:pause-animation hover:shadow-[0_0_20px_3px_rgba(168,85,247,0.7)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
                disabled={isLoading}
              >
                {isLoading ? 'JOINING...' : 'JOIN NOW'}
              </button>
            </form>
          </div>
          
          {/* Right side - Phone Demo */}
          <div className="flex justify-center mt-8 md:mt-0">
            <div className="w-full  md:w-80 h-[700px] md:h-[700px]">
              <img src="/Screenshot.png" alt="Cherry App Demo" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
        {/* Scroll Down Button - Only visible on md screens and above */}
        <button 
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="absolute bottom-10  text-white hidden md:block"
          aria-label="Scroll down for more content"
        >
          <div className=" hover:scale-115 transition-all duration-300 shadow-[0_0_20px_3px_rgba(128,128,128,0.3)]  cursor-pointer rounded-full p-2 backdrop-blur-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </button>
      </div>

      {/* White Separator Line */}
      <div className="w-full flex items-center justify-center">
        <div className="w-[40%] px-8 border-t border-white/50">
        </div>
      </div>

      {/* Feature Sections */}
      <div className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 md:bg-transparent p-6 rounded-full md:rounded-none backdrop-blur-sm text-center w-[280px] h-[280px] mx-auto flex flex-col items-center justify-center md:w-auto md:h-auto md:p-8 md:block">
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-4 font-[Kaisei_Decol]">Customization</h3>
              <LuPencil className="w-10 h-10 md:w-10 md:h-10 mx-auto my-3 md:my-6 text-[#B87CED]" />
              <p className="text-white font-[Comme] text-sm md:text-md">Unleash your creativity,<br/>craft the perfect story</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 md:bg-transparent p-6 rounded-full md:rounded-none backdrop-blur-sm text-center w-[280px] h-[280px] mx-auto flex flex-col items-center justify-center md:w-auto md:h-auto md:p-8 md:block">
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-4 font-[Kaisei_Decol]">NSFW Content</h3>
              <FaPepperHot className="w-10 h-10 md:w-10 md:h-10 mx-auto my-3 md:my-6 text-[#B87CED]" />
              <p className="text-white font-[Comme] text-sm md:text-md">Zero boundaries,<br/> endless possibilities</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 md:bg-transparent p-6 rounded-full md:rounded-none backdrop-blur-sm text-center w-[280px] h-[280px] mx-auto flex flex-col items-center justify-center md:w-auto md:h-auto md:p-8 md:block">
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-4 font-[Kaisei_Decol]">Unlimited Experiences</h3>
              <FaPeopleGroup className="w-10 h-10 md:w-10 md:h-10 mx-auto my-3 md:my-6 text-[#B87CED]" />
              <p className="text-white font-[Comme] text-sm md:text-md">Read and remix from <br/> community stories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
