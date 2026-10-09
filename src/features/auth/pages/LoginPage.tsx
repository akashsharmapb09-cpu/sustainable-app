import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Masthead */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <span className="font-serif text-3xl font-bold tracking-tight text-foreground">
              GreenSwap<span className="text-burnt">.</span>
            </span>
          </Link>
          <p className="mt-2 text-sm text-ink-muted font-sans">
            Your sustainable lifestyle field guide.
          </p>
        </div>

        <div className="border border-border bg-surface p-8 rounded">
          <div className="border-b border-border pb-4 mb-6">
            <p className="taxonomy-label mb-1">FIELD OPERATOR — SIGN IN</p>
            <h1 className="font-serif text-2xl font-semibold text-foreground">
              Welcome back.
            </h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
