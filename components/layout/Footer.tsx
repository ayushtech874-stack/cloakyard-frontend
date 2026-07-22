'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-background dark:bg-background border-t border-white/5 dark:border-white/5 pt-xl overflow-hidden relative">
      <div className="w-full max-w-[1440px] mx-auto px-lg z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-xl mb-xl">
          
          {/* Brand Info & Newsletter */}
          <div className="md:col-span-2 flex flex-col gap-md">
            <div>
              <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
                <Image 
                  src="/logo.jpeg" 
                  alt="Cloakyard" 
                  width={200} 
                  height={50} 
                  className="object-contain dark:invert-0 invert mix-blend-difference dark:mix-blend-normal" 
                />
              </Link>
              <p className="font-body-md text-on-surface-variant mt-sm max-w-sm">
                Premium streetwear engineered for the digital age. Boxy, oversized, and built for impact.
              </p>
            </div>
            
            <div className="mt-sm">
              <h4 className="font-label-sm text-label-sm text-on-background uppercase tracking-widest mb-sm">Join the Flux</h4>
              <form className="flex group" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="ENTER NEURAL LINK (EMAIL)" 
                  className="bg-transparent border-b border-on-background/20 text-on-background font-label-sm text-sm uppercase py-sm flex-1 outline-none focus:border-primary-fixed transition-colors placeholder:text-on-background/30"
                  required
                />
                <button type="submit" className="border-b border-on-background/20 py-sm px-sm text-primary-fixed group-focus-within:border-primary-fixed hover:text-on-background transition-colors">
                  <ArrowUpRight size={20} />
                </button>
              </form>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="flex flex-col gap-md">
            <h4 className="font-label-sm text-label-sm text-on-background uppercase tracking-widest">Shop</h4>
            <div className="flex flex-col gap-sm">
              <Link href="/shop" className="font-body-md text-on-surface-variant hover:text-primary-fixed transition-colors">All Products</Link>
              <Link href="/shop?fitType=oversized" className="font-body-md text-on-surface-variant hover:text-primary-fixed transition-colors">Oversized Fit</Link>
              <Link href="/shop?fitType=boxy" className="font-body-md text-on-surface-variant hover:text-primary-fixed transition-colors">Boxy Fit</Link>
              <Link href="/customise" className="font-body-md text-on-surface-variant hover:text-primary-fixed transition-colors flex items-center gap-2">
                Custom Orders <span className="bg-primary-fixed text-on-primary-container text-[10px] px-2 py-0.5 rounded font-label-sm uppercase tracking-wider">New</span>
              </Link>
            </div>
          </div>

          {/* Links Column 2 */}
          <div className="flex flex-col gap-md">
            <h4 className="font-label-sm text-label-sm text-on-background uppercase tracking-widest">Company</h4>
            <div className="flex flex-col gap-sm">
              <Link href="/about" className="font-body-md text-on-surface-variant hover:text-primary-fixed transition-colors">About Us</Link>
              <Link href="/contact" className="font-body-md text-on-surface-variant hover:text-primary-fixed transition-colors">Contact</Link>
              <Link href="/terms" className="font-body-md text-on-surface-variant hover:text-primary-fixed transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="font-body-md text-on-surface-variant hover:text-primary-fixed transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        {/* Huge Brand Marquee/Typography */}
        <div className="w-full border-t border-on-background/10 pt-lg pb-md mt-lg flex flex-col md:flex-row justify-between items-end gap-md">
          <div className="hidden md:block w-full">
             <h1 className="font-headline-xl text-[12vw] leading-none tracking-tighter text-on-background/5 select-none w-full text-center">
               CLOAKYARD
             </h1>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center py-md border-t border-on-background/5 gap-md">
          <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">
            © {new Date().getFullYear()} CLOAKYARD FLUX. ALL RIGHTS RESERVED.
          </span>
          
          <div className="flex gap-md">
            <a className="w-10 h-10 rounded-full border border-on-background/10 flex items-center justify-center hover:border-primary-fixed hover:bg-primary-fixed/5 group transition-colors" href="#">
              <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary-fixed transition-colors">public</span>
            </a>
            <a className="w-10 h-10 rounded-full border border-on-background/10 flex items-center justify-center hover:border-primary-fixed hover:bg-primary-fixed/5 group transition-colors" href="mailto:support@cloakyard.in">
              <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary-fixed transition-colors">alternate_email</span>
            </a>
            <a className="w-10 h-10 rounded-full border border-on-background/10 flex items-center justify-center hover:border-primary-fixed hover:bg-primary-fixed/5 group transition-colors" href="#">
              <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary-fixed transition-colors">photo_camera</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
