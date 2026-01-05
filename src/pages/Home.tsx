import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, MapPin, Star } from 'lucide-react';
import { Button } from '../components/common/Button';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="City traffic"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-48">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Your Ride, <span className="text-primary-400">Your Way</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Experience the safest, fastest, and most comfortable way to get around town. Join millions of riders today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 border-white text-white hover:bg-white hover:text-black">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose RideNow?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We focus on safety, reliability, and comfort to ensure every ride is a great experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-12 w-12 text-black" />}
              title="Secure Rides"
              description="Every ride is tracked and insured. Our drivers are vetted and trained for your safety."
            />
            <FeatureCard
              icon={<Clock className="h-12 w-12 text-black" />}
              title="Always On Time"
              description="Our advanced algorithm finds the nearest driver to ensure you never wait too long."
            />
            <FeatureCard
              icon={<MapPin className="h-12 w-12 text-black" />}
              title="Real-Time Tracking"
              description="Track your ride in real-time and share your location with loved ones for peace of mind."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting a ride is easier than ever. Just follow these simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard number="1" title="Book a Ride" description="Enter your destination and choose your ride type." />
            <StepCard number="2" title="Match Driver" description="We'll connect you with a nearby top-rated driver." />
            <StepCard number="3" title="Track Ride" description="See your driver's location and arrival time." />
            <StepCard number="4" title="Arrive Safely" description="Pay seamlessly and rate your experience." />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Loved by Thousands</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our happy riders have to say about their experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="Daily Commuter"
              content="RideNow has transformed my daily commute. The drivers are professional and I always feel safe."
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <TestimonialCard
              name="Michael Chen"
              role="Business Traveler"
              content="Reliability is key for me. RideNow delivers every time, whether it's an airport run or a client meeting."
              image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <TestimonialCard
              name="Emily Davis"
              role="Weekend Explorer"
              content="I love how easy the app is to use. The estimated fares are accurate and there are no hidden fees."
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to ride?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Download the app or sign up online to start riding with the best in the business.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-gray-200">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-black">
                Become a Driver
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
    <div className="mb-6">{icon}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="relative p-6 text-center">
    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
      {number}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TestimonialCard = ({ name, role, content, image }: { name: string; role: string; content: string; image: string }) => (
  <div className="p-8 rounded-2xl bg-white shadow-sm border border-gray-100">
    <div className="flex items-center gap-4 mb-6">
      <img src={image} alt={name} className="w-12 h-12 rounded-full" />
      <div>
        <h4 className="font-bold text-gray-900">{name}</h4>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
    <div className="flex mb-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-600 italic">"{content}"</p>
  </div>
);

export default Home;
