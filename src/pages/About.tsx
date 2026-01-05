import { Users, Target, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About RideNow</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We're on a mission to reimagine transportation for a connected world.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              To provide safe, reliable, and affordable transportation for everyone, everywhere. We believe that mobility is a fundamental right, and we're dedicated to making it accessible to all.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We started with a simple idea: push a button, get a ride. Today, we're connecting millions of people across cities, reducing congestion, and creating earning opportunities for drivers.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <Users className="h-10 w-10 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900">10M+</div>
              <div className="text-sm text-gray-500">Riders</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <Target className="h-10 w-10 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-500">Cities</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-500">Insured</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <Users className="h-10 w-10 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900">2M+</div>
              <div className="text-sm text-gray-500">Drivers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600">The people driving RideNow forward.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Dummy team members */}
             {[1, 2, 3].map((i) => (
               <div key={i} className="bg-white p-6 rounded-xl shadow-sm text-center">
                 <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                 <h3 className="text-xl font-bold text-gray-900">Team Member {i}</h3>
                 <p className="text-primary-600">Position</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
