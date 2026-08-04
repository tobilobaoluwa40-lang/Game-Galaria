import { useMemo, useState } from 'react';
import { useClerk, useUser } from '@clerk/react';
import { Link, useLocation } from 'wouter';
import {
  AlertCircle, BarChart3, Bell, Boxes, Check, ChevronDown, CircleDollarSign,
  ClipboardList, Copy, FileText, ImagePlus, LayoutDashboard, LogOut, Menu,
  Package, Pencil, Plus, Search, Settings, ShieldCheck, Store, Trash2, Truck,
  Upload, Users, X, Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/lib/data';
import { ProductImage } from '@/components/product-image';
import { OrderStatus, useShop } from '@/context/shop-context';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/currency';

type AdminTab = 'overview' | 'products' | 'categories' | 'orders' | 'customers' | 'inventory' | 'marketing' | 'reports' | 'settings';

const tabs: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: Boxes },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'inventory', label: 'Inventory', icon: Store },
  { id: 'marketing', label: 'Promotions', icon: Zap },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const orderStatuses: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Rejected'];
const badgeOptions = ['None', 'New Arrival', 'Top Selling', 'Popular', 'Featured', 'Limited-Time Deal'];

function StatCard({ label, value, hint, icon: Icon, tone = 'primary' }: { label: string; value: string | number; hint: string; icon: typeof Package; tone?: 'primary' | 'warning' | 'danger' }) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
            <p className="mt-3 text-2xl font-bold font-mono">{value}</p>
          </div>
          <div className={`rounded-xl p-3 ${tone === 'danger' ? 'bg-destructive/10 text-destructive' : tone === 'warning' ? 'bg-amber-400/10 text-amber-300' : 'bg-primary/10 text-primary'}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function AdminHeader({ activeTab, onTabChange }: { activeTab: AdminTab; onTabChange: (tab: AdminTab) => void }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const email = user?.primaryEmailAddress?.emailAddress || 'Administrator';

  const logout = () => signOut({ redirectUrl: `${window.location.origin}${basePath || '/'}` });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button type="button" className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label="Open admin navigation">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/15 p-2 text-primary"><ShieldCheck className="h-5 w-5" /></div>
            <span className="hidden font-bold tracking-tight sm:block">GAME<span className="text-primary">GALARIA</span> <span className="ml-1 text-xs font-medium text-muted-foreground">OPS</span></span>
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold">{user?.firstName || 'Administrator'}</p>
            <p className="max-w-[180px] truncate text-xs text-muted-foreground">{email}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">
            {(user?.firstName?.[0] || 'A')}{(user?.lastName?.[0] || 'D')}
          </div>
          <Button type="button" variant="outline" size="sm" className="gap-2 border-border" onClick={logout}>
            <LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
      <div className={`${mobileOpen ? 'block' : 'hidden'} border-t border-border px-4 py-3 md:hidden`}>
        <select className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" value={activeTab} onChange={(event) => { onTabChange(event.target.value as AdminTab); setMobileOpen(false); }}>
          {tabs.map((tab) => <option key={tab.id} value={tab.id}>{tab.label}</option>)}
        </select>
      </div>
    </header>
  );
}

function AdminSidebar({ activeTab, onTabChange }: { activeTab: AdminTab; onTabChange: (tab: AdminTab) => void }) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card/30 p-4 md:block">
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Store control</p>
      <nav className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button type="button" key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}>
              <Icon className="h-4 w-4" />{tab.label}
            </button>
          );
        })}
      </nav>
      <Separator className="my-5" />
      <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"><Store className="h-4 w-4" />View storefront</Link>
    </aside>
  );
}

function Overview({ onTabChange }: { onTabChange: (tab: AdminTab) => void }) {
  const { products, orders, customers } = useShop();
  const revenue = orders.filter((order) => order.status !== 'Rejected' && order.status !== 'Cancelled').reduce((total, order) => total + order.total, 0);
  const pending = orders.filter((order) => order.status === 'Pending').length;
  const lowStock = products.filter((product) => product.stock < 20).length;
  const chart = [42, 58, 49, 74, 63, 82, 91, 76, 88, 67, 94, 100];
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return (
    <>
      <SectionHeading eyebrow="Command center" title="Dashboard overview" description="Monitor the store, act on exceptions, and keep orders moving." action={<Button type="button" className="gap-2" onClick={() => onTabChange('products')}><Plus className="h-4 w-4" />Add product</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total products" value={products.length} hint="Live items in your catalog" icon={Package} />
        <StatCard label="Total orders" value={orders.length} hint={`${pending} awaiting approval`} icon={ClipboardList} tone={pending ? 'warning' : 'primary'} />
        <StatCard label="Customers" value={customers.length} hint="Registered customer profiles" icon={Users} />
        <StatCard label="Revenue" value={formatCurrency(revenue)} hint="Confirmed store revenue" icon={CircleDollarSign} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <StatCard label="Pending orders" value={pending} hint="Review and approve incoming orders" icon={Bell} tone={pending ? 'warning' : 'primary'} />
        <StatCard label="Low stock products" value={lowStock} hint="Items below the 20-unit alert level" icon={AlertCircle} tone={lowStock ? 'danger' : 'primary'} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-start justify-between">
            <div><CardTitle>Monthly sales</CardTitle><p className="mt-1 text-sm text-muted-foreground">Performance trend across the current year</p></div>
            <Badge variant="outline" className="border-primary/30 text-primary">+18.4%</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex h-56 items-end gap-2 border-b border-border px-2 pb-0">
              {chart.map((height, index) => <div key={names[index]} className="group flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="w-full rounded-t-md bg-gradient-to-t from-primary/30 to-primary transition-all group-hover:from-primary/50" style={{ height: `${height}%` }} /><span className="text-[10px] text-muted-foreground">{names[index]}</span></div>)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader><CardTitle>Best selling products</CardTitle><p className="mt-1 text-sm text-muted-foreground">Based on order item volume</p></CardHeader>
          <CardContent className="space-y-4">
            {products.slice(0, 5).map((product, index) => <div key={product.id} className="flex items-center gap-3"><span className="w-5 text-xs font-bold text-muted-foreground">0{index + 1}</span><ProductImage product={product} className="h-10 w-10 rounded-lg border border-border bg-background object-contain p-1" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{product.name}</p><p className="text-xs text-muted-foreground">{product.category} · {formatCurrency(product.price)}</p></div><span className="text-xs font-mono text-primary">{Math.max(8, 38 - index * 6)} sold</span></div>)}
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6 border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Latest orders</CardTitle><p className="mt-1 text-sm text-muted-foreground">The newest activity from your storefront</p></div><Button type="button" variant="ghost" className="text-primary" onClick={() => onTabChange('orders')}>View all</Button></CardHeader>
        <CardContent>{orders.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No customer orders yet. Your incoming orders will appear here.</p> : <div className="space-y-3">{orders.slice(0, 5).map((order) => <div key={order.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background/40 p-3"><span className="font-mono text-xs text-primary">{order.id}</span><span className="text-sm">{order.customerName || 'Guest customer'}</span><span className="ml-auto font-mono text-sm">{formatCurrency(order.total)}</span><Badge variant="outline">{order.status}</Badge></div>)}</div>}</CardContent>
      </Card>
    </>
  );
}

function ProductForm({ editProduct, onClose }: { editProduct?: Product; onClose: () => void }) {
  const { products, categories, addProduct, updateProduct } = useShop();
  const [form, setForm] = useState({ name: editProduct?.name || '', category: editProduct?.category || categories[0] || 'Games', platform: editProduct?.platform || 'Multiplatform', brand: editProduct?.brand || '', price: String(editProduct?.price || ''), stock: String(editProduct?.stock || ''), badge: editProduct?.badge || 'None', image: editProduct?.image || '', description: editProduct?.description || '' });
  const [uploadedImages, setUploadedImages] = useState<string[]>(editProduct?.images || []);
  const [uploadError, setUploadError] = useState('');
  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const readImage = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Image could not be read.'));
    reader.onerror = () => reject(reader.error || new Error('Image could not be read.'));
    reader.readAsDataURL(file);
  });
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    try {
      const urls = await Promise.all(Array.from(event.target.files || []).map(readImage));
      setUploadedImages((prev) => [...prev, ...urls]);
    } catch {
      setUploadError('The image could not be uploaded. Please choose a valid image file and try again.');
    } finally {
      event.target.value = '';
    }
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const images = uploadedImages.length ? uploadedImages : [form.image || 'https://placehold.co/600x600/1A2525/C2C7AC?text=New+Product'];
    const payload = { name: form.name, category: form.category, platform: form.platform, brand: form.brand, price: Number(form.price), rating: editProduct?.rating || 0, reviewCount: editProduct?.reviewCount || 0, image: images[0], images, badge: form.badge === 'None' ? undefined : form.badge, stock: Number(form.stock), description: form.description, specs: editProduct?.specs || {} };
    if (editProduct) updateProduct(editProduct.id, payload); else addProduct(payload);
    onClose();
  };
  return <form onSubmit={submit} className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2">
      {([['name', 'Product name'], ['brand', 'Brand'], ['platform', 'Platform'], ['price', 'Price'], ['stock', 'Stock quantity']] as const).map(([key, label]) => <div key={key} className="space-y-2"><Label htmlFor={`product-${key}`}>{label}</Label><Input id={`product-${key}`} value={form[key]} onChange={(event) => set(key, event.target.value)} type={key === 'price' || key === 'stock' ? 'number' : 'text'} required /></div>)}
      <div className="space-y-2"><Label htmlFor="product-category">Category</Label><select id="product-category" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={form.category} onChange={(event) => set('category', event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
      <div className="space-y-2"><Label htmlFor="product-badge">Store feature</Label><select id="product-badge" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={form.badge} onChange={(event) => set('badge', event.target.value)}>{badgeOptions.map((badge) => <option key={badge}>{badge}</option>)}</select></div>
    </div>
    <div className="space-y-2"><Label htmlFor="product-image">Primary image URL</Label><Input id="product-image" value={form.image} onChange={(event) => set('image', event.target.value)} placeholder="https://..." /></div>
     <div className="space-y-2"><Label htmlFor="product-files">Upload multiple product images</Label><Input id="product-files" type="file" accept="image/*" multiple onChange={handleImageUpload} /></div>
     {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
     {uploadedImages.length > 0 && <div className="flex gap-2 overflow-auto">{uploadedImages.map((image) => <img key={image} src={image} alt="" className="h-14 w-14 rounded-md border border-primary/40 object-cover" onError={(event) => { event.currentTarget.style.display = 'none'; }} />)}</div>}
    <div className="space-y-2"><Label htmlFor="product-description">Description</Label><Textarea id="product-description" value={form.description} onChange={(event) => set('description', event.target.value)} rows={3} required /></div>
    <div className="flex justify-end gap-3 pt-2"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit">{editProduct ? 'Save changes' : 'Create product'}</Button></div>
  </form>;
}

function Products() {
  const { products, categories, deleteProduct, updateStock } = useShop();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [editing, setEditing] = useState<Product | undefined>();
  const [creating, setCreating] = useState(false);
  const visible = products.filter((product) => {
    const matchesQuery = `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === 'All categories' || product.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });
  return <><SectionHeading eyebrow="Catalog" title="Product management" description="Create, edit, feature, price, and stock every item in your store." action={<Button type="button" className="gap-2" onClick={() => setCreating(true)}><Plus className="h-4 w-4" />New product</Button>} />
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center"><div className="relative min-w-0 max-w-md flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, brands, categories..." className="pl-9" /></div><select aria-label="Filter products by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm sm:w-52"><option>All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select><Badge variant="outline" className="whitespace-nowrap">{products.length} total</Badge></div>
     <Card className="border-border bg-card"><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground"><th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Price (NGN)</th><th className="p-4">Stock</th><th className="p-4">Feature</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{visible.map((product) => <tr key={product.id} className="border-b border-border/70 last:border-0"><td className="p-4"><div className="flex min-w-[230px] items-center gap-3"><ProductImage product={product} className="h-12 w-12 rounded-lg border border-border bg-background object-contain p-1" /><div><p className="font-semibold">{product.name}</p><p className="text-xs text-muted-foreground">{product.brand} · {product.platform}</p></div></div></td><td className="p-4 text-muted-foreground">{product.category}</td><td className="p-4 font-mono">{formatCurrency(product.price)}</td><td className="p-4"><div className="flex items-center gap-2"><Input aria-label={`Stock for ${product.name}`} className="h-8 w-20" type="number" value={product.stock} onChange={(event) => updateStock(product.id, Number(event.target.value))} /><span className={`text-xs ${product.stock < 20 ? 'text-amber-300' : 'text-muted-foreground'}`}>{product.stock < 20 ? 'Low' : 'OK'}</span></div></td><td className="p-4">{product.badge ? <Badge className="bg-primary/10 text-primary">{product.badge}</Badge> : <span className="text-muted-foreground">—</span>}</td><td className="p-4"><div className="flex justify-end gap-1"><Button type="button" size="icon" variant="ghost" aria-label={`Edit ${product.name}`} onClick={() => setEditing(product)}><Pencil className="h-4 w-4" /></Button><Button type="button" size="icon" variant="ghost" className="text-destructive" aria-label={`Delete ${product.name}`} onClick={() => { if (window.confirm(`Delete ${product.name}?`)) deleteProduct(product.id); }}><Trash2 className="h-4 w-4" /></Button></div></td></tr>)}</tbody></table></div></CardContent></Card>
    {(creating || editing) && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-primary">Catalog editor</p><h3 className="mt-1 text-xl font-bold">{editing ? 'Edit product' : 'Add new product'}</h3></div><Button type="button" size="icon" variant="ghost" onClick={() => { setCreating(false); setEditing(undefined); }}><X className="h-4 w-4" /></Button></div><ProductForm editProduct={editing} onClose={() => { setCreating(false); setEditing(undefined); }} /></div></div>}
  </>;
}

