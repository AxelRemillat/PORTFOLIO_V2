import Link from "next/link";

export const metadata = {
  title: "Contact — Axel Remillat",
  description: "Contacter Axel Remillat — email, LinkedIn, GitHub.",
};

const links = [
  {
    label: "Email",
    value: "axelremillat@netcourrier.com",
    href: "mailto:axelremillat@netcourrier.com",
    icon: "✉",
  },
  {
    label: "LinkedIn",
    value: "axel-remillatesmelyon",
    href: "https://www.linkedin.com/in/axel-remillatesmelyon",
    icon: "in",
  },
  {
    label: "GitHub",
    value: "@axelremillat",
    href: "https://github.com/",
    icon: "GH",
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-sm font-mono text-orange mb-3 tracking-[0.12em] uppercase">Contact</p>
      <h1 className="text-4xl font-bold text-white mb-4">Parlons-en</h1>
      <p className="text-muted mb-12">
        Projet data, mission IA, collaboration ou juste une question — je lis tout.
      </p>

      <div className="space-y-4 mb-12">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center gap-5 p-5 bg-surface border border-border rounded-xl hover:border-orange/40 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-border flex items-center justify-center text-sm font-mono text-muted group-hover:bg-orange/10 group-hover:text-orange transition-colors shrink-0">
              {link.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted mb-0.5">{link.label}</p>
              <p className="text-white text-sm font-medium truncate">{link.value}</p>
            </div>
            <span className="ml-auto text-muted group-hover:text-white transition-colors shrink-0">
              →
            </span>
          </Link>
        ))}
      </div>

      <div className="p-5 bg-orange/5 border border-orange/20 rounded-xl">
        <p className="text-sm text-muted leading-relaxed">
          <span className="text-text font-medium">Disponibilité :</span> Alternance chez{" "}
          <span className="text-text">Andra Learning</span> depuis juillet 2026.
          Ouvert aux collaborations et missions IA complémentaires.
        </p>
      </div>
    </div>
  );
}
