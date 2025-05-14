import { useState, FormEvent } from "react";
import { LuBookHeart } from "react-icons/lu";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaMagnifyingGlass } from "react-icons/fa6";

import { toast } from "sonner";

// Add this import at the top
import { SwipeableCarousel } from "@/components/SwipeableCarousel";
import posthog from "posthog-js";

export function Home() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    // Track form submission attempt
    posthog.capture("waitlist_submit_attempt", { email });

    try {
      const formBody = `email=${encodeURIComponent(email)}&mailingLists=${encodeURIComponent(
        import.meta.env.VITE_MAILING_LISTS
      )}`;
      const response = await fetch(import.meta.env.VITE_LOOPS_API_ENDPOINT, {
        method: "POST",
        body: formBody,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to join waitlist");
      }

      setSuccess(true);
      setEmail("");

      // Track successful submission
      posthog.capture("waitlist_submit_success", { email });
      toast("Successfully joined the waitlist!");
    } catch (err) {
      // Track submission error
      posthog.capture("waitlist_submit_error", {
        email,
        error: err instanceof Error ? err.message : "Unknown error",
      });
      setError("Failed to join waitlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add this array near the top of the component
  const demoImages = ["/home/Screenshot1.png", "/home/Screenshot2.png", "/home/Screenshot3.png"];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[url('/BG.png')] bg-cover bg-center bg-no-repeat bg-fixed">
      {/* Hero Section */}
      <div className="w-full py-8 px-4 md:px-8  min-h-screen flex items-center justify-center relative">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-8 xl:gap-8  w-full">
          {/* Left side - Title */}
          <div className="w-fit flex flex-col relative px-4 md:px-0">
            {/* Title section - always at top */}
            <div className="relative order-1">
              <h1 className="text-[20vw] md:text-[10vw] bg-gradient-to-b from-[#E96F71] to-[#DE4447] text-transparent bg-clip-text font-['SansitaOne'] text-left mb-0">
                Cherry
              </h1>
            </div>
            <p className="text-md md:text-[1.8vw] text-[#542E2F] mb-6 md:mb-8 text-left font-[Kaisei_Decol] font-normal md:font-bold order-2 -mt-2 md:-mt-8">
              Love, Drama, Desire
              <br />
              —Short n' sweet romantic stories
            </p>

            {/* Mobile carousel placement */}
            <div className="w-full h-[500px] block md:hidden order-3 mb-6">
              <div className="w-full h-full rounded-3xl">
                <SwipeableCarousel images={demoImages} interval={4000} />
              </div>
            </div>

            {/* Waitlist section - moves below carousel on mobile */}
            <div className="order-4 md:order-3">
              <div className="w-full flex items-center justify-center">
                <a
                  href="https://apps.apple.com/us/app/cherry-romance-stories/id6743647667"
                  className="inline-block transition-transform duration-300 ease-in-out hover:scale-105">
                  <img src={"/home/appstore.png"} className="w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80" />
                </a>
              </div>
              {/* <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 w-full max-w-full px-0">
                <input
                  type="text"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full md:w-auto font-[Comme] bg-transparent border border-[#DE4447] text-[#B25557] px-4 py-2 md:p-4 rounded-full placeholder-white focus:outline-none focus:ring-2 focus:ring-[#DE4447]"
                  disabled={isLoading}
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                {success && <p className="text-green-400 text-sm">Successfully joined the waitlist!</p>}
                <button
                  type="submit"
                  className="font-[Comme] text-sm text-light cursor-pointer bg-white text-[#DE4447] px-8 py-3 md:py-2 md:px-14 rounded-full transition-shadow duration-1500 animate-[pulse-glow_2s_ease-in-out_infinite] hover:pause-animation hover:shadow-[0_0_20px_3px_rgba(222, 68, 71,0.7)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none whitespace-nowrap"
                  disabled={isLoading}>
                  {isLoading ? "JOINING..." : "JOIN NOW"}
                </button>
              </form> */}
            </div>
          </div>

          {/* Desktop carousel - hidden on mobile */}
          <div className="aspect-[9/16]  md:h-[700px] lg:h-[900px] relative hidden md:block">
            <div className="absolute inset-0 rounded-3xl">
              <SwipeableCarousel images={demoImages} interval={4000} />
            </div>
          </div>
        </div>
        {/* Scroll Down Button - Only visible on md screens and above */}
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          className="absolute bottom-10  text-white hidden md:block"
          aria-label="Scroll down for more content">
          <div className=" hover:scale-115 transition-all duration-300 border-1 border-[#DE4447] cursor-pointer rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="#DE4447" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </button>
      </div>

      {/* White Separator Line */}
      <div className="w-full flex items-center justify-center">
        <div className="w-[40%] px-8 border-t border-[#CE8C8D]"></div>
      </div>

      {/* Feature Sections */}
      <div className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 md:bg-transparent p-6 rounded-full md:rounded-none backdrop-blur-sm text-center w-[280px] h-[280px] mx-auto flex flex-col items-center justify-center md:w-auto md:h-auto md:p-8 md:block">
              <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-[#B25557] mb-2 md:mb-8 font-[Kaisei_Decol]">
                Bite-Sized Stories
              </h3>
              <LuBookHeart className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto my-3 md:my-10 text-[#DE4447]" />
              <p className="text-[#B25557] font-[Kaisei_Decol] text-sm md:text-lg lg:text-xl">
                Read short stories on the go
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 md:bg-transparent p-6 rounded-full md:rounded-none backdrop-blur-sm text-center w-[280px] h-[280px] mx-auto flex flex-col items-center justify-center md:w-auto md:h-auto md:p-8 md:block">
              <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-[#B25557] mb-2 md:mb-8 font-[Kaisei_Decol]">
                Find Your Niche
              </h3>
              <FaMagnifyingGlass className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto my-3 md:my-10 text-[#DE4447]" />
              <p className="text-[#B25557] font-[Kaisei_Decol] text-sm md:text-lg lg:text-xl">
                We've got everything nice or all the spice
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 md:bg-transparent p-6 rounded-full md:rounded-none backdrop-blur-sm text-center w-[280px] h-[280px] mx-auto flex flex-col items-center justify-center md:w-auto md:h-auto md:p-8 md:block">
              <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-[#B25557] mb-2 md:mb-8 font-[Kaisei_Decol]">
                Support Indie Authors
              </h3>
              <FaPeopleGroup className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto my-3 md:my-10 text-[#DE4447]" />
              <p className="text-[#B25557] font-[Kaisei_Decol] text-sm md:text-lg lg:text-xl">
                Engage and uplift amateur writers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
