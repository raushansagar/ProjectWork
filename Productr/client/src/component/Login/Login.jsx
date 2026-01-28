import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'




const Login = () => {


  const { registerUser, loginUser, userOtp } = useContext(AuthContext);




  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [timer, setTimer] = useState(20)
  const [canResend, setCanResend] = useState(false)

  // Start OTP timer
  useEffect(() => {
    if (step !== 2 || timer === 0) return

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [step, timer])



  // Enable resend
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true)
    }
  }, [timer])

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }

    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }


  const sendOtp = async () => {
    if (!email.trim()) return

    const res = await userOtp(email);

    console.log("otp", res)
    setStep(2)
    setTimer(20)
    setCanResend(false)
    setOtp(Array(6).fill(''))
  }


  const loginHander = async () => {
    if (!email.trim()) return

    const data = {
      email,
      otp : otp.join(""),
    };

    const res = await loginUser(data);
    console.log(res);
  }

  const resendOtp = async () => {
    if (!canResend) return

    const res = await userOtp();
    console.log(res)
    setTimer(20)
    setCanResend(false)
    setOtp(Array(6).fill(''))
  }

  return (
    <div className='flex flex-col justify-center w-[376px] p-3'>
      <h3 className='text-[#111652] font-medium text-2xl'>
        Login to your Productr Account
      </h3>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <div className='mt-6 mb-4'>
            <p className='mb-1.5'>Email or Phone number</p>
            <div className='h-10 w-[360px] border border-gray-400 rounded-sm px-1'>
              <input
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter email or phone number'
                className='h-full w-full outline-none'
              />
            </div>
          </div>

          <button
            onClick={sendOtp}
            className='w-[360px] h-[40px] bg-[#071074] text-white rounded-sm cursor-pointer'
          >
            Login
          </button>
        </>
      )}


      {step === 2 && (
        <>
          <p className='mt-6 mb-3'>Enter OTP</p>

          <div className='flex gap-2 mb-4'>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type='text'
                maxLength='1'
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                className='w-12 h-12 border border-gray-400 text-center text-lg outline-none rounded-sm'
              />
            ))}
          </div>

          <button onClick={() => loginHander()} className='w-[360px] h-[40px] bg-[#071074] text-white rounded-sm cursor-pointer'>
            Enter your OTP
          </button>

          <div className='flex justify-center mt-3'>
            {!canResend ? (
              <p className='text-gray-400 text-sm'>
                Didn’t receive OTP?
                <span className='ml-1'>Resend in {timer}s</span>
              </p>
            ) : (
              <button
                onClick={resendOtp}
                className='text-[#071074] text-sm cursor-pointer'
              >
                Resend OTP
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Login
