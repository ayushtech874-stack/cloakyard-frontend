'use client'
import { useState, useEffect } from 'react'
import { Plus, Search, Edit3, Trash2, Eye, EyeOff } from 'lucide-react'
import ProductFormModal from '@/components/admin/ProductFormModal'
import { formatPrice } from '@/lib/utils'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const fetchProducts = async () => {
    setLoading(true)
    const pwd = localStorage.getItem('cloakyard_admin_pwd')
    const res = await fetch('/api/admin/products', {
      headers: { Authorization: `Bearer ${pwd}` }
    })
    if (res.ok) {
      setProducts(await res.json())
    }
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? (It will be hidden from the store)')) return
    const pwd = localStorage.getItem('cloakyard_admin_pwd')
    await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${pwd}` }
    })
    fetchProducts()
  }

  const openEdit = (product: any) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const openCreate = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  if (loading) return <div className="h-96 rounded-2xl skeleton" />

  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-display text-3xl text-cream">PRODUCTS</h2>
          <p className="text-sm text-muted mt-1">Manage your catalogue and inventory</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus size={18} /> ADD PRODUCT
        </button>
      </div>

      <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-surface2">
          <div className="flex-1 relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="text" placeholder="Search products..." className="input-base pl-10 h-10 w-full" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-white/5 text-muted font-mono text-xs">
              <tr>
                <th className="p-4 w-16">IMAGE</th>
                <th className="p-4">NAME & SLUG</th>
                <th className="p-4">VARIANTS</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-surface2 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-16 bg-bg rounded overflow-hidden border border-white/10">
                      <img src={product.images[0]?.url || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-cream font-medium mb-1">{product.name}</p>
                    <p className="text-xs text-muted font-mono">{product.slug}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-cream">{product.variants.length} Variants</p>
                    <p className="text-xs text-muted">
                      {product.variants.reduce((sum:number, v:any) => sum + v.stock, 0)} Total Stock
                    </p>
                  </td>
                  <td className="p-4">
                    {product.isActive ? (
                      <span className="px-2 py-1 rounded bg-green-400/10 text-green-400 text-xs font-mono border border-green-400/20 flex items-center gap-1 w-max"><Eye size={12}/> ACTIVE</span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-red-400/10 text-red-400 text-xs font-mono border border-red-400/20 flex items-center gap-1 w-max"><EyeOff size={12}/> INACTIVE</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(product)} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-muted hover:text-accent hover:border-accent/30 transition-colors">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-muted hover:text-red-400 hover:border-red-400/30 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted font-mono">No products found. Add one!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={fetchProducts}
        initialData={editingProduct}
      />
    </>
  )
}
