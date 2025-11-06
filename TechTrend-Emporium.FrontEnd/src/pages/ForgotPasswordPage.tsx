// src/pages/ForgotPasswordPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";

const questions = [
  "What is your favorite color?",
  "What is your mother's maiden name?",
  "What is your first pet's name?",
];

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [step, setStep] = useState<"verify" | "reset">("verify");

  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");

  const checkPassword = (v: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
      v
    );

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && question && answer) {
      setStep("reset"); // simula verificación correcta
      setError("");
    } else {
      setError("Please fill in all fields.");
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkPassword(pwd)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number and symbol."
      );
      return;
    }
    if (pwd !== confirmPwd) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    alert("Password reset successful!");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-5xl flex-col md:flex-row md:items-center md:justify-between rounded-xl bg-white shadow p-6 md:p-10">
        {/* Left: Form */}
        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold mb-6">Tech Trend Emporium</h1>
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Welcome!</h2>
            <h3 className="text-xl font-bold mb-1">Forgot your password?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Please enter your recovery information.
            </p>

            {step === "verify" && (
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your user email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Security question</label>
                  <select
                    className="w-full border rounded-md p-2 text-sm"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  >
                    <option value="">Select your question</option>
                    {questions.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Question answer</label>
                  <Input
                    type="text"
                    placeholder="Type your answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button type="submit" className="w-full">
                  Verify
                </Button>

                <div className="text-center text-sm mt-4">
                  Don’t have an account?{" "}
                  <Link to="/register" className="text-blue-600 font-medium">
                    Register
                  </Link>
                  <br />
                  <Link to="/login" className="font-medium hover:underline">
                    Back to Login
                  </Link>
                </div>
              </form>
            )}

            {step === "reset" && (
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">New password</label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Confirm password</label>
                  <Input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!checkPassword(pwd) || pwd !== confirmPwd}
                >
                  Reset Password
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Image (solo desktop) */}
         <div className="hidden md:flex md:w-1/2 justify-center">
          <img
          src="/TTE.png"           // ✅ archivo en public/
          alt="Tech Trend Emporium"
         className="max-w-sm"
         />
         </div>

      </div>
    </div>
  );
}
