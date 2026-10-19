import{i as e,n as t,t as n}from"./jsx-runtime-Dk72oS4N.js";import{t as r}from"./check-ShyaDhLO.js";var i=e(t(),1),a=n(),o=[{id:`1`,label:`Use a reusable water bottle`,completed:!0},{id:`2`,label:`Try a plant-based meal`,completed:!0},{id:`3`,label:`Walk or cycle for short trips`,completed:!0},{id:`4`,label:`Avoid food waste`,completed:!0},{id:`5`,label:`Use LED bulbs`,completed:!1},{id:`6`,label:`Choose second-hand`,completed:!1},{id:`7`,label:`Take shorter showers`,completed:!1}];function s(){let[e,t]=(0,i.useState)(o),[n,s]=(0,i.useState)(`plan`),c=e=>{t(t=>t.map(t=>t.id===e?{...t,completed:!t.completed}:t))},l=e.filter(e=>e.completed).length;return(0,a.jsxs)(`div`,{className:`routine-root`,children:[(0,a.jsxs)(`div`,{className:`routine-header`,children:[(0,a.jsx)(`h1`,{className:`routine-title`,children:`Your routine`}),(0,a.jsx)(`p`,{className:`routine-sub`,children:`Build simple habits for a stronger impact.`})]}),(0,a.jsxs)(`div`,{className:`routine-tabs`,children:[(0,a.jsx)(`button`,{type:`button`,className:`routine-tab ${n===`plan`?`is-active`:``}`,onClick:()=>s(`plan`),children:`7-day plan`}),(0,a.jsx)(`button`,{type:`button`,className:`routine-tab ${n===`swaps`?`is-active`:``}`,onClick:()=>s(`swaps`),children:`Your swaps`}),(0,a.jsx)(`button`,{type:`button`,className:`routine-tab ${n===`analytics`?`is-active`:``}`,onClick:()=>s(`analytics`),children:`Analytics`})]}),(0,a.jsxs)(`div`,{className:`routine-split`,children:[(0,a.jsxs)(`div`,{className:`routine-card routine-challenge-card`,children:[(0,a.jsxs)(`div`,{className:`challenge-card-header`,children:[(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`h2`,{className:`challenge-title`,children:`Your 7-day challenge`}),(0,a.jsx)(`p`,{className:`challenge-desc`,children:`Complete daily actions to build your sustainable routine.`})]}),(0,a.jsxs)(`span`,{className:`challenge-counter`,children:[l,`/7 completed`]})]}),(0,a.jsx)(`div`,{className:`routine-checklist`,children:e.map(e=>(0,a.jsxs)(`button`,{type:`button`,className:`checklist-item ${e.completed?`is-checked`:``}`,onClick:()=>c(e.id),children:[(0,a.jsx)(`div`,{className:`check-box`,children:e.completed&&(0,a.jsx)(r,{className:`h-3.5 w-3.5 stroke-[3]`})}),(0,a.jsx)(`span`,{className:`check-text`,children:e.label}),(0,a.jsx)(`span`,{className:`check-bookmark`,children:`🔖`})]},e.id))})]}),(0,a.jsxs)(`div`,{className:`routine-right-col`,children:[(0,a.jsxs)(`div`,{className:`routine-card tip-card`,children:[(0,a.jsxs)(`div`,{className:`tip-header`,children:[(0,a.jsx)(`span`,{className:`tip-title`,children:`Today's tip`}),(0,a.jsx)(`span`,{className:`tip-icon`,children:`💡`})]}),(0,a.jsxs)(`p`,{className:`tip-body`,children:[`Taking a 5 minute shorter shower can save up to `,(0,a.jsx)(`strong`,{children:`20 liters of water`}),` and reduce hot water heating emissions.`]})]}),(0,a.jsxs)(`div`,{className:`routine-card quote-card`,children:[(0,a.jsx)(`blockquote`,{className:`quote-text`,children:`“Progress, not perfection, leads to a cleaner planet.”`}),(0,a.jsx)(`div`,{className:`quote-leaf`,"aria-hidden":`true`,children:(0,a.jsxs)(`svg`,{width:`40`,height:`40`,viewBox:`0 0 40 40`,fill:`none`,children:[(0,a.jsx)(`path`,{d:`M10 30 C15 15 25 10 35 8 C30 20 22 28 10 30Z`,fill:`#123826`,opacity:`0.8`}),(0,a.jsx)(`path`,{d:`M12 28 L30 12`,stroke:`#4dd282`,strokeWidth:`1.5`})]})})]})]})]}),(0,a.jsx)(`style`,{children:`
        .routine-root {
          max-width: 1080px;
          margin: 0 auto;
          padding: 2.2rem 2.5rem 4rem;
          font-family: 'DM Sans', sans-serif;
          color: var(--color-ink);
        }
        .routine-header {
          margin-bottom: 1.4rem;
        }
        .routine-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--color-ink);
          letter-spacing: -0.02em;
          margin: 0 0 0.35rem;
        }
        .routine-sub {
          font-size: 0.9rem;
          color: var(--color-ink-muted);
          margin: 0;
        }

        .routine-tabs {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 2rem;
        }
        .routine-tab {
          padding: 0.45rem 1.15rem;
          border-radius: 999px;
          border: 1px solid #DFD7CA;
          background: #FAF8F4;
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--color-ink-muted);
          cursor: pointer;
          transition: all 0.15s;
        }
        .dark .routine-tab {
          background: #141c17;
          border-color: #24352b;
        }
        .routine-tab:hover {
          border-color: #123826;
          color: var(--color-ink);
        }
        .routine-tab.is-active {
          background: #123826;
          border-color: #123826;
          color: #ffffff;
          font-weight: 600;
        }
        .dark .routine-tab.is-active {
          background: #3eac6a;
          border-color: #3eac6a;
          color: #0c130f;
        }

        .routine-split {
          display: grid;
          grid-template-columns: 1.45fr 1fr;
          gap: 1.8rem;
          align-items: flex-start;
        }
        .routine-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 1.8rem 2rem;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.04);
        }

        .challenge-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.8rem;
        }
        .challenge-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0 0 0.3rem;
        }
        .challenge-desc {
          font-size: 0.78rem;
          color: var(--color-ink-muted);
          margin: 0;
        }
        .challenge-counter {
          font-size: 0.75rem;
          font-weight: 700;
          color: #123826;
          background: rgba(18, 56, 38, 0.08);
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          white-space: nowrap;
        }
        .dark .challenge-counter {
          background: rgba(62, 172, 106, 0.15);
          color: #3eac6a;
        }

        .routine-checklist {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .checklist-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 1rem;
          background: #FAF8F4;
          border: 1px solid #DFD7CA;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
          width: 100%;
        }
        .dark .checklist-item {
          background: #141c17;
          border-color: #24352b;
        }
        .checklist-item:hover {
          border-color: #123826;
        }
        .checklist-item.is-checked {
          background: rgba(18, 56, 38, 0.05);
          border-color: rgba(18, 56, 38, 0.3);
        }
        .dark .checklist-item.is-checked {
          background: rgba(62, 172, 106, 0.08);
          border-color: rgba(62, 172, 106, 0.3);
        }
        .check-box {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #DFD7CA;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .checklist-item.is-checked .check-box {
          background: #123826;
          border-color: #123826;
          color: #ffffff;
        }
        .dark .checklist-item.is-checked .check-box {
          background: #3eac6a;
          border-color: #3eac6a;
          color: #0c130f;
        }
        .check-text {
          font-size: 0.85rem;
          color: var(--color-ink);
          font-weight: 500;
          flex: 1;
        }
        .check-bookmark {
          font-size: 0.85rem;
          opacity: 0.35;
        }
        .checklist-item:hover .check-bookmark {
          opacity: 0.9;
        }

        .routine-right-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .tip-card {
          background: #FAF8F4;
        }
        .dark .tip-card {
          background: #152019;
        }
        .tip-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .tip-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-ink);
        }
        .tip-body {
          font-size: 0.82rem;
          color: var(--color-ink-muted);
          line-height: 1.6;
          margin: 0;
        }

        .quote-card {
          background: #f7f3ec;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2.2rem 2rem;
        }
        .dark .quote-card {
          background: #131c16;
        }
        .quote-text {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.15rem;
          font-style: italic;
          color: #123826;
          line-height: 1.5;
          margin: 0 0 1rem;
        }
        .dark .quote-text {
          color: #4dd282;
        }
        .quote-leaf {
          margin-top: 0.5rem;
        }

        @media (max-width: 860px) {
          .routine-split {
            grid-template-columns: 1fr;
          }
        }
      `})]})}export{s as LogActivityPage};