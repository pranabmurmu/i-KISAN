import React from 'react';

interface FarmerLogoProps {
  className?: string;
  size?: number | string;
}

export const FarmerLogo: React.FC<FarmerLogoProps> = ({
  className = 'w-6 h-6',
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Ground hill curve */}
      <path d="M 14 96 C 35 88 65 88 88 96" />

      {/* Left grass/plant sprout */}
      <path d="M 23 90 C 25 81 29 73 29 73" />
      <path d="M 27 75 C 21 72 17 76 17 79 C 22 81 26 77 27 75 Z" />
      <path d="M 21 82 C 14 81 12 85 13 88 C 17 89 21 86 21 82 Z" />

      {/* Right grass/plant sprout */}
      <path d="M 78 92 C 77 84 77 74 77 74" />
      <path d="M 77 76 C 83 73 87 77 86 81 C 82 82 78 78 77 76 Z" />
      <path d="M 78 84 C 85 83 89 87 87 90 C 83 91 79 87 78 84 Z" />

      {/* Wheat / Crop Sheaf carried on shoulder */}
      {/* Central pole */}
      <path d="M 34 22 L 86 38" />

      {/* Grains on stalk */}
      {/* Top terminal grain */}
      <path d="M 20 18 C 16 16 12 18 14 22 C 17 23 20 20 20 18 Z" />
      {/* Pair 1 */}
      <path d="M 23 17 C 20 12 25 10 28 13 C 28 17 24 18 23 17 Z" />
      <path d="M 25 21 C 21 24 23 29 27 27 C 29 24 27 21 25 21 Z" />
      {/* Pair 2 */}
      <path d="M 29 19 C 27 14 32 12 35 15 C 35 19 31 20 29 19 Z" />
      <path d="M 31 23 C 27 26 29 31 33 29 C 35 26 33 23 31 23 Z" />
      {/* Pair 3 */}
      <path d="M 36 21 C 34 16 39 14 42 17 C 42 21 38 22 36 21 Z" />
      <path d="M 38 25 C 34 28 36 33 40 31 C 42 28 40 25 38 25 Z" />

      {/* Farmer Hat */}
      <path d="M 42 20 L 67 13" /> {/* Hat brim */}
      <path d="M 47 18 C 47 11 48 10 57 8 C 60 8 61 10 61 15" /> {/* Hat crown */}

      {/* Farmer Head & Profile */}
      <path d="M 48 20 C 49 26 52 28 54 28 C 58 28 59 25 61 22 C 62 20 60 17 59 16" />
      <path d="M 59 17 C 61 18 62 21 60 23 C 58 25 55 24 53 23" />

      {/* Farmer Torso & Shirt */}
      <path d="M 49 28 L 41 36 C 40 38 41 42 41 47" /> {/* Left shoulder & back */}
      <path d="M 54 28 L 57 37 L 58 53" /> {/* Front chest & shirt opening */}
      <path d="M 44 32 L 53 53" /> {/* Center fold / shirt placket */}
      <path d="M 44 53 L 58 53" /> {/* Belt / waistline */}

      {/* Left arm (holding wheat pole above) */}
      <path d="M 55 31 C 61 32 67 36 71 31" /> {/* Bicep & forearm going to hand */}
      <circle cx="73" cy="33" r="3.5" /> {/* Hand gripping pole */}

      {/* Right arm (holding hoe handle below) */}
      <path d="M 42 36 C 39 40 37 47 37 53" />
      <path d="M 36 43 L 42 44" /> {/* Rolled up sleeve cuff */}
      <circle cx="37" cy="56" r="3" /> {/* Right hand holding hoe handle */}

      {/* Hoe tool */}
      <path d="M 23 52 L 60 66" /> {/* Hoe wooden handle */}
      <path d="M 22 51 C 20 54 17 55 17 63 L 24 65 C 25 57 24 52 22 51 Z" /> {/* Hoe blade */}

      {/* Trousers & Legs (Walking stride) */}
      {/* Front Leg (stepping forward) */}
      <path d="M 53 54 C 55 60 59 66 64 74 C 67 79 68 84 76 84 C 77 84 78 86 73 87 C 67 87 64 83 59 75 C 55 68 50 63 46 54" />

      {/* Back Leg (trailing stride) */}
      <path d="M 44 54 C 42 61 36 68 31 77 C 28 82 34 86 38 88 C 40 88 41 87 39 84 C 36 80 43 71 49 61" />
    </svg>
  );
};
