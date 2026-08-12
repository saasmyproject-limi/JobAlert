import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send, CheckCircle2, PhoneCall } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Question générale');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-whatsapp/15 border border-whatsapp/30 text-vert-profond text-xs sm:text-sm font-bold">
          <MessageSquare className="w-4 h-4 text-whatsapp fill-whatsapp" />
          <span>Support & Inquiries</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-sora font-extrabold text-vert-profond tracking-tight">
          Contactez l'Équipe JobAlert
        </h2>
        <p className="text-base text-encre/70 max-w-xl mx-auto font-medium">
          Une question, une suggestion ou un partenariat ? Écrivez-nous ou contactez-nous directement sur WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card WhatsApp */}
          <a
            href="https://wa.me/237699631950"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-[28px] p-6 border border-sauge/40 shadow-subtle hover:shadow-card hover:-translate-y-0.5 transition-all flex items-start gap-4 block group"
          >
            <div className="w-12 h-12 rounded-2xl bg-whatsapp/15 text-whatsapp flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-6 h-6 fill-whatsapp" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-whatsapp uppercase tracking-wider">Assistance Directe</span>
              <h3 className="text-lg font-sora font-extrabold text-vert-profond">WhatsApp Support</h3>
              <p className="text-sm font-bold text-encre/80">+237 699 63 19 50</p>
              <p className="text-xs text-encre/60">Disponible du Lundi au Samedi (8h - 18h)</p>
            </div>
          </a>

          {/* Card Email */}
          <div className="bg-white rounded-[28px] p-6 border border-sauge/40 shadow-subtle flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sauge/40 text-vert-profond flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-vert-profond uppercase tracking-wider">Email Officiel</span>
              <h3 className="text-lg font-sora font-extrabold text-vert-profond">Écrivez-nous</h3>
              <p className="text-sm font-bold text-encre/80">contact@jobalert.cm</p>
              <p className="text-xs text-encre/60">Réponse garantie sous 24h ouvrées</p>
            </div>
          </div>

          {/* Card Location */}
          <div className="bg-white rounded-[28px] p-6 border border-sauge/40 shadow-subtle flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-or-clair/40 text-vert-profond flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-vert-profond uppercase tracking-wider">Bureaux</span>
              <h3 className="text-lg font-sora font-extrabold text-vert-profond">Siège & Couverture</h3>
              <p className="text-sm text-encre/80 font-medium">Douala & Yaoundé, Cameroun</p>
              <p className="text-xs text-encre/60">Couverture nationale sur les 10 régions</p>
            </div>
          </div>

        </div>

        {/* Right Column: Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[32px] p-6 sm:p-8 border border-sauge/40 shadow-subtle">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-whatsapp/20 text-whatsapp flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-sora font-extrabold text-vert-profond">
                Message envoyé avec succès !
              </h3>
              <p className="text-sm text-encre/80 max-w-md mx-auto">
                Merci {name}. Notre équipe a bien reçu votre demande et vous répondra très rapidement sur votre adresse {email} ou par WhatsApp.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setMessage('');
                }}
                className="px-6 py-2.5 rounded-full bg-vert-profond text-creme font-sora font-bold text-xs hover:bg-vert-moyen transition-all"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-xl font-sora font-extrabold text-vert-profond mb-2">
                Envoyer un message à l'équipe
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-vert-profond mb-1">Votre Nom complet *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Paul Biya"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-vert-profond mb-1">Votre Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="ex: paul@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-vert-profond mb-1">Numéro WhatsApp</label>
                  <input
                    type="text"
                    placeholder="ex: +237 699 00 11 22"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-vert-profond mb-1">Sujet de votre message</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-semibold transition-all bg-white"
                  >
                    <option value="Question générale">Question générale</option>
                    <option value="Partenariat recruteur">Partenariat recruteur / entreprise</option>
                    <option value="Assistance technique">Assistance technique</option>
                    <option value="Signalement d'annonce">Signalement d'une annonce</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-vert-profond mb-1">Votre Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Posez votre question ou détaillez votre demande ici..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-sauge/60 focus:border-vert-profond focus:ring-2 focus:ring-vert-profond/20 outline-none text-encre text-sm font-medium transition-all"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-vert-profond hover:bg-vert-moyen text-creme font-sora font-extrabold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-or-clair" />
                <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer mon message'}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
