import { Plane } from 'lucide-react';
const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
                    
                    {/* Branding Section */}
                    <div className="sm:col-span-2 md:col-span-1">
                        <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Plane className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Udaan</h3>
                        </div>
                        <p className="text-sm text-slate-400">Your trusted partner for hassle-free flight bookings.</p>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Press</a></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Cancellation</a></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
                    <p>&copy; 2025 Lakshaya Papnai. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
