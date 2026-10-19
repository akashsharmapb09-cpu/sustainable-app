import{i as e,n as t,t as n}from"./jsx-runtime-Dk72oS4N.js";import{t as r}from"./check-DXqZwZ1f.js";import{B as i,R as a}from"./index-BrylOh2R.js";var o={name:`calendar`,size:24,node:[[`path`,{d:`M8 2v3`,key:`1ioesn`}],[`path`,{d:`M16 2v3`,key:`otl347`}],[`rect`,{x:`3`,y:`3`,width:`18`,height:`18`,rx:`2`,key:`h1oib`}],[`path`,{d:`M3 9h18`,key:`1pudct`}]]};o.node;var s=a(o),c={name:`droplets`,size:24,node:[[`path`,{d:`M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z`,key:`1ptgy4`}],[`path`,{d:`M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97`,key:`1sl1rz`}]]};c.node;var l=a(c),u={name:`flame`,size:24,node:[[`path`,{d:`M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4`,key:`1slcih`}]]};u.node;var d=a(u),f={name:`trending-down`,size:24,node:[[`path`,{d:`M16 17h6v-6`,key:`t6n2it`}],[`path`,{d:`m22 17-8.5-8.5-5 5L2 7`,key:`x473p`}]]};f.node;var p=a(f),m={name:`wallet`,size:24,node:[[`path`,{d:`M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1`,key:`18etb6`}],[`path`,{d:`M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4`,key:`xoc0q4`}]]};m.node;var h=a(m),g=e(t(),1),_=n(),v=[{id:`1`,label:`Use a reusable water bottle`,category:`Shopping`,saving:`-1.5 kg CO₂e`,completed:!0},{id:`2`,label:`Try a plant-based meal`,category:`Food`,saving:`-2.8 kg CO₂e`,completed:!0},{id:`3`,label:`Walk or cycle for short trips`,category:`Transport`,saving:`-4.2 kg CO₂e`,completed:!0},{id:`4`,label:`Avoid food waste`,category:`Food`,saving:`-3.0 kg CO₂e`,completed:!0},{id:`5`,label:`Use LED bulbs`,category:`Energy`,saving:`-1.8 kg CO₂e`,completed:!1},{id:`6`,label:`Choose second-hand`,category:`Shopping`,saving:`-2.2 kg CO₂e`,completed:!1},{id:`7`,label:`Take shorter showers`,category:`Home`,saving:`-2.0 kg CO₂e`,completed:!1}];function y(){let[e,t]=(0,g.useState)(v),[n,a]=(0,g.useState)(`plan`),o=e=>{t(t=>t.map(t=>t.id===e?{...t,completed:!t.completed}:t))},c=e.filter(e=>e.completed).length;return(0,_.jsxs)(`div`,{className:`routine-root`,children:[(0,_.jsxs)(`div`,{className:`routine-header`,children:[(0,_.jsx)(`h1`,{className:`routine-title`,children:`Your routine`}),(0,_.jsx)(`p`,{className:`routine-sub`,children:`Build simple habits for a stronger impact.`})]}),(0,_.jsxs)(`div`,{className:`routine-tabs`,children:[(0,_.jsx)(`button`,{type:`button`,className:`routine-tab ${n===`plan`?`is-active`:``}`,onClick:()=>a(`plan`),children:`7-day plan`}),(0,_.jsx)(`button`,{type:`button`,className:`routine-tab ${n===`swaps`?`is-active`:``}`,onClick:()=>a(`swaps`),children:`Your swaps`}),(0,_.jsx)(`button`,{type:`button`,className:`routine-tab ${n===`analytics`?`is-active`:``}`,onClick:()=>a(`analytics`),children:`Analytics`})]}),n===`plan`&&(0,_.jsxs)(`div`,{className:`routine-split`,children:[(0,_.jsxs)(`div`,{className:`routine-card routine-challenge-card`,children:[(0,_.jsxs)(`div`,{className:`challenge-card-header`,children:[(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`h2`,{className:`challenge-title`,children:`Your 7-day challenge`}),(0,_.jsx)(`p`,{className:`challenge-desc`,children:`Complete daily actions to build your sustainable routine.`})]}),(0,_.jsxs)(`span`,{className:`challenge-counter`,children:[c,`/7 completed`]})]}),(0,_.jsx)(`div`,{className:`routine-checklist`,children:e.map(e=>(0,_.jsxs)(`button`,{type:`button`,className:`checklist-item ${e.completed?`is-checked`:``}`,onClick:()=>o(e.id),children:[(0,_.jsx)(`div`,{className:`check-box`,children:e.completed&&(0,_.jsx)(r,{className:`h-3.5 w-3.5 stroke-[3]`})}),(0,_.jsx)(`span`,{className:`check-text`,children:e.label}),(0,_.jsx)(`span`,{className:`check-saving`,children:e.saving}),(0,_.jsx)(`span`,{className:`check-bookmark`,children:`🔖`})]},e.id))})]}),(0,_.jsxs)(`div`,{className:`routine-right-col`,children:[(0,_.jsxs)(`div`,{className:`routine-card tip-card`,children:[(0,_.jsxs)(`div`,{className:`tip-header`,children:[(0,_.jsx)(`span`,{className:`tip-title`,children:`Today's tip`}),(0,_.jsx)(`span`,{className:`tip-icon`,children:`💡`})]}),(0,_.jsxs)(`p`,{className:`tip-body`,children:[`Taking a 5 minute shorter shower can save up to `,(0,_.jsx)(`strong`,{children:`20 liters of water`}),` and reduce hot water heating emissions.`]})]}),(0,_.jsxs)(`div`,{className:`routine-card quote-card`,children:[(0,_.jsx)(`blockquote`,{className:`quote-text`,children:`“Progress, not perfection, leads to a cleaner planet.”`}),(0,_.jsx)(`div`,{className:`quote-leaf`,"aria-hidden":`true`,children:(0,_.jsxs)(`svg`,{width:`40`,height:`40`,viewBox:`0 0 40 40`,fill:`none`,children:[(0,_.jsx)(`path`,{d:`M10 30 C15 15 25 10 35 8 C30 20 22 28 10 30Z`,fill:`#123826`,opacity:`0.8`}),(0,_.jsx)(`path`,{d:`M12 28 L30 12`,stroke:`#4dd282`,strokeWidth:`1.5`})]})})]})]})]}),n===`swaps`&&(0,_.jsxs)(`div`,{className:`routine-card routine-swaps-view`,children:[(0,_.jsxs)(`div`,{className:`swaps-header-row`,children:[(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`h2`,{className:`challenge-title`,children:`Active Adopted Swaps`}),(0,_.jsx)(`p`,{className:`challenge-desc`,children:`Sustainable habits currently active in your household routine.`})]}),(0,_.jsx)(i,{to:`/catalogue`,className:`adopt-more-btn`,children:`Browse More Swaps →`})]}),(0,_.jsx)(`div`,{className:`swaps-list-grid`,children:[{title:`Metro commute for office workdays`,cat:`Transport`,co2:`-75 kg CO₂e / mo`,money:`Save ~₹3,200/mo`,status:`Adopted 3 weeks ago`,dot:`bg-emerald-600`},{title:`Eat plant-based weekday lunches`,cat:`Food`,co2:`-30 kg CO₂e / mo`,money:`Save ~₹1,100/mo`,status:`Adopted 2 weeks ago`,dot:`bg-emerald-600`},{title:`AC 24°C thermostat setpoint`,cat:`Energy`,co2:`-40 kg CO₂e / mo`,money:`Save ~₹680/mo`,status:`Adopted 1 month ago`,dot:`bg-emerald-600`},{title:`Cloth totes for market purchases`,cat:`Shopping`,co2:`-5 kg CO₂e / mo`,money:`Zero plastic waste`,status:`Adopted 2 months ago`,dot:`bg-emerald-600`}].map(e=>(0,_.jsxs)(`div`,{className:`adopted-swap-item`,children:[(0,_.jsxs)(`div`,{className:`adopted-item-left`,children:[(0,_.jsx)(`span`,{className:`adopted-status-tag`,children:e.status}),(0,_.jsx)(`h3`,{className:`adopted-item-title`,children:e.title}),(0,_.jsxs)(`div`,{className:`adopted-item-meta`,children:[(0,_.jsx)(`span`,{className:`adopted-cat`,children:e.cat}),(0,_.jsx)(`span`,{className:`dot-divider`,children:`·`}),(0,_.jsx)(`span`,{className:`adopted-money`,children:e.money})]})]}),(0,_.jsx)(`div`,{className:`adopted-item-right`,children:(0,_.jsx)(`span`,{className:`adopted-co2-pill`,children:e.co2})})]},e.title))})]}),n===`analytics`&&(0,_.jsxs)(`div`,{className:`routine-analytics-view`,children:[(0,_.jsxs)(`div`,{className:`analytics-kpi-grid`,children:[(0,_.jsxs)(`div`,{className:`routine-card kpi-card`,children:[(0,_.jsx)(`div`,{className:`kpi-icon-wrap bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300`,children:(0,_.jsx)(p,{className:`h-5 w-5`})}),(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`span`,{className:`kpi-label`,children:`MONTHLY CO₂E SAVED`}),(0,_.jsxs)(`strong`,{className:`kpi-value`,children:[`150.0 `,(0,_.jsx)(`span`,{children:`kg`})]}),(0,_.jsx)(`span`,{className:`kpi-sub`,children:`↑ 12% vs last month`})]})]}),(0,_.jsxs)(`div`,{className:`routine-card kpi-card`,children:[(0,_.jsx)(`div`,{className:`kpi-icon-wrap bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300`,children:(0,_.jsx)(h,{className:`h-5 w-5`})}),(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`span`,{className:`kpi-label`,children:`NET EXPENDITURE SAVINGS`}),(0,_.jsxs)(`strong`,{className:`kpi-value`,children:[`₹4,980 `,(0,_.jsx)(`span`,{children:`/ mo`})]}),(0,_.jsx)(`span`,{className:`kpi-sub`,children:`Fuel & electricity deltas`})]})]}),(0,_.jsxs)(`div`,{className:`routine-card kpi-card`,children:[(0,_.jsx)(`div`,{className:`kpi-icon-wrap bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300`,children:(0,_.jsx)(l,{className:`h-5 w-5`})}),(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`span`,{className:`kpi-label`,children:`WATER CONSERVED`}),(0,_.jsxs)(`strong`,{className:`kpi-value`,children:[`720 `,(0,_.jsx)(`span`,{children:`Litres`})]}),(0,_.jsx)(`span`,{className:`kpi-sub`,children:`Showers & tap aerators`})]})]}),(0,_.jsxs)(`div`,{className:`routine-card kpi-card`,children:[(0,_.jsx)(`div`,{className:`kpi-icon-wrap bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300`,children:(0,_.jsx)(d,{className:`h-5 w-5`})}),(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`span`,{className:`kpi-label`,children:`HABIT STREAK`}),(0,_.jsxs)(`strong`,{className:`kpi-value`,children:[`14 `,(0,_.jsx)(`span`,{children:`Days`})]}),(0,_.jsx)(`span`,{className:`kpi-sub`,children:`Current active streak 🔥`})]})]})]}),(0,_.jsxs)(`div`,{className:`analytics-charts-split`,children:[(0,_.jsxs)(`div`,{className:`routine-card chart-card`,children:[(0,_.jsxs)(`div`,{className:`chart-header`,children:[(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`h3`,{className:`chart-title`,children:`Weekly Carbon Reduction Trend`}),(0,_.jsx)(`p`,{className:`chart-sub`,children:`Kilograms of CO₂e avoided each week`})]}),(0,_.jsx)(`span`,{className:`chart-period-badge`,children:`Last 4 Weeks`})]}),(0,_.jsx)(`div`,{className:`weekly-bars-display`,children:[{week:`Week 1`,kg:28,height:`55%`},{week:`Week 2`,kg:34,height:`68%`},{week:`Week 3`,kg:41,height:`82%`},{week:`Week 4`,kg:47,height:`94%`}].map(e=>(0,_.jsxs)(`div`,{className:`weekly-bar-col`,children:[(0,_.jsxs)(`span`,{className:`bar-kg-label`,children:[e.kg,` kg`]}),(0,_.jsx)(`div`,{className:`bar-track`,children:(0,_.jsx)(`div`,{className:`bar-fill`,style:{height:e.height}})}),(0,_.jsx)(`span`,{className:`bar-week-label`,children:e.week})]},e.week))})]}),(0,_.jsxs)(`div`,{className:`routine-card breakdown-card`,children:[(0,_.jsx)(`h3`,{className:`chart-title`,children:`Impact by Category`}),(0,_.jsx)(`p`,{className:`chart-sub`,children:`Where your footprint savings come from`}),(0,_.jsx)(`div`,{className:`category-bars-list`,children:[{name:`Transport (Metro & Carpooling)`,pct:50,color:`#123826`,kg:`75 kg`},{name:`Energy (AC 24°C & LEDs)`,pct:27,color:`#2b7a4b`,kg:`40 kg`},{name:`Food (Plant-based meals)`,pct:20,color:`#a35a38`,kg:`30 kg`},{name:`Shopping & Waste (Totes & Compost)`,pct:3,color:`#848E86`,kg:`5 kg`}].map(e=>(0,_.jsxs)(`div`,{className:`cat-breakdown-row`,children:[(0,_.jsxs)(`div`,{className:`cat-breakdown-info`,children:[(0,_.jsx)(`span`,{className:`cat-name`,children:e.name}),(0,_.jsxs)(`strong`,{className:`cat-kg`,children:[e.kg,` (`,e.pct,`%)`]})]}),(0,_.jsx)(`div`,{className:`cat-progress-track`,children:(0,_.jsx)(`div`,{className:`cat-progress-fill`,style:{width:`${e.pct}%`,backgroundColor:e.color}})})]},e.name))}),(0,_.jsxs)(`div`,{className:`streak-bubble-row`,children:[(0,_.jsxs)(`span`,{className:`streak-bubble-title`,children:[(0,_.jsx)(s,{className:`h-3.5 w-3.5 inline mr-1`}),`Recent Daily Activity:`]}),(0,_.jsx)(`div`,{className:`streak-dots`,children:[`M`,`T`,`W`,`T`,`F`,`S`,`S`,`M`,`T`,`W`,`T`,`F`,`S`,`S`].map((e,t)=>(0,_.jsx)(`div`,{className:`streak-dot ${t<12?`is-complete`:`is-today`}`,title:`Day ${t+1} (${e})`,children:e},t))})]})]})]})]}),(0,_.jsx)(`style`,{children:`
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
        .checklist-item:hover { border-color: #123826; }
        .checklist-item.is-checked {
          background: rgba(18, 56, 38, 0.05);
          border-color: rgba(18, 56, 38, 0.3);
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
        .check-text {
          font-size: 0.85rem;
          color: var(--color-ink);
          font-weight: 500;
          flex: 1;
        }
        .check-saving {
          font-size: 0.72rem;
          color: #123826;
          font-weight: 600;
          background: rgba(18, 56, 38, 0.08);
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
        }
        .check-bookmark { font-size: 0.85rem; opacity: 0.35; }
        .checklist-item:hover .check-bookmark { opacity: 0.9; }

        .routine-right-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .tip-card { background: #FAF8F4; }
        .dark .tip-card { background: #152019; }
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
        .dark .quote-card { background: #131c16; }
        .quote-text {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.15rem;
          font-style: italic;
          color: #123826;
          line-height: 1.5;
          margin: 0 0 1rem;
        }
        .dark .quote-text { color: #4dd282; }

        /* ── Swaps Tab ── */
        .swaps-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.8rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .adopt-more-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1.15rem;
          background: #123826;
          color: #ffffff;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.15s;
        }
        .adopt-more-btn:hover { background: #1c4e36; }
        .swaps-list-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .adopted-swap-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.15rem 1.4rem;
          background: #FAF8F4;
          border: 1px solid #DFD7CA;
          border-radius: 12px;
          gap: 1rem;
        }
        .dark .adopted-swap-item {
          background: #152019;
          border-color: #24352b;
        }
        .adopted-status-tag {
          font-size: 0.65rem;
          color: #123826;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 0.2rem;
          display: block;
        }
        .dark .adopted-status-tag { color: #4dd282; }
        .adopted-item-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0 0 0.25rem;
        }
        .adopted-item-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--color-ink-muted);
        }
        .adopted-money { color: #8b5a2b; font-weight: 600; }
        .adopted-co2-pill {
          padding: 0.4rem 0.85rem;
          border-radius: 999px;
          background: rgba(18, 56, 38, 0.1);
          color: #123826;
          font-weight: 700;
          font-size: 0.82rem;
          white-space: nowrap;
        }
        .dark .adopted-co2-pill {
          background: rgba(62, 172, 106, 0.15);
          color: #3eac6a;
        }

        /* ── Analytics Tab ── */
        .analytics-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .kpi-card {
          padding: 1.4rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .kpi-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .kpi-label {
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          color: var(--color-ink-muted);
          display: block;
          margin-bottom: 0.2rem;
        }
        .kpi-value {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--color-ink);
          line-height: 1.1;
          display: block;
        }
        .kpi-value span { font-size: 0.8rem; font-family: 'DM Sans', sans-serif; font-weight: 500; }
        .kpi-sub { font-size: 0.68rem; color: #123826; font-weight: 600; display: block; margin-top: 0.15rem; }
        .dark .kpi-sub { color: #4dd282; }

        .analytics-charts-split {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 1.8rem;
        }
        .chart-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.6rem;
        }
        .chart-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0 0 0.25rem;
        }
        .chart-sub { font-size: 0.78rem; color: var(--color-ink-muted); margin: 0; }
        .chart-period-badge {
          font-size: 0.68rem;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.05);
          color: var(--color-ink-muted);
        }

        .weekly-bars-display {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 180px;
          padding-top: 1.5rem;
        }
        .weekly-bar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          height: 100%;
        }
        .bar-kg-label { font-size: 0.72rem; font-weight: 700; color: #123826; }
        .dark .bar-kg-label { color: #4dd282; }
        .bar-track {
          flex: 1;
          width: 38px;
          background: rgba(0, 0, 0, 0.04);
          border-radius: 8px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }
        .dark .bar-track { background: rgba(255, 255, 255, 0.04); }
        .bar-fill {
          width: 100%;
          background: linear-gradient(180deg, #4dd282 0%, #123826 100%);
          border-radius: 8px;
          transition: height 0.6s ease;
        }
        .bar-week-label { font-size: 0.72rem; color: var(--color-ink-muted); }

        .category-bars-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: 1.5rem 0 1.8rem;
        }
        .cat-breakdown-row {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .cat-breakdown-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
        }
        .cat-name { color: var(--color-ink); }
        .cat-kg { font-weight: 700; color: var(--color-ink); }
        .cat-progress-track {
          height: 7px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 99px;
          overflow: hidden;
        }
        .dark .cat-progress-track { background: rgba(255, 255, 255, 0.06); }
        .cat-progress-fill { height: 100%; border-radius: 99px; }

        .streak-bubble-row {
          border-top: 1px solid var(--color-border);
          padding-top: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .streak-bubble-title {
          font-size: 0.72rem;
          color: var(--color-ink-muted);
          font-weight: 600;
        }
        .streak-dots {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .streak-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
          color: #ffffff;
          background: #d4ccbf;
        }
        .streak-dot.is-complete { background: #123826; }
        .streak-dot.is-today { background: #4dd282; color: #0c130f; box-shadow: 0 0 0 2px rgba(77, 210, 130, 0.4); }

        @media (max-width: 900px) {
          .routine-split, .analytics-charts-split { grid-template-columns: 1fr; }
          .analytics-kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .analytics-kpi-grid { grid-template-columns: 1fr; }
          .routine-root { padding: 1.5rem 1.25rem; }
        }
      `})]})}export{y as LogActivityPage};