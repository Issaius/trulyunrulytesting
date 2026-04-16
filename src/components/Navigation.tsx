import Link from 'next/link';

export default function Navigation() {
    return (
        <nav className="fixed top-0 left-0 w-full p-6 flex justify-center items-center z-50">
            <div className="flex gap-8 text-sm items-center tracking-widest">
                <Link href="/" className="hover:text-zinc-400 transition-colors text-center">
                    HOME
                </Link>
                <Link href="/portfolio" className="hover:text-zinc-400 transition-colors text-center">
                    PORTFOLIO
                </Link>
                <Link href="/about" className="hover:text-zinc-400 transition-colors text-center">
                    ABOUT
                </Link>
                <Link href="/impressum" className="hover:text-zinc-400 transition-colors text-center">
                    LEGAL
                </Link>
            </div>
        </nav>
    );
}
