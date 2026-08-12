import React from 'react';
import { Users, Mail, MessageSquare } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  badge: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Ghapoutsa Limi",
    role: "Fondateur & Directeur du Projet",
    bio: "Visionnaire de la plateforme ESSOR au Cameroun, engagé dans la digitalisation et la démocratisation de l'accès aux opportunités professionnelles.",
    avatar: "GL",
    badge: "Fondateur & Visionnaire"
  },
  {
    name: "Tchantchou Nguemou",
    role: "Co-Fondateur & Lead Architecte SaaS",
    bio: "Ingénieur logiciel full-stack spécialisé dans les architectures web modernes et les moteurs de correspondance d'alertes instantanées par WhatsApp.",
    avatar: "TN",
    badge: "Lead Full-Stack"
  }
];

export const TeamSection: React.FC = () => {
  return (
    <section id="equipe" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-or-clair/30 border border-or-ambre/40 text-vert-profond text-xs sm:text-sm font-bold">
          <Users className="w-4 h-4 text-vert-profond" />
          <span>Porteurs du Projet</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-sora font-extrabold text-vert-profond tracking-tight">
          Les Porteurs du Projet ESSOR
        </h2>
        <p className="text-base text-encre/70 max-w-xl mx-auto font-medium">
          Une équipe passionnée au service de l'insertion professionnelle et de la transparence des opportunités au Cameroun.
        </p>
      </div>

      {/* Team Cards Grid (2 founders) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {TEAM_MEMBERS.map((member, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[32px] p-8 border border-sauge/40 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6 text-center group"
          >
            <div className="space-y-4">
              {/* Avatar circle */}
              <div className="w-24 h-24 rounded-full bg-vert-profond text-or-clair font-sora font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md border-2 border-or-ambre/30 group-hover:scale-105 transition-transform">
                {member.avatar}
              </div>

              {/* Badge */}
              <span className="inline-block px-3 py-1 rounded-full bg-sauge/30 text-vert-profond text-xs font-sora font-bold">
                {member.badge}
              </span>

              {/* Name & Role */}
              <div className="space-y-1">
                <h3 className="text-2xl font-sora font-extrabold text-vert-profond">
                  {member.name}
                </h3>
                <p className="text-xs font-bold text-or-ambre uppercase tracking-wider">
                  {member.role}
                </p>
              </div>

              {/* Bio */}
              <p className="text-sm text-encre/80 leading-relaxed font-medium">
                {member.bio}
              </p>
            </div>

            {/* Contact links */}
            <div className="pt-4 border-t border-sauge/30 flex items-center justify-center gap-3">
              <a
                href={`mailto:contact@jobalert.cm?subject=Contact%20pour%20${encodeURIComponent(member.name)}`}
                className="p-3 rounded-full bg-creme hover:bg-sauge/30 text-vert-profond transition-all"
                title={`Contacter ${member.name}`}
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/237699631950"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-whatsapp/15 text-whatsapp hover:bg-whatsapp/25 transition-all"
                title="WhatsApp Direct"
              >
                <MessageSquare className="w-4 h-4 fill-whatsapp" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
