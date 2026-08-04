import { useEffect, useRef, useState } from 'react';
import { ClerkProvider, Show, SignIn, SignUp, useClerk, useSignIn } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Redirect, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ShopProvider } from '@/context/shop-context';
import Home from '@/pages/home';
import Shop from '@/pages/shop';
import ProductDetail from '@/pages/product-detail';
import Cart from '@/pages/cart';
import Checkout from '@/pages/checkout';
import Account from '@/pages/account';
import Admin from '@/pages/admin';
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

function stripBase(path: string) {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

function SignInScreen({ path, signUpUrl }: { path: string; signUpUrl: string }) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10">
      <SignIn
        routing="path"
        path={path}
        signUpUrl={signUpUrl}
        fallbackRedirectUrl={`${basePath}/account`}
      />
    </div>
  );
}

function SignUpScreen({ path, signInUrl }: { path: string; signInUrl: string }) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10">
      <SignUp
        routing="path"
        path={path}
        signInUrl={signInUrl}
        fallbackRedirectUrl={`${basePath}/account`}
      />
    </div>
  );
}

function PasswordLoginScreen() {
  const { signIn, fetchStatus } = useSignIn();
  const { setActive } = useClerk();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setErrorMessage('Enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Enter your password.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await signIn.create({
        identifier: normalizedEmail,
        password,
      });

      if (result.error) {
        setErrorMessage(result.error.longMessage || result.error.message);
        return;
      }

      if (signIn.status === 'complete' && signIn.createdSessionId) {
        await setActive({ session: signIn.createdSessionId });
        setLocation('/account');
        return;
      }

      setErrorMessage(
        signIn.status === 'needs_second_factor'
          ? 'Additional verification is required to finish signing in. Please use the secure sign-in flow.'
          : 'We could not complete sign-in. Please check your details and try again.',
      );
    } catch (error: unknown) {
      const clerkError = error as {
        errors?: Array<{ longMessage?: string; message?: string }>;
      };
      setErrorMessage(
        clerkError.errors?.[0]?.longMessage ||
        clerkError.errors?.[0]?.message ||
        'We could not sign you in. Check your email and password and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-[440px] overflow-hidden rounded-[10px] border border-[#323D39] bg-[#1A2525] shadow-2xl">
        <div className="px-6 pb-7 pt-8 sm:px-10">
          <Link href="/" className="mx-auto mb-6 flex w-fit items-center gap-2">
            <img src={`${basePath}/logo.svg`} alt="Game Galaria" className="h-8 w-auto" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#C2C7AC]">Welcome back</h1>
            <p className="mt-2 text-sm text-[#959372]">Log in to access your Game Galaria account</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-medium text-[#C2C7AC]">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666F50]" />
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email address"
                  className="h-11 border-[#323D39] bg-[#1E2A26] pl-10 text-[#C2C7AC] placeholder:text-[#959372]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="login-password" className="text-sm font-medium text-[#C2C7AC]">Password</label>
                <Link href="/sign-in" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666F50]" />
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-11 border-[#323D39] bg-[#1E2A26] pl-10 pr-11 text-[#C2C7AC] placeholder:text-[#959372]"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666F50] hover:text-[#C2C7AC]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p role="alert" className="rounded-lg border border-[#959372]/50 bg-[#959372]/10 px-3 py-2 text-sm text-[#C2C7AC]">
                {errorMessage}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting || fetchStatus === 'fetching'} className="h-11 w-full gap-2 font-semibold">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Log in <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#959372]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">Create account</Link>
          </p>
        </div>
        <div className="border-t border-[#323D39] px-6 py-4 text-center text-xs text-[#959372]">
          Your password is sent securely to Clerk and never stored by Game Galaria.
        </div>
      </div>
    </div>
  );
}

function SignInPage() {
  return <SignInScreen path={`${basePath}/sign-in`} signUpUrl={`${basePath}/register`} />;
}

function LoginPage() {
  return <PasswordLoginScreen />;
}

function SignUpPage() {
  return <SignUpScreen path={`${basePath}/sign-up`} signInUrl={`${basePath}/login`} />;
}

function RegisterPage() {
  return <SignUpScreen path={`${basePath}/register`} signInUrl={`${basePath}/login`} />;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const client = useQueryClient();
  const previousUser = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (previousUser.current !== undefined && previousUser.current !== userId) {
        client.clear();
      }
      previousUser.current = userId;
    });
    return unsubscribe;
  }, [addListener, client]);

  return null;
}

function ProtectedAdmin() {
  return (
    <>
      <Show when="signed-in">
        <Admin />
      </Show>
      <Show when="signed-out">
        <Redirect to="/login" />
      </Show>
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/login/*?" component={LoginPage} />
      <Route path="/register/*?" component={RegisterPage} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/account" component={Account} />
      <Route path="/admin" component={ProtectedAdmin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ClerkApp() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      signInUrl={`${basePath}/login`}
      signUpUrl={`${basePath}/register`}
      appearance={{
        cssLayerName: 'clerk',
        options: {
          logoPlacement: 'inside',
          logoLinkUrl: basePath || '/',
          logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
        },
        variables: {
          colorPrimary: '#838C6D',
          colorForeground: '#C2C7AC',
          colorMutedForeground: '#959372',
          colorDanger: '#959372',
          colorBackground: '#1A2525',
          colorInput: '#1E2A26',
          colorInputForeground: '#C2C7AC',
          colorNeutral: '#323D39',
          fontFamily: 'Outfit, sans-serif',
          borderRadius: '10px',
        },
        elements: {
          rootBox: 'w-full flex justify-center',
          cardBox: 'bg-[#1A2525] border border-[#323D39] rounded-[10px] w-[440px] max-w-full overflow-hidden',
          card: '!shadow-none !border-0 !bg-transparent',
          footer: '!shadow-none !border-0 !bg-transparent',
          headerTitle: 'text-[#C2C7AC]',
          headerSubtitle: 'text-[#959372]',
          formFieldLabel: 'text-[#C2C7AC]',
          formFieldInput: 'bg-[#1E2A26] border-[#323D39] text-[#C2C7AC]',
          formButtonPrimary: 'bg-[#838C6D] text-[#1A2525] hover:bg-[#959372]',
          footerActionLink: 'text-[#838C6D]',
          footerActionText: 'text-[#959372]',
          dividerText: 'text-[#959372]',
          socialButtonsBlockButtonText: 'text-[#C2C7AC]',
          alertText: 'text-[#C2C7AC]',
        },
      }}
      localization={{
        signIn: { start: { title: 'Welcome back', subtitle: 'Log in to access your Game Galaria account' } },
        signUp: { start: { title: 'Create your account', subtitle: 'Join Game Galaria and start leveling up your setup' } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ShopProvider>
        <ClerkApp />
      </ShopProvider>
    </WouterRouter>
  );
}

export default App;