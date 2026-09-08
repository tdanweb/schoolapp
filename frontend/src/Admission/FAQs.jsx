//frequently asked questions....
import { useState } from "react";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";

export default function ApplicantFAQs() {

    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How do I complete my admission application?",
            answer:
                "Log in to your applicant portal and proceed to the BioData section. Fill in all required information carefully, review your details, and submit your application when you are satisfied that everything is correct."
        },
        {
            question: "How do I pay my application fee?",
            answer:
                "Navigate to the Payment section of your applicant portal. You will find the available payment instructions and options there. Ensure that you complete the payment successfully before proceeding with your application."
        },
        {
            question: "Is the application fee refundable?",
            answer:
                "No. The application fee is non-refundable. Applicants are therefore advised to carefully review the admission requirements before making payment."
        },
        {
            question: "How do I know if my application has been successfully submitted?",
            answer:
                "After completing the required application steps, visit the Status section of your portal. Your application status and other relevant information will be displayed there."
        },
        {
            question: "Where can I find information about the entrance examination?",
            answer:
                "Information about the entrance examination, including relevant instructions and updates, will be made available through the Entrance Exam section of your applicant portal."
        },
        {
            question: "Can I edit my information after submitting my application?",
            answer:
                "Some information may not be editable after final submission. If you need to correct an important detail, please contact the school through the Contact section of the portal for assistance."
        },
        {
            question: "How will I receive important admission updates?",
            answer:
                "Important announcements and admission updates will be posted on your applicant portal. We recommend checking your dashboard regularly so that you do not miss important information."
        },
        {
            question: "Who should I contact if I have a problem with my application?",
            answer:
                "If you encounter any difficulty with your application, payment, examination, or other admission-related matters, visit the Contacts section of the portal to find the appropriate support channel."
        }
    ];


    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };


    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Header */}
            <div>
                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <FaQuestionCircle />
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">
                            Help Centre
                        </p>

                        <h1 className="text-2xl font-bold text-slate-800">
                            Frequently Asked Questions
                        </h1>
                    </div>

                </div>

                <p className="text-sm text-slate-500 mt-3">
                    Find answers to common questions about your admission
                    application and applicant portal.
                </p>
            </div>


            {/* FAQ List */}
            <div className="space-y-3">

                {faqs.map((faq, index) => {

                    const isOpen = openIndex === index;

                    return (
                        <div
                            key={index}
                            className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
                                isOpen
                                    ? "border-amber-300 shadow-sm"
                                    : "border-slate-200"
                            }`}
                        >

                            {/* Question */}
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left"
                            >

                                <div className="flex items-center gap-3">

                                    <span
                                        className={`text-sm font-semibold ${
                                            isOpen
                                                ? "text-amber-700"
                                                : "text-slate-700"
                                        }`}
                                    >
                                        {faq.question}
                                    </span>

                                </div>


                                <span
                                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isOpen
                                            ? "bg-amber-100 text-amber-700 rotate-180"
                                            : "bg-slate-100 text-slate-500"
                                    }`}
                                >
                                    <FaChevronDown size={11} />
                                </span>

                            </button>


                            {/* Answer */}
                            <div
                                className={`grid transition-all duration-300 ease-in-out ${
                                    isOpen
                                        ? "grid-rows-[1fr]"
                                        : "grid-rows-[0fr]"
                                }`}
                            >

                                <div className="overflow-hidden">

                                    <div className="px-5 pb-5 pt-1">

                                        <div className="border-l-2 border-amber-400 pl-4">

                                            <p className="text-sm leading-6 text-slate-600">
                                                {faq.answer}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>
                    );
                })}

            </div>


            {/* Bottom Help */}
            <div className="bg-slate-900 rounded-xl p-5 text-center">

                <p className="text-white font-semibold">
                    Still need help?
                </p>

                <p className="text-slate-400 text-sm mt-1">
                    If your question isn't answered here, please contact the
                    admission office for assistance.
                </p>

            </div>

        </div>
    );
}

import { motion } from "framer-motion";
import {
    FaEnvelope,
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaWhatsapp,
    FaYoutube
} from "react-icons/fa";

