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
      <div className="w-full px-4 py-12 md:py-24 min-h-screen flex items-center justify-center relative">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16 xl:gap-24 max-w-6xl w-full">
          {/* Left side - Title */}
          <div className="flex flex-col relative">
            <div className="flex flex-col relative">
              <span className="text-white text-xs sm:text-sm tracking-wider absolute top-1 -right-4 font-[Kaisel_Decol]">coming soon</span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-pink-200 font-[Pinyon_Script] text-left">Cherry</h1>
            </div>
            <p className="text-lg md:text-xl text-purple-200 mb-6 md:mb-8 text-left font-[Kaisel_Decol]">Love, Drama, Desire<br/>—Your Choices Write the Story.</p>
            <p className="text-sm md:text-md text-purple-200 font-light mb-6 md:mb-8 text-left font-[Comme]">Join our waitlist to gain exclusive early access.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-full md:max-w-sm">
              <input
                type="text"
                placeholder="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border border-purple-500/50 text-white px-4 py-2 rounded-full placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              {success && <p className="text-green-400 text-sm">Successfully joined the waitlist!</p>}
              <button
                type="submit"
                className="bg-white text-purple-600 px-8 py-3 rounded-full border-2 border-purple-500 transition-colors shadow-[0_0_15px_2px_rgba(168,85,247,0.5)] hover:shadow-[0_0_20px_3px_rgba(168,85,247,0.7)] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
          
          {/* Right side - Phone Demo */}
          <div className="flex justify-center mt-8 md:mt-0">
            <div className="w-52 md:w-64 h-[450px] md:h-[600px]">
              <img src="/Screenshot.png" alt="Cherry App Demo" className="w-full h-full object-cover rounded-3xl shadow-2xl" />
            </div>
          </div>
        </div>
        {/* Scroll Down Button - Only visible on md screens and above */}
        <button 
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/80 hover:text-white transition-colors hidden md:block"
          aria-label="Scroll down for more content"
        >
          <div className="animate-bounce bg-purple-500/30 hover:bg-purple-500/50 rounded-full p-2 backdrop-blur-sm">
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
            <div className="bg-black/50 p-8 rounded-xl backdrop-blur-sm text-center">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 font-[Kaisel_Decol]">Create Your Own</h3>
              <LuPencil className="w-8 h-8 md:w-10 md:h-10 mx-auto my-4 md:my-6 text-purple-300" />
              <p className="text-white font-[Kaisel_Decol] text-sm md:text-md">Tailor and customize your own story</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-black/50 p-8 rounded-xl backdrop-blur-sm text-center">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 font-[Kaisel_Decol]">NSFW Content</h3>
              <FaPepperHot className="w-8 h-8 md:w-10 md:h-10 mx-auto my-4 md:my-6 text-purple-300" />
              <p className="text-white font-[Kaisel_Decol] text-sm md:text-md">Zero boundaries, endless possibilities</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-black/50 p-8 rounded-xl backdrop-blur-sm text-center">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 font-[Kaisel_Decol]">Infinite Experiences</h3>
              <FaPeopleGroup className="w-8 h-8 md:w-10 md:h-10 mx-auto my-4 md:my-6 text-purple-300" />
              <p className="text-white font-[Kaisel_Decol] text-sm md:text-md">Read and remix from the community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
