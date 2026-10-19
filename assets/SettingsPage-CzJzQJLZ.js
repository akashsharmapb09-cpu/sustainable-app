import{i as e,n as t,t as n}from"./jsx-runtime-Dk72oS4N.js";var r=e(t(),1),i=n();function a(){let[e,t]=(0,r.useState)(`profile`),[n,a]=(0,r.useState)(`Akash Sharma`),[o]=(0,r.useState)(`akash@example.com`),[s,c]=(0,r.useState)(`India`),[l,u]=(0,r.useState)([`Sustainability`,`Clean Energy`,`Healthy Living`]),[d,f]=(0,r.useState)(!1),p=[`Sustainability`,`Clean Energy`,`Healthy Living`,`Zero Waste`,`Plant Diet`,`E-Mobility`],m=e=>{u(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e])};return(0,i.jsxs)(`div`,{className:`settings-root`,children:[(0,i.jsxs)(`div`,{className:`settings-header`,children:[(0,i.jsx)(`h1`,{className:`settings-title`,children:`Profile & Settings`}),(0,i.jsx)(`p`,{className:`settings-sub`,children:`Manage your account and preferences.`})]}),(0,i.jsx)(`div`,{className:`settings-tabs`,children:[`profile`,`preferences`,`notifications`,`privacy`].map(n=>(0,i.jsx)(`button`,{type:`button`,className:`settings-tab ${e===n?`is-active`:``}`,onClick:()=>t(n),children:n.charAt(0).toUpperCase()+n.slice(1)},n))}),(0,i.jsxs)(`div`,{className:`settings-card`,children:[(0,i.jsxs)(`div`,{className:`settings-user-row`,children:[(0,i.jsx)(`div`,{className:`user-avatar-circle`,children:`A`}),(0,i.jsxs)(`div`,{className:`user-meta`,children:[(0,i.jsx)(`strong`,{className:`user-name`,children:n}),(0,i.jsx)(`span`,{className:`user-email`,children:o})]}),(0,i.jsx)(`button`,{type:`button`,className:`user-edit-btn`,children:`Edit`})]}),(0,i.jsxs)(`form`,{onSubmit:e=>{e.preventDefault(),f(!0),setTimeout(()=>f(!1),2500)},className:`settings-form`,children:[(0,i.jsxs)(`div`,{className:`form-field`,children:[(0,i.jsx)(`label`,{className:`form-label`,htmlFor:`user-name-input`,children:`Name`}),(0,i.jsx)(`input`,{id:`user-name-input`,type:`text`,className:`form-input`,value:n,onChange:e=>a(e.target.value)})]}),(0,i.jsxs)(`div`,{className:`form-field`,children:[(0,i.jsx)(`label`,{className:`form-label`,htmlFor:`user-email-input`,children:`Email`}),(0,i.jsx)(`input`,{id:`user-email-input`,type:`email`,className:`form-input`,value:o,readOnly:!0})]}),(0,i.jsxs)(`div`,{className:`form-field`,children:[(0,i.jsx)(`label`,{className:`form-label`,htmlFor:`user-location-select`,children:`Location`}),(0,i.jsxs)(`select`,{id:`user-location-select`,className:`form-select`,value:s,onChange:e=>c(e.target.value),children:[(0,i.jsx)(`option`,{value:`India`,children:`India`}),(0,i.jsx)(`option`,{value:`United Kingdom`,children:`United Kingdom`}),(0,i.jsx)(`option`,{value:`United States`,children:`United States`}),(0,i.jsx)(`option`,{value:`Global`,children:`Global / Other`})]})]}),(0,i.jsxs)(`div`,{className:`form-field`,children:[(0,i.jsx)(`label`,{className:`form-label`,children:`Interests`}),(0,i.jsx)(`div`,{className:`interest-tags-grid`,children:p.map(e=>{let t=l.includes(e);return(0,i.jsx)(`button`,{type:`button`,className:`tag-pill ${t?`is-selected`:``}`,onClick:()=>m(e),children:e},e)})})]}),(0,i.jsx)(`div`,{className:`form-actions`,children:(0,i.jsx)(`button`,{type:`submit`,className:`save-settings-btn`,children:d?`Saved Successfully ✓`:`Save Changes`})})]})]}),(0,i.jsx)(`style`,{children:`
        .settings-root {
          max-width: 820px;
          margin: 0 auto;
          padding: 2.2rem 2.5rem 4rem;
          font-family: 'DM Sans', sans-serif;
          color: var(--color-ink);
        }
        .settings-header {
          margin-bottom: 1.5rem;
        }
        .settings-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--color-ink);
          letter-spacing: -0.02em;
          margin: 0 0 0.35rem;
        }
        .settings-sub {
          font-size: 0.9rem;
          color: var(--color-ink-muted);
          margin: 0;
        }

        .settings-tabs {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 2rem;
        }
        .settings-tab {
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
        .dark .settings-tab {
          background: #141c17;
          border-color: #24352b;
        }
        .settings-tab:hover {
          border-color: #123826;
          color: var(--color-ink);
        }
        .settings-tab.is-active {
          background: #123826;
          border-color: #123826;
          color: #ffffff;
          font-weight: 600;
        }
        .dark .settings-tab.is-active {
          background: #3eac6a;
          border-color: #3eac6a;
          color: #0c130f;
        }

        .settings-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 2.2rem 2.5rem;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.04);
        }

        .settings-user-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding-bottom: 1.8rem;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 2rem;
        }
        .user-avatar-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #d6e8dc;
          color: #123826;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .dark .user-avatar-circle {
          background: #1e3828;
          color: #4dd282;
        }
        .user-meta {
          flex: 1;
        }
        .user-name {
          display: block;
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-ink);
        }
        .user-email {
          font-size: 0.82rem;
          color: var(--color-ink-muted);
        }
        .user-edit-btn {
          padding: 0.45rem 1.1rem;
          border-radius: 999px;
          border: 1px solid var(--color-border);
          background: #FAF8F4;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-ink);
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .user-edit-btn:hover {
          border-color: #123826;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-ink-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-input, .form-select {
          padding: 0.7rem 1rem;
          border-radius: 10px;
          border: 1.5px solid #DFD7CA;
          background: #FAF8F4;
          color: var(--color-ink);
          font-size: 0.88rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .dark .form-input, .dark .form-select {
          background: #141c17;
          border-color: #24352b;
        }
        .form-input:focus, .form-select:focus {
          border-color: #123826;
        }

        .interest-tags-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-top: 0.25rem;
        }
        .tag-pill {
          padding: 0.45rem 1rem;
          border-radius: 999px;
          border: 1.5px solid #DFD7CA;
          background: #FAF8F4;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--color-ink-muted);
          cursor: pointer;
          transition: all 0.15s;
        }
        .dark .tag-pill {
          background: #141c17;
          border-color: #24352b;
        }
        .tag-pill:hover {
          border-color: #123826;
          color: var(--color-ink);
        }
        .tag-pill.is-selected {
          background: rgba(18, 56, 38, 0.1);
          border-color: #123826;
          color: #123826;
          font-weight: 700;
        }
        .dark .tag-pill.is-selected {
          background: rgba(62, 172, 106, 0.15);
          border-color: #3eac6a;
          color: #3eac6a;
        }

        .form-actions {
          margin-top: 1rem;
          text-align: right;
        }
        .save-settings-btn {
          padding: 0.75rem 1.8rem;
          background: #123826;
          color: #ffffff;
          border-radius: 999px;
          border: none;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .save-settings-btn:hover {
          background: #1c4e36;
          transform: translateY(-1px);
        }
      `})]})}export{a as SettingsPage};