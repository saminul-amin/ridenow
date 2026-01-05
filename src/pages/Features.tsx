import { Shield, Clock, Map, CreditCard, User, Heart } from 'lucide-react';

const Features = () => {
    const features = [
        {
          title: "Safety First",
          description: "From verified drivers to real-time trip tracking, your safety is our top priority.",
          icon: <Shield className="h-8 w-8 text-primary" />,
        },
        {
          title: "Fast Pickups",
          description: "Get picked up in minutes. Our smart dispatch system finds the nearest driver instantly.",
          icon: <Clock className="h-8 w-8 text-primary" />,
        },
        {
          title: "Smart Routing",
          description: "We optimize routes to get you to your destination as quickly and efficiently as possible.",
          icon: <Map className="h-8 w-8 text-primary" />,
        },
        {
          title: "Cashless Payments",
          description: "Pay securely with credit/debit cards or digital wallets. No cash needed.",
          icon: <CreditCard className="h-8 w-8 text-primary" />,
        },
        {
          title: "Top-Rated Drivers",
          description: "Ride with the best. All drivers are rated by riders like you to ensure quality.",
          icon: <User className="h-8 w-8 text-primary" />,
        },
        {
          title: "24/7 Support",
          description: "Our support team is always available to help with any questions or issues.",
          icon: <Heart className="h-8 w-8 text-primary" />,
        },
      ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Features</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover why millions of people choose RideNow for their daily commute, errands, and adventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-6 bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
