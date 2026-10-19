import{i as e,n as t,t as n}from"./jsx-runtime-Dk72oS4N.js";import{t as r}from"./check-ShyaDhLO.js";import{L as i,N as a}from"./index-CIOU2s-f.js";var o={name:`bookmark`,size:24,node:[[`path`,{d:`M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z`,key:`oz39mx`}]]};o.node;var s=i(o),c={name:`sliders-horizontal`,size:24,node:[[`path`,{d:`M10 5H3`,key:`1qgfaw`}],[`path`,{d:`M12 19H3`,key:`yhmn1j`}],[`path`,{d:`M14 3v4`,key:`1sua03`}],[`path`,{d:`M16 17v4`,key:`1q0r14`}],[`path`,{d:`M21 12h-9`,key:`1o4lsq`}],[`path`,{d:`M21 19h-5`,key:`1rlt1p`}],[`path`,{d:`M21 5h-7`,key:`1oszz2`}],[`path`,{d:`M8 10v4`,key:`tgpxqk`}],[`path`,{d:`M8 12H3`,key:`a7s4jb`}]]};c.node;var l=i(c),u=e(t(),1),d=n(),f=[{id:`bike`,title:`Bike instead of driving`,category:`transport`,categoryLabel:`Transport`,co2Saving:`Save up to 0.2t CO2e / month`,image:`https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&q=80`,saved:!1},{id:`plant`,title:`Eat plant-based meals`,category:`food`,categoryLabel:`Food`,co2Saving:`Save up to 0.3t CO2e / month`,image:`https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80`,saved:!0},{id:`led`,title:`Use LED bulbs`,category:`energy`,categoryLabel:`Energy`,co2Saving:`Save up to 0.1t CO2e / month`,image:`https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80`,saved:!1},{id:`secondhand`,title:`Buy second-hand clothes`,category:`shopping`,categoryLabel:`Shopping`,co2Saving:`Save up to 0.05t CO2e / month`,image:`https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&q=80`,saved:!1},{id:`metro`,title:`Switch to metro commuting`,category:`transport`,categoryLabel:`Transport`,co2Saving:`Save up to 0.25t CO2e / month`,image:`https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&q=80`,saved:!0},{id:`compost`,title:`Aerobic home composting`,category:`waste`,categoryLabel:`Waste`,co2Saving:`Save up to 0.08t CO2e / month`,image:`https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=80`,saved:!1}];function p(){let[e,t]=(0,u.useState)(f),[n,i]=(0,u.useState)(`all`),[o,c]=(0,u.useState)(``),p=e=>{t(t=>t.map(t=>t.id===e?{...t,saved:!t.saved}:t))},m=e.filter(e=>{let t=n===`all`||e.category===n,r=e.title.toLowerCase().includes(o.toLowerCase())||e.categoryLabel.toLowerCase().includes(o.toLowerCase());return t&&r}),h={all:e.length,transport:e.filter(e=>e.category===`transport`).length,food:e.filter(e=>e.category===`food`).length,energy:e.filter(e=>e.category===`energy`).length,shopping:e.filter(e=>e.category===`shopping`).length,waste:e.filter(e=>e.category===`waste`).length};return(0,d.jsxs)(`div`,{className:`cat-page`,children:[(0,d.jsxs)(`div`,{className:`cat-header`,children:[(0,d.jsx)(`h1`,{className:`cat-title`,children:`Catalogue`}),(0,d.jsx)(`p`,{className:`cat-sub`,children:`Browse all sustainable swaps and find what works for you.`})]}),(0,d.jsxs)(`div`,{className:`cat-search-row`,children:[(0,d.jsxs)(`div`,{className:`cat-search-box`,children:[(0,d.jsx)(a,{className:`h-4 w-4 text-ink-muted`}),(0,d.jsx)(`input`,{type:`text`,placeholder:`Search swaps...`,value:o,onChange:e=>c(e.target.value)})]}),(0,d.jsxs)(`button`,{type:`button`,className:`cat-filter-btn`,children:[(0,d.jsx)(l,{className:`h-3.5 w-3.5`}),(0,d.jsx)(`span`,{children:`Filter`})]})]}),(0,d.jsxs)(`div`,{className:`cat-layout`,children:[(0,d.jsx)(`aside`,{className:`cat-sidebar`,children:[{id:`all`,label:`All swaps`,count:h.all},{id:`transport`,label:`Transport`,count:h.transport},{id:`food`,label:`Food`,count:h.food},{id:`energy`,label:`Energy`,count:h.energy},{id:`shopping`,label:`Shopping`,count:h.shopping},{id:`waste`,label:`Waste`,count:h.waste}].map(({id:e,label:t,count:r})=>(0,d.jsxs)(`button`,{type:`button`,className:`cat-nav-item ${n===e?`is-active`:``}`,onClick:()=>i(e),children:[(0,d.jsx)(`span`,{children:t}),(0,d.jsxs)(`span`,{className:`cat-count`,children:[`(`,r,`)`]})]},e))}),(0,d.jsxs)(`div`,{className:`cat-list`,children:[m.map(e=>(0,d.jsxs)(`div`,{className:`cat-card`,children:[(0,d.jsx)(`div`,{className:`cat-card-thumb`,children:(0,d.jsx)(`img`,{src:e.image,alt:e.title})}),(0,d.jsxs)(`div`,{className:`cat-card-content`,children:[(0,d.jsx)(`h3`,{className:`cat-card-title`,children:e.title}),(0,d.jsx)(`span`,{className:`cat-card-badge`,children:e.categoryLabel}),(0,d.jsx)(`p`,{className:`cat-card-co2`,children:e.co2Saving})]}),(0,d.jsx)(`button`,{type:`button`,className:`cat-save-btn ${e.saved?`is-saved`:``}`,onClick:()=>p(e.id),children:e.saved?(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(r,{className:`h-3.5 w-3.5`}),(0,d.jsx)(`span`,{children:`Saved`})]}):(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(s,{className:`h-3.5 w-3.5`}),(0,d.jsx)(`span`,{children:`Save`})]})})]},e.id)),m.length===0&&(0,d.jsx)(`div`,{className:`cat-empty`,children:(0,d.jsx)(`p`,{children:`No swaps match your search or filter.`})})]})]}),(0,d.jsx)(`style`,{children:`
        .cat-page {
          max-width: 1040px;
          margin: 0 auto;
          padding: 2.2rem 2rem 4rem;
          font-family: 'DM Sans', sans-serif;
          color: var(--color-ink);
        }
        .cat-header {
          margin-bottom: 1.5rem;
        }
        .cat-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--color-ink);
          letter-spacing: -0.02em;
          margin: 0 0 0.35rem;
        }
        .cat-sub {
          font-size: 0.9rem;
          color: var(--color-ink-muted);
          margin: 0;
        }
        .cat-search-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .cat-search-box {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: #FAF8F4;
          border: 1px solid #DFD7CA;
          border-radius: 999px;
          padding: 0.55rem 1.25rem;
          flex: 1;
          max-width: 480px;
        }
        .dark .cat-search-box {
          background: #16201a;
          border-color: #24352b;
        }
        .cat-search-box input {
          border: none;
          background: none;
          outline: none;
          font-size: 0.85rem;
          color: var(--color-ink);
          width: 100%;
        }
        .cat-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1.1rem;
          background: #FAF8F4;
          border: 1px solid #DFD7CA;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-ink);
          cursor: pointer;
          transition: all 0.15s;
        }
        .cat-filter-btn:hover {
          border-color: #123826;
        }
        .cat-layout {
          display: grid;
          grid-template-columns: 210px 1fr;
          gap: 2.5rem;
          align-items: flex-start;
        }
        .cat-sidebar {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          background: #FAF8F4;
          border: 1px solid #DFD7CA;
          border-radius: 14px;
          padding: 0.8rem;
        }
        .dark .cat-sidebar {
          background: #141c17;
          border-color: #202c24;
        }
        .cat-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.85rem;
          background: none;
          border: none;
          border-radius: 8px;
          color: var(--color-ink-muted);
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
        }
        .cat-nav-item:hover {
          background: rgba(0, 0, 0, 0.04);
          color: var(--color-ink);
        }
        .cat-nav-item.is-active {
          background: rgba(18, 56, 38, 0.1);
          color: #123826;
          font-weight: 700;
        }
        .dark .cat-nav-item.is-active {
          background: rgba(62, 172, 106, 0.15);
          color: #3eac6a;
        }
        .cat-count {
          font-size: 0.72rem;
          opacity: 0.7;
        }
        .cat-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .cat-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 14px;
          padding: 1rem 1.4rem;
          display: flex;
          align-items: center;
          gap: 1.4rem;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .cat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
          border-color: rgba(18, 56, 38, 0.3);
        }
        .cat-card-thumb {
          width: 72px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .cat-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cat-card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .cat-card-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0;
        }
        .cat-card-badge {
          font-size: 0.68rem;
          color: var(--color-ink-muted);
          font-weight: 500;
        }
        .cat-card-co2 {
          font-size: 0.75rem;
          font-weight: 600;
          color: #123826;
          margin: 0;
        }
        .dark .cat-card-co2 {
          color: #3eac6a;
        }
        .cat-save-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 1.1rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid var(--color-border);
          background: #FAF8F4;
          color: var(--color-ink-muted);
        }
        .cat-save-btn:hover {
          border-color: #123826;
          color: #123826;
        }
        .cat-save-btn.is-saved {
          background: #e4efe7;
          border-color: #123826;
          color: #123826;
          font-weight: 700;
        }
        .dark .cat-save-btn.is-saved {
          background: #1a3826;
          border-color: #3eac6a;
          color: #3eac6a;
        }
        .cat-empty {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--color-ink-muted);
        }
        @media (max-width: 768px) {
          .cat-layout {
            grid-template-columns: 1fr;
          }
          .cat-sidebar {
            flex-direction: row;
            flex-wrap: wrap;
          }
        }
      `})]})}export{p as CataloguePage};