import Link from "next/link";
import { Bi } from "@/components/ui/bi";

export default function NotFound() {
  return (
    <div className="site-container py-24 text-center">
      <div className="max-w-md mx-auto journal-paper p-8 border border-rule rounded-sm space-y-4">
        <span className="heritage-stamp text-xs font-mono font-semibold uppercase px-3 py-1 text-terracotta inline-block">
          404 · पृष्ठ नहीं मिला
        </span>
        <Bi
          hindi="पृष्ठ उपलब्ध नहीं है"
          english="Page Not Found"
          as="h1"
          className="text-2xl font-heading font-medium text-text"
        />
        <p className="text-sm text-secondary font-heading">
          यह पृष्ठ हटा दिया गया है या इसका पता बदल दिया गया है।
          <br />
          The page you requested does not exist in this field archive.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary-hover text-xs font-mono uppercase tracking-wider rounded-sm transition-colors shadow-xs"
          >
            <span>मुख्य पृष्ठ पर लौटें / Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

