import ProductClient from './ProductClient';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductClient slug={slug} />;
}
