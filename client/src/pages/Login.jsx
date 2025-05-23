import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Textbox } from "../components";
import { useLoginMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRandomQuote } from "../utils/quotes";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [quote, setQuote] = useState(getRandomQuote());
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(getRandomQuote());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (data) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials(res));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            opacity: 0
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: {
                enable: true,
                mode: "repulse",
                parallax: { enable: true, force: 60, smooth: 10 }
              }
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 150, duration: 0.4 }
            }
          },
          particles: {
            color: { value: "#6366f1" },
            links: {
              color: "#6366f1",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1
            },
            move: {
              direction: "none",
              enable: true,
              outModes: "bounce",
              random: false,
              speed: 1,
              straight: false
            },
            number: {
              density: {
                enable: true,
                area: 800
              },
              value: 60
            },
            opacity: {
              value: 0.3
            },
            shape: {
              type: "circle"
            },
            size: {
              value: { min: 1, max: 3 }
            }
          },
          detectRetina: true
        }}
      />

      <div className="container relative z-10 px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">
          {/* Left side - Branding and Quote */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.02, 1],
                rotate: [0, 1, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-3xl transform -rotate-6" />
              <h1 className="text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 relative">
                OrbitPlan
              </h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 relative">Your tasks in perfect orbit</p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={quote.quote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-8 p-8 bg-white/20 dark:bg-gray-800/20 rounded-2xl backdrop-blur-lg shadow-xl border border-white/20"
              >
                <p className="text-xl text-gray-700 dark:text-gray-200 italic">"{quote.quote}"</p>
                <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">- {quote.author}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right side - Login Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-indigo-600/30 to-purple-600/30 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 blur-2xl" />
              <div className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-2xl shadow-xl backdrop-blur-xl border border-white/20 relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.3
                  }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 mx-auto mb-6 shadow-lg"
                >
                  <FiLogIn className="w-full h-full text-white" />
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-8 text-center"
                >
                  Welcome Back!
                </motion.h2>
                
                <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative group"
                  >
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Textbox
                      type="email"
                      label="Email Address"
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-900/50 border-2 border-transparent focus:border-indigo-500 rounded-xl transition-all duration-200"
                      register={register("email", {
                        required: "Email is required!",
                      })}
                      error={errors.email ? errors.email.message : ""}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="relative group"
                  >
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Textbox
                      type="password"
                      label="Password"
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-900/50 border-2 border-transparent focus:border-indigo-500 rounded-xl transition-all duration-200"
                      register={register("password", {
                        required: "Password is required!",
                      })}
                      error={errors.password ? errors.password.message : ""}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button
                      type="submit"
                      label="Login"
                      disabled={isLoading}
                      className="relative w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                      <div className="relative flex items-center justify-center gap-2">
                        {isLoading ? (
                          <Loading />
                        ) : (
                          <>
                            {/* <span className="text-sm uppercase tracking-wider font-semibold">Login to OrbitPlan</span> */}
                            <FiLogIn className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          </>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
