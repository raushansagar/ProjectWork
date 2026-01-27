import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Signup = () => {
  const { registerUser, userOtp , signup , setSignup} = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);

  // OTP timer
  useEffect(() => {
    if (step !== 2 || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timer]);

  useEffect(() => {
    if (timer === 0) setCanResend(true);
  }, [timer]);

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Send OTP
  const sendOtp = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter name and email");
      return;
    }

    try {
      await userOtp(email);
      toast.success("OTP sent to your email");
      setStep(2);
      setTimer(20);
      setCanResend(false);
      setOtp(Array(6).fill(""));
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  };

  // Verify OTP & Signup
  const signupHandler = async () => {
    const data = {
      name,
      email,
      otp: otp.join(""),
    };

    try {
      await registerUser(data);
      toast.success("Account created successfully!");
      setStep(1)
    } catch (error) {
      toast.error("Signup failed, please check your OTP and try again");
    }
    finally{

    }
  };

  const resendOtp = async () => {
    if (!canResend) return;

    try {
      await userOtp(email);
      toast.success("OTP resent successfully");
      setTimer(20);
      setCanResend(false);
      setOtp(Array(6).fill(""));
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="flex flex-col justify-center w-[376px] p-3">
      <ToastContainer />
      <h3 className="text-[#111652] font-medium text-2xl">
        Create your Productr Account
      </h3>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <div className="mt-6 mb-4">
            <p className="mb-1.5">Full Name</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="h-10 w-[360px] border border-gray-400 rounded-sm px-2 outline-none"
            />
          </div>

          <div className="mb-4">
            <p className="mb-1.5">Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="h-10 w-[360px] border border-gray-400 rounded-sm px-2 outline-none"
            />
          </div>

          <button
            onClick={sendOtp}
            className="w-[360px] h-[40px] bg-[#071074] text-white rounded-sm"
          >
            Sign Up
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <p className="mt-6 mb-3">Enter OTP</p>

          <div className="flex gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                className="w-12 h-12 border border-gray-400 text-center text-lg outline-none rounded-sm"
              />
            ))}
          </div>

          <button
            onClick={signupHandler}
            className="w-[360px] h-[40px] bg-[#071074] text-white rounded-sm"
          >
            Verify & Create Account
          </button>

          <div className="flex justify-center mt-3">
            {!canResend ? (
              <p className="text-gray-400 text-sm">
                Didn’t receive OTP?
                <span className="ml-1">Resend in {timer}s</span>
              </p>
            ) : (
              <button onClick={resendOtp} className="text-[#071074] text-sm">
                Resend OTP
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Signup;
