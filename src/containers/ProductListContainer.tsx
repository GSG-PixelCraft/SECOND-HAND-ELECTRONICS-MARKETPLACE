// Handles product listing with filters, pagination
import { useState } from 'react'
import { useProducts } from '@/hooks/queries'
import { ProductList } from '@/components'

export const ProductListContainer = () => {
  const [filters, setFilters] = useState({})
  const { data, isLoading } = useProducts(filters)

  return <ProductList products={data} onFilterChange={setFilters} />
}