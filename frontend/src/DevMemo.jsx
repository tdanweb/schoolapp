import {
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaWhatsapp,
  FaPlayCircle,
} from "react-icons/fa";

function DeveloperNotice() {
  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-3">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* Header */}
{/* Header */}
<div className="bg-gray-900 px-5 py-5 text-white">
  <div className="flex flex-col sm:flex-row sm:items-center gap-4">

    <img
      src="/User1.jpeg"
      alt="Temidayo Daniel Betiku"
      className="h-20 w-20 rounded-full object-cover border-4 border-white/20"
    />

    <div className="flex-1">
      <p className="text-xs uppercase tracking-wider text-gray-400">
        From the Developer
      </p>

      <h2 className="text-xl font-bold mt-1">
        Temidayo Daniel Betiku
      </h2>

      <p className="text-sm text-gray-300">
        Frontend Developer • Web Designer • MERN Stack Developer
      </p>

      {/* Contacts */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-gray-300">

        <a
          href="mailto:betikutdan@gmail.com"
          className="flex items-center gap-1.5 hover:text-white"
        >
          <FaEnvelope size={13} />
          betikutdan@gmail.com
        </a>

        <a
          href="https://wa.me/2347053489210"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-white"
        >
          <FaWhatsapp size={14} />
          +234 705 348 9210
        </a>

        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
          aria-label="Facebook"
        >
          <FaFacebook size={15} />
        </a>

        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
          aria-label="Instagram"
        >
          <FaInstagram size={15} />
        </a>

      </div>
    </div>

  </div>

  {/* Read Guide */}
  <div className="mt-5 border-t border-gray-700 pt-4">
    <div className="flex items-center gap-2">
      <span className="text-lg">📖</span>

      <div>
        <p className="font-semibold text-white">
          Please read through this guide
        </p>

        <p className="text-xs text-gray-400 mt-0.5">
          Important information about the application and available features.
        </p>
      </div>
    </div>
  </div>
</div>

        {/* Main Content */}
        <div className="p-5 sm:p-7">

          {/* Intro */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Welcome to the School App
            </h3>

            <p className="text-sm leading-6 text-gray-600">
              Achievers School App is a modern school management web application
              designed as a portfolio project for real-world school use. It is
              built to bring important school activities into one organized
              digital platform, covering administration, students, staff,
              attendance, results, fees, admissions and other school operations.
            </p>
          </div>

          {/* Development Notice */}
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 mb-6">
            <h3 className="font-bold text-yellow-900 mb-2">
              🚧 Development Notice
            </h3>

            <p className="text-sm leading-6 text-yellow-900">
              Some features of the application are still under active
              development. However, a significant proportion of the web app is
              already functional and available for testing.
            </p>

            <p className="text-sm leading-6 text-yellow-800 mt-2">
              Some available features may not yet be perfect, and you may
              encounter areas that are still being refined. Development and
              improvements are actively ongoing.
            </p>
          </div>

          {/* Test Account */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              🔐 Demo Admin Access
            </h3>

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Email
                </p>

                <div className="rounded-lg bg-white border border-gray-200 px-3 py-2 font-medium text-gray-700">
                  betikutdan@gmail.com
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Password
                </p>

                <div className="rounded-lg bg-white border border-gray-200 px-3 py-2 font-medium text-gray-700">
                  daniel1234
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Use the demo account to explore the administrative features
              currently available. You can also create your own staff account. Parent Portal not yet developed.
            </p>
          </div>

          {/* Available Features */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">
              Currently Available for Testing
            </h3>

            <div className="grid sm:grid-cols-2 gap-2">
              {[
                "Creating an account and logging in",
                "Admin Portal, Fee Mgt. Portal",
                "Posting and Viewing blog/Updates",
                "Approving users",
                "Assigning staff to duties",
                "Enrolling staff",
                "Enrolling and Managing students",
                "Adding Subjects and Classes",
                "Generating student ID cards",
                "Checking/Downloading Results",
                "Admin Result Checker Pin",
                "Uploading results",
                "Marking attendance",
                "Dashboard statistics and data",
                "General application configuration",
                "Student and staff management",
                "And many more features",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2.5"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">
                    ✓
                  </span>

                  <span className="text-sm text-gray-700">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">
              Technology Stack
            </h3>

            <div className="flex flex-wrap gap-2">
              {[
                "React.js",
                "Vite",
                "Tailwind CSS",
                "Node.js",
                "Express.js",
                "MongoDB",
                "Mongoose",
                "JWT",
                "Axios",
                "Cloudinary",
                "Framer Motion",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Demo Link */}
          <div className="rounded-xl border border-gray-200 p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-1">
              Want to see the application in action?
            </h3>

            <p className="text-sm text-gray-500 mb-3">
              Watch the full demonstration of the School App.
            </p>

            {/* Replace # with your actual video URL */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition"
            >
              <FaPlayCircle size={17} />
              Watch Full Demo Here
            </a>
          </div>

          {/* Developer Contact */}
          <div className="border-t border-gray-200 pt-5">
            <h3 className="font-bold text-gray-800 mb-1">
              Connect with the Developer
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              For feedback, suggestions, collaboration or enquiries:
            </p>

            <div className="flex flex-wrap gap-3">

              <a
                href="mailto:betikutdan@gmail.com"
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FaEnvelope />
                Email
              </a>

              <a
                href="https://wa.me/2347053489210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FaWhatsapp />
                WhatsApp
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FaFacebook />
                Facebook
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FaInstagram />
                Instagram
              </a>

            </div>

            <div className="mt-4 text-sm text-gray-600">
              <span className="font-medium">Phone / WhatsApp:</span>{" "}
              +234 705 348 9210
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 text-center">
          <p className="text-xs text-gray-500">
            Designed and developed as a portfolio project for modern school
            management.
          </p>

          <p className="text-xs text-gray-400 mt-1">
            © 2026 Achievers School App
          </p>
        </div>

      </div>
    </div>
  );
}

export default DeveloperNotice;


