import { Link } from "react-router-dom";
import { 
  Home, 
  Info, 
  Newspaper, 
  Mail, 
  MapPin, 
  Phone, 
  GraduationCap,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronRight
} from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-school-primary dark:bg-gray-900 text-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-school-accent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-school-secondary rounded-full blur-3xl animate-float delay-300"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="animate-fadeInUp">
            <div className="mb-4">
              <Logo size="md" showText={true} />
            </div>
            <p className="text-white/80 dark:text-gray-300 leading-relaxed mb-4">
              Our values: Faith, Science, Discipline
            </p>
            <div className="flex gap-3 mt-4">
              <a 
                href="https://www.facebook.com/pages/CSAMZ/255599934611910?locale=en_GB" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/Csamztss" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/csamzupdates__1/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://rw.linkedin.com/in/hitayezu-eustache-01081a357" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="animate-fadeInUp delay-100">
            <h5 className="font-semibold mb-4 text-white dark:text-school-accent">Quick Links</h5>
            <ul className="space-y-2 text-white/80 dark:text-gray-300">
              <li>
                <Link to="/" className="hover:text-white dark:hover:text-school-accent transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white dark:hover:text-school-accent transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  <Info className="w-4 h-4" />
                  About
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-white dark:hover:text-school-accent transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  <Newspaper className="w-4 h-4" />
                  News
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white dark:hover:text-school-accent transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  <Mail className="w-4 h-4" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="animate-fadeInUp delay-200">
            <h5 className="font-semibold mb-4 text-white dark:text-school-accent">Our Programs</h5>
            <ul className="space-y-2 text-white/80 dark:text-gray-300">
              <li>
                <Link to="/programs/software-development" className="hover:text-white dark:hover:text-school-accent transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Software Development
                </Link>
              </li>
              <li>
                <Link to="/programs/computer-systems" className="hover:text-white dark:hover:text-school-accent transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Computer Systems & Architecture
                </Link>
              </li>
              <li>
                <Link to="/programs/building-construction" className="hover:text-white dark:hover:text-school-accent transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Building Construction
                </Link>
              </li>
              <li>
                <Link to="/programs/plumbing-technology" className="hover:text-white dark:hover:text-school-accent transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Plumbing Technology
                </Link>
              </li>
              <li>
                <Link to="/programs/wood-technology" className="hover:text-white dark:hover:text-school-accent transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Wood Technology
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="animate-fadeInUp delay-300">
            <h5 className="font-semibold mb-4 text-white dark:text-school-accent">Contact Info</h5>
            <div className="space-y-3 text-white/80 dark:text-gray-300">
              <p className="hover:text-white dark:hover:text-school-accent transition-colors flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Muko, Gicumbi District<br />Northern Province, Rwanda</span>
              </p>
              <p className="hover:text-white dark:hover:text-school-accent transition-colors flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                +250 788 123 456
              </p>
              <p className="hover:text-white dark:hover:text-school-accent transition-colors flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                info@csamzaccaria.edu.rw
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 dark:border-gray-700 mt-8 pt-8 text-center text-white/60 dark:text-gray-400 animate-fadeInUp delay-400">
          <p className="hover:text-white dark:hover:text-school-accent transition-colors">&copy; {new Date().getFullYear()} Collegio Santo Antonio Maria Zaccaria. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
