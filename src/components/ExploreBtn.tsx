"use client";
import Image from "next/image";
import posthog from "posthog-js";

export const ExploreBtn = () => {
  const handleClick = () => {
    posthog.capture("explore_clicked");
  };

  return (
    <button
      className="mt-7 mx-auto"
      type="button"
      id="explore-btn"
      onClick={handleClick}
    >
      <a href="#events">
        Explore
        <Image
          src="/icons/arrow-down.svg"
          alt="arrow-down"
          width="20"
          height="20"
        />
      </a>
    </button>
  );
};
