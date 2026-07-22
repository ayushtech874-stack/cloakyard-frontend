import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-background transition-colors duration-300">
        {/* Hero */}
        <section className="pt-40 pb-24 px-6 md:px-12 text-center max-w-4xl mx-auto">
          <span className="font-label-sm text-sm tracking-widest uppercase text-on-surface-variant mb-6 inline-block">Our Story</span>
          <h1 className="font-headline-xl text-[clamp(40px,6vw,80px)] text-on-background leading-[0.9] mb-8 uppercase tracking-tighter">
            BORN IN THE STREETS.<br />
            <span className="text-on-background/40">BUILT FOR THE YARD.</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed font-body-md">
            Cloakyard isn't just clothing; it's a statement of identity. We started with a simple belief: streetwear in India needed a reset. No more thin fabrics, no more shrunk-after-one-wash tees, no more generic fits. Just pure, unadulterated quality.
          </p>
        </section>

        {/* Brand Values */}
        <section className="py-24 px-6 md:px-12 bg-surface border-y border-on-background/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="border border-on-background/10 p-8 hover:bg-on-background/5 transition-colors">
              <h3 className="font-headline-lg text-2xl text-on-background mb-4 uppercase tracking-wider">01 / HEAVYWEIGHT CRAFT</h3>
              <p className="text-on-surface-variant leading-relaxed font-body-md">Every piece we make starts with premium 240GSM cotton. It's thick, it's durable, and it falls perfectly. Our garments are bio-washed and pre-shrunk so they look exactly the same on day 100 as they did on day 1.</p>
            </div>
            <div className="border border-on-background/10 p-8 hover:bg-on-background/5 transition-colors">
              <h3 className="font-headline-lg text-2xl text-on-background mb-4 uppercase tracking-wider">02 / THE PERFECT FIT</h3>
              <p className="text-on-surface-variant leading-relaxed font-body-md">We spent 8 months perfecting our oversized and boxy silhouettes. We dropped the shoulders precisely, widened the chest, and calibrated the length. It's not just a bigger size; it's a completely reimagined block.</p>
            </div>
            <div className="border border-on-background/10 p-8 hover:bg-on-background/5 transition-colors">
              <h3 className="font-headline-lg text-2xl text-on-background mb-4 uppercase tracking-wider">03 / YOUR CANVAS</h3>
              <p className="text-on-surface-variant leading-relaxed font-body-md">Streetwear is about individuality. That's why we built our Customise platform. We give you our premium blanks, and you bring the vision. It's collaboration in its purest form.</p>
            </div>
          </div>
        </section>

        {/* Made In India */}
        <section className="py-32 px-6 md:px-12 text-center max-w-4xl mx-auto">
          <h2 className="font-headline-xl text-5xl text-on-background mb-8 tracking-tighter uppercase">PROUDLY MADE IN INDIA</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-12 font-body-md">
            From the cotton fields to the spinning mills, from the dye houses to our cut-and-sew facility—every step of our supply chain is rooted in India. We work with ethical factories that pay fair wages and maintain safe working conditions.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-6 border border-on-background/10 bg-background flex flex-col items-center justify-center">
              <span className="text-on-background block text-4xl mb-2 font-headline-xl tracking-tighter">100%</span>
              <span className="text-on-surface-variant font-label-sm uppercase tracking-widest text-xs">Indian Cotton</span>
            </div>
            <div className="p-6 border border-on-background/10 bg-background flex flex-col items-center justify-center">
              <span className="text-on-background block text-4xl mb-2 font-headline-xl tracking-tighter">0%</span>
              <span className="text-on-surface-variant font-label-sm uppercase tracking-widest text-xs">Polyester Blends</span>
            </div>
            <div className="p-6 border border-on-background/10 bg-background flex flex-col items-center justify-center">
              <span className="text-on-background block text-4xl mb-2 font-headline-xl tracking-tighter">240</span>
              <span className="text-on-surface-variant font-label-sm uppercase tracking-widest text-xs">GSM Weight</span>
            </div>
            <div className="p-6 border border-on-background/10 bg-background flex flex-col items-center justify-center">
              <span className="text-on-background block text-4xl mb-2 font-headline-xl tracking-tighter">5+</span>
              <span className="text-on-surface-variant font-label-sm uppercase tracking-widest text-xs">QC Checks</span>
            </div>
          </div>
        </section>
        
        <div className="pb-32 flex justify-center">
          <Link href="/shop" className="bg-primary-fixed text-on-primary border border-primary-fixed px-xl py-4 font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 hover:bg-transparent hover:text-primary-fixed">EXPLORE THE COLLECTION</Link>
        </div>
      </div>
    </>
  )
}
