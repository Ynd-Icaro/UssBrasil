'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProductGrid } from '@/components/products';
import { Skeleton } from '@/components/ui';
import api from '@/lib/api';
import { Product, Category } from '@/types';
import { cn } from '@/lib/utils';

export default function CategoryPage() {
  const params = useParams();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    async function loadCategory() {
      try {
        const response = await api.get(`/categories/slug/${params.slug}`);
        // API pode retornar { data: category } ou category direto
        const categoryData = response.data?.data || response.data;
        setCategory(categoryData);
      } catch (error) {
        console.error('Error loading category:', error);
        setIsLoading(false);
      }
    }
    
    if (params.slug) {
      loadCategory();
    }
  }, [params.slug]);

  useEffect(() => {
    async function loadProducts() {
      if (!category) return;
      
      setIsLoading(true);
      try {
        const response = await api.get(
          `/products?categoryId=${category.id}&page=${currentPage}&limit=12&sortBy=${sortBy}&sortOrder=${sortOrder}`
        );
        // API pode retornar diferentes formatos
        const responseData = response.data?.data || response.data;
        const productsData = responseData?.data || responseData;
        const meta = responseData?.meta;
        
        setProducts(Array.isArray(productsData) ? productsData : []);
        setTotalPages(meta?.totalPages || 1);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProducts();
  }, [category, currentPage, sortBy, sortOrder]);

  if (!category && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Categoria não encontrada</h1>
          <p className="text-text-secondary">
            A categoria que você procura não existe.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* Breadcrumb */}
          <nav className="text-sm text-text-secondary mb-4">
            <a href="/" className="hover:text-text-primary">Home</a>
            <span className="mx-2">/</span>
            <a href="/products" className="hover:text-text-primary">Produtos</a>
            <span className="mx-2">/</span>
            <span className="text-text-primary">{category?.name || '...'}</span>
          </nav>

          {/* Category Info */}
          <div className="relative py-16 px-8 rounded-2xl bg-gradient-to-r from-primary/20 to-transparent border border-border overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15),transparent_70%)]" />
            <div className="relative z-10">
              {category ? (
                <>
                  <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
                  {category.description && (
                    <p className="text-text-secondary max-w-2xl">
                      {category.description}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <Skeleton className="h-10 w-64 mb-4" />
                  <Skeleton className="h-6 w-96" />
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-text-secondary">
            {products.length} produtos encontrados
          </p>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary"
          >
            <option value="createdAt-desc">Mais recentes</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="name-asc">A - Z</option>
          </select>
        </div>

        {/* Products */}
        <ProductGrid products={products} isLoading={isLoading} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'w-10 h-10 rounded-lg font-medium transition-colors',
                  page === currentPage
                    ? 'bg-primary text-white'
                    : 'bg-surface hover:bg-surface-hover'
                )}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
