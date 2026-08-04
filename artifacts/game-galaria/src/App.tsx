import { useEffect, useRef } from 'react';
import { ClerkProvider, Show, SignIn, SignUp, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Redirect, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ShopProvider } from '@/context/shop-context';
import Home from '@/pages/home';
import Shop from '@/pages/shop';
import ProductDetail from '@/pages/product-detail';
import Cart from '@/pages/cart';
import Checkout from '@/pages/checkout';
import Account from '@/pages/account';
import Admin from '@/pages/admin';

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

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
      />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
      />
    </div>
  );
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
        <Redirect to="/sign-in" />
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
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      appearance={{
        cssLayerName: 'clerk',
        options: {
          logoPlacement: 'inside',
          logoLinkUrl: basePath || '/',
          logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
        },
        variables: {
          colorPrimary: '#00ff99',
          colorForeground: '#f8fafc',
          colorMutedForeground: '#94a3b8',
          colorDanger: '#fb7185',
          colorBackground: '#0d1117',
          colorInput: '#111827',
          colorInputForeground: '#f8fafc',
          colorNeutral: '#243041',
          fontFamily: 'Outfit, sans-serif',
          borderRadius: '0.65rem',
        },
        elements: {
          rootBox: 'w-full flex justify-center',
          cardBox: 'bg-[#0d1117] border border-[#243041] rounded-2xl w-[440px] max-w-full overflow-hidden',
          card: '!shadow-none !border-0 !bg-transparent',
          footer: '!shadow-none !border-0 !bg-transparent',
          headerTitle: 'text-slate-50',
          headerSubtitle: 'text-slate-400',
          formFieldLabel: 'text-slate-200',
          formFieldInput: 'bg-[#111827] border-[#243041] text-slate-50',
          formButtonPrimary: 'bg-[#00ff99] text-[#07110d] hover:bg-[#33ffaa]',
          footerActionLink: 'text-[#00ff99]',
          footerActionText: 'text-slate-400',
          dividerText: 'text-slate-500',
          socialButtonsBlockButtonText: 'text-slate-100',
          alertText: 'text-rose-300',
        },
      }}
      localization={{
        signIn: { start: { title: 'Admin access', subtitle: 'Sign in to manage Game Galaria' } },
        signUp: { start: { title: 'Create admin details', subtitle: 'Create the account you will use for store operations' } },
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