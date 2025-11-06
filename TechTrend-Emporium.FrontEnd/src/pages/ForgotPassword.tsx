import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";

const QUESTIONS = [
  "What is your favorite color?",
  "What is your mother’s maiden name?",
  "What city were you born in?",
  "What was the name of your first pet?",
];

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 8+ chars, 1 upper, 1 lower, 1 number, 1 symbol
const strongPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function ForgotPassword() {
  const nav = useNavigate();

  // Paso 1: email + pregunta + respuesta
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const canVerify = emailRx.test(email) && !!question && !!answer.trim();

  // Paso 2: reset
  const [phase, setPhase] = useState<"verify" | "reset">("verify");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const pwStrong = strongPw.test(pw);
  const pwMatch = pw && pw === pw2;
  const canReset = pwStrong && pwMatch;

  const pwHelp = useMemo(() => {
    if (!pw) return "Min 8 chars, 1 upper, 1 lower, 1 number, 1 symbol.";
    if (!pwStrong) return "Password does not meet complexity requirements.";
    return "Password meets complexity requirements.";
  }, [pw, pwStrong]);

  const RightShow1 = (
    <button
      type="button"
      className="text-xs text-gray-600 px-3 py-2"
      aria-label="Show password while pressed"
      onMouseDown={() => setShow1(true)} onMouseUp={() => setShow1(false)} onMouseLeave={() => setShow1(false)}
      onTouchStart={() => setShow1(true)} onTouchEnd={() => setShow1(false)}
    >
      Show
    </button>
  );
  const RightShow2 = (
    <button
      type="button"
      className="text-xs text-gray-600 px-3 py-2"
      aria-label="Show password while pressed"
      onMouseDown={() => setShow2(true)} onMouseUp={() => setShow2(false)} onMouseLeave={() => setShow2(false)}
      onTouchStart={() => setShow2(true)} onTouchEnd={() => setShow2(false)}
    >
      Show
    </button>
  );

  // Simulaciones; aquí llamarías tu API real
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canVerify) return;
    setPhase("reset");
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canReset) return;
    // Al éxito → Login
    nav("/login", { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card izquierda */}
        <div className="order-2 md:order-1">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
            <div className="mb-6">
              <div className="text-gray-700">Welcome !</div>
              <h1 className="mt-1 text-2xl font-semibold">Forgot your password?</h1>
              <p className="mt-2 text-sm text-gray-600">
                Please enter the email you use to log in and your recovery information.
              </p>
            </div>

            {phase === "verify" && (
              <form className="space-y-5" onSubmit={handleVerify}>
                <label className="block">
                  <div className="mb-2 font-medium text-gray-800">Email</div>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>

                <label className="block">
                  <div className="mb-2 font-medium text-gray-800">Security question</div>
                  <select
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  >
                    <option value="" disabled>Select your question</option>
                    {QUESTIONS.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <div className="mb-2 font-medium text-gray-800">Question answer</div>
                  <Input value={answer} onChange={(e) => setAnswer(e.target.value)} />
                </label>

                <Button type="submit" disabled={!canVerify}>Continue</Button>

                <div className="text-center text-sm text-gray-500">
                  Don’t have an Account? <Link to="/register" className="font-medium text-gray-900">Register</Link>
                  <div className="mt-2"><Link to="/login" className="underline">Back to Login</Link></div>
                </div>
              </form>
            )}

            {phase === "reset" && (
              <form className="space-y-5" onSubmit={handleReset}>
                <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                  ✅ Security question verified for <span className="font-medium">{email}</span>. Set your new password.
                </div>

                <label className="block">
                  <div className="mb-2 font-medium text-gray-800">New password</div>
                  <Input
                    type={show1 ? "text" : "password"}
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    rightSlot={RightShow1}
                  />
                </label>

                <label className="block">
                  <div className="mb-2 font-medium text-gray-800">Confirm new password</div>
                  <Input
                    type={show2 ? "text" : "password"}
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    rightSlot={RightShow2}
                  />
                </label>

                <ul className="text-sm space-y-1">
                  <li className={pwStrong ? "text-green-600" : "text-gray-600"}>• {pwHelp}</li>
                  {!pwMatch && !!pw2 && <li className="text-red-600">• Passwords do not match.</li>}
                </ul>

                <Button type="submit" disabled={!canReset}>Reset</Button>
                <div className="text-center text-sm">
                  <button type="button" className="underline" onClick={() => setPhase("verify")}>Back</button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Imagen derecha (decorativa, solo desktop) */}
        <div className="order-1 md:order-2 hidden md:flex items-center justify-center">
          <img src="/logo512.png" alt="Tech Trend Emporium" className="h-72 object-contain rounded-xl shadow" />
        </div>
      </div>
    </div>
  );
}
