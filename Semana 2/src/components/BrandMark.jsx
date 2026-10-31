/** Emblema vectorial propio: rombo y hojas de Valkora. */
export default function BrandMark({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 88 88" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="valkora-gold" x1="6" y1="6" x2="82" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF4C9" />
          <stop offset=".42" stopColor="#E9B85D" />
          <stop offset=".72" stopColor="#FBDFA3" />
          <stop offset="1" stopColor="#A86B25" />
        </linearGradient>
      </defs>
      <path d="M44 4 84 44 44 84 4 44 44 4Z" stroke="url(#valkora-gold)" strokeWidth="1.9"/>
      <path d="M44 11 77 44 44 77 11 44 44 11Z" stroke="url(#valkora-gold)" strokeOpacity=".36" strokeWidth=".7"/>
      <path d="M44 63V29" stroke="url(#valkora-gold)" strokeWidth="2.3" strokeLinecap="round"/>
      <path d="M44 42c-8-4-12-12-11-22 8 3 13 11 11 22Z" fill="url(#valkora-gold)"/>
      <path d="M43 50c-13-1-19-8-20-18 11 1 19 8 20 18Z" fill="url(#valkora-gold)"/>
      <path d="M45 50c13-1 19-8 20-18-11 1-19 8-20 18Z" fill="url(#valkora-gold)"/>
      <path d="M44 59c-10-1-15-6-16-13 9 1 14 5 16 13ZM44 59c10-1 15-6 16-13-9 1-14 5-16 13Z" fill="url(#valkora-gold)" opacity=".92"/>
    </svg>
  );
}
