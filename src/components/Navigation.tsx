import Link from 'next/link';
import Image from 'next/image';

export default function Navigation() {
    return (
        <nav className="fixed top-0 left-0 w-full p-6 flex justify-center items-center z-50">
            <div className="flex items-center">
                <Link href="/" className="flex items-center mr-6">
                    <Image
                        src="/Logo white.svg"
                        alt="Logo"
                        width={48}
                        height={48}
                        priority
                        className="w-12 h-12 object-contain"
                    />
                </Link>

                <div className="h-5 w-px bg-zinc-600 mr-6"></div>

                <div className="flex gap-8 text-sm items-center tracking-widest">
                    <Link href="/portfolio" className="hover:text-zinc-400 transition-colors text-center">PORTFOLIO</Link>
                    <Link href="/about" className="hover:text-zinc-400 transition-colors text-center">ABOUT</Link>
                    <Link href="/impressum" className="hover:text-zinc-400 transition-colors text-center">LEGAL</Link>
                </div>
            </div>
        </nav>
    );
}
