import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm text-gray-600">
              Now supporting Deepseek, Llama and more
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
            Where{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Humans
            </span>{" "}
            & AI <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Collaborate
            </span>
          </h1>

          <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create interactive groups with users and LLMs. Collaborate,
            brainstorm, and automate conversations in beautifully designed
            spaces that feel natural.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth/login"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center justify-center">
                Start Free Today
                <svg
                  className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ChatLM?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built to supercharge how humans and AIs collaborate in the modern
              workplace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Multi-LLM Support"
              desc="Add Deepseek, Llama, Qwen and more to any group. Switch between models seamlessly."
              gradient="from-blue-500 to-cyan-500"
              icon="🤖"
            />
            <FeatureCard
              title="Real-Time Collaboration"
              desc="Invite team members and work together with AI assistants in lightning-fast conversations."
              gradient="from-purple-500 to-pink-500"
              icon="⚡"
            />

            <FeatureCard
              title="Beautiful Interface"
              desc="Clean, intuitive design that gets out of your way so you can focus on what matters."
              gradient="from-orange-500 to-red-500"
              icon="✨"
            />
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Get Started in{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Minutes
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to transform your workflow
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <Step
              number="01"
              title="Create Your Account"
              desc="Sign up with your email and get instant access to all features. No credit card required."
              gradient="from-blue-500 to-cyan-500"
            />
            <Step
              number="02"
              title="Build Your Team"
              desc="Invite colleagues and add your favorite AI models to create the perfect collaborative space."
              gradient="from-purple-500 to-pink-500"
            />
            <Step
              number="03"
              title="Start Collaborating"
              desc="Begin conversations that blend human creativity with AI intelligence seamlessly."
              gradient="from-green-500 to-emerald-500"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  gradient,
  icon,
}: {
  title: string;
  desc: string;
  gradient: string;
  icon: string;
}) {
  return (
    <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
      <div
        className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-xl text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}
      ></div>
    </div>
  );
}

function Step({
  number,
  title,
  desc,
  gradient,
}: {
  number: string;
  title: string;
  desc: string;
  gradient: string;
}) {
  return (
    <div className="relative text-center group">
      <div
        className={`w-20 h-20 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
      >
        {number}
      </div>
      <h3 className="font-bold text-xl text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">{desc}</p>

      {number !== "03" && (
        <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform translate-x-10"></div>
      )}
    </div>
  );
}
