import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import { supabase } from "../../lib/SupabaseClients";
import bcrypt from "bcryptjs";
import CustomAlert from "../../components/CustomAlert";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const hashedPassword = bcrypt.hashSync(password, 10);

      const { data, error } = await supabase
        .from("users")
        .insert([{ nama: name, email: email.trim(), password: hashedPassword }]);

      if (error) {
        setAlert({ message: error.message, type: "error" });
      } else {
        setAlert({ message: "Akun berhasil dibuat!", type: "success" });
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch {
      setAlert({ message: "Terjadi kesalahan, silakan coba lagi.", type: "error" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-navy/90">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden rounded-l-[50px]">
        <img
          src="/images/A-ICON-POSTER.png"
          alt="Penginapan"
          className="absolute inset-0 w-full h-full object-cover animate-fade-left"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-navy/60 via-navy/40 to-transparent flex items-center justify-center p-8">
          <h2 className="text-4xl font-extrabold text-cream text-center leading-snug animate-fade-up">
            Bergabunglah dengan <br /> SIG Penginapan Pekanbaru
          </h2>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-10">
        <div className="w-full max-w-md bg-cream rounded-[50px] shadow-2xl p-12 animate-fade-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-navy mb-2">Daftar</h1>
            <p className="text-navy/70 text-sm">
              Buat akun baru untuk mengakses fitur SIG penginapan
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/50" />
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black
                           focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300"
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/50" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black
                           focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/50" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black
                           focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-2xl bg-black text-cream font-semibold
                          hover:scale-[1.03] hover:shadow-xl transition-all duration-300 ${
                            loading ? "opacity-70 cursor-not-allowed" : ""
                          }`}
              disabled={loading}
            >
              {loading ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          <div className="flex justify-between mt-6 text-sm text-navy/60">
            <Link to="/login" className="hover:underline text-black">
              Sudah punya akun?
            </Link>
          </div>
        </div>
      </div>

      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
