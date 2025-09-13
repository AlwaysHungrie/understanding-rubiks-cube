import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 w-full py-4 px-6 text-center text-gray-600 text-sm">
      <p>
        Created by{" "}
        <a
          href="https://twitter.com/your_twitter_handle"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-800 font-semibold transition-colors"
        >
          @your_twitter_handle
        </a>
      </p>
    </footer>
  );
};

export default Footer;
