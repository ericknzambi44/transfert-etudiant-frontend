// src/views/LandingView.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, Users, Building2, Shield, ArrowRight, 
  CheckCircle, FileText, UserCheck, ThumbsUp, ChevronRight,
  Code, Github, Linkedin 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    title: "1. L'établissement rejoint la plateforme",
    description: "L'université crée son compte en quelques secondes.",
    icon: Building2,
    color: "text-primary",
  },
  {
    title: "2. Ouverture du dossier étudiant",
    description: "L'établissement saisit l'email de l'étudiant (le reste est facultatif).",
    icon: FileText,
    color: "text-secondary",
  },
  {
    title: "3. Validation du départ",
    description: "L'établissement confirme que l'étudiant peut quitter.",
    icon: CheckCircle,
    color: "text-primary",
  },
  {
    title: "4. L'étudiant accepte",
    description: "L'étudiant reçoit un lien et donne son accord (sans identifiant).",
    icon: UserCheck,
    color: "text-accent",
  },
  {
    title: "5. L'université d'accueil valide",
    description: "L'établissement cible accepte l'étudiant après vérification.",
    icon: ThumbsUp,
    color: "text-green-600",
  },
];

export default function LandingView() {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-rdc opacity-10" />
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium text-primary animate-pulse-glow">
              <GraduationCap className="h-4 w-4" />
              Plateforme officielle RDC
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-in slide-in-from-top-2">
              Student Go RDC
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simplifiez les transferts entre universités : transparent, sécurisé et sans fraude.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/register/etablissement">
                <Button size="lg" className="btn-elite gap-2">
                  Inscrire mon établissement <Building2 className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register/etudiant">
                <Button size="lg" variant="outline" className="gap-2">
                  Rejoindre en tant qu'étudiant <Users className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="ghost" onClick={() => setShowGuide(!showGuide)} className="gap-2">
                <ChevronRight className={cn("h-4 w-4 transition-transform", showGuide && "rotate-90")} />
                Guide d'utilisation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Guide d'utilisation (étapes) – responsive avec défilement horizontal sur mobile */}
      <div className={cn(
        "container transition-all duration-500 overflow-hidden",
        showGuide ? "max-h-[800px] opacity-100 py-8" : "max-h-0 opacity-0 py-0"
      )}>
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border">
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Comment ça marche ?
          </h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex md:grid md:grid-cols-5 gap-4 min-w-max md:min-w-0">
              {steps.map((step, idx) => (
                <div key={idx} className="text-center space-y-2 w-48 md:w-auto flex-shrink-0">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                    <step.icon className={cn("h-8 w-8", step.color)} />
                  </div>
                  <div className="font-semibold text-sm md:text-base">{step.title}</div>
                  <p className="text-xs md:text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 p-4 bg-primary/5 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">📌 En résumé :</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>L'université d'origine crée un compte et ajoute l'étudiant (juste son email).</li>
              <li>Elle valide le dossier de départ.</li>
              <li>L'étudiant reçoit un lien, l'ouvre et clique sur "Je consens".</li>
              <li>L'université d'accueil se connecte, recherche l'étudiant par email et accepte le transfert.</li>
              <li>C'est fini ! L'étudiant peut être accueilli.</li>
            </ol>
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="font-semibold">💡 À savoir :</span> L'étudiant doit d'abord créer son compte avec son adresse email sur la plateforme. Les établissements utiliseront exactement cet email pour lui créer un dossier.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card-inner p-6 text-center hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sécurisé & fiable</h3>
            <p className="text-muted-foreground">Chaque étape est enregistrée et vérifiable.</p>
          </div>
          <div className="card-inner p-6 text-center hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Parcours préservé</h3>
            <p className="text-muted-foreground">Les crédits et cours suivent l'étudiant.</p>
          </div>
          <div className="card-inner p-6 text-center hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Réseau national</h3>
            <p className="text-muted-foreground">Toutes les universités du pays sont connectées.</p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-gradient-rdc py-16 mt-8">
        <div className="container text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Prêt à commencer ?</h2>
          <p className="text-white/80 max-w-xl mx-auto">Créez un compte en quelques instants.</p>
          <Link to="/login">
            <Button variant="secondary" size="lg" className="gap-2">
              Se connecter <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer / Crédits */}
      <footer className="container py-8 border-t text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Student Go RDC – Plateforme de transfert inter-universitaire</p>
        <p className="mt-2 flex items-center justify-center gap-2">
          <Code className="h-4 w-4" /> Développé par <span className="font-medium text-foreground">Erick Nzambi</span>
          <a href="https://github.com/ericknzambi44" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
            <Github className="h-4 w-4" />
          </a>
          <a href="https://www.linkedin.com/in/erick-nzambi-4013a6379" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
            <Linkedin className="h-4 w-4" />
          </a>
        </p>
      </footer>
    </div>
  );
}