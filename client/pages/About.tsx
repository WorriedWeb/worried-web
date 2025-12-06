import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Heart, Zap } from 'lucide-react';
import { useData } from '../context/DataContext';

export const About: React.FC = () => {
  const { teamMembers } = useData();

  return (
    <div className="bg-canvas dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-dark dark:text-white mb-6">
          We worry about the details, <br />
          <span className="text-primary dark:text-blue-400">so you don't have to.</span>
        </h1>
        <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          Worried Web was founded on a simple premise: Digital projects are stressful.
          Our mission is to absorb that anxiety and transform it into flawless, high-performance web experiences.
        </p>
      </section>

      {/* Values Grid */}
      <section className="py-16 bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-primary dark:text-blue-300 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 text-dark dark:text-white">Precision Focused</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We obsess over pixel-perfect implementation and clean code. Good enough is never enough for us.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 text-accent dark:text-orange-300 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 text-dark dark:text-white">Human Centered</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Technology serves people, not the other way around. We design with empathy and inclusivity at the core.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/50 text-support dark:text-teal-300 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-support group-hover:text-white transition-colors">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 text-dark dark:text-white">Proactive Energy</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We don't wait for problems to arise. We anticipate challenges and solve them before they impact your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-primary dark:text-blue-400 font-semibold tracking-wide uppercase text-sm mb-3">The Worriers</h2>
          <h3 className="font-heading text-3xl md:text-4xl font-bold text-dark dark:text-white">Meet the Team</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="group text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg group-hover:scale-105 transition-transform duration-300 bg-gray-200 dark:bg-gray-800">
                <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-lg font-bold text-dark dark:text-white">{member.name}</h4>
              <p className="text-primary dark:text-blue-400 font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats/CTA */}
      <section className="bg-primary dark:bg-gray-800 text-white py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Ready to work with a team that cares as much as you do?</h2>
              <p className="text-blue-100 text-lg mb-8">
                Let's discuss your project and see if we're the right fit to take your digital presence to the next level.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-accent text-white font-bold rounded-lg shadow-lg hover:bg-accent/90 transition-all transform hover:-translate-y-1"
              >
                Get in Touch
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="text-4xl font-bold text-warm mb-1">5+</div>
                <div className="text-sm text-blue-200">Years Experience</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="text-4xl font-bold text-warm mb-1">100+</div>
                <div className="text-sm text-blue-200">Projects Delivered</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="text-4xl font-bold text-warm mb-1">24/7</div>
                <div className="text-sm text-blue-200">Support Availability</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="text-4xl font-bold text-warm mb-1">98%</div>
                <div className="text-sm text-blue-200">Client Retention</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};