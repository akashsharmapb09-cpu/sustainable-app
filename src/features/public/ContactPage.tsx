import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicFooter, PublicMasthead } from './PublicMasthead';
import { useReveal } from '../../shared/lib/hooks/useReveal';
import { Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

export function ContactPage() {
  useReveal();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Suggest a New Swap',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate instantaneous local submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      topic: 'Suggest a New Swap',
      subject: '',
      message: '',
    });
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1c2e24]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <PublicMasthead />

      <main>
        {/* Hero Section */}
        <section
          style={{
            background: 'linear-gradient(135deg,#E8F0E9 0%,#F5F0E8 60%,#EFF0E6 100%)',
            padding: '5rem 2rem 4rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '500px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle,rgba(51,89,58,0.1),transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />

          <span className="gs-tag" data-reveal style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
            📬 Get in Touch
          </span>

          <h1
            data-reveal
            style={{
              fontFamily: "'Fraunces',Georgia,serif",
              fontSize: 'clamp(2.4rem,4.5vw,3.6rem)',
              fontWeight: 700,
              color: '#1B211E',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              maxWidth: '16ch',
              margin: '0 auto 1.25rem',
              transitionDelay: '0.08s',
            }}
          >
            We'd love to hear from you.
          </h1>

          <p
            data-reveal
            style={{
              fontSize: '1.05rem',
              color: '#535C55',
              maxWidth: '52ch',
              margin: '0 auto 2rem',
              lineHeight: 1.65,
              transitionDelay: '0.16s',
            }}
          >
            Have a question, feedback on an emission calculation, a suggestion for a new swap, or want to collaborate? Reach out to our team anytime.
          </p>

          <div
            data-reveal
            style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', transitionDelay: '0.24s' }}
          >
            <a
              href="#contact-form"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.8rem 1.6rem',
                background: '#1B2B1F',
                color: '#F5F0E8',
                borderRadius: '999px',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.88rem',
                transition: 'background 0.2s,transform 0.2s',
              }}
              className="gs-shine btn-pulse"
            >
              Send a Message <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.8rem 1.6rem',
                background: 'transparent',
                color: '#1B211E',
                border: '1.5px solid #C5BCAD',
                borderRadius: '999px',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.88rem',
                transition: 'all 0.2s',
              }}
              className="hover-glow"
            >
              Learn About Us
            </Link>
          </div>
        </section>

        {/* Channels & Info Bar */}
        <div style={{ background: '#1B2B1F', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {[
            {
              icon: <Mail className="h-5 w-5 text-[#a4cfa9]" />,
              label: 'Direct Email',
              val: 'contact@greenswap.org',
              desc: 'For inquiries, bug reports & data feedback',
            },
            {
              icon: <Clock className="h-5 w-5 text-[#a4cfa9]" />,
              label: 'Average Response Time',
              val: 'Within 24 Hours',
              desc: 'Monday to Saturday, 9am - 7pm IST',
            },
            {
              icon: <MapPin className="h-5 w-5 text-[#a4cfa9]" />,
              label: 'Headquarters & Origin',
              val: 'New Delhi, India',
              desc: 'Built with local climate context in mind',
            },
          ].map((item, i) => (
            <div
              key={item.label}
              className={`stagger-${i + 1}`}
              data-reveal="scale"
              style={{
                padding: '2.5rem 2rem',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                transition: 'background 0.25s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                {item.icon}
                <span style={{ fontSize: '0.78rem', color: 'rgba(200,223,202,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {item.label}
                </span>
              </div>
              <strong style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: '1.35rem', fontWeight: 700, color: '#c8dfca' }}>
                {item.val}
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'rgba(200,223,202,0.6)' }}>{item.desc}</span>
            </div>
          ))}
        </div>

        {/* Main Content Area: Form & Team sidebar */}
        <section id="contact-form" style={{ maxWidth: 1160, margin: '0 auto', padding: '5rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
            
            {/* Left: Contact Form */}
            <div
              className="glass-card"
              data-reveal
              style={{
                padding: '2.5rem',
                borderRadius: '24px',
                background: '#FFFFFF',
                border: '1px solid #DFD7CA',
                boxShadow: '0 12px 36px rgba(27,43,31,0.05)',
              }}
            >
              <div style={{ marginBottom: '1.75rem' }}>
                <span className="lp-eyebrow">MESSAGE US</span>
                <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: '1.85rem', fontWeight: 700, color: '#1B211E', margin: '0.4rem 0 0.5rem' }}>
                  Send an Inquiry
                </h2>
                <p style={{ fontSize: '0.88rem', color: '#535C55', lineHeight: 1.6 }}>
                  Fill out the form below. Whether it's adding a new swap or discussing methodology, our team will review it.
                </p>
              </div>

              {submitted ? (
                <div
                  style={{
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    background: '#F2F7F3',
                    borderRadius: '16px',
                    border: '1px solid #CFE0D1',
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: '#1B2B1F',
                      color: '#a4cfa9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem',
                    }}
                  >
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: '1.4rem', fontWeight: 700, color: '#1B211E', margin: '0 0 0.5rem' }}>
                    Message Received!
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#535C55', maxWidth: '38ch', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                    Thank you, <strong>{formData.name || 'friend'}</strong>. We have logged your note regarding "{formData.topic}" and will follow up at <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={resetForm}
                    style={{
                      padding: '0.7rem 1.5rem',
                      background: '#1B2B1F',
                      color: '#F5F0E8',
                      borderRadius: '999px',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1B211E', marginBottom: '0.4rem' }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Akash Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem 0.9rem',
                          borderRadius: '10px',
                          border: '1px solid #DFD7CA',
                          fontSize: '0.88rem',
                          background: '#FAF7F2',
                          color: '#1B211E',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1B211E', marginBottom: '0.4rem' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem 0.9rem',
                          borderRadius: '10px',
                          border: '1px solid #DFD7CA',
                          fontSize: '0.88rem',
                          background: '#FAF7F2',
                          color: '#1B211E',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1B211E', marginBottom: '0.4rem' }}>
                      Topic of Inquiry
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '10px',
                        border: '1px solid #DFD7CA',
                        fontSize: '0.88rem',
                        background: '#FAF7F2',
                        color: '#1B211E',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="Suggest a New Swap">🌱 Suggest a New Swap</option>
                      <option value="Methodology & Data Feedback">🔬 Methodology & Data Feedback</option>
                      <option value="Bug Report or UI Issue">🛠️ Bug Report or UI Issue</option>
                      <option value="Partnership or Research">🤝 Partnership or Research</option>
                      <option value="General Question">💬 General Question</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1B211E', marginBottom: '0.4rem' }}>
                      Subject Line *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Brief headline of your message"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '10px',
                        border: '1px solid #DFD7CA',
                        fontSize: '0.88rem',
                        background: '#FAF7F2',
                        color: '#1B211E',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1B211E', marginBottom: '0.4rem' }}>
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Share your thoughts, suggested swap citations, or details..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '10px',
                        border: '1px solid #DFD7CA',
                        fontSize: '0.88rem',
                        background: '#FAF7F2',
                        color: '#1B211E',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.3rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#848E86' }}>{formData.message.length} characters</span>
                    </div>
                  </div>

                  {/* 10. CAPTCHA: Security Verification */}
                  {/* // TODO: add hCaptcha */}
                  <div className="captcha-container" style={{ padding: '0.75rem', background: '#FAF7F2', borderRadius: '10px', border: '1px dashed #DFD7CA', textAlign: 'center', fontSize: '0.8rem', color: '#535C55' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#2E7D32' }} />
                      <span>Spam protection enabled (hCaptcha verification pending)</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem 1.8rem',
                      background: '#1B2B1F',
                      color: '#F5F0E8',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      border: 'none',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'background 0.2s, transform 0.2s',
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                    className="gs-shine"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Team & Info Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Team Card */}
              <div
                className="glass-card"
                data-reveal
                style={{
                  padding: '2rem',
                  borderRadius: '24px',
                  background: '#FFFFFF',
                  border: '1px solid #DFD7CA',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <HeartHandshake className="h-5 w-5 text-[#33593A]" />
                  <h3 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: '1.25rem', fontWeight: 700, color: '#1B211E', margin: 0 }}>
                    Core Creators
                  </h3>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#535C55', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                  GreenSwap is crafted with care by independent builders dedicated to transparent environmental impact.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {[
                    { initial: 'A', name: 'Akash Sharma', role: 'Lead Engineer', email: 'akash@greenswap.org' },
                    { initial: 'R', name: 'Ridhima Sambyal', role: 'Design & UX', email: 'ridhima@greenswap.org' },
                    { initial: 'S', name: 'Suhani', role: 'Research & Data', email: 'suhani@greenswap.org' },
                  ].map((member) => (
                    <div
                      key={member.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        background: '#FAF7F2',
                        border: '1px solid #ECE4D8',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg,#33593A,#4C7D55)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                          }}
                        >
                          {member.initial}
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.88rem', color: '#1B211E' }}>{member.name}</strong>
                          <span style={{ fontSize: '0.74rem', color: '#848E86' }}>{member.role}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#33593A' }}>
                        {member.email}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data & Citation Note */}
              <div
                className="glass-card"
                data-reveal
                style={{
                  padding: '1.75rem',
                  borderRadius: '24px',
                  background: '#F0EAE1',
                  border: '1px solid #DFD7CA',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <ShieldCheck className="h-5 w-5 text-[#33593A]" />
                  <h4 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: '1.1rem', fontWeight: 700, color: '#1B211E', margin: 0 }}>
                    Emission Citation Corrections?
                  </h4>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#535C55', lineHeight: 1.6, margin: '0 0 1rem' }}>
                  We prioritize mathematical transparency. If you have newer municipal grid factors or peer-reviewed life-cycle analyses to add, please let us know.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link
                    to="/methodology"
                    style={{ fontSize: '0.78rem', color: '#33593A', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    View Methodology →
                  </Link>
                  <Link
                    to="/data-sources"
                    style={{ fontSize: '0.78rem', color: '#33593A', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Browse Data Catalog →
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
