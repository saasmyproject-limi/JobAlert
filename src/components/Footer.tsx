import React from 'react';
import { Link } from '../router/Router';
import { MessageSquare, Heart, Mail, MapPin, Users, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-sauge/40 bg-vert-profond text-creme pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-sora font-extrabold text-2xl tracking-tight text-creme">
                ES<span className="text-or-ambre">SOR</span>
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-whatsapp inline-block animate-pulse" />
            </div>
            <p className="text-creme/70 text-xs leading-relaxed font-medium">
              1ère plateforme nationale d'alertes instantanées par WhatsApp pour les emplois formels, concours MINFOPRA, stages et bourses d'études au Cameroun.
            </p>
            <div className="flex items-center gap-2 text-xs text-whatsapp font-bold">
              <MessageSquare className="w-4 h-4 fill-whatsapp" />
              <span>Support WhatsApp : +237 699 63 19 50</span>
            </div>
          </div>

          {/* Col 2: Navigation rapide */}
          <div className="space-y-3">
            <h4 className="font-sora font-extrabold text-or-clair text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium text-creme/80">
              <li>
                <Link to="/" className="hover:text-or-clair transition-colors">Accueil</Link>
              </li>
              <li>
                <Link to="/offres" className="hover:text-or-clair transition-colors">Opportunités & Offres</Link>
              </li>
              <li>
                <Link to="/publier" className="hover:text-or-clair transition-colors">Publier une annonce</Link>
              </li>
              <li>
                <a href="#equipe" className="hover:text-or-clair transition-colors flex items-center gap-1">
                  <Users className="w-3 h-3 text-or-ambre" />
                  <span>Porteurs du Projet (Équipe)</span>
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-or-clair transition-colors flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-or-ambre" />
                  <span>Questions Fréquentes (FAQ)</span>
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-or-clair transition-colors flex items-center gap-1">
                  <Mail className="w-3 h-3 text-or-ambre" />
                  <span>Nous Contacter</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Porteurs du Projet */}
          <div className="space-y-3">
            <h4 className="font-sora font-extrabold text-or-clair text-xs uppercase tracking-wider">
              Porteurs du Projet
            </h4>
            <ul className="space-y-2 text-xs font-medium text-creme/80">
              <li className="flex flex-col">
                <span className="font-bold text-creme">Ghapoutsa Limi</span>
                <span className="text-[11px] text-creme/60">Fondateur & Directeur du Projet</span>
              </li>
              <li className="flex flex-col">
                <span className="font-bold text-creme">Tchantchou Nguemou</span>
                <span className="text-[11px] text-creme/60">Co-Fondateur & Lead Architecte</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Bureaux & Contact */}
          <div className="space-y-3">
            <h4 className="font-sora font-extrabold text-or-clair text-xs uppercase tracking-wider">
              Bureaux & Contact
            </h4>
            <div className="space-y-2 text-xs text-creme/80 font-medium">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-or-ambre flex-shrink-0" />
                <span>Douala & Yaoundé, Cameroun</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-or-ambre flex-shrink-0" />
                <span>contact@jobalert.cm</span>
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/237699631950"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-whatsapp text-vert-profond font-sora font-bold text-xs hover:bg-whatsapp/90 transition-all shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-vert-profond" />
                  <span>Rejoindre la communauté WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Line & Copyright */}
        <div className="pt-8 border-t border-creme/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-creme/60 font-medium">
          <div>
            © {new Date().getFullYear()} ESSOR Cameroun. Tous droits réservés.
          </div>
          <div className="flex items-center gap-1">
            <span>Conçu avec</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
            <span>par Ghapoutsa Limi & Tchantchou Nguemou</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
