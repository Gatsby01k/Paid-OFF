"use client";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Навбар */}
      <header className="flex justify-between items-center px-10 py-6 font-bold">
        <div className="text-xl tracking-widest">PAIDOFF</div>
        <nav className="flex gap-8">
          <a href="#about" className="hover:opacity-70">About</a>
          <a href="#algorithms" className="hover:opacity-70">Algorithms</a>
          <a href="#contact" className="hover:opacity-70">Contact</a>
          <a
            href="#getstarted"
            className="bg-black text-yellow-400 px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Get Started
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-1 items-center justify-between px-16 py-10">
        <div className="max-w-xl">
          <p className="uppercase text-sm font-bold tracking-widest mb-4">
            Automated trading with artificial intelligence
          </p>
          <h1 className="text-6xl font-extrabold leading-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            AI CRYPT <br /> TRADING
          </h1>
          <p className="mt-6 text-lg opacity-80">
            Умный риск-менеджмент, прозрачная симуляция доходности и чистый интерфейс уровня <b>awwwards</b>.
          </p>
          <div className="mt-8 flex gap-6">
            <a
              href="#getstarted"
              className="px-6 py-3 bg-black text-yellow-300 rounded-full font-semibold shadow-xl hover:scale-105 transition-transform"
            >
              Get Started
            </a>
            <a
              href="#learn"
              className="px-6 py-3 border-2 border-black rounded-full font-semibold hover:bg-black hover:text-yellow-300 transition-colors"
            >
              Learn more
            </a>
          </div>
        </div>

        {/* Робот */}
        <div className="robot-wrap">
          <svg
            className="robot-svg"
            viewBox="0 0 400 420"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="PaidOFF robot"
          >
            {/* coin */}
            <g className="robot__coin" transform="translate(300,70)">
              <circle cx="0" cy="0" r="28" fill="#000" />
              <circle cx="0" cy="0" r="24" fill="#ffd300" />
              <path d="M-6 5 L0 -8 L6 5 Z" fill="#000" />
            </g>

            {/* body */}
            <g className="robot__body" transform="translate(90,120)">
              <rect x="0" y="30" rx="16" ry="16" width="200" height="130" fill="#000" stroke="#000" strokeWidth="6"/>
              <rect x="8" y="38" rx="12" ry="12" width="184" height="114" fill="#111"/>

              {/* chest graph */}
              <g transform="translate(26,62)">
                <rect x="0" y="0" width="132" height="60" rx="10" fill="#000"/>
                <rect x="10" y="32" width="12" height="20" fill="#ffd300"/>
                <rect x="30" y="24" width="12" height="28" fill="#ffd300"/>
                <rect x="50" y="18" width="12" height="34" fill="#ffd300"/>
                <rect x="70" y="12" width="12" height="40" fill="#ffd300"/>
                <rect x="90" y="8"  width="12" height="44" fill="#ffd300"/>
              </g>

              {/* head */}
              <g transform="translate(24,-34)">
                <rect x="0" y="0" width="156" height="94" rx="26" fill="#000" stroke="#000" strokeWidth="6"/>
                <rect x="6" y="6" width="144" height="82" rx="22" fill="#111"/>
                <g transform="translate(46,46)">
                  <ellipse className="robot__blink" cx="0" cy="0" rx="13" ry="7" fill="#ffd300"/>
                  <circle className="robot__eye" cx="0" cy="0" r="7" fill="#000"/>
                </g>
                <g transform="translate(110,46)">
                  <ellipse className="robot__blink" cx="0" cy="0" rx="13" ry="7" fill="#ffd300"/>
                  <circle className="robot__eye" cx="0" cy="0" r="7" fill="#000"/>
                </g>
                <rect x="66" y="66" width="26" height="6" rx="3" fill="#000" opacity=".7"/>
                <rect className="robot__shine" x="-20" y="12" width="70" height="6" rx="3" fill="#fff"/>
              </g>

              {/* arms */}
              <g transform="translate(-30,70)">
                <rect x="0" y="0" width="44" height="18" rx="9" fill="#000"/>
                <rect x="38" y="-8" width="24" height="36" rx="12" fill="#111"/>
              </g>
              <g transform="translate(200,70)">
                <rect x="0" y="0" width="44" height="18" rx="9" fill="#000"/>
                <rect x="-18" y="-8" width="24" height="36" rx="12" fill="#111"/>
              </g>

              {/* tracks */}
              <g transform="translate(-8,164)">
                <rect x="0" y="0" width="96" height="34" rx="16" fill="#000"/>
                <rect x="104" y="0" width="96" height="34" rx="16" fill="#000"/>
              </g>
            </g>
          </svg>
        </div>
      </section>

      {/* футер */}
      <footer className="text-center py-6 text-sm opacity-70 border-t border-black/20">
        © {new Date().getFullYear()} PaidOFF. All rights reserved.
      </footer>
    </main>
  );
}
