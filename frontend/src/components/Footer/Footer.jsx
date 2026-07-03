import React from 'react'
import logo from '../../assets/shortlogo.svg'

function Footer() {
    const footerLinks = [
        "About", "Accessibility", "User Agreement", "Privacy Policy",
        "Cookie Policy", "Copyright Policy", "Brand Policy",
        "Guest Controls", "Community Guidelines", "Language"
    ]

    return (
        <footer className="w-full bg-white border-t border-gray-200 py-4 px-4 sm:px-8">
            <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-3">
                {/* Links row */}
                <div className="flex flex-wrap justify-center items-center gap-x-1 gap-y-1">
                    {footerLinks.map((link, idx) => (
                        <span key={link} className="flex items-center">
                            
                               <a href="#"
                                className="text-xs text-zinc-500 hover:text-blue-700 hover:underline transition-colors px-1"
                            >
                                {link}
                            </a>
                            {idx !== footerLinks.length - 1 && (
                                <span className="text-zinc-300 text-xs">•</span>
                            )}
                        </span>
                    ))}
                </div>

                {/* Logo + copyright row */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                    <img src={logo} alt="LinkedIn" className="w-5 h-5" />
                    <span>LinkedIn Corporation © {new Date().getFullYear()}</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer