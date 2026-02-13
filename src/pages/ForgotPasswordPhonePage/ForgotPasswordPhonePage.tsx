import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/services/auth.service";
import type { AxiosError } from "axios";

interface Country {
  name: string;
  code: string;
  dialCode: string;
}

const COUNTRIES_FALLBACK: Country[] = [
  { name: "Palestine", code: "PS", dialCode: "+970" },
  { name: "United States", code: "US", dialCode: "+1" },
  { name: "United Kingdom", code: "GB", dialCode: "+44" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971" },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966" },
  { name: "Egypt", code: "EG", dialCode: "+20" },
  { name: "Jordan", code: "JO", dialCode: "+962" },
  { name: "Lebanon", code: "LB", dialCode: "+961" },
  { name: "Syria", code: "SY", dialCode: "+963" },
  { name: "Iraq", code: "IQ", dialCode: "+964" },
  { name: "Kuwait", code: "KW", dialCode: "+965" },
  { name: "Qatar", code: "QA", dialCode: "+974" },
  { name: "Bahrain", code: "BH", dialCode: "+973" },
  { name: "Oman", code: "OM", dialCode: "+968" },
  { name: "Yemen", code: "YE", dialCode: "+967" },
  { name: "Canada", code: "CA", dialCode: "+1" },
  { name: "France", code: "FR", dialCode: "+33" },
  { name: "Germany", code: "DE", dialCode: "+49" },
  { name: "Italy", code: "IT", dialCode: "+39" },
  { name: "Spain", code: "ES", dialCode: "+34" },
  { name: "Australia", code: "AU", dialCode: "+61" },
  { name: "India", code: "IN", dialCode: "+91" },
  { name: "Japan", code: "JP", dialCode: "+81" },
  { name: "China", code: "CN", dialCode: "+86" },
  { name: "Brazil", code: "BR", dialCode: "+55" },
];

const forgotPasswordPhoneSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
});

type ForgotPasswordPhoneFormData = z.infer<typeof forgotPasswordPhoneSchema>;

export default function ForgotPasswordPhonePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("+970");
  const [countries, setCountries] = useState<Country[]>(COUNTRIES_FALLBACK);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordPhoneFormData>({
    resolver: zodResolver(forgotPasswordPhoneSchema),
    mode: "onChange",
  });

  const phoneValue = watch("phone");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,idd",
        );
        if (!response.ok) {
          throw new Error(`Countries request failed: ${response.status}`);
        }
        const data = (await response.json()) as Array<{
          name: { common: string };
          cca2: string;
          idd?: { root: string; suffixes?: string[] };
        }>;

        const countryList: Country[] = data
          .map((country) => ({
            name: country.name.common,
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
        console.error("Failed to fetch countries, using fallback:", error);
      }
    };

    fetchCountries();
  }, []);

  const onSubmit = async (data: ForgotPasswordPhoneFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const normalizedCountryCode = countryCode.startsWith("+")
        ? countryCode
        : `+${countryCode}`;
      const cleanValue = data.phone.replace(/\s/g, "");
      const fullPhoneNumber = `${normalizedCountryCode}${cleanValue}`;
      await authService.sendVerificationCode({
        phoneNumber: fullPhoneNumber,
      });
      console.log("Forgot password phone:", fullPhoneNumber);
      // Navigate to OTP screen
      navigate(ROUTES.OTP_PHONE, { state: { phoneNumber: fullPhoneNumber } });
    } catch (error) {
      const apiError = error as AxiosError<{ message?: string }>;
      setSubmitError(
        apiError.response?.data?.message ??
          "Failed to send verification code. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between px-6 py-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-gray-700 hover:text-gray-900"
        >
          Back
        </button>
        <Link
          to={ROUTES.HOME}
          className="text-base font-semibold text-blue-600"
        >
          Logo
        </Link>
        <span className="w-10" aria-hidden="true" />
      </div>

      <div className="flex items-start justify-center px-5 py-10">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Forget Password
          </h1>
          <p className="text-sm text-gray-400">
            Enter your phone number to receive a verification code.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-left">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone number <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1 flex items-center">
                <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-sm text-gray-700">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="h-full cursor-pointer appearance-none border-0 bg-transparent px-0 py-0 text-sm focus:outline-none focus:ring-0"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.dialCode}>
                        {country.dialCode} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="absolute inset-y-0 left-20 flex items-center text-gray-300">
                  |
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  className={`block w-full rounded-md border py-2.5 pl-28 pr-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                    errors.phone
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  {...register("phone")}
                />
              </div>
              {errors.phone ? (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              ) : null}
            </div>

            {submitError ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!isValid || !phoneValue || isSubmitting}
              className={`w-full rounded-md px-4 py-3 text-sm font-medium transition ${
                isValid && phoneValue && !isSubmitting
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Code"}
            </button>
          </form>

          <Link
            to={ROUTES.FORGOT_PASSWORD_EMAIL}
            className="text-xs text-gray-600 hover:underline"
          >
            Reset Password via Email
          </Link>
        </div>
      </div>
    </div>
  );
}