export function ApplicantContact() {

    const contactInfo = [
        {
            icon: <FaEnvelope />,
            title: "Email",
            value: "info@achieversinternational.edu.ng",
            href: "mailto:info@achieversinternational.edu.ng",
            color: "bg-blue-100 text-blue-700"
        },
        {
            icon: <FaPhoneAlt />,
            title: "Phone",
            value: "+234 803 123 4567",
            href: "tel:+2348031234567",
            color: "bg-green-100 text-green-700"
        },
        {
            icon: <FaWhatsapp />,
            title: "WhatsApp",
            value: "+234 905 987 6543",
            href: "https://wa.me/2349059876543",
            color: "bg-emerald-100 text-emerald-700"
        },
        {
            icon: <FaMapMarkerAlt />,
            title: "Address",
            value: "Achievers International Schools, Ibadan, Oyo State, Nigeria.",
            color: "bg-amber-100 text-amber-700"
        }
    ];

    const socials = [
        {
            icon: <FaFacebookF />,
            name: "Facebook",
            username: "@AchieversInternationalSchools"
        },
        {
            icon: <FaInstagram />,
            name: "Instagram",
            username: "@AchieversInternationalSchools"
        },
        {
            icon: <FaYoutube />,
            name: "YouTube",
            username: "Achievers International Schools"
        },
        {
            icon: <FaLinkedinIn />,
            name: "LinkedIn",
            username: "Achievers International Schools"
        }
    ];

    return (
        <div className="relative min-h-[650px] rounded-2xl overflow-hidden">

            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/school-hall.jpg')"
                }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-blue-900/60" />


            {/* Content */}
            <div className="relative z-10 p-5 md:p-8 lg:p-12">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-white mb-8"
                >
                    <p className="text-amber-400 uppercase tracking-[0.2em] text-xs font-semibold">
                        Get In Touch
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold mt-2">
                        We're Here
                        <span className="text-amber-400"> to Help You</span>
                    </h1>

                    <p className="text-slate-300 max-w-xl text-sm md:text-base mt-3">
                        Have questions about your admission? Reach out to
                        Achievers International Schools through any of the
                        channels below.
                    </p>
                </motion.div>


                {/* CONTACT CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden"
                >

                    <div className="grid lg:grid-cols-2">

                        {/* LEFT SIDE */}
                        <div className="p-6 md:p-8 lg:p-10">

                            {/* School */}
                            <div className="flex items-center gap-4 pb-6 border-b border-slate-200">

                                <div className="w-16 h-16 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 font-bold text-xl">
                                    AI
                                </div>

                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                                        Achievers International Schools
                                    </h2>

                                    <p className="text-amber-600 text-sm mt-1">
                                        Excellence • Discipline • Achievement
                                    </p>
                                </div>

                            </div>


                            {/* Contact details */}
                            <div className="mt-7 space-y-5">

                                {contactInfo.map((item, index) => (

                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: index * 0.1
                                        }}
                                        className="flex gap-4"
                                    >

                                        <div
                                            className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${item.color}`}
                                        >
                                            {item.icon}
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-wide font-semibold text-slate-400">
                                                {item.title}
                                            </p>

                                            {item.href ? (
                                                <a
                                                    href={item.href}
                                                    className="text-sm text-slate-700 hover:text-blue-700 transition"
                                                >
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p className="text-sm text-slate-700 leading-6">
                                                    {item.value}
                                                </p>
                                            )}
                                        </div>

                                    </motion.div>

                                ))}

                            </div>

                        </div>


                        {/* RIGHT SIDE */}
                        <div className="bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-6 md:p-8 lg:p-10">

                            <p className="text-xs uppercase tracking-widest font-semibold text-amber-600">
                                Stay Connected
                            </p>

                            <h3 className="text-2xl font-bold text-slate-900 mt-2">
                                Follow Us
                            </h3>

                            <p className="text-sm text-slate-500 mt-2 mb-7">
                                Stay connected with the school for admission
                                updates, announcements and school activities.
                            </p>


                            <div className="space-y-3">

                                {socials.map((social, index) => (

                                    <motion.a
                                        key={social.name}
                                        href="#"
                                        initial={{
                                            opacity: 0,
                                            x: 20
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0
                                        }}
                                        transition={{
                                            delay: 0.2 + index * 0.1
                                        }}
                                        whileHover={{
                                            scale: 1.02,
                                            x: 4
                                        }}
                                        className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-3 shadow-sm"
                                    >

                                        <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center">
                                            {social.icon}
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {social.name}
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                {social.username}
                                            </p>
                                        </div>

                                    </motion.a>

                                ))}

                            </div>

                        </div>

                    </div>


                    {/* Footer */}
                    <div className="bg-slate-900 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">

                        <p className="text-xs text-slate-300 text-center sm:text-left">
                            We're committed to supporting you throughout your
                            admission journey.
                        </p>

                        <span className="text-xs font-semibold text-amber-400">
                            Admission Support
                        </span>

                    </div>

                </motion.div>

            </div>

        </div>
    );
}