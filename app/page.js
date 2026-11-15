"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Building2,
  Home,
  Microscope,
  Truck,
  HeartHandshake,
  ArrowUpRight,
  Sparkles,
  Search,
  Scale,
  PhoneCall,
  Heart,
  ShieldCheck,
  MapPin,
  ShieldAlert,
  Users,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SERVICE_CATEGORIES, SAMPLE_TESTIMONIALS } from "@/data/providers";

const ICON_MAP = {
  Stethoscope,
  Building2,
  Home,
  Microscope,
  Truck,
  HeartHandshake,
};

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Discover",
    description:
      "Search for animal-care services based on your companion's needs, service category, and neighborhood.",
    icon: Search,
  },
  {
    step: "02",
    title: "Compare",
    description:
      "Explore provider details, clinical services, opening hours, sample ratings, and verification status.",
    icon: Scale,
  },
  {
    step: "03",
    title: "Connect",
    description:
      "Contact the provider directly via phone or open turn-by-turn directions in Google Maps.",
    icon: PhoneCall,
  },
  {
    step: "04",
    title: "Stay Connected",
    description:
      "Save trusted clinics, hospitals, and emergency ambulances to your personal shortlist for future reference.",
    icon: Heart,
  },
];

const VALUE_PROPOSITIONS = [
  {
    title: "Six Care Pillars in One Place",
    copy: "Discover veterinary clinics, 24/7 animal hospitals, pet boarding, diagnostic labs, veterinary ambulances, and animal NGOs without juggling tabs.",
    icon: Building2,
  },
  {
    title: "Effortless Service Discovery",
    copy: "Filter immediately by service category, open-now availability, emergency triage capability, or rating.",
    icon: Search,
  },
  {
    title: "Location & Area Search",
    copy: "Search by neighborhood, borough, or optional browser GPS distance calculation to find care close to home.",
    icon: MapPin,
  },
  {
    title: "Rapid Emergency-Care Discovery",
    copy: "Dedicated 24/7 trauma hospital and oxygen-equipped ambulance directory when urgent situations arise.",
    icon: ShieldAlert,
  },
  {
    title: "Transparent Verification Status",
    copy: "Clear badges distinguish Verified, Pending Verification, and Unverified sample listings—plus community correction reporting.",
    icon: ShieldCheck,
  },
  {
    title: "Community-Oriented Animal Welfare",
    copy: "Built equally for everyday pet parents and street-animal caregivers looking for rescue NGOs and subsidized care.",
    icon: Users,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [selectedHeroCategory, setSelectedHeroCategory] =
    useState("Veterinary Clinics");

  const handleHeroPillClick = (categoryId) => {
    setSelectedHeroCategory(categoryId);
    router.push(`/discover?category=${encodeURIComponent(categoryId)}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F1E8] text-[#142746] flex flex-col justify-between">
      <Navbar />

      <main id="top" className="flex-1">
        {/* ======================== A. PRESERVED ART-DIRECTED HERO SECTION ======================== */}
        <section
          aria-label="PawCare Hero"
          className="relative max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 pt-4 sm:pt-6 lg:pt-8 pb-14 lg:pb-20 overflow-hidden"
        >
          {/* Giant Display Headline + Handwritten Coral Script Overlay */}
          <div className="relative z-10 select-none text-center animate-editorial-in">
            <h1 className="font-display-hero uppercase text-[#142746] text-[clamp(3.3rem,11.7vw,11.2rem)] tracking-[-0.02em] leading-[0.86] w-full">
              EXCEPTIONAL CARE
            </h1>

            <p
              aria-hidden="true"
              className="font-script-accent text-[#F0523B] text-[clamp(2.35rem,5.8vw,5.5rem)] leading-none -mt-5 sm:-mt-9 lg:-mt-14 lg:translate-x-24 -rotate-[6deg] inline-block relative z-30 drop-shadow-[0_2px_10px_rgba(248,241,232,0.75)] pointer-events-none"
            >
              For Every Paw
            </p>
          </div>

          {/* Layered 3-Column Editorial Stage */}
          <div className="relative mt-2 sm:mt-4 lg:-mt-10 grid grid-cols-1 lg:grid-cols-12 items-end gap-8 lg:gap-4">
            {/* Left Supporting Content */}
            <div className="lg:col-span-3 order-2 lg:order-1 z-20 lg:pb-28 flex flex-col items-start text-left animate-editorial-in delay-100">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]">
                BETTER CARE FOR EVERY PAW
              </span>

              {/* Three Circular Pet Profile Portraits */}
              <div className="flex items-center gap-2.5 mt-3.5 mb-4">
                <div className="flex -space-x-2">
                  <img
                    src="/images/pet-avatar-1.jpg"
                    alt="Golden Retriever portrait"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#F8F1E8] shadow-md"
                  />
                  <img
                    src="/images/pet-avatar-2.jpg"
                    alt="British Shorthair cat portrait"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#F8F1E8] shadow-md"
                  />
                  <img
                    src="/images/pet-avatar-3.jpg"
                    alt="French Bulldog portrait"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#F8F1E8] shadow-md"
                  />
                </div>
                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-[#EEE7DE] text-[#142746] text-xs font-bold">
                  6 Care Pillars
                </span>
              </div>

              <p className="text-[#6D6B68] text-[15px] sm:text-base leading-[1.6] max-w-[300px] mb-6">
                PawCare helps pet parents and animal caregivers discover trusted
                veterinary clinics, hospitals, boarding, diagnostics,
                ambulances, and rescue NGOs in one convenient platform.
              </p>

              {/* Primary CTA: Find Care + Secondary CTA: Explore How It Works */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/discover"
                  className="group inline-flex items-center gap-2 bg-[#142746] hover:bg-[#1d355e] text-white text-sm font-semibold px-6 py-3.5 rounded-full shadow-[0_10px_25px_rgba(20,39,70,0.22)] transition-all duration-200"
                >
                  <span>Find Care</span>
                  <ArrowUpRight className="w-4 h-4 text-[#F0523B] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center px-4 py-3.5 rounded-full border border-[#142746]/20 hover:bg-[#EEE7DE] text-xs font-bold text-[#142746] transition-colors"
                >
                  Explore How It Works
                </a>
              </div>
            </div>

            {/* Central Hero Image: Dalmatian Cutout Layered Over Coral Shape & Headline */}
            <div className="lg:col-span-6 order-1 lg:order-2 relative flex flex-col items-center justify-end min-h-[390px] sm:min-h-[480px] lg:min-h-[560px]">
              <div
                aria-hidden="true"
                className="hidden sm:flex absolute top-8 left-6 lg:left-8 z-10 w-10 h-10 rounded-full bg-[#EEE7DE] items-center justify-center text-[#F0523B]"
              >
                <Sparkles className="w-5 h-5" />
              </div>

              {/* Coral Rounded Rectangular Backdrop */}
              <div
                aria-hidden="true"
                className="w-[88%] sm:w-[78%] lg:w-[86%] h-[300px] sm:h-[370px] lg:h-[430px] bg-[#F0523B] rounded-[40px] sm:rounded-[48px] shadow-[0_24px_60px_rgba(240,82,59,0.28)] relative overflow-hidden z-10"
              >
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-white/25 text-[11px] font-semibold tracking-[0.25em] uppercase">
                  <span>PAWCARE PLATFORM</span>
                  <span>EST. 2026</span>
                </div>
              </div>

              {/* Dalmatian Cutout Portrait */}
              <div className="absolute inset-x-0 bottom-0 -top-8 sm:-top-14 lg:-top-20 z-20 flex items-end justify-center pointer-events-none">
                <img
                  src="/images/dalmatian-hero.png"
                  alt="Majestic Dalmatian portrait looking slightly right"
                  fetchPriority="high"
                  width={680}
                  height={820}
                  className="w-[300px] sm:w-[390px] lg:w-[465px] xl:w-[490px] max-h-[440px] sm:max-h-[540px] lg:max-h-[635px] object-contain object-bottom drop-shadow-[0_22px_32px_rgba(20,39,70,0.28)] select-none"
                />
              </div>
            </div>

            {/* Right Supporting Content: Tall Navy Testimonial Card + Coral Script */}
            <div className="lg:col-span-3 order-3 z-20 lg:pb-24 flex flex-col items-center lg:items-end animate-editorial-in delay-200">
              <aside
                aria-label="Pet Parent Testimonial"
                className="w-full max-w-[290px] lg:max-w-[245px] bg-[#142746] text-white rounded-[34px] p-6 sm:p-7 flex flex-col items-center text-center shadow-[0_22px_50px_rgba(20,39,70,0.22)] relative"
              >
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#F0523B] to-[#F8F1E8]/40">
                    <img
                      src="/images/happy-pets-group.jpg"
                      alt="Happy Golden Retriever puppy and ginger kitten together"
                      width={80}
                      height={80}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#F0523B] text-white flex items-center justify-center text-xs font-bold shadow"
                  >
                    ♥
                  </span>
                </div>

                <blockquote className="text-[15px] leading-[1.55] text-[#F8F1E8]/95 font-normal mb-5">
                  &ldquo;Finding the right care for my pet has never been
                  easier.&rdquo;
                </blockquote>

                <div className="w-8 h-[1.5px] bg-[#F0523B] mb-3.5" />

                <cite className="not-italic text-[10px] font-bold tracking-[0.2em] uppercase text-[#EEE7DE]/75">
                  A HAPPY PET PARENT (DEMO)
                </cite>
              </aside>

              <div className="mt-5 text-center lg:text-right pr-1">
                <p className="font-script-accent text-[#F0523B] text-2xl sm:text-[27px] leading-none -rotate-2">
                  Care. Trust. Compassion.
                </p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#6D6B68] font-medium mt-1">
                  Every Visit • Every Companion
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Floating Beige Service Panel (6 Categories -> Opens Discovery with Category) */}
          <div className="relative z-30 mt-6 lg:-mt-16 max-w-[1120px] mx-auto animate-editorial-in delay-300">
            <div className="bg-[#EEE7DE]/95 backdrop-blur-md border border-[#142746]/10 rounded-[28px] sm:rounded-full px-4 py-4 sm:px-6 sm:py-4 shadow-[0_20px_50px_rgba(20,39,70,0.12)]">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                {SERVICE_CATEGORIES.map((service) => {
                  const IconComponent = ICON_MAP[service.iconName] || Stethoscope;
                  const isSelected = selectedHeroCategory === service.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleHeroPillClick(service.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#F0523B] text-white border border-[#F0523B] shadow-[0_8px_20px_rgba(240,82,59,0.32)]"
                          : "bg-transparent text-[#142746] border border-[#142746]/25 hover:border-[#142746] hover:bg-[#F8F1E8]/70"
                      }`}
                    >
                      <IconComponent
                        className={`w-4 h-4 ${
                          isSelected ? "text-white" : "text-[#F0523B]"
                        }`}
                      />
                      <span>{service.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ======================== B. WHAT IS PAWCARE? (PROBLEM & SOLUTION) ======================== */}
        <section
          id="about"
          aria-labelledby="what-is-pawcare-heading"
          className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24 border-t border-[#142746]/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEE7DE] text-[#F0523B] text-xs font-bold uppercase tracking-[0.18em] mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>What Is PawCare?</span>
              </span>
              <h2
                id="what-is-pawcare-heading"
                className="font-display-hero uppercase text-[#142746] text-4xl sm:text-6xl tracking-tight leading-[0.92]"
              >
                ONE CALM PLATFORM FOR EVERY ANIMAL NEED
              </h2>
              <p className="font-script-accent text-[#F0523B] text-3xl sm:text-4xl mt-1">
                Built for pet parents &amp; community rescuers.
              </p>
              <p className="text-[#6D6B68] text-base leading-relaxed mt-4">
                Whether you are scheduling a routine puppy booster, searching
                for an overnight feline suite, or coordinating an emergency
                ambulance for an injured street dog, PawCare unifies animal-care
                discovery in one structured directory.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* The Problem Card */}
              <div className="bg-[#EEE7DE] rounded-[34px] p-7 border border-[#142746]/10 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#142746]/10 text-[#142746] text-xs font-bold uppercase tracking-wider mb-4">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F0523B]" />
                    <span>The Problem</span>
                  </span>
                  <h3 className="text-xl font-bold text-[#142746]">
                    Fragmented, Stressful Search When Minutes Count
                  </h3>
                  <p className="text-sm text-[#6D6B68] leading-relaxed mt-3">
                    Finding reliable veterinary services, 24/7 emergency
                    assistance, diagnostic laboratories, and animal welfare
                    organizations often requires sifting through outdated pages,
                    unverified phone numbers, and scattered directories while
                    your pet is in distress.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#142746]/10 text-xs font-bold text-[#6D6B68]">
                  Scattered directories • Unclear emergency hours
                </div>
              </div>

              {/* The Solution Card */}
              <div className="bg-[#142746] text-white rounded-[34px] p-7 shadow-xl flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0523B] text-white text-xs font-bold uppercase tracking-wider mb-4">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>The PawCare Solution</span>
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Centralized, Transparent Animal-Care Discovery
                  </h3>
                  <p className="text-sm text-[#EEE7DE]/85 leading-relaxed mt-3">
                    PawCare brings clinics, 24/7 hospitals, boarding suites,
                    diagnostic labs, veterinary ambulances, and rescue NGOs
                    together with instant filters, transparent verification
                    badges, one-tap calling, and saved provider shortlists.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs font-bold text-[#F0523B]">
                  <span>6 Specialized Care Categories</span>
                  <Link href="/discover" className="underline text-white">
                    Explore Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================== C. EXPLORE OUR SERVICES (6 CATEGORIES) ======================== */}
        <section
          id="services"
          aria-labelledby="explore-services-heading"
          className="bg-[#EEE7DE] py-20 sm:py-28 border-t border-[#142746]/10"
        >
          <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]">
                  COMPREHENSIVE CARE DIRECTORY
                </span>
                <h2
                  id="explore-services-heading"
                  className="font-display-hero uppercase text-[#142746] text-4xl sm:text-6xl lg:text-7xl mt-2"
                >
                  EXPLORE OUR SERVICES
                </h2>
                <p className="font-script-accent text-[#F0523B] text-3xl sm:text-4xl -mt-1">
                  Six specialized pillars for dogs, cats &amp; community animals
                </p>
              </div>

              <Link
                href="/discover"
                className="inline-flex items-center gap-2 bg-[#142746] hover:bg-[#F0523B] text-white text-sm font-bold px-7 py-4 rounded-full transition-colors self-start lg:self-auto"
              >
                <span>Explore All Services</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {SERVICE_CATEGORIES.map((cat) => {
                const IconComponent = ICON_MAP[cat.iconName] || Stethoscope;
                return (
                  <Link
                    key={cat.id}
                    href={`/discover?category=${encodeURIComponent(cat.id)}`}
                    className="group bg-[#F8F1E8] rounded-[34px] overflow-hidden border border-[#142746]/10 hover:border-[#F0523B] shadow-sm hover:shadow-[0_20px_50px_rgba(20,39,70,0.10)] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-52 w-full overflow-hidden bg-[#142746]">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          loading="lazy"
                          width={540}
                          height={360}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                          <span className="w-10 h-10 rounded-2xl bg-[#F8F1E8]/95 text-[#F0523B] flex items-center justify-center shadow">
                            <IconComponent className="w-5 h-5" />
                          </span>
                          <span className="px-3 py-1 rounded-full bg-[#142746]/85 text-white text-[11px] font-bold">
                            {cat.accentCount}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 sm:p-7">
                        <h3 className="text-xl font-bold text-[#142746] group-hover:text-[#F0523B] transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-[#6D6B68] leading-relaxed mt-2">
                          {cat.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 sm:px-7 pb-6 pt-3 border-t border-[#142746]/[0.07] flex items-center justify-between text-xs font-bold text-[#142746]">
                      <span className="group-hover:text-[#F0523B] transition-colors">
                        Browse {cat.name}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#F0523B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================== D. HOW PAWCARE WORKS (4 STEPS) ======================== */}
        <section
          id="how-it-works"
          aria-labelledby="how-pawcare-works-heading"
          className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-28"
        >
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]">
              SIMPLE 4-STEP JOURNEY
            </span>
            <h2
              id="how-pawcare-works-heading"
              className="font-display-hero uppercase text-[#142746] text-4xl sm:text-6xl lg:text-7xl mt-2"
            >
              HOW PAWCARE WORKS
            </h2>
            <p className="font-script-accent text-[#F0523B] text-3xl sm:text-4xl -mt-1">
              From search to care in moments
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS_STEPS.map((item) => {
              const StepIcon = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-white rounded-[32px] p-7 border border-[#142746]/10 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-display-hero text-4xl text-[#F0523B]">
                        {item.step}
                      </span>
                      <span className="w-12 h-12 rounded-2xl bg-[#EEE7DE] text-[#142746] flex items-center justify-center">
                        <StepIcon className="w-5 h-5 text-[#F0523B]" />
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#142746]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#6D6B68] leading-relaxed mt-2.5">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-[#142746]/[0.06] text-[11px] font-bold uppercase tracking-wider text-[#142746]/60">
                    Step {item.step} of 04
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================== E. WHY CHOOSE PAWCARE? ======================== */}
        <section
          aria-labelledby="why-choose-heading"
          className="bg-[#EEE7DE] py-20 sm:py-28 border-t border-[#142746]/10"
        >
          <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="max-w-3xl mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]">
                PLATFORM VALUE PROPOSITIONS
              </span>
              <h2
                id="why-choose-heading"
                className="font-display-hero uppercase text-[#142746] text-4xl sm:text-6xl lg:text-7xl mt-2"
              >
                WHY CHOOSE PAWCARE?
              </h2>
              <p className="text-[#6D6B68] text-base sm:text-lg mt-3">
                Designed around clarity, speed, and community trust—without
                cluttered directories or unverified claims.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {VALUE_PROPOSITIONS.map((prop) => {
                const PropIcon = prop.icon;
                return (
                  <div
                    key={prop.title}
                    className="bg-[#F8F1E8] rounded-[30px] p-7 border border-[#142746]/10"
                  >
                    <span className="w-11 h-11 rounded-2xl bg-[#142746] text-white flex items-center justify-center mb-5">
                      <PropIcon className="w-5 h-5 text-[#F0523B]" />
                    </span>
                    <h3 className="text-lg font-bold text-[#142746]">
                      {prop.title}
                    </h3>
                    <p className="text-sm text-[#6D6B68] leading-relaxed mt-2">
                      {prop.copy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================== F. EMERGENCY CARE PROMOTIONAL SECTION ======================== */}
        <section
          aria-labelledby="promo-emergency-heading"
          className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-24"
        >
          <div className="bg-[#142746] text-white rounded-[40px] sm:rounded-[48px] p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-2xl relative overflow-hidden">
            <div className="lg:col-span-7 space-y-4 relative z-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0523B] text-white text-xs font-bold uppercase tracking-[0.18em]">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>24/7 Emergency Support Directory</span>
              </span>
              <h2
                id="promo-emergency-heading"
                className="font-display-hero uppercase text-white text-4xl sm:text-6xl lg:text-7xl leading-[0.9]"
              >
                BECAUSE EVERY SECOND MATTERS.
              </h2>
              <p className="text-[#EEE7DE]/85 text-base sm:text-lg leading-relaxed max-w-xl">
                When a pet faces a sudden medical crisis, searching shouldn&apos;t
                slow you down. PawCare provides immediate access to 24/7
                emergency veterinary hospitals and mobile oxygen-equipped
                veterinary ambulances with one-tap calling and map directions.
              </p>
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  href="/emergency"
                  className="inline-flex items-center gap-2 bg-[#F0523B] hover:bg-[#d9432d] text-white font-bold text-sm px-7 py-4 rounded-full shadow-lg transition-colors"
                >
                  <span>Find Emergency Care</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/discover?emergency=true"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-4 rounded-full transition-colors"
                >
                  <span>Filter 24/7 Providers</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative z-10">
              <div className="rounded-[32px] overflow-hidden border-2 border-white/15 bg-[#EEE7DE]">
                <img
                  src="/images/card-ambulance.jpg"
                  alt="Veterinary paramedic comforting a Golden Retriever beside a mobile veterinary ambulance"
                  loading="lazy"
                  width={540}
                  height={400}
                  className="w-full h-64 sm:h-72 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ======================== G. TESTIMONIALS (ILLUSTRATIVE DEMO CONTENT) ======================== */}
        <section
          aria-labelledby="testimonials-heading"
          className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 pb-20 sm:pb-28"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]">
                COMMUNITY EXPERIENCES (DEMO)
              </span>
              <h2
                id="testimonials-heading"
                className="font-display-hero uppercase text-[#142746] text-4xl sm:text-6xl mt-2"
              >
                TRUSTED BY PET PARENTS &amp; RESCUERS
              </h2>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-[#EEE7DE] text-[#6D6B68] text-xs font-semibold">
              Illustrative Demo Testimonials
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {SAMPLE_TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[32px] p-7 border border-[#142746]/10 shadow-sm flex flex-col justify-between"
              >
                <blockquote className="text-sm sm:text-base text-[#142746] leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                <div className="mt-6 pt-4 border-t border-[#142746]/10 flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.author}
                    loading="lazy"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border border-[#142746]/15"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#142746]">
                      {item.author}
                    </p>
                    <p className="text-[11px] text-[#F0523B] font-semibold">
                      {item.petName}
                    </p>
                    <p className="text-[10px] text-[#6D6B68]">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================== H. FOR ANIMAL-CARE PROVIDERS ======================== */}
        <section
          aria-labelledby="for-providers-heading"
          className="bg-[#EEE7DE] py-20 sm:py-24 border-t border-[#142746]/10"
        >
          <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="rounded-[34px] overflow-hidden border border-[#142746]/10 bg-white shadow-md">
                <img
                  src="/images/card-vet-clinic.jpg"
                  alt="Veterinarian caring for an Australian Shepherd dog"
                  loading="lazy"
                  width={560}
                  height={420}
                  className="w-full h-72 object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]">
                FOR ANIMAL-CARE PROVIDERS &amp; NGOS
              </span>
              <h2
                id="for-providers-heading"
                className="font-display-hero uppercase text-[#142746] text-4xl sm:text-6xl leading-[0.92]"
              >
                PARTNER WITH PAWCARE
              </h2>
              <p className="text-[#6D6B68] text-base leading-relaxed">
                Are you a veterinary clinic, 24/7 animal hospital, diagnostic
                laboratory, boarding studio, ambulance service, or animal
                welfare NGO? Join PawCare to connect with pet parents and
                caregivers in your neighborhood.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm font-semibold text-[#142746]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F0523B] shrink-0" />
                  <span>Dedicated provider profile &amp; service tags</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F0523B] shrink-0" />
                  <span>Direct phone &amp; Google Maps directions links</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F0523B] shrink-0" />
                  <span>Transparent verification badge workflow</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F0523B] shrink-0" />
                  <span>Provider dashboard to manage hours &amp; services</span>
                </li>
              </ul>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  href="/list-business"
                  className="inline-flex items-center gap-2 bg-[#F0523B] hover:bg-[#d9432d] text-white font-bold text-sm px-7 py-4 rounded-full shadow-md transition-colors"
                >
                  <span>List Your Business</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/signup?role=service_provider"
                  className="inline-flex items-center gap-2 bg-[#142746] hover:bg-[#1f3b68] text-white font-bold text-xs px-6 py-4 rounded-full transition-colors"
                >
                  <span>Create Provider Account</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ======================== I. FINAL CTA ======================== */}
        <section
          aria-labelledby="final-cta-heading"
          className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-28 text-center"
        >
          <div className="bg-white rounded-[42px] p-10 sm:p-16 border border-[#142746]/10 shadow-[0_20px_60px_rgba(20,39,70,0.07)] max-w-4xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0523B]">
              START EXPLORING TODAY
            </span>
            <h2
              id="final-cta-heading"
              className="font-display-hero uppercase text-[#142746] text-4xl sm:text-6xl lg:text-7xl mt-2"
            >
              EVERY PAW DESERVES THE RIGHT CARE.
            </h2>
            <p className="text-[#6D6B68] text-base sm:text-lg max-w-xl mx-auto mt-3">
              Discover trusted animal-care professionals, save your go-to
              clinics, and keep emergency support at your fingertips.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 bg-[#F0523B] hover:bg-[#d9432d] text-white font-bold text-sm px-8 py-4 rounded-full shadow-[0_12px_28px_rgba(240,82,59,0.3)] transition-all"
              >
                <span>Get Started</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-[#142746] hover:bg-[#1f3b68] text-white font-bold text-sm px-8 py-4 rounded-full transition-all"
              >
                <span>Create Free Account</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ======================== J. FOOTER ======================== */}
      <Footer />
    </div>
  );
}
