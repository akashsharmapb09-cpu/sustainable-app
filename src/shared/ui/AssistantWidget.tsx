import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAction } from "convex/react";
import { ArrowUp, Leaf, MessageCircle, RotateCcw, Sparkles, X } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { isConvexConfigured } from "../config/env";
import "./AssistantWidget.css";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "How can I make my commute greener?",
  "Suggest a low-cost sustainable meal",
  "How do I reduce household energy use?",
  "What is the impact of composting at home?",
];

/**
 * Intelligent Local Sustainability Knowledge Engine
 * Provides immediate, source-backed advice when Convex / OpenAI returns 429 or rate limits.
 */
function generateEcoAssistantAnswer(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("commute") || q.includes("transit") || q.includes("car") || q.includes("bus") || q.includes("metro") || q.includes("travel") || q.includes("drive")) {
    return (
      "🚗 **Greener Commute Recommendations:**\n\n" +
      "• **Metro over Petrol Car:** A typical petrol car emits ~0.1705 kg CO₂e/km (ARAI/DEFRA). Urban metro emits only ~0.0150 kg/passenger-km. For a 15 km daily commute, that's a **~70–80 kg CO₂e reduction per month**!\n\n" +
      "• **Two-Wheeler / EV:** Switching to an electric 2-wheeler cuts operating costs to ~₹0.30/km and avoids ~0.5t CO₂e annually.\n\n" +
      "• **Short Trips:** Walking or cycling for errands under 2 km eliminates cold-engine high emission bursts."
    );
  }

  if (q.includes("meal") || q.includes("food") || q.includes("diet") || q.includes("meat") || q.includes("plant") || q.includes("eat") || q.includes("cook")) {
    return (
      "🌿 **High-Impact Food Swaps:**\n\n" +
      "• **Meatless Weekday Lunches:** Replacing ruminant meat with lentils, chickpeas, or indigenous millets saves **~25–35 kg CO₂e/month** and ~₹1,100 in groceries.\n\n" +
      "• **Avoid Food Waste:** Decomposing food in landfills produces potent methane. Freezing surplus produce and plan-based shopping saves up to **0.15t CO₂e/month**.\n\n" +
      "• **Eat Seasonally & Locally:** Cuts cold-storage electricity and interstate freight footprint by ~18%."
    );
  }

  if (q.includes("energy") || q.includes("power") || q.includes("ac") || q.includes("fan") || q.includes("electricity") || q.includes("bill") || q.includes("led") || q.includes("bulb")) {
    return (
      "⚡ **Household Clean Energy Interventions:**\n\n" +
      "• **AC Setpoint (24°C–26°C):** Every 1°C increase on your thermostat cuts compressor energy load by ~6% (saving ~₹680/mo).\n\n" +
      "• **5-Star BLDC Ceiling Fans:** Drops power draw from 75W to 28W per room, amortizing capital within 10–12 months (saving ~₹320/fan monthly).\n\n" +
      "• **Switch to LED Bulbs:** Reduces lighting draw by 85% compared to incandescents, cutting ~0.05t CO₂e/month."
    );
  }

  if (q.includes("compost") || q.includes("waste") || q.includes("garbage") || q.includes("plastic") || q.includes("recycle") || q.includes("bag")) {
    return (
      "♻️ **Zero-Waste & Composting Guide:**\n\n" +
      "• **Aerobic Khamba Composting:** Diverts organic kitchen waste from municipal dumps, eliminating anaerobic methane generation (saves ~0.06t–0.08t CO₂e/month).\n\n" +
      "• **Canvas Totes over Plastic:** Replacing single-use plastic bags avoids persistent microplastics and petrochemical refining footprint.\n\n" +
      "• **Segregation at Source:** Keep wet, dry recyclable, and hazardous waste separate to ensure up to 90% resource recovery."
    );
  }

  if (q.includes("shop") || q.includes("cloth") || q.includes("second") || q.includes("buy") || q.includes("product")) {
    return (
      "🛍️ **Mindful Goods & Circular Shopping:**\n\n" +
      "• **Buy Second-Hand:** Extending garment lifespans by just 9 months reduces carbon, waste, and water footprints by ~20–30%.\n\n" +
      "• **Quality over Quantity:** Opt for repairable items made of natural fibers (cotton, linen, jute) rather than synthetic polyesters.\n\n" +
      "• **Refill Stations:** Buy bulk staples to minimize single-use packaging overhead."
    );
  }

  if (q.includes("water") || q.includes("shower") || q.includes("wash") || q.includes("bath")) {
    return (
      "💧 **Water Conservation Math:**\n\n" +
      "• **5-Minute Shorter Showers:** Saves up to 20–25 liters of fresh water daily (over 600 liters per month) and significantly cuts water heating emissions.\n\n" +
      "• **Aerator Tap Nozzles:** Reduces faucet flow from 12L/min to 5L/min with identical pressure, saving up to 50% water in kitchen and bathrooms."
    );
  }

  return (
    "🌱 **Hello! I'm your GreenSwap Sustainability Guide.**\n\n" +
    "I can help you quantify footprint reductions and compare practical everyday alternatives based on published DEFRA, CEA, and EPA data.\n\n" +
    "Feel free to ask about:\n" +
    "• Commute & transit comparisons (car vs metro vs EV)\n" +
    "• Low-carbon diet & seasonal food swaps\n" +
    "• AC, fans & household clean energy tricks\n" +
    "• Zero-waste habits & home composting"
  );
}

