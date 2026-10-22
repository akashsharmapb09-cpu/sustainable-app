import { PublicFooter, PublicMasthead } from './PublicMasthead';
import { useReveal } from '../../shared/lib/hooks/useReveal';
import { Link } from 'react-router-dom';

export function AboutPage() {
  useReveal();
  return (
    <div className="min-h-screen bg-background text-foreground" style={{fontFamily:"'DM Sans',sans-serif"}}>
      <PublicMasthead />
      <main>
        {/* Hero */}
        <section style={{
          background:'linear-gradient(135deg,#E8F0E9 0%,#F5F0E8 60%,#EFF0E6 100%)',
          padding:'6rem 2rem 5rem', textAlign:'center', position:'relative', overflow:'hidden'
        }}>
          <div style={{position:'absolute',top:'-80px',left:'50%',transform:'translateX(-50%)',
            width:'500px',height:'300px',borderRadius:'50%',
            background:'radial-gradient(circle,rgba(51,89,58,0.1),transparent 70%)',
            filter:'blur(40px)',pointerEvents:'none'}} aria-hidden="true"/>
          <span className="gs-tag" data-reveal style={{display:'inline-flex',marginBottom:'1.5rem'}}>🌿 About GreenSwap</span>
          <h1 data-reveal style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:'clamp(2.5rem,5vw,4rem)',
            fontWeight:700,color:'#1B211E',letterSpacing:'-0.03em',lineHeight:1.1,
            maxWidth:'14ch',margin:'0 auto 1.5rem',transitionDelay:'0.08s'}}>
            A field guide,<br/>not a sermon.
          </h1>
          <p data-reveal style={{fontSize:'1.05rem',color:'#535C55',maxWidth:'50ch',
            margin:'0 auto 2.5rem',lineHeight:1.7,transitionDelay:'0.16s'}}>
            GreenSwap ranks household alternatives with published emission factors, explicit
            uncertainty ranges, and real cost deltas — no black boxes, no guilt.
          </p>
          <div data-reveal style={{display:'flex',justifyContent:'center',gap:'1rem',flexWrap:'wrap',transitionDelay:'0.24s'}}>
            <Link to="/onboarding" style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',
              padding:'0.85rem 1.8rem',background:'#1B2B1F',color:'#F5F0E8',borderRadius:'999px',
              fontWeight:600,textDecoration:'none',fontSize:'0.9rem',
              transition:'background 0.2s,transform 0.2s',overflow:'hidden'}}
              className="gs-shine btn-pulse">
              Get Started →
            </Link>
            <Link to="/methodology" style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',
              padding:'0.85rem 1.8rem',background:'transparent',color:'#1B211E',
              border:'1.5px solid #C5BCAD',borderRadius:'999px',fontWeight:600,
              textDecoration:'none',fontSize:'0.9rem',transition:'all 0.2s'}}
              className="hover-glow">
              Our Methodology →
            </Link>
          </div>
        </section>

        {/* Stats */}
        <div style={{background:'#1B2B1F',display:'grid',gridTemplateColumns:'repeat(3,1fr)'}}>
          {[['3', 'Trusted data sources'],['100+','Eco swaps catalogued'],['±12%','Uncertainty bounds shown']].map(([v,l],i) => (
            <div key={l} className={`stagger-${i+1}`} data-reveal="scale"
              style={{padding:'2.5rem 2rem',borderRight:'1px solid rgba(255,255,255,0.08)',
                display:'flex',flexDirection:'column',gap:'0.4rem',
                transition:'background 0.25s',cursor:'default'}}
              onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.04)')}
              onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
            >
              <strong style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:'2.2rem',
                fontWeight:700,color:'#c8dfca'}}>{v}</strong>
              <span style={{fontSize:'0.78rem',color:'rgba(200,223,202,0.6)'}}>{l}</span>
            </div>
          ))}
        </div>

        {/* Values */}
        <section style={{maxWidth:1100,margin:'0 auto',padding:'7rem 2rem'}}>
          <p className="lp-eyebrow" data-reveal>OUR PRINCIPLES</p>
          <h2 data-reveal style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:'clamp(1.8rem,3.5vw,2.6rem)',
            fontWeight:700,color:'#1B211E',letterSpacing:'-0.02em',margin:'0 0 3rem',transitionDelay:'0.08s'}}>
            How GreenSwap is different
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'1.5rem'}}>
            {[
              { emoji:'📊', title:'No Fake Point Estimates', body:'Every carbon and cost figure is shown as an honest range [low – high]. Pretending otherwise is greenwashing.' },
              { emoji:'🗂️', title:'Grid-Calibrated Math', body:'EV charging on the Indian grid (0.716 kg CO₂e/kWh) ≠ Europe. We use local CEA data, not global averages.' },
              { emoji:'🔬', title:'Open Formula Ranking', body:'No black-box ML. Every suggestion shows its top 2 scoring factors and links to scientific source citations.' },
              { emoji:'🇮🇳', title:'India-First Design', body:'Built for Indian households with local prices, ARAI emission factors, and DMRC benchmarks by default.' },
              { emoji:'⚖️', title:'Balanced Trade-offs', body:'We show both the savings and the upfront costs — so you can make an informed decision, not just feel good.' },
              { emoji:'🔒', title:'Privacy by Design', body:'Your activity data stays on your device or in your private account. We never sell data or serve ads.' },
            ].map(({ emoji, title, body }, i) => (
              <div key={title} className={`glass-card gs-shine hover-lift stagger-${Math.min(i+1,6)}`}
                data-reveal="scale"
                style={{padding:'1.75rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                <span style={{fontSize:'2rem'}}>{emoji}</span>
                <h3 style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:'1.1rem',
                  fontWeight:600,color:'#1B211E',margin:0}}>{title}</h3>
                <p style={{fontSize:'0.85rem',color:'#535C55',lineHeight:1.65,margin:0}}>{body}</p>
              </div>
            ))}
          </div>
        </section>
        <section style={{background:'#F0EAE1',padding:'6rem 2rem',textAlign:'center',
          borderTop:'1px solid #DFD7CA',borderBottom:'1px solid #DFD7CA'}}>
          <p className="lp-eyebrow lp-eyebrow--center" data-reveal>THE TEAM</p>
          <h2 data-reveal style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:'clamp(1.8rem,3.5vw,2.4rem)',
            fontWeight:700,color:'#1B211E',margin:'0 0 3rem',letterSpacing:'-0.02em',transitionDelay:'0.08s'}}>
            Built with care
          </h2>
          <div style={{display:'flex',justifyContent:'center',gap:'2rem',flexWrap:'wrap'}}>
            {[['A','Akash Sharma','Lead Engineer'],['R','Ridhima Sambyal','Design & UX'],['S','Suhani','Research & Data']].map(([initial,name,role],i) => (
              <div key={name} className={`glass-card hover-lift stagger-${i+1}`} data-reveal="scale"
                style={{padding:'2rem 2.5rem',display:'flex',flexDirection:'column',alignItems:'center',gap:'1rem',minWidth:'180px'}}>
                <div style={{width:64,height:64,borderRadius:'50%',
                  background:`linear-gradient(135deg,#33593A,#4C7D55)`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  color:'#fff',fontSize:'1.5rem',fontWeight:700,
                  boxShadow:'0 8px 24px rgba(51,89,58,0.3)'}}>
                  {initial}
                </div>
                <div>
                  <strong style={{display:'block',fontSize:'0.95rem',color:'#1B211E',fontWeight:700}}>{name}</strong>
                  <span style={{fontSize:'0.75rem',color:'#848E86'}}>{role}</span>
                </div>
              </div>
            ))}
          </div>
          <div data-reveal style={{ marginTop: '2.5rem' }}>
            <Link
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 2rem',
                background: '#1B2B1F',
                color: '#F5F0E8',
                borderRadius: '999px',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'background 0.2s, transform 0.2s',
              }}
              className="gs-shine btn-pulse"
            >
              Get in Touch with the Team →
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
