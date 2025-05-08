import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { LandingNav } from "../../components/LandingNav";
import { SiteFooter } from "../../components/SiteFooter";
import UserIcon from "../../components/UserIcon"; // Import the updated UserIcon

const Homepage = () => {
  // Testimonial data
  const testimonials = [
    {
      quote:
        "Bookit has completely transformed how we schedule meetings. The interface is intuitive and the booking process is seamless.",
      name: "Sarah Johnson",
      title: "Marketing Director",
    },
    {
      quote:
        "I've tried many scheduling tools, but Bookit stands out with its reliability and feature set. Highly recommended!",
      name: "Michael Chen",
      title: "Product Manager",
    },
    {
      quote:
        "The ability to check room availability in real-time has saved us countless hours of back-and-forth emails.",
      name: "Emily Rodriguez",
      title: "HR Specialist",
    },
    {
      quote: "Our team productivity increased by 30% after implementing Bookit for our meeting management.",
      name: "David Kim",
      title: "Operations Lead",
    },
    {
      quote:
        "The calendar integration works flawlessly with our existing systems. Couldn't be happier with this platform.",
      name: "Jessica Taylor",
      title: "IT Director",
    },
    {
      quote: "Customer support is exceptional. Any questions we had were answered promptly and thoroughly.",
      name: "Robert Wilson",
      title: "CEO",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col">
      <LandingNav />

      {/* Top image placeholder - 66px tall */}
      <div className="h-[66px] bg-gray-200 w-full">
        <img src="/placeholder.svg" alt="Top banner" className="w-full h-full object-cover" />
      </div>

      {/* Main banner - 524px tall */}
      <div className="h-[524px] bg-[#1e5393] text-white flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Bookit</h1>
        <p className="text-xl md:text-2xl mb-10 max-w-2xl">Your Meeting Reservation Platform</p>
        <div className="flex gap-4">
          <Button asChild size="lg" variant="secondary">
            <Link to="/sign-in">Sign In</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/sign-up">Register</Link>
          </Button>
        </div>
      </div>

      {/* Middle image placeholder - 240px tall */}
      <div className="h-[240px] bg-gray-200 w-full">
        <img src="/placeholder.svg" alt="Middle banner" className="w-full h-full object-cover" />
      </div>

      {/* Testimonials section */}
      <section className="py-16 bg-[#1e5393] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">What Our Users Say</h2>
            <p className="text-lg max-w-3xl mx-auto">
              Find the perfect meeting room anytime, anywhere. Check availability, book instantly, and make your
              meetings memorable—effortless scheduling at your fingertips!
            </p>
          </div>

          {/* Testimonial cards - 3x2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card text-gray-900 mx-auto">
                <div className="testimonial-quote">"{testimonial.quote}"</div>
                <div className="testimonial-author">
                  <div className="author-avatar bg-gray-300 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-600" /> {/* Now it accepts className */}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default Homepage;