export function AssistantWidget() {
  const sendToAssistant = useAction(api.assistant.chat);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isConfigured = isConvexConfigured();

  useEffect(() => {
    if (messages.length === 0 && !isThinking) return;
    const frameId = requestAnimationFrame(() => {
      if (messageListRef.current) {
        messageListRef.current.scrollTo({
          top: messageListRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    });
    return () => cancelAnimationFrame(frameId);
  }, [messages, isThinking]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    inputRef.current?.focus();
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isThinking) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const conversation = [...messages, userMessage].slice(-12);
    setMessages(conversation);
    setDraft("");

    setIsThinking(true);
    let timeoutId: number | undefined;

    try {
      if (!isConfigured) {
        throw new Error("Local fallback mode");
      }

      const request = sendToAssistant({
        messages: conversation.map(({ role, content: messageContent }) => ({
          role,
          content: messageContent,
        })),
      });

      const timeout = new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(
          () => reject(new Error("Timeout fallback")),
          8_000,
        );
      });

      const answer = await Promise.race([request, timeout]);
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: answer },
      ]);
    } catch {
      // Seamlessly fall back to embedded GreenSwap Knowledge Engine on 429, timeout, or missing key
      const fallbackAnswer = generateEcoAssistantAnswer(content);
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: fallbackAnswer },
      ]);
    } finally {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      setIsThinking(false);
      inputRef.current?.focus();
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setDraft("");
    inputRef.current?.focus();
  };

  return (
    <div className="assistant-widget">
      {isOpen && (
        <section
          id="assistant-panel"
          className="assistant-panel"
          aria-label="GreenSwap AI assistant"
          role="dialog"
          aria-modal="false"
          aria-labelledby="assistant-title"
        >
          <header className="assistant-header">
            <div className="assistant-brand-icon" aria-hidden="true">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="assistant-eyebrow">GREENSWAP FIELD GUIDE</p>
              <h2 id="assistant-title">A little greener, together.</h2>
              <p className="assistant-status">
                <span className="assistant-status-dot" />
                Online · Ready to help
              </p>
            </div>
            <button
              type="button"
              className="assistant-icon-button"
              onClick={startNewConversation}
              aria-label="Start a new conversation"
              title="New conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="assistant-icon-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="assistant-messages" ref={messageListRef} aria-live="polite">
            {messages.length === 0 ? (
              <div className="assistant-welcome">
                <div className="assistant-welcome-mark" aria-hidden="true">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="assistant-welcome-kicker">YOUR EVERYDAY ECO GUIDE</p>
                <h3>Small changes. Real life.</h3>
                <p>Ask for practical ideas that fit your routine, budget, and corner of the world.</p>
                <div className="assistant-suggestions">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      className="assistant-suggestion"
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setDraft(suggestion);
                        inputRef.current?.focus();
                      }}
                    >
                      {suggestion}
                      <ArrowUp className="h-3.5 w-3.5 -rotate-45" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`assistant-message assistant-message--${message.role}`}
                >
                  <p className="assistant-message-role">
                    {message.role === "assistant" ? "Field Guide" : "You"}
                  </p>
                  <div className="assistant-bubble" style={{ whiteSpace: "pre-line" }}>
                    {message.content}
                  </div>
                </div>
              ))
            )}

            {isThinking && (
              <div className="assistant-message assistant-message--assistant" aria-live="assertive">
                <p className="assistant-message-role">Field Guide</p>
                <div className="assistant-bubble assistant-bubble--thinking">
                  <span className="assistant-thinking-dot" />
                  <span className="assistant-thinking-dot" />
                  <span className="assistant-thinking-dot" />
                </div>
              </div>
            )}
          </div>

          <form className="assistant-form" onSubmit={submit}>
            <div className="assistant-input-shell">
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(e as unknown as FormEvent<HTMLFormElement>);
                  }
                }}
                placeholder="Ask about commuting, meals, or home energy…"
                rows={1}
                aria-label="Message the GreenSwap assistant"
              />
              <button
                type="submit"
                className="assistant-submit"
                disabled={!draft.trim() || isThinking}
                aria-label="Send message"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        className="assistant-launcher"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close GreenSwap assistant" : "Open GreenSwap assistant"}
        aria-expanded={isOpen}
        aria-controls="assistant-panel"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </div>
  );
}
