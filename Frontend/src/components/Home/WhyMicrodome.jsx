import {
  Microscope,
  Users,
  Video,
  BookOpen,
  Clock,
  Wallet,
  HeartHandshake,
  Trophy,
  ClipboardCheck,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Expert Mentorship",
    description:
      "Guidance from experienced mentors specializing in biology, microbiology and biotechnology.",
  },
  {
    icon: Trophy,
    title: "Proven Success",
    description:
      "Our mentors have cracked IIT-JAM, GAT-B and CUET-PG and guide students with real exam strategies.",
  },
  {
    icon: Video,
    title: "Interactive Learning",
    description:
      "Live classes with discussions, presentations and doubt solving sessions.",
  },
  {
    icon: BookOpen,
    title: "Structured Classes",
    description:
      "Weekly biology classes with a structured syllabus and concept-driven teaching.",
  },
  {
    icon: Clock,
    title: "Flexible Learning",
    description:
      "Recorded sessions available so you can revise concepts anytime.",
  },
  {
    icon: Globe,
    title: "Online Convenience",
    description:
      "Attend live online classes easily from anywhere via Google Meet.",
  },
  {
    icon: ClipboardCheck,
    title: "Realistic Mock Tests",
    description:
      "Practice with exam-level mock tests designed for IIT-JAM, GAT-B and CUET-PG.",
  },
  {
    icon: Wallet,
    title: "Affordable Fees",
    description:
      "High quality preparation at a price accessible for most students.",
  },
  {
    icon: HeartHandshake,
    title: "Financial Support",
    description:
      "Special assistance programs available for deserving students.",
  },
];

const WhyMicrodome = () => {
  return (
    <section className="w-full py-24 flex justify-center">
      <div className="w-full max-w-6xl px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Join <span className="text-highlighted">Microdome</span>?
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Microdome combines expert mentorship, structured learning and
            realistic exam preparation to help students succeed in biotechnology
            entrance exams.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12">
          {features.map((item, index) => {
            const Icon = item.icon;

            let span = "";

            // Row 1 → 3 cards
            if (index < 3) span = "md:col-span-4";
            // Row 2 → 4 cards
            else if (index < 7) span = "md:col-span-3";
            // Row 3 → 2 wide cards
            else span = "md:col-span-6";

            const borderMap = {
              0: "rounded-t-xl md:rounded-tr-none",
              2: "md:rounded-tr-xl",
              7: "md:rounded-bl-xl",
              8: "rounded-b-xl md:rounded-bl-none",
            };

            let borderStyle = borderMap[index] || "";

            return (
              <div
                key={index}
                className={`group p-6 md:py-8 border border-gray-200 dark:border-zinc-800
  bg-white/70 dark:bg-black/10
  backdrop-blur-xl
  transition-all duration-300
  hover:border-highlighted/60
  hover:shadow-md
  hover:bg-gray-50/60 dark:hover:bg-accent/20

  ${span} ${borderStyle}`}
              >
                <div
                  className="
    w-12 h-12 flex items-center justify-center
    rounded-lg
    bg-highlighted/10 text-highlighted
    transition-all duration-300
    group-hover:bg-highlighted/20
    group-hover:scale-105
    "
                >
                  <Icon size={22} />
                </div>

                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyMicrodome;
