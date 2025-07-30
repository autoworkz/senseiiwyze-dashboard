import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-sm">S</span>
      </div>
      <span className="text-lg font-semibold text-foreground">SenseiiWyze</span>
    </Link>
  );
}