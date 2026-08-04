import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MOCK_PRODUCTS } from '@/lib/data';
import { useShop } from '@/context/shop-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, DollarSign, TrendingUp, AlertCircle, ShoppingBag } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function Admin() {
  const { orders } = useShop();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStockProducts = MOCK_PRODUCTS.filter(p => p.stock < 20);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Simplified Admin Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-primary">
            GG <span className="text-foreground">ADMIN</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin Session</span>
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xs font-bold">AD</div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          
          <h1 className="text-3xl font-bold tracking-tight mb-8">Dashboard Overview</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                <DollarSign className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center text-primary">
                  <TrendingUp className="w-3 h-3 mr-1" /> +12.5% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                <ShoppingBag className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active orders this week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                <Package className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{MOCK_PRODUCTS.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across 8 categories
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
                <Users className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,249</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered accounts
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border h-full">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No orders have been placed yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border hover:bg-transparent">
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.slice(0, 5).map((order) => (
                            <TableRow key={order.id} className="border-border hover:bg-muted/50">
                              <TableCell className="font-mono text-xs">{order.id}</TableCell>
                              <TableCell className="text-sm">{format(new Date(order.date), 'MMM dd, HH:mm')}</TableCell>
                              <TableCell className="text-sm">John Doe</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono font-medium">${order.total.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Low Stock Alerts */}
            <div className="lg:col-span-1">
              <Card className="bg-card border-border h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    Low Stock Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lowStockProducts.map(product => (
                      <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                        <div className="flex items-center gap-3">
                          <img src={product.image} className="w-10 h-10 object-contain bg-muted/20 rounded p-1" />
                          <div>
                            <div className="text-sm font-medium line-clamp-1" title={product.name}>{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.platform}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <div className="text-lg font-bold text-destructive">{product.stock}</div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Left</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
