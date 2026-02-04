import Link from 'next/link';

export default function Navigation() {
    return (
        <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50">
            <Link href="/" className="text-xl font-bold tracking-tighter">TRULY UNRULY</Link>
            <div className="flex gap-6 text-sm">
                <Link href="/portfolio" className="hover:text-zinc-400 transition-colors">PORTFOLIO</Link>
                <Link href="/about" className="hover:text-zinc-400 transition-colors">ABOUT</Link>
                <Link href="/impressum" className="hover:text-zinc-400 transition-colors">INFO</Link>
            </div>
        </nav>
    );
}
