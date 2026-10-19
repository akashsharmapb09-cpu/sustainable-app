import{i as e,n as t,t as n}from"./jsx-runtime-Dk72oS4N.js";import{U as r}from"./index-BrylOh2R.js";var i=e(t(),1),a=n(),o=[{id:`transit`,title:`Swap to public transport`,category:`transport`,co2Saving:`Save up to 0.2t CO2e / month`,image:`https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80`,topics:[`lifestyle`,`all`]},{id:`plant`,title:`Eat more plant-based meals`,category:`food`,co2Saving:`Save up to 0.3t CO2e / month`,image:`https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80`,topics:[`works-for-you`,`food`,`all`]},{id:`appliances`,title:`Use energy efficient appliances`,category:`energy`,co2Saving:`Save up to 0.1t CO2e / month`,image:`https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80`,topics:[`care-about`,`energy`,`home`,`all`]},{id:`food-waste`,title:`Avoid food waste`,category:`food`,co2Saving:`Save up to 0.15t CO2e / month`,image:`https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80`,topics:[`works-for-you`,`food`,`lifestyle`,`all`]},{id:`secondhand`,title:`Buy second-hand`,category:`shopping`,co2Saving:`Save up to 0.05t CO2e / month`,image:`https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80`,topics:[`choices`,`shopping`,`all`]},{id:`reusable`,title:`Choose reusable items`,category:`shopping`,co2Saving:`Save up to 0.05t CO2e / month`,image:`https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80`,topics:[`choices`,`shopping`,`lifestyle`,`all`]},{id:`bldc-fan`,title:`BLDC Ceiling Fans`,category:`energy`,co2Saving:`Save up to 0.08t CO2e / month`,image:`https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80`,topics:[`care-about`,`energy`,`home`,`all`]},{id:`composting`,title:`Aerobic Khamba Composting`,category:`waste`,co2Saving:`Save up to 0.06t CO2e / month`,image:`https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80`,topics:[`choices`,`waste`,`home`,`all`]}],s={lifestyle:{title:`Everyday lifestyle`,desc:`Simple habits that fit your routine for a tangible everyday carbon reduction.`,bannerBg:`linear-gradient(135deg, #1b3827 0%, #12291d 100%)`},"works-for-you":{title:`What works for you`,desc:`Personalised food and lifestyle alternatives configured for your preferences.`,bannerBg:`linear-gradient(135deg, #3d2c1d 0%, #291e13 100%)`},"care-about":{title:`Topics you care about`,desc:`Clean power, renewables, and high-impact interventions that make the biggest difference.`,bannerBg:`linear-gradient(135deg, #17353f 0%, #0e2229 100%)`},choices:{title:`Your everyday choices`,desc:`Smarter alternatives for daily purchases, circular economy, and low-waste living.`,bannerBg:`linear-gradient(135deg, #2b3320 0%, #1c2215 100%)`}},c=[{id:`all`,label:`All`},{id:`transport`,label:`Transport`},{id:`food`,label:`Food`},{id:`energy`,label:`Energy`},{id:`shopping`,label:`Shopping`},{id:`waste`,label:`Waste`},{id:`home`,label:`Home`}];function l(){let[e,t]=r(),n=e.get(`topic`),l=e.get(`cat`),[u,d]=(0,i.useState)(l??`all`);(0,i.useEffect)(()=>{l&&d(l)},[l]);let f=n?s[n]:null,p=n=>{d(n);let r=new URLSearchParams(e);n===`all`?r.delete(`cat`):r.set(`cat`,n),t(r)},m=()=>{let n=new URLSearchParams(e);n.delete(`topic`),t(n)},h=(0,i.useMemo)(()=>o.filter(e=>{let t=u===`all`||e.category===u||u===`home`&&e.topics.includes(`home`),r=!n||e.topics.includes(n);return t&&r}),[u,n]);return(0,a.jsxs)(`div`,{className:`discover-root`,children:[f&&(0,a.jsxs)(`div`,{className:`topic-spotlight-banner`,style:{background:f.bannerBg},children:[(0,a.jsxs)(`div`,{className:`topic-banner-text`,children:[(0,a.jsx)(`span`,{className:`topic-banner-pill`,children:`SELECTED TOPIC`}),(0,a.jsx)(`h2`,{className:`topic-banner-title`,children:f.title}),(0,a.jsx)(`p`,{className:`topic-banner-desc`,children:f.desc})]}),(0,a.jsx)(`button`,{type:`button`,className:`topic-clear-btn`,onClick:m,children:`Show all topics ✕`})]}),(0,a.jsxs)(`div`,{className:`discover-header`,children:[(0,a.jsxs)(`div`,{className:`discover-header-text`,children:[(0,a.jsxs)(`h1`,{className:`discover-title`,children:[`Discover `,(0,a.jsx)(`span`,{className:`discover-italic`,children:`a better everyday.`})]}),(0,a.jsx)(`p`,{className:`discover-sub`,children:`Explore ideas, tips and stories to live well with a lighter footprint.`})]}),(0,a.jsx)(`div`,{className:`discover-watermark`,"aria-hidden":`true`,children:(0,a.jsxs)(`svg`,{viewBox:`0 0 120 120`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`,children:[(0,a.jsx)(`path`,{d:`M20 100 C40 80 50 40 100 20 C80 50 40 70 20 100Z`,fill:`#33593A`,opacity:`0.12`}),(0,a.jsx)(`path`,{d:`M30 60 C50 50 70 40 90 25`,stroke:`#33593A`,strokeWidth:`1.5`,opacity:`0.2`})]})})]}),(0,a.jsx)(`div`,{className:`discover-tabs-bar`,children:c.map(({id:e,label:t})=>(0,a.jsx)(`button`,{type:`button`,className:`discover-tab ${u===e?`is-active`:``}`,onClick:()=>p(e),children:t},e))}),(0,a.jsxs)(`div`,{className:`discover-cards-grid`,children:[h.map(e=>(0,a.jsxs)(`div`,{className:`discover-card`,children:[(0,a.jsx)(`div`,{className:`discover-card-img`,children:(0,a.jsx)(`img`,{src:e.image,alt:e.title,loading:`lazy`})}),(0,a.jsxs)(`div`,{className:`discover-card-body`,children:[(0,a.jsx)(`h3`,{className:`discover-card-name`,children:e.title}),(0,a.jsx)(`p`,{className:`discover-card-co2`,children:e.co2Saving})]})]},e.id)),h.length===0&&(0,a.jsxs)(`div`,{className:`discover-empty`,children:[(0,a.jsx)(`p`,{children:`No swaps found for this combination.`}),(0,a.jsx)(`button`,{type:`button`,className:`discover-reset-btn`,onClick:()=>{d(`all`),m()},children:`Reset filters`})]})]}),(0,a.jsx)(`style`,{children:`
        .discover-root {
          max-width: 1140px;
          margin: 0 auto;
          padding: 2.4rem 2.5rem 4rem;
          font-family: 'DM Sans', sans-serif;
          color: var(--color-ink);
          position: relative;
        }

        /* ── Topic Spotlight Banner ── */
        .topic-spotlight-banner {
          border-radius: 16px;
          padding: 1.8rem 2.2rem;
          margin-bottom: 2rem;
          color: #f4efe6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          animation: gs-page-in 0.3s ease both;
        }
        .topic-banner-pill {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #a8dfbc;
          display: block;
          margin-bottom: 0.3rem;
        }
        .topic-banner-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.6rem;
          font-weight: 700;
          margin: 0 0 0.3rem;
          color: #ffffff;
        }
        .topic-banner-desc {
          font-size: 0.85rem;
          color: rgba(244, 239, 230, 0.8);
          margin: 0;
        }
        .topic-clear-btn {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          border-radius: 999px;
          padding: 0.45rem 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .topic-clear-btn:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        /* ── Header ── */
        .discover-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          position: relative;
          margin-bottom: 1.8rem;
        }
        .discover-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 2.4rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--color-ink);
          margin: 0 0 0.4rem;
          line-height: 1.15;
        }
        .discover-italic {
          font-style: italic;
          font-weight: 400;
          display: block;
          color: #123826;
        }
        .dark .discover-italic {
          color: #4dd282;
        }
        .discover-sub {
          font-size: 0.9rem;
          color: var(--color-ink-muted);
          margin: 0;
          max-width: 45ch;
          line-height: 1.5;
        }
        .discover-watermark {
          width: 90px;
          height: 90px;
          opacity: 0.6;
          pointer-events: none;
        }
        .discover-watermark svg {
          width: 100%;
          height: 100%;
        }

        /* ── Filter Tabs Bar ── */
        .discover-tabs-bar {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }
        .discover-tab {
          padding: 0.4rem 1.1rem;
          border-radius: 999px;
          border: 1px solid #DFD7CA;
          background: #FAF8F4;
          color: var(--color-ink-muted);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .dark .discover-tab {
          background: #141c17;
          border-color: #24352b;
        }
        .discover-tab:hover {
          border-color: #123826;
          color: var(--color-ink);
        }
        .discover-tab.is-active {
          background: #123826;
          border-color: #123826;
          color: #ffffff;
          font-weight: 600;
        }
        .dark .discover-tab.is-active {
          background: #3eac6a;
          border-color: #3eac6a;
          color: #0c130f;
        }

        /* ── 3x2 Cards Grid ── */
        .discover-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .discover-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .discover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
          border-color: rgba(18, 56, 38, 0.35);
        }
        .discover-card-img {
          width: 100%;
          height: 160px;
          overflow: hidden;
        }
        .discover-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .discover-card:hover .discover-card-img img {
          transform: scale(1.05);
        }
        .discover-card-body {
          padding: 1.15rem 1.25rem 1.3rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .discover-card-name {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0;
          line-height: 1.35;
        }
        .discover-card-co2 {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--color-ink-muted);
          margin: 0;
        }

        .discover-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 1rem;
          color: var(--color-ink-muted);
        }
        .discover-reset-btn {
          margin-top: 1rem;
          padding: 0.5rem 1.2rem;
          border-radius: 999px;
          background: #123826;
          color: #fff;
          border: none;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .discover-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .discover-cards-grid {
            grid-template-columns: 1fr;
          }
          .discover-root {
            padding: 1.5rem 1.25rem;
          }
        }
      `})]})}export{l as ExplorePage};