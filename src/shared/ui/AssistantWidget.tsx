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
];

function getErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("OPENAI_API_KEY")) {
    return "The assistant is almost ready. Add OPENAI_API_KEY to your Convex deployment settings.";
  }
  if (message.includes("Failed to fetch") || message.includes("WebSocket")) {
    return "I couldn't reach the assistant service. Check that the Convex deployment is online and try again.";
  }
  return message || "I couldn't get an answer just now. Please try again.";
}

export function AssistantWidget() {
  const sendToAssistant = useAction(api.assistant.chat);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isConfigured = isConvexConfigured();

  useEffect(() => {
    if (messages.length === 0 && !isThinking) return;
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
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
    setError(null);

    if (!isConfigured) {
      setError("Connect a Convex Cloud deployment to enable the AI assistant.");
      return;
    }

    setIsThinking(true);
    let timeoutId: number | undefined;
    try {
      const request = sendToAssistant({
        messages: conversation.map(({ role, content: messageContent }) => ({
          role,
          content: messageContent,
        })),
      });
      const timeout = new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(
          () => reject(new Error("The assistant is taking too long to respond. Check your connection and try again.")),
          20_000,
        );
      });
      const answer = await Promise.race([request, timeout]);
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: answer },
      ]);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      setIsThinking(false);
      inputRef.current?.focus();
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setError(null);
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
                <span className={`assistant-status-dot${isConfigured ? "" : " is-offline"}`} />
                {isConfigured ? "Backend URL set" : "Setup required"}
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
              <div className="assistant-thread">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`assistant-message assistant-message--${message.role}`}
                  >
                    {message.role === "assistant" && (
                      <span className="assistant-message-mark" aria-hidden="true">
                        <Leaf className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <p>{message.content}</p>
                  </div>
                ))}
                {isThinking && (
                  <div className="assistant-message assistant-message--assistant assistant-typing" role="status">
                    <span className="assistant-message-mark" aria-hidden="true">
                      <Leaf className="h-3.5 w-3.5" />
                    </span>
                    <span className="assistant-typing-dots" aria-label="Thinking">
                      <i /><i /><i />
                    </span>
                  </div>
                )}
                {error && <p className="assistant-error" role="alert">{error}</p>}
              </div>
            )}
          </div>

          <form className="assistant-composer" onSubmit={(event) => void submit(event)}>
            <label className="sr-only" htmlFor="assistant-message">Ask the GreenSwap assistant</label>
            <textarea
              ref={inputRef}
              id="assistant-message"
              rows={1}
              maxLength={2_000}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Ask for a practical idea..."
              disabled={isThinking}
            />
            <button
              type="submit"
              className="assistant-send-button"
              disabled={!draft.trim() || isThinking}
              aria-label="Send message"
            >
              {isThinking
                ? <span className="assistant-send-spinner" aria-hidden="true" />
                : <ArrowUp className="h-4 w-4" />}
            </button>
            <p className="assistant-composer-note">Powered by OpenAI · Avoid sharing personal details.</p>
          </form>
        </section>
      )}

      <button
        type="button"
        className={`assistant-launcher${isOpen ? " is-open" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close GreenSwap assistant" : "Open GreenSwap assistant"}
        aria-expanded={isOpen}
        aria-controls="assistant-panel"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        {!isOpen && <span>Ask GreenSwap</span>}
      </button>
    </div>
  );
}