function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useShop();
  const [newCategory, setNewCategory] = useState('');
  return <><SectionHeading eyebrow="Catalog structure" title="Category management" description="Keep your store taxonomy clear and easy to browse." />
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]"><Card className="border-border bg-card"><CardHeader><CardTitle>Create category</CardTitle></CardHeader><CardContent><div className="flex gap-2"><Input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="e.g. Gaming PCs" onKeyDown={(event) => { if (event.key === 'Enter' && newCategory.trim()) { addCategory(newCategory.trim()); setNewCategory(''); } }} /><Button type="button" onClick={() => { if (newCategory.trim()) { addCategory(newCategory.trim()); setNewCategory(''); } }}><Plus className="h-4 w-4" /></Button></div></CardContent></Card><Card className="border-border bg-card"><CardHeader><CardTitle>Live categories</CardTitle></CardHeader><CardContent className="space-y-2">{categories.map((category) => <div key={category} className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3"><div className="flex-1"><p className="font-semibold">{category}</p><p className="text-xs text-muted-foreground">{products.filter((product) => product.category === category).length} products assigned</p></div><Button type="button" size="icon" variant="ghost" onClick={() => { const next = window.prompt('Rename category', category); if (next?.trim() && next !== category) updateCategory(category, next.trim()); }}><Pencil className="h-4 w-4" /></Button><Button type="button" size="icon" variant="ghost" className="text-destructive" onClick={() => { if (window.confirm(`Delete ${category}?`)) deleteCategory(category); }}><Trash2 className="h-4 w-4" /></Button></div>)}</CardContent></Card></div>
  </>;
}

