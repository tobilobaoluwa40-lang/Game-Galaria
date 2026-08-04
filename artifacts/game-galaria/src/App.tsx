import { useEffect, useRef, useState } from 'react';
import { ClerkProvider, Show, SignIn, SignUp, useClerk, useSignIn } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Redirect, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ShopProvider } from '@/context/shop-context';
import { ThemeProvider, useTheme as useGameTheme } from '@/context/theme-context';
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
import { StoreLogo } from '@/components/store-logo';

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
        appearance={{
          elements: {
            footerAction: 'hidden',
          },
        }}
      />
    </div>
  );
}

function SignUpScreen({ path, signInUrl }: { path: string; signInUrl: string }) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-[440px]">
        <SignUp
          routing="path"
          path={path}
          signInUrl={signInUrl}
          fallbackRedirectUrl={`${basePath}/account`}
        />
        <p className="mx-auto -mt-5 max-w-[360px] px-4 text-center text-xs leading-5 text-muted-foreground">
          Use a unique password you have not used on another website. Avoid common or previously exposed passwords; Clerk blocks compromised passwords to help protect your account.
        </p>
      </div>
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
      <div className="w-full max-w-[440px] overflow-hidden rounded-[10px] border border-border bg-card shadow-2xl">
        <div className="px-6 pb-7 pt-8 sm:px-10">
          <Link href="/" className="mx-auto mb-6 flex w-fit items-center gap-2">
            <StoreLogo className="h-8 max-w-56 object-contain" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Log in to access your Game Galaria account</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div className="space-y-2">
               <label htmlFor="login-email" className="text-sm font-medium text-foreground">Email address</label>
              <div className="relative">
                 <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email address"
                   className="h-11 border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                 <label htmlFor="login-password" className="text-sm font-medium text-foreground">Password</label>
                <Link href="/sign-in" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                 <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                   className="h-11 border-border bg-background pl-10 pr-11 text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((visible) => !visible)}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
               <p role="alert" className="rounded-lg border border-accent/50 bg-accent/10 px-3 py-2 text-sm text-foreground">
                {errorMessage}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting || fetchStatus === 'fetching'} className="h-11 w-full gap-2 font-semibold">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Log in <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

           <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">Create account</Link>
          </p>
        </div>
        <div className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
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
      <Route path="/shop/:category" component={Shop} />
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
  const { theme } = useGameTheme();
  const clerkColors = theme === 'dark'
    ? {
        foreground: '#C2C7AC',
        mutedForeground: '#959372',
        background: '#1A2525',
        input: '#1E2A26',
        neutral: '#323D39',
        primary: '#838C6D',
        primaryForeground: '#1A2525',
      }
    : {
        foreground: '#24332D',
        mutedForeground: '#5C6B5D',
        background: '#FFFFFF',
        input: '#F6F8F0',
        neutral: '#D7DDCC',
        primary: '#65734E',
        primaryForeground: '#FFFFFF',
      };

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
           colorPrimary: clerkColors.primary,
           colorForeground: clerkColors.foreground,
           colorMutedForeground: clerkColors.mutedForeground,
           colorDanger: clerkColors.mutedForeground,
           colorBackground: clerkColors.background,
           colorInput: clerkColors.input,
           colorInputForeground: clerkColors.foreground,
           colorNeutral: clerkColors.neutral,
          fontFamily: 'Outfit, sans-serif',
          borderRadius: '10px',
        },
        elements: {
          rootBox: 'w-full flex justify-center',
           cardBox: 'bg-card border border-border rounded-[10px] w-[440px] max-w-full overflow-hidden',
           card: '!shadow-none !border-0 !bg-transparent',
           footer: '!shadow-none !border-0 !bg-transparent',
           headerTitle: 'text-foreground',
           headerSubtitle: 'text-muted-foreground',
           formFieldLabel: 'text-foreground',
           formFieldInput: 'bg-background border-border text-foreground',
           formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
           footerActionLink: 'text-primary',
           footerActionText: 'text-muted-foreground',
           dividerText: 'text-muted-foreground',
           socialButtonsBlockButtonText: 'text-foreground',
           alertText: 'text-foreground',
        },
      }}
      localization={{
        signIn: { start: { title: 'Welcome back', subtitle: 'Log in to access your Game Galaria account' } },
        signUp: { start: { title: 'Create your account', subtitle: 'Join Game Galaria and start leveling up your setup' } },
        unstable__errors: {
          form_password_pwned: 'This password has appeared in a data breach. Choose a new, unique password.',
          form_password_not_strong_enough: 'Choose a stronger password with a mix of letters, numbers, and symbols.',
        },
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
      <ThemeProvider>
        <ShopProvider>
          <ClerkApp />
        </ShopProvider>
      </ThemeProvider>
    </WouterRouter>
  );
}

export default App;