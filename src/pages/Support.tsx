import React from "react";

const Support = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[url('/BG.png')] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl font-bold mb-4">Support</h1>
        <p className="text-lg text-gray-700">
          For support inquiries, please email us at{" "}
          <a href="mailto:cherry@sliceoflifeapp.com" className="text-blue-500 hover:underline">
            cherry@sliceoflifeapp.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Support;
