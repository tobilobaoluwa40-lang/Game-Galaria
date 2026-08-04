import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useShop } from '@/context/shop-context';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useClerk, useUser } from '@clerk/react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Account() {
  const { products, wishlist, orders } = useShop();
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const searchParams = new URLSearchParams(window.location.search);
  const defaultTab = searchParams.get('tab') || 'profile';

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));
  const firstName = user?.firstName || 'Gamer';
  const lastName = user?.lastName || '';
  const displayName = [firstName, lastName].filter(Boolean).join(' ');
  const email = user?.primaryEmailAddress?.emailAddress || 'No email address';

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading your account...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-8 w-8" />
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your player profile</p>
            <h1 className="text-3xl font-bold">Access your Game Galaria account</h1>
            <p className="mt-3 text-muted-foreground">
              Log in to view orders, save your wishlist, manage addresses, and keep your gaming setup moving.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link href="/login">
                <Button className="w-full">Log in</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="w-full">Create account</Button>
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">New accounts are protected with email verification and secure password validation.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar / TabsList built manually for vertical layout on desktop */}
            <Tabs defaultValue={defaultTab} className="w-full flex flex-col md:flex-row gap-8">
              
              <div className="w-full md:w-64 shrink-0">
                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl mb-4">
                    {`${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()}
                  </div>
                  <h2 className="font-bold text-lg">{displayName}</h2>
                  <p className="truncate text-sm text-muted-foreground">{email}</p>
                </div>

                <TabsList className="flex md:flex-col h-auto bg-transparent p-0 w-full overflow-x-auto justify-start border-b md:border-b-0 border-border pb-2 md:pb-0 gap-2">
                  <TabsTrigger value="profile" className="w-full justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-3 rounded-lg border border-transparent data-[state=active]:border-primary/20">
                    <User className="w-4 h-4 mr-3" /> Profile
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="w-full justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-3 rounded-lg border border-transparent data-[state=active]:border-primary/20">
                    <Package className="w-4 h-4 mr-3" /> Orders
                  </TabsTrigger>
                  <TabsTrigger value="wishlist" className="w-full justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-3 rounded-lg border border-transparent data-[state=active]:border-primary/20">
                    <Heart className="w-4 h-4 mr-3" /> Wishlist ({wishlist.length})
                  </TabsTrigger>
                  <TabsTrigger value="addresses" className="w-full justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-3 rounded-lg border border-transparent data-[state=active]:border-primary/20">
                    <MapPin className="w-4 h-4 mr-3" /> Addresses
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="w-full justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-3 rounded-lg border border-transparent data-[state=active]:border-primary/20">
                    <Settings className="w-4 h-4 mr-3" /> Settings
                  </TabsTrigger>
                </TabsList>
                
                <button
                  type="button"
                  onClick={() => signOut({ redirectUrl: `${window.location.origin}${import.meta.env.BASE_URL}` })}
                  className="flex items-center text-muted-foreground hover:text-destructive transition-colors mt-6 px-4 py-2 w-full text-sm font-medium"
                >
                  <LogOut className="w-4 h-4 mr-3" /> Sign Out
                </button>
              </div>

              <div className="flex-1 bg-card border border-border rounded-xl p-6 md:p-8 min-h-[500px]">
                
                <TabsContent value="profile" className="mt-0">
                  <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground font-medium">First Name</label>
                      <div className="p-3 bg-background border border-border rounded-md">{firstName}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground font-medium">Last Name</label>
                      <div className="p-3 bg-background border border-border rounded-md">{lastName || '—'}</div>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm text-muted-foreground font-medium">Email</label>
                      <div className="p-3 bg-background border border-border rounded-md">{email}</div>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm text-muted-foreground font-medium">Phone</label>
                      <div className="p-3 bg-background border border-border rounded-md">{user?.phoneNumbers?.[0]?.phoneNumber || 'Add a phone number in your profile'}</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="orders" className="mt-0">
                  <h2 className="text-2xl font-bold mb-6">Order History</h2>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-muted-foreground">When you buy gear, it will show up here.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-border rounded-lg overflow-hidden bg-background">
                          <div className="bg-muted/30 p-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Order Placed</div>
                              <div className="font-medium text-sm">{format(new Date(order.date), 'MMM dd, yyyy')}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Total</div>
                              <div className="font-medium font-mono text-sm">${order.total.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Order #</div>
                              <div className="font-medium font-mono text-sm">{order.id}</div>
                            </div>
                            <div className="ml-auto">
                              <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} className={order.status === 'Delivered' ? 'bg-primary text-primary-foreground' : ''}>
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-4 mb-4 last:mb-0">
                                <div className="w-16 h-16 bg-muted/20 rounded border flex items-center justify-center p-1 shrink-0">
                                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                  <div className="font-medium text-sm line-clamp-1">{item.product.name}</div>
                                  <div className="text-muted-foreground text-xs mt-1">Qty: {item.quantity}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="wishlist" className="mt-0">
                  <h2 className="text-2xl font-bold mb-6">Your Wishlist</h2>
                  
                  {wishlistProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                      <p className="text-muted-foreground">Save items you want to buy later.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="addresses" className="mt-0">
                  <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-primary/50 rounded-lg p-5 relative bg-primary/5">
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">Default</Badge>
                      <h3 className="font-bold mb-1">John Doe</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        123 Gaming Street<br />
                        Apt 4B<br />
                        Neo City, NC 12345<br />
                        United States
                      </p>
                      <div className="flex gap-3 text-sm">
                        <button className="text-primary hover:underline">Edit</button>
                      </div>
                    </div>
                    <button className="border border-dashed border-border rounded-lg p-5 flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors min-h-[160px]">
                      <Plus className="w-8 h-8 mb-2" />
                      <span>Add New Address</span>
                    </button>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                  <div className="space-y-6 max-w-xl">
                    <div className="flex items-center justify-between py-4 border-b border-border">
                      <div>
                        <h3 className="font-medium">Order Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive updates on your order status</p>
                      </div>
                      <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                        <div className="w-5 h-5 bg-background rounded-full absolute right-0.5 top-0.5" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-border">
                      <div>
                        <h3 className="font-medium">Promotional Emails</h3>
                        <p className="text-sm text-muted-foreground">Receive deals and new arrival alerts</p>
                      </div>
                      <div className="w-11 h-6 bg-muted rounded-full relative cursor-pointer border border-border">
                        <div className="w-5 h-5 bg-muted-foreground rounded-full absolute left-0.5 top-0.5" />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button className="text-destructive font-medium text-sm hover:underline">Delete Account</button>
                    </div>
                  </div>
                </TabsContent>

              </div>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { Plus } from 'lucide-react';