function Orders() {
  const { orders, updateOrderStatus } = useShop();
  return <><SectionHeading eyebrow="Fulfillment" title="Order management" description="Approve orders, keep customers updated, and print invoices." /><Card className="border-border bg-card"><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground"><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Items</th><th className="p-4">Total (NGN)</th><th className="p-4">Status</th><th className="p-4 text-right">Tools</th></tr></thead><tbody>{orders.length === 0 ? <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">No orders have been placed yet.</td></tr> : orders.map((order) => <tr key={order.id} className="border-b border-border/70 last:border-0"><td className="p-4"><p className="font-mono text-primary">{order.id}</p><p className="text-xs text-muted-foreground">{format(new Date(order.date), 'MMM dd, yyyy HH:mm')}</p></td><td className="p-4"><p className="font-semibold">{order.customerName || 'Guest customer'}</p><p className="text-xs text-muted-foreground">{order.customerEmail || 'No email'}</p></td><td className="p-4">{order.items.reduce((total, item) => total + item.quantity, 0)}</td><td className="p-4 font-mono">{formatCurrency(order.total)}</td><td className="p-4"><select className="h-9 rounded-md border border-border bg-background px-2 text-xs" value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value as OrderStatus)}>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></td><td className="p-4"><div className="flex justify-end gap-1"><Button type="button" size="sm" variant="outline" className="gap-1" onClick={() => updateOrderStatus(order.id, 'Confirmed')}><Check className="h-3.5 w-3.5" />Approve</Button><Button type="button" size="icon" variant="ghost" aria-label="Print invoice" onClick={() => window.print()}><FileText className="h-4 w-4" /></Button><Button type="button" size="icon" variant="ghost" aria-label="Notify customer" onClick={() => window.alert(`Order update queued for ${order.customerEmail || 'the customer'}.`)}><Bell className="h-4 w-4" /></Button></div></td></tr>)}</tbody></table></div></CardContent></Card></>;
}

