// Aggregates dashboard data from multiple sources
import { useProducts, useOrders } from '@/hooks/queries'
import { DashboardView } from '@/pages/dashboard'

export const DashboardContainer = () => {
  const { data: products } = useProducts()
  const { data: orders } = useOrders()

  return <DashboardView products={products} orders={orders} />
}