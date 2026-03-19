'use client';

export default function PixelArtBackground() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        {/* Definitions */}
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#C8E6F5', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#F5E6D3', stopOpacity: 1 }} />
          </linearGradient>

          {/* Grass Pattern - Pixelated Checkerboard */}
          <pattern id="grassPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#A8D77B" />
            <rect x="0" y="0" width="20" height="20" fill="#A8D77B" />
            <rect x="20" y="20" width="20" height="20" fill="#A8D77B" />
            <rect x="0" y="10" width="10" height="10" fill="#6B8E23" opacity="0.2" />
            <rect x="20" y="10" width="10" height="10" fill="#6B8E23" opacity="0.2" />
            <rect x="10" y="0" width="10" height="10" fill="#6B8E23" opacity="0.15" />
            <rect x="30" y="30" width="10" height="10" fill="#6B8E23" opacity="0.15" />
          </pattern>
        </defs>

        {/* Sky Background */}
        <rect width="1200" height="800" fill="url(#skyGradient)" />

        {/* Sun in Top Right Corner */}
        <g>
          {/* Sun rays */}
          <rect x="1080" y="30" width="15" height="15" fill="#FFE87B" opacity="0.6" />
          <rect x="1050" y="35" width="15" height="15" fill="#FFE87B" opacity="0.5" />
          <rect x="1110" y="35" width="15" height="15" fill="#FFE87B" opacity="0.5" />
          <rect x="1045" y="65" width="15" height="15" fill="#FFE87B" opacity="0.5" />
          <rect x="1115" y="65" width="15" height="15" fill="#FFE87B" opacity="0.5" />
          
          {/* Sun body */}
          <rect x="1080" y="45" width="40" height="40" fill="#FFD700" />
          <rect x="1085" y="50" width="30" height="30" fill="#FFF44F" />
        </g>

        {/* Far Background - Light Clouds */}
        <g opacity="0.3">
          <rect x="100" y="100" width="50" height="20" fill="#E8D9C3" />
          <rect x="105" y="90" width="40" height="10" fill="#E8D9C3" />
          <rect x="90" y="115" width="70" height="10" fill="#E8D9C3" />

          <rect x="800" y="80" width="60" height="24" fill="#E8D9C3" />
          <rect x="820" y="65" width="40" height="15" fill="#E8D9C3" />
          <rect x="790" y="105" width="80" height="10" fill="#E8D9C3" />

          <rect x="450" y="120" width="55" height="20" fill="#E8D9C3" />
          <rect x="465" y="105" width="40" height="10" fill="#E8D9C3" />
        </g>

        {/* Mid Background - Darker Clouds */}
        <g opacity="0.5">
          <rect x="150" y="180" width="70" height="28" fill="#D9CCBB" />
          <rect x="170" y="165" width="50" height="14" fill="#D9CCBB" />
          <rect x="130" y="200" width="110" height="14" fill="#D9CCBB" />

          <rect x="900" y="160" width="80" height="32" fill="#D9CCBB" />
          <rect x="925" y="140" width="60" height="18" fill="#D9CCBB" />
          <rect x="880" y="190" width="120" height="14" fill="#D9CCBB" />
        </g>

        {/* Pixel Art House/Shop - Center Background */}
        <g opacity="0.7">
          {/* House Base */}
          <rect x="550" y="350" width="140" height="120" fill="#8B4513" />
          
          {/* Roof - Pixelated Triangle */}
          <rect x="520" y="320" width="200" height="30" fill="#5C4033" />
          <rect x="520" y="315" width="50" height="5" fill="#5C4033" />
          <rect x="670" y="315" width="50" height="5" fill="#5C4033" />
          
          {/* Door */}
          <rect x="595" y="405" width="50" height="65" fill="#5C4033" />
          <rect x="600" y="410" width="40" height="55" fill="#3D2817" />
          <circle cx="640" cy="440" r="2" fill="#D97B68" />
          
          {/* Windows */}
          <rect x="565" y="370" width="25" height="25" fill="#87CEEB" opacity="0.8" />
          <rect x="570" y="375" width="8" height="8" fill="#5C4033" opacity="0.3" />
          <rect x="580" y="375" width="8" height="8" fill="#5C4033" opacity="0.3" />
          <rect x="570" y="385" width="8" height="8" fill="#5C4033" opacity="0.3" />
          <rect x="580" y="385" width="8" height="8" fill="#5C4033" opacity="0.3" />
          
          <rect x="610" y="370" width="25" height="25" fill="#87CEEB" opacity="0.8" />
          <rect x="615" y="375" width="8" height="8" fill="#5C4033" opacity="0.3" />
          <rect x="625" y="375" width="8" height="8" fill="#5C4033" opacity="0.3" />
          <rect x="615" y="385" width="8" height="8" fill="#5C4033" opacity="0.3" />
          <rect x="625" y="385" width="8" height="8" fill="#5C4033" opacity="0.3" />
          
          {/* Chimney */}
          <rect x="680" y="300" width="20" height="40" fill="#8B4513" />
          <rect x="677" y="295" width="26" height="8" fill="#5C4033" />
        </g>

        {/* Foreground - Bright Clouds */}
        <g opacity="0.6">
          <rect x="80" y="280" width="90" height="36" fill="#F5E6D3" />
          <rect x="110" y="260" width="70" height="18" fill="#F5E6D3" />
          <rect x="60" y="305" width="130" height="18" fill="#F5E6D3" />

          <rect x="950" y="260" width="110" height="40" fill="#F5E6D3" />
          <rect x="985" y="240" width="80" height="22" fill="#F5E6D3" />
          <rect x="930" y="295" width="150" height="18" fill="#F5E6D3" />
        </g>

        {/* Trees - Left Side */}
        <g>
          {/* Large Tree Left */}
          <rect x="120" y="520" width="18" height="90" fill="#5C4033" />
          <rect x="90" y="505" width="78" height="35" fill="#6B8E23" />
          <rect x="105" y="530" width="65" height="28" fill="#7FB069" />
          <rect x="120" y="550" width="45" height="20" fill="#6B8E23" />

          {/* Decorative Leaves */}
          <rect x="85" y="490" width="15" height="15" fill="#A8D77B" opacity="0.5" />
          <rect x="170" y="495" width="15" height="15" fill="#A8D77B" opacity="0.5" />
        </g>

        {/* Trees - Right Side */}
        <g>
          {/* Large Tree Right */}
          <rect x="1062" y="530" width="18" height="85" fill="#5C4033" />
          <rect x="1032" y="515" width="78" height="35" fill="#6B8E23" />
          <rect x="1047" y="540" width="65" height="28" fill="#7FB069" />
          <rect x="1062" y="560" width="45" height="20" fill="#6B8E23" />

          {/* Decorative Leaves */}
          <rect x="1027" y="500" width="15" height="15" fill="#A8D77B" opacity="0.5" />
          <rect x="1112" y="505" width="15" height="15" fill="#A8D77B" opacity="0.5" />
        </g>

        {/* Small Bushes */}
        <g opacity="0.7">
          {/* Left Bush */}
          <rect x="280" y="600" width="60" height="45" fill="#6B8E23" />
          <rect x="285" y="595" width="50" height="22" fill="#A8D77B" />
          
          {/* Right Bush */}
          <rect x="880" y="605" width="55" height="40" fill="#6B8E23" />
          <rect x="885" y="600" width="45" height="20" fill="#A8D77B" />
        </g>

        {/* Grass Area - Full Bottom */}
        <rect x="0" y="650" width="1200" height="150" fill="url(#grassPattern)" />

        {/* Grass Border Detail */}
        <g opacity="0.4">
          <rect x="0" y="640" width="1200" height="10" fill="#A8D77B" />
          <line x1="0" y1="641" x2="1200" y2="641" stroke="#6B8E23" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="646" x2="1200" y2="646" stroke="#6B8E23" strokeWidth="1" opacity="0.25" />
        </g>

        {/* Scattered Grass Tufts Details */}
        <g opacity="0.6">
          {/* Left side tufts */}
          <rect x="40" y="710" width="8" height="28" fill="#6B8E23" />
          <rect x="320" y="725" width="6" height="22" fill="#6B8E23" />
          <rect x="500" y="700" width="7" height="30" fill="#6B8E23" />
          
          {/* Right side tufts */}
          <rect x="1160" y="715" width="8" height="25" fill="#6B8E23" />
          <rect x="920" y="730" width="6" height="20" fill="#6B8E23" />
          <rect x="700" y="705" width="7" height="28" fill="#6B8E23" />
        </g>

        {/* Pixel Flowers - Bottom */}
        <g opacity="0.8">
          {/* Flower 1 - Red */}
          <rect x="200" y="745" width="6" height="6" fill="#D97B68" />
          <rect x="195" y="740" width="5" height="5" fill="#E85D54" />
          <rect x="205" y="740" width="5" height="5" fill="#E85D54" />
          <rect x="200" y="735" width="5" height="5" fill="#E85D54" />
          <rect x="200" y="745" width="5" height="5" fill="#E85D54" />

          {/* Flower 2 - Center */}
          <rect x="630" y="755" width="6" height="6" fill="#D97B68" />
          <rect x="625" y="750" width="5" height="5" fill="#E85D54" />
          <rect x="635" y="750" width="5" height="5" fill="#E85D54" />
          <rect x="630" y="745" width="5" height="5" fill="#E85D54" />
          <rect x="630" y="755" width="5" height="5" fill="#E85D54" />

          {/* Flower 3 - Right */}
          <rect x="950" y="750" width="6" height="6" fill="#D97B68" />
          <rect x="945" y="745" width="5" height="5" fill="#E85D54" />
          <rect x="955" y="745" width="5" height="5" fill="#E85D54" />
          <rect x="950" y="740" width="5" height="5" fill="#E85D54" />
          <rect x="950" y="750" width="5" height="5" fill="#E85D54" />
        </g>

        {/* Ground Shadow */}
        <rect x="0" y="770" width="1200" height="30" fill="#5C4033" opacity="0.08" />
      </svg>
    </div>
  );
}
