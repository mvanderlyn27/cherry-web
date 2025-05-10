import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[url('/BG.png')] bg-cover bg-center bg-no-repeat bg-fixed">
      {" "}
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-lg text-gray-700">
          This privacy policy describes how we collect, use, and share information when you use our app to buy books.
        </p>
        <h2 className="text-xl font-bold mt-4">Information We Collect</h2>
        <p className="text-lg text-gray-700">
          We collect the following information:
          <ul>
            <li>Your email address</li>
            <li>Your purchase history</li>
          </ul>
        </p>
        <h2 className="text-xl font-bold mt-4">How We Use Your Information</h2>
        <p className="text-lg text-gray-700">
          We use your information to:
          <ul>
            <li>Process your purchases</li>
            <li>Send you updates about our app</li>
          </ul>
        </p>
        <h2 className="text-xl font-bold mt-4">How We Share Your Information</h2>
        <p className="text-lg text-gray-700">
          We share your information with:
          <ul>
            <li>Our payment processor</li>
            <li>Our email provider</li>
          </ul>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
