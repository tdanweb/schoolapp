import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

const SchoolFooter = ({
  schoolName = "Achiever's International Academy",
  motto = "For Outstanding Success with Discipline",
  phone = "+234 800 500 6010",
  email = "info@achieverschools.edu.ng",
  address = "Plot 26, GRA Maitama, Abuja, Nigeria",
  logo = null,
  year = new Date().getFullYear(),
}) => {
  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "About Us", href: "#" },
    { name: "Admissions", href: "/admission" },
    { name: "Academics", href: "/academics" },
    { name: "Our Staff", href: "#" },
    { name: "Calendar", href: "/calendar" },
  ];

  const schoolLinks = [
    { name: "Student Portal", href: "/app/user" },
    { name: "Parent Portal", href: "/app/user" },
    { name: "Staff Portal", href: "/app/user" },
    { name: "School News", href: "/blog" },
    { name: "Events", href: "#" },
    { name: "Gallery", href: "#" },
  ];

  return (
    <footer className="bg-[#071A3D] text-white mt-5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* School Info */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              {logo ? (
                <img
                  src={logo}
                  alt={`${schoolName} logo`}
                  className="w-14 h-14 object-contain"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center">
                  <span className="text-[#071A3D] font-bold text-xl">
                    AIA
                  </span>
                </div>
              )}

              <div>
                <h2 className="font-bold text-lg leading-tight">
                  {schoolName}
                </h2>
                <p className="text-[#D4AF37] text-xs mt-1">
                  {motto}
                </p>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-7 max-w-sm">
              Building confident, disciplined and academically excellent
              students through quality education and character development.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-[#071A3D] flex items-center justify-center transition"
              >
                <FaFacebookF size={14} />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-[#071A3D] flex items-center justify-center transition"
              >
                <FaInstagram size={14} />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-[#071A3D] flex items-center justify-center transition"
              >
                <FaTwitter size={14} />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-[#071A3D] flex items-center justify-center transition"
              >
                <FaYoutube size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-300 hover:text-[#D4AF37] text-sm transition"
                  >
                    <FaArrowRight
                      size={10}
                      className="text-[#D4AF37] group-hover:translate-x-1 transition"
                    />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* School Links */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              School Links
            </h3>

            <ul className="space-y-3">
              {schoolLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-300 hover:text-[#D4AF37] text-sm transition"
                  >
                    <FaArrowRight
                      size={10}
                      className="text-[#D4AF37] group-hover:translate-x-1 transition"
                    />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Contact Us
            </h3>

            <div className="space-y-5">

              {/* Address */}
              <div className="flex gap-3">
                <div className="text-[#D4AF37] mt-1">
                  <FaMapMarkerAlt />
                </div>

                <p className="text-gray-300 text-sm leading-6">
                  {address}
                </p>
              </div>

              {/* Phone */}
              <div className="flex gap-3">
                <div className="text-[#D4AF37] mt-1">
                  <FaPhoneAlt size={14} />
                </div>

                <a
                  href={`tel:${phone}`}
                  className="text-gray-300 hover:text-[#D4AF37] text-sm transition"
                >
                  {phone}
                </a>
              </div>

              {/* Email */}
              <div className="flex gap-3">
                <div className="text-[#D4AF37] mt-1">
                  <FaEnvelope size={15} />
                </div>

                <a
                  href={`mailto:${email}`}
                  className="text-gray-300 hover:text-[#D4AF37] text-sm transition break-all"
                >
                  {email}
                </a>
              </div>
            </div>

            {/* CTA */}
            <a
              href="/admission"
              className="inline-flex items-center gap-2 mt-7 bg-[#D4AF37] text-[#071A3D] px-5 py-3 rounded-md text-sm font-semibold hover:bg-[#e5c45a] transition"
            >
              Apply for Admission
              <FaArrowRight size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">

            <p className="text-gray-400 text-center md:text-left">
              © {year}{" "}
              <span className="text-white font-medium">
                {schoolName}
              </span>
              . All rights reserved.
            </p>

            <div className="flex items-center gap-5 text-gray-400">
              <a
                href="#"
                className="hover:text-[#D4AF37] transition"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="hover:text-[#D4AF37] transition"
              >
                Terms & Conditions
              </a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default SchoolFooter;