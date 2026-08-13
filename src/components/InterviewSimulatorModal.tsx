import React, { useState } from 'react';
import { JobOffer, UserProfile } from '../types';
import { MessageSquare, Send, CheckCircle, RefreshCw, X, Globe, Sparkles } from 'lucide-react';

interface InterviewSimulatorModalProps {
  job: JobOffer;
  user: UserProfile;
  onClose: () => void;
}

export const InterviewSimulatorModal: React.FC<InterviewSimulatorModalProps> = ({ job, user, onClose }) => {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const questions = {
    fr: [
      `1. Pouvez-vous vous présenter brièvement et nous expliquer votre intérêt pour le poste de ${job.title} chez ${job.organization} ?`,
      `2. Quelles sont vos compétences clés en ${user.domain || 'votre secteur'} et comment les avez-vous appliquées dans vos expériences passées ?`,
      `3. Comment gérez-vous une situation de pression ou un délai serré dans votre travail au quotidien ?`,
    ],
    en: [
      `1. Could you briefly introduce yourself and explain why you applied for the ${job.title} position at ${job.organization}?`,
      `2. What are your core technical skills in ${user.domain || 'your field'} and how did you use them in previous projects?`,
      `3. How do you handle high-pressure deadlines or remote collaboration challenges?`,
    ],
  };

  const handleSendAnswer = () => {
    if (!userAnswer.trim()) return;

    if (lang === 'fr') {
      setFeedback(
        `✅ Bon point ! Votre réponse valorise bien votre motivation. Conseil IA : Pensez à citer un exemple concret chiffré (ex: projet livré, pourcentage de gain).`
      );
    } else {
      setFeedback(
        `✅ Great answer! Clear structure. AI Tip: Highlight specific metrics or tools used to make your response even stronger.`
      );
    }
  };

  const handleNextQuestion = () => {
    setUserAnswer('');
    setFeedback(null);
    if (currentStep < questions[lang].length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setCurrentStep(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-vert-profond/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-2xl w-full border border-sauge shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-sauge/20 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-vert-profond text-creme flex items-center justify-center font-bold text-xl">
              🎙️
            </div>
            <div>
              <h3 className="text-xl font-sora font-extrabold text-vert-profond flex items-center gap-2">
                <span>Simulateur d'Entretien IA</span>
                <span className="px-2.5 py-0.5 rounded-full bg-vert-profond/10 text-vert-profond text-[10px] font-bold">FR / EN</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Entraînement pour : <span className="font-bold text-vert-profond">{job.title}</span>
              </p>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full text-xs font-bold">
            <button
              onClick={() => { setLang('fr'); setCurrentStep(0); setFeedback(null); }}
              className={`px-3 py-1 rounded-full transition-all ${lang === 'fr' ? 'bg-vert-profond text-creme shadow-sm' : 'text-slate-500'}`}
            >
              Français 🇫🇷
            </button>
            <button
              onClick={() => { setLang('en'); setCurrentStep(0); setFeedback(null); }}
              className={`px-3 py-1 rounded-full transition-all ${lang === 'en' ? 'bg-vert-profond text-creme shadow-sm' : 'text-slate-500'}`}
            >
              English 🇬🇧
            </button>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
            Question {currentStep + 1} / {questions[lang].length}
          </span>
          <p className="text-sm font-sora font-bold text-vert-profond leading-relaxed">
            {questions[lang][currentStep]}
          </p>
        </div>

        {/* Answer Input */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-vert-profond">
            Saisissez ou dictez votre réponse d'entraînement :
          </label>
          <textarea
            rows={4}
            placeholder={lang === 'fr' ? 'Tapez votre réponse ici...' : 'Type your answer here...'}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full p-4 rounded-2xl border border-sauge/60 focus:border-vert-profond outline-none text-xs font-medium leading-relaxed text-encre bg-white"
          ></textarea>
        </div>

        {/* Feedback Section */}
        {feedback && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 space-y-1">
            <p className="font-extrabold flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Analyse & Evaluation IA ESSOR :</span>
            </p>
            <p>{feedback}</p>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handleSendAnswer}
            disabled={!userAnswer.trim()}
            className="px-5 py-2.5 rounded-full bg-vert-profond hover:bg-vert-moyen text-creme font-sora font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{lang === 'fr' ? 'Analyser ma réponse' : 'Analyze my answer'}</span>
          </button>

          <button
            onClick={handleNextQuestion}
            className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 font-sora font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'fr' ? 'Question suivante' : 'Next question'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
