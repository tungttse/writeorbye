'use client';

import Link from 'next/link';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Title */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Write or Bye
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            The ultimate writing productivity tool. Keep writing or face the consequences.
          </p>

          {/* CTA Button */}
          <Link
            href="/app"
            className="inline-block px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Writing →
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon="⏱️"
            title="Timed Sessions"
            description="Set a timer and commit to writing. Track your WPM, words written, and active time."
          />
          <FeatureCard
            icon="😈"
            title="Punishment Modes"
            description="Choose your consequence: gentle warnings, annoying sounds, or hardcore text deletion!"
          />
          <FeatureCard
            icon="📊"
            title="Track Progress"
            description="Set word targets, see progress bars, and watch your stats in real-time."
          />
        </div>

        {/* How It Works */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <StepCard number="1" title="Set Timer" description="Choose your session length" />
            <StepCard number="2" title="Start Writing" description="Begin your focused session" />
            <StepCard number="3" title="Keep Going" description="Don't stop or face consequences" />
            <StepCard number="4" title="Export" description="Save your work as .txt or .md" />
          </div>
        </div>

        {/* Punishment Modes Showcase */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Challenge</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ModeCard
              mode="Gentle"
              color="green"
              description="Screen turns red as a warning. Perfect for beginners."
              icon="🌱"
            />
            <ModeCard
              mode="Medium"
              color="yellow"
              description="Warning sounds + visual effects. For the committed writer."
              icon="⚡"
            />
            <ModeCard
              mode="Hardcore"
              color="red"
              description="Your text starts DELETING. Only for the brave!"
              icon="💀"
            />
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center">
          <p className="text-xl text-gray-400 mb-6">Ready to boost your writing productivity?</p>
          <Link
            href="/app"
            className="inline-block px-8 py-4 text-lg font-semibold bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Writing Now
          </Link>
        </div>

        <Footer variant="landing" />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/15 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold mx-auto mb-3">
        {number}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

function ModeCard({ mode, color, description, icon }: { mode: string; color: string; description: string; icon: string }) {
  const colorClasses = {
    green: 'border-green-500 text-green-400',
    yellow: 'border-yellow-500 text-yellow-400',
    red: 'border-red-500 text-red-400',
  };

  return (
    <div className={`border-2 ${colorClasses[color as keyof typeof colorClasses]} rounded-xl p-6 text-center bg-white/5`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className={`text-xl font-bold mb-2 ${colorClasses[color as keyof typeof colorClasses]}`}>{mode}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}