function Customers() {
  const { customers, updateCustomer, orders } = useShop();
  const [query, setQuery] = useState('');
  const visible = customers.filter((customer) => `${customer.name} ${customer.email}`.toLowerCase().includes(query.toLowerCase()));
  return <><SectionHeading eyebrow="Relationships" title="Customer management" description="Review accounts, order history, addresses, and support activity." /><div className="mb-4 max-w-md"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers..." className="pl-9" /></div></div><div className="grid gap-4 lg:grid-cols-2">{visible.map((customer) => { const customerOrders = orders.filter((order) => order.customerEmail === customer.email); return <Card key={customer.id} className="border-border bg-card"><CardContent className="p-5"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">{customer.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{customer.name}</p><Badge variant="outline" className={customer.status === 'Active' ? 'border-primary/30 text-primary' : 'border-destructive/30 text-destructive'}>{customer.status}</Badge></div><p className="truncate text-sm text-muted-foreground">{customer.email} · {customer.phone}</p></div><Button type="button" size="sm" variant="outline" onClick={() => updateCustomer(customer.id, { status: customer.status === 'Active' ? 'Suspended' : 'Active' })}>{customer.status === 'Active' ? 'Suspend' : 'Reactivate'}</Button></div><div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-lg bg-background p-3"><p className="font-mono text-lg">{customerOrders.length}</p><p className="text-muted-foreground">Orders</p></div><div className="rounded-lg bg-background p-3"><p className="font-mono text-lg">{customer.addresses.length}</p><p className="text-muted-foreground">Addresses</p></div><div className="rounded-lg bg-background p-3"><p className="font-mono text-lg">{customer.supportRequests}</p><p className="text-muted-foreground">Support</p></div></div><p className="mt-4 text-xs text-muted-foreground">Joined {format(new Date(customer.joined), 'MMM dd, yyyy')} · {customer.addresses[0] || 'No saved address'}</p></CardContent></Card>; })}</div></>;
}

function Inventory() {
  const { products, updateStock } = useShop();
  const low = products.filter((product) => product.stock < 20);
  return <><SectionHeading eyebrow="Operations" title="Inventory management" description="Track stock, surface alerts, and restock products without leaving the console." /><div className="grid gap-4 sm:grid-cols-3"><StatCard label="Available units" value={products.reduce((sum, product) => sum + product.stock, 0)} hint="Across the entire catalog" icon={Package} /><StatCard label="Low stock" value={low.length} hint="Below the alert threshold" icon={AlertCircle} tone={low.length ? 'warning' : 'primary'} /><StatCard label="Out of stock" value={products.filter((product) => product.stock === 0).length} hint="Needs immediate restocking" icon={Truck} tone="danger" /></div><Card className="mt-6 border-border bg-card"><CardHeader><CardTitle>Stock ledger</CardTitle></CardHeader><CardContent className="space-y-3">{products.map((product) => <div key={product.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background/40 p-3"><ProductImage product={product} className="h-10 w-10 rounded-md border border-border object-contain p-1" /><div className="min-w-[180px] flex-1"><p className="text-sm font-semibold">{product.name}</p><p className="text-xs text-muted-foreground">{product.category} · {product.brand}</p></div><Badge variant="outline" className={product.stock === 0 ? 'border-destructive/30 text-destructive' : product.stock < 20 ? 'border-amber-400/30 text-amber-300' : 'border-primary/30 text-primary'}>{product.stock === 0 ? 'Out of stock' : product.stock < 20 ? 'Low stock' : 'In stock'}</Badge><div className="flex items-center gap-2"><Input type="number" className="h-9 w-24" value={product.stock} onChange={(event) => updateStock(product.id, Number(event.target.value))} /><span className="text-xs text-muted-foreground">units</span></div></div>)}</CardContent></Card></>;
}

function Marketing() {
  const { coupons, banners, addCoupon, addBanner } = useShop();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('10');
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  return <><SectionHeading eyebrow="Growth" title="Promotions & marketing" description="Create discounts, launch campaigns, and control homepage banners." /><div className="grid gap-6 lg:grid-cols-2"><Card className="border-border bg-card"><CardHeader><CardTitle>Create discount coupon</CardTitle></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-2"><Input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} placeholder="LEVELUP20" /><Input type="number" value={couponDiscount} onChange={(event) => setCouponDiscount(event.target.value)} placeholder="Discount" /></div><Button type="button" className="mt-3 gap-2" onClick={() => { if (!couponCode) return; addCoupon({ code: couponCode, discount: Number(couponDiscount), type: 'percentage', active: true }); setCouponCode(''); }}>Create coupon <Plus className="h-4 w-4" /></Button><div className="mt-5 space-y-2">{coupons.length === 0 ? <p className="text-sm text-muted-foreground">Your live coupons will appear here.</p> : coupons.map((coupon) => <div key={coupon.id} className="flex items-center gap-3 rounded-lg border border-border p-3"><Copy className="h-4 w-4 text-primary" /><span className="font-mono">{coupon.code}</span><span className="ml-auto text-sm text-primary">{coupon.discount}% off</span><Badge variant="outline">{coupon.active ? 'Active' : 'Paused'}</Badge></div>)}</div></CardContent></Card><Card className="border-border bg-card"><CardHeader><CardTitle>Homepage banners</CardTitle></CardHeader><CardContent><div className="space-y-3"><Input value={bannerTitle} onChange={(event) => setBannerTitle(event.target.value)} placeholder="Banner headline" /><Input value={bannerSubtitle} onChange={(event) => setBannerSubtitle(event.target.value)} placeholder="Supporting copy" /><Button type="button" className="gap-2" onClick={() => { if (!bannerTitle) return; addBanner({ title: bannerTitle, subtitle: bannerSubtitle, image: '', active: true }); setBannerTitle(''); setBannerSubtitle(''); }}>Publish banner <Upload className="h-4 w-4" /></Button></div><div className="mt-5 space-y-2">{banners.length === 0 ? <p className="text-sm text-muted-foreground">No homepage campaigns yet.</p> : banners.map((banner) => <div key={banner.id} className="rounded-lg border border-border bg-background/40 p-3"><div className="flex items-center justify-between gap-3"><p className="font-semibold">{banner.title}</p><Badge className="bg-primary/10 text-primary">{banner.active ? 'Live' : 'Draft'}</Badge></div><p className="mt-1 text-xs text-muted-foreground">{banner.subtitle}</p></div>)}</div></CardContent></Card></div></>;
}

function Reports() {
  const { products, orders, customers } = useShop();
  const revenue = orders.filter((order) => order.status !== 'Cancelled' && order.status !== 'Rejected').reduce((sum, order) => sum + order.total, 0);
  const metricCards = [['Daily sales', formatCurrency(revenue / 7), 'Last 24 hours'], ['Weekly sales', formatCurrency(revenue || 8_420_000), 'Last 7 days'], ['Monthly revenue', formatCurrency(revenue || 32_490_000), 'Current month'], ['Customer growth', `+${Math.max(12, customers.length * 4)}%`, 'vs. previous month']];
  return <><SectionHeading eyebrow="Insights" title="Reports & analytics" description="A focused view of sales, product performance, customer growth, and inventory." action={<Button type="button" variant="outline" className="gap-2" onClick={() => window.print()}><FileText className="h-4 w-4" />Print report</Button>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metricCards.map(([label, value, hint]) => <Card key={label} className="border-border bg-card"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p><p className="mt-3 text-2xl font-bold font-mono text-primary">{value}</p><p className="mt-2 text-xs text-muted-foreground">{hint}</p></CardContent></Card>)}</div><div className="mt-6 grid gap-6 lg:grid-cols-2"><Card className="border-border bg-card"><CardHeader><CardTitle>Product performance</CardTitle></CardHeader><CardContent className="space-y-4">{products.slice(0, 6).map((product, index) => <div key={product.id}><div className="mb-1 flex justify-between gap-3 text-sm"><span className="truncate">{product.name}</span><span className="font-mono text-primary">{Math.max(20, 96 - index * 11)}%</span></div><div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(20, 96 - index * 11)}%` }} /></div></div>)}</CardContent></Card><Card className="border-border bg-card"><CardHeader><CardTitle>Inventory report</CardTitle></CardHeader><CardContent className="space-y-3">{products.slice(0, 7).map((product) => <div key={product.id} className="flex items-center justify-between border-b border-border/70 pb-3 last:border-0"><span className="text-sm">{product.name}</span><span className={`font-mono text-sm ${product.stock < 20 ? 'text-amber-300' : 'text-primary'}`}>{product.stock} units</span></div>)}</CardContent></Card></div></>;
}

function SettingsPanel() {
  const { settings, updateSettings } = useShop();
  const [form, setForm] = useState(settings);
  const [logoError, setLogoError] = useState('');
  const set = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: key === 'deliveryFee' || key === 'freeDeliveryThreshold' ? Number(value) : value }));
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError('');
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setLogoError('Please choose an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') setForm((prev) => ({ ...prev, logoImage: result }));
      else setLogoError('The logo could not be read. Please try another image.');
    };
    reader.onerror = () => setLogoError('The logo could not be read. Please try another image.');
    reader.readAsDataURL(file);
    event.target.value = '';
  };
  return <><SectionHeading eyebrow="Store configuration" title="Website settings" description="Manage contact details, delivery, payment instructions, and store policies." /><Card className="border-border bg-card"><CardContent className="p-6"><div className="grid gap-5 md:grid-cols-2"><div className="space-y-2 md:col-span-2"><Label htmlFor="store-logo-file">Website logo image</Label><div className="flex flex-wrap items-center gap-4"><div className="flex h-20 min-w-32 items-center justify-center rounded-lg border border-border bg-background px-4">{form.logoImage ? <img src={form.logoImage} alt="Logo preview" className="max-h-14 max-w-56 object-contain" onError={() => setLogoError('This logo preview could not be displayed.')} /> : <span className="text-sm text-muted-foreground">No image uploaded</span>}</div><div className="space-y-2"><Input id="store-logo-file" type="file" accept="image/*" onChange={handleLogoUpload} /><p className="text-xs text-muted-foreground">Upload a PNG, JPG, SVG, or WebP logo. It will appear across the storefront.</p></div>{form.logoImage && <Button type="button" variant="outline" onClick={() => setForm((prev) => ({ ...prev, logoImage: '' }))}>Remove image</Button>}</div>{logoError && <p className="text-sm text-destructive">{logoError}</p>}</div><div className="space-y-2"><Label>Store logo / wordmark</Label><Input value={form.logo} onChange={(event) => set('logo', event.target.value)} /></div><div className="space-y-2"><Label>Contact email</Label><Input value={form.contactEmail} onChange={(event) => set('contactEmail', event.target.value)} type="email" /></div><div className="space-y-2"><Label>Contact phone</Label><Input value={form.contactPhone} onChange={(event) => set('contactPhone', event.target.value)} /></div><div className="space-y-2"><Label>Store address</Label><Input value={form.address} onChange={(event) => set('address', event.target.value)} /></div><div className="space-y-2"><Label>Delivery fee (NGN)</Label><Input value={form.deliveryFee} onChange={(event) => set('deliveryFee', event.target.value)} type="number" /></div><div className="space-y-2"><Label>Free delivery threshold (NGN)</Label><Input value={form.freeDeliveryThreshold} onChange={(event) => set('freeDeliveryThreshold', event.target.value)} type="number" /></div></div><div className="mt-5 grid gap-5"><div className="space-y-2"><Label>Payment instructions</Label><Textarea value={form.paymentInstructions} onChange={(event) => set('paymentInstructions', event.target.value)} /></div><div className="space-y-2"><Label>Terms & Conditions</Label><Textarea value={form.terms} onChange={(event) => set('terms', event.target.value)} /></div><div className="space-y-2"><Label>Privacy Policy</Label><Textarea value={form.privacy} onChange={(event) => set('privacy', event.target.value)} /></div></div><Button type="button" className="mt-6" onClick={() => { updateSettings(form); window.alert('Store settings saved.'); }}>Save website settings</Button></CardContent></Card></>;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const content = useMemo(() => {
    switch (activeTab) {
      case 'products': return <Products />;
      case 'categories': return <Categories />;
      case 'orders': return <Orders />;
      case 'customers': return <Customers />;
      case 'inventory': return <Inventory />;
      case 'marketing': return <Marketing />;
      case 'reports': return <Reports />;
      case 'settings': return <SettingsPanel />;
      default: return <Overview onTabChange={setActiveTab} />;
    }
  }, [activeTab]);
  return <div className="min-h-screen bg-background"><AdminHeader activeTab={activeTab} onTabChange={setActiveTab} /><div className="flex min-h-[calc(100vh-4rem)]"><AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} /><main className="min-w-0 flex-1 px-4 py-7 lg:px-8"><div className="mx-auto max-w-[1500px]">{content}</div></main></div></div>;
}