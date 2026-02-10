import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import AuthHeader from "@/components/layout/AuthHeader";
import { authService } from "@/services/auth.service";
import type { AxiosError } from "axios";

// TODO: update feilds rules and validation based on backend requirements
interface Country {
  name: string;
  flag: string;
  code: string;
  dialCode: string;
}

const COUNTRIES_FALLBACK: Country[] = [
  { name: "Palestine", flag: "🇵🇸", code: "PS", dialCode: "+970" },
  { name: "United States", flag: "🇺🇸", code: "US", dialCode: "+1" },
  { name: "United Kingdom", flag: "🇬🇧", code: "GB", dialCode: "+44" },
  { name: "United Arab Emirates", flag: "🇦🇪", code: "AE", dialCode: "+971" },
  { name: "Saudi Arabia", flag: "🇸🇦", code: "SA", dialCode: "+966" },
  { name: "Egypt", flag: "🇪🇬", code: "EG", dialCode: "+20" },
  { name: "Jordan", flag: "🇯🇴", code: "JO", dialCode: "+962" },
  { name: "Lebanon", flag: "🇱🇧", code: "LB", dialCode: "+961" },
  { name: "Syria", flag: "🇸🇾", code: "SY", dialCode: "+963" },
  { name: "Iraq", flag: "🇮🇶", code: "IQ", dialCode: "+964" },
  { name: "Kuwait", flag: "🇰🇼", code: "KW", dialCode: "+965" },
  { name: "Qatar", flag: "🇶🇦", code: "QA", dialCode: "+974" },
  { name: "Bahrain", flag: "🇧🇭", code: "BH", dialCode: "+973" },
  { name: "Oman", flag: "🇴🇲", code: "OM", dialCode: "+968" },
  { name: "Yemen", flag: "🇾🇪", code: "YE", dialCode: "+967" },
  { name: "Canada", flag: "🇨🇦", code: "CA", dialCode: "+1" },
  { name: "France", flag: "🇫🇷", code: "FR", dialCode: "+33" },
  { name: "Germany", flag: "🇩🇪", code: "DE", dialCode: "+49" },
  { name: "Italy", flag: "🇮🇹", code: "IT", dialCode: "+39" },
  { name: "Spain", flag: "🇪🇸", code: "ES", dialCode: "+34" },
  { name: "Australia", flag: "🇦🇺", code: "AU", dialCode: "+61" },
  { name: "India", flag: "🇮🇳", code: "IN", dialCode: "+91" },
  { name: "Japan", flag: "🇯🇵", code: "JP", dialCode: "+81" },
  { name: "China", flag: "🇨🇳", code: "CN", dialCode: "+86" },
  { name: "Brazil", flag: "🇧🇷", code: "BR", dialCode: "+55" },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [countryCode, setCountryCode] = useState("+970");
  const [countries, setCountries] = useState<Country[]>(COUNTRIES_FALLBACK);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailValidation, setEmailValidation] = useState<{
    isValid: boolean;
    isTouched: boolean;
  }>({ isValid: false, isTouched: false });
  const [phoneValidation, setPhoneValidation] = useState<{
    isValid: boolean;
    isTouched: boolean;
  }>({ isValid: false, isTouched: false });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value.trim().length > 0) {
      setEmailValidation({
        isValid: validateEmail(value),
        isTouched: true,
      });
    } else {
      setEmailValidation({ isValid: false, isTouched: false });
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (value.trim().length > 0) {
      const cleanValue = value.replace(/\s/g, "");
      const isValidPhone =
        /^\d+$/.test(cleanValue) &&
        cleanValue.length >= 7 &&
        cleanValue.length <= 15;
      setPhoneValidation({
        isValid: isValidPhone,
        isTouched: true,
      });
    } else {
      setPhoneValidation({ isValid: false, isTouched: false });
    }
  };

  const isFormValid = () => {
    return (
      fullName.trim().length > 0 &&
      emailValidation.isValid &&
      phoneValidation.isValid &&
      password.trim().length >= 6 &&
      agreeToTerms
    );
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,cca2,idd,flag",
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(`Countries request failed: ${response.status}`);
        }
        const data = (await response.json()) as Array<{
          name: { common: string };
          flag?: string;
          flags?: { png?: string; svg?: string; alt?: string };
          cca2: string;
          idd?: { root: string; suffixes?: string[] };
        }>;

        const countryList: Country[] = data
          .map((country) => ({
            name: country.name.common,
            flag: country.flag || "🌍",
            code: country.cca2,
            dialCode: country.idd?.root
              ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
              : "",
          }))
          .filter((c: Country) => c.dialCode)
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        if (countryList.length > 0) {
          setCountries(countryList);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Failed to fetch countries, using fallback:", error);
      }
    };

    fetchCountries();
    return () => controller.abort();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const cleanValue = phoneNumber.replace(/\s/g, "");
    const normalizedCountryCode = countryCode.startsWith("+")
      ? countryCode
      : `+${countryCode}`;

    try {
      const response = await authService.register({
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: `${normalizedCountryCode}${cleanValue}`,
        password,
      });
      const { token, user } = response.data;
      const safeUser = user ?? {};
      const displayName =
        safeUser.fullName ??
        safeUser.name ??
        safeUser.email ??
        safeUser.phoneNumber ??
        fullName.trim() ??
        "User";

      setToken(token);
      setUser({
        ...safeUser,
        id: safeUser.id ?? "unknown",
        role: safeUser.role ?? "user",
        name: displayName,
        emailVerified: safeUser.isEmailVerified ?? safeUser.emailVerified,
        phoneVerified: safeUser.isPhoneVerified ?? safeUser.phoneVerified,
        identityVerified:
          safeUser.isIdentityVerified ?? safeUser.identityVerified,
      });
      navigate(ROUTES.PROFILE);
    } catch (error) {
      const apiError = error as AxiosError<{ message?: string }>;
      setSubmitError(
        apiError.response?.data?.message ??
          "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Sign up with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Desktop Only */}
      <AuthHeader />

      {/* Main Content */}
      <div className="flex items-start justify-center px-5 py-6 sm:items-center sm:px-6 sm:py-10">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Title */}
          <div className="text-center">
            {/* Mobile - Title with Close Button */}
            <div className="grid grid-cols-[auto,1fr,auto] items-center sm:hidden">
              {/* Hidden Close Button (left spacer) */}
              <Link
                to={ROUTES.HOME}
                className="pointer-events-none justify-self-start opacity-0"
                aria-hidden="true"
                tabIndex={-1}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Link>
              <h1 className="text-2xl text-gray-900">Sign up</h1>
              {/* Close Button */}
              <Link
                to={ROUTES.HOME}
                className="justify-self-end text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Link>
            </div>
            {/* Desktop - Simple Title */}
            <h1 className="hidden text-2xl text-gray-900 sm:block sm:text-3xl">
              Sign up
            </h1>
            <p className="mt-3 text-lg text-gray-900 sm:text-xl">Welcome !</p>
            <p className="mt-2 text-sm text-gray-400">
              Create your account to buy or sell electronics
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5 sm:mt-8 sm:space-y-6"
          >
            {/* Full Name Input */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="Enter your email"
                  className={`block w-full rounded-md border px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                    emailValidation.isTouched && !emailValidation.isValid
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  required
                />
              </div>
              {emailValidation.isTouched && !emailValidation.isValid && (
                <p className="mt-1 text-sm text-red-600">
                  Please enter a valid email address
                </p>
              )}
            </div>

            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone number <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1 flex items-center">
                <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="h-full cursor-pointer appearance-none border-0 bg-transparent px-0 py-0 text-2xl font-semibold focus:outline-none focus:ring-0"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.dialCode}>
                        {country.flag}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="absolute inset-y-0 left-12 flex items-center text-gray-400">
                  |
                </div>
                <input
                  id="phoneNumber"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="Enter your phone number"
                  className={`block w-full rounded-md border py-2.5 pl-16 pr-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                    phoneValidation.isTouched && !phoneValidation.isValid
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  required
                />
              </div>
              {phoneValidation.isTouched && !phoneValidation.isValid && (
                <p className="mt-1 text-sm text-red-600">The number is wrong</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2.5 pr-10 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start">
              <input
                id="agreeToTerms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="agreeToTerms"
                className="ml-2 text-sm text-gray-700"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Register Button */}
            {submitError ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isFormValid() && !isSubmitting
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-300"
              }`}
            >
              {isSubmitting ? "Signing up..." : "Register"}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">
                  Or Continue With
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="hidden sm:inline">Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("apple")}
                className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span className="hidden sm:inline">Apple</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("facebook")}
                className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="hidden sm:inline">Facebook</span>
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to={ROUTES.SIGN_IN}
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
