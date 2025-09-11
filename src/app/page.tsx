"use client";
import { useRouter } from "next/navigation";
import { LuMessageCircle } from "react-icons/lu";
export default function HomePage() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/chatbot");
  };

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen"
      style={{ background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)" }}
    >
      <div className="max-w-md mx-auto">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icon */}
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <LuMessageCircle className="w-8 h-8 text-primary" />
          </div>

          {/* Content */}
        <div className="space-y-3">
  <h2 className="text-2xl font-bold text-gray-900">Comienza a chatear con el chat</h2>
  <p className="text-gray-700 text-pretty">
    Practica y valida tus conocimientos del verbo "to be" con nuestro chatbot interactivo.
  </p>
</div>

          {/* CTA Button */}
          <button
            onClick={handleRedirect}
            className="px-8 py-3 text-lg font-semibold w-full rounded-lg shadow-md transition-colors cursor-pointer hover:opacity-90"
            style={{
              background: "linear-gradient(90deg, #42b0c5 0%, #8b93fb 100%)",
              color: "#fff",
              border: "none",
            }}
          >
            Comenzar Ahora
          </button>
        </div>
      </div>
    </section>
  );
}