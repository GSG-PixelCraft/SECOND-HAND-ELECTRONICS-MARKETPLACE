import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Pencil,
  Smartphone,
  IdCard,
  Mail,
  CheckCircle,
} from "lucide-react";
import { EditProfileForm } from "./EditProfileForm";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";

export default function ProfileDetails() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [showPhoneVerification, setShowPhoneVerification] =
    React.useState(false);
  const [phoneStep, setPhoneStep] = React.useState(1);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [showEmailVerification, setShowEmailVerification] =
    React.useState(false);
  const [emailStep, setEmailStep] = React.useState(1);
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState(["", "", "", ""]);
  const navigate = useNavigate();
  const { user, verification } = useAuthStore();

  const handleVerify = (label: string) => {
    if (label === "Verified Phone") {
      setShowPhoneVerification(true);
      setPhoneStep(1);
      setPhoneNumber("");
    } else if (label === "Verified Identity") {
      navigate(ROUTES.VERIFY_IDENTITY);
    } else if (label === "Verified Email") {
      setShowEmailVerification(true);
      setEmailStep(1);
      setEmail("");
    }
  };

  const handleSendCode = () => {
    if (phoneNumber.trim()) {
      setPhoneStep(2);
    }
  };

  const handleVerifyCode = () => {
    setPhoneStep(3);
  };

  const handleChangePhoneNumber = () => {
    setPhoneStep(4);
    setPhoneNumber("");
  };

  const handleCloseOverlay = () => {
    setShowPhoneVerification(false);
    setPhoneStep(1);
    setPhoneNumber("");
  };

  // Email verification handlers
  const handleSendEmailCode = () => {
    if (email.trim()) {
      setEmailStep(2);
    }
  };

  const handleVerifyEmailCode = () => {
    setEmailStep(3);
  };

  const handleChangeEmail = () => {
    setEmailStep(4);
    setEmail("");
  };

  const handleCloseEmailOverlay = () => {
    setShowEmailVerification(false);
    setEmailStep(1);
    setEmail("");
    setOtp(["", "", "", ""]);
  };

  if (isEditing) {
    return (
      <EditProfileForm
        onCancel={() => setIsEditing(false)}
        onSubmit={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted-10" />

            <div className="space-y-1">
              <p className="text-bodyLg font-semibold text-neutral-foreground">
                Eleanor Vance
              </p>

              <div className="flex items-center gap-2 text-caption text-muted-foreground">
                <MapPin size={14} />
                <span>Palestine</span>
              </div>

              <div className="flex items-center gap-2 text-caption text-muted-foreground">
                <Calendar size={14} />
                <span>Member since May 2023</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-10 text-primary transition hover:bg-primary-20"
          >
            <Pencil size={18} />
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold text-neutral-foreground">
            Profile Completion
          </p>
          <p className="text-body font-semibold text-primary">50%</p>
        </div>

        <div className="h-2 w-full rounded-full bg-neutral-10">
          <div className="h-2 w-1/2 rounded-full bg-primary" />
        </div>
      </section>

      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <p className="mb-1 font-semibold text-neutral-foreground">
          Trust indicators
        </p>
        <p className="mb-4 text-caption text-muted-foreground">
          Verify your identity, mobile and email to get “Verified” badge. Tap to
          verify missing items
        </p>

        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Verified Phone",
              icon: Smartphone,
              verified: verification.phone?.status === "verified",
            },
            {
              label: "Verified Identity",
              icon: IdCard,
              verified: verification.identity?.status === "approved",
            },
            {
              label: "Verified Email",
              icon: Mail,
              verified:
                user?.emailVerified ||
                verification.email?.status === "verified",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                onClick={() => !item.verified && handleVerify(item.label)}
                disabled={item.verified}
                key={item.label}
                className={`relative flex flex-col items-center gap-2 rounded-lg border border-neutral-20 p-4 ${
                  !item.verified ? "cursor-pointer hover:border-primary" : ""
                }`}
              >
                <Icon className="text-primary" />
                <span className="text-caption text-neutral-foreground">
                  {item.label}
                </span>

                {item.verified && (
                  <CheckCircle
                    size={16}
                    className="absolute -right-2 -top-2 text-success"
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <p className="mb-4 font-semibold text-neutral-foreground">
          Activity Summary
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-neutral-20 p-4">
            <p className="text-bodyLg font-semibold text-neutral-foreground">
              10 hours
            </p>
            <p className="text-caption text-muted-foreground">Avg. response</p>
          </div>

          <div className="rounded-lg border border-neutral-20 p-4">
            <p className="text-bodyLg font-semibold text-neutral-foreground">
              12
            </p>
            <p className="text-caption text-muted-foreground">Active listing</p>
          </div>
        </div>
      </section>

      {/* Phone Verification Overlay */}
      {showPhoneVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm rounded-lg bg-white p-8 text-center">
            {phoneStep === 1 && (
              <>
                <h2 className="mb-2 text-xl font-bold">Verify phone number</h2>
                <p className="mb-6 text-gray-600">Enter your phone number</p>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+970 59-123-4567"
                  className="mb-4 w-full rounded-md border px-3 py-2"
                />
                <button
                  onClick={handleSendCode}
                  disabled={!phoneNumber.trim()}
                  className="w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-300"
                >
                  Send code
                </button>
                <button
                  onClick={handleCloseOverlay}
                  className="mt-2 w-full py-2 text-gray-600"
                >
                  Cancel
                </button>
              </>
            )}

            {phoneStep === 2 && (
              <>
                <h2 className="mb-2 text-xl font-bold">Verify phone number</h2>
                <p className="mb-6 text-gray-600">
                  Enter 4-digit verification code we sent to{" "}
                  {phoneNumber.slice(0, 7)}*****07
                </p>
                <div className="mb-6 flex justify-center space-x-2">
                  <input
                    type="text"
                    maxLength={1}
                    className="h-12 w-12 rounded-md border text-center text-lg"
                  />
                  <input
                    type="text"
                    maxLength={1}
                    className="h-12 w-12 rounded-md border text-center text-lg"
                  />
                  <input
                    type="text"
                    maxLength={1}
                    className="h-12 w-12 rounded-md border text-center text-lg"
                  />
                  <input
                    type="text"
                    maxLength={1}
                    className="h-12 w-12 rounded-md border text-center text-lg"
                  />
                </div>
                <button
                  onClick={handleVerifyCode}
                  className="mb-4 w-full rounded-md bg-gray-200 py-2 text-gray-500"
                >
                  Verify
                </button>
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  <a href="#" className="text-blue-600">
                    Resend
                  </a>
                </p>
                <a
                  href="#"
                  onClick={handleChangePhoneNumber}
                  className="mt-2 inline-block text-sm text-gray-600"
                >
                  Change phone number
                </a>
              </>
            )}

            {phoneStep === 4 && (
              <>
                <h2 className="mb-2 text-xl font-bold">Change phone number</h2>
                <p className="mb-6 text-gray-600">
                  We will send a verification code to your new account phone
                  number
                </p>

                <div className="mb-4">
                  <div className="flex items-center rounded-lg border px-4 py-3">
                    <div className="relative flex-1">
                      <select className="w-full appearance-none bg-transparent pr-8 text-sm outline-none">
                        <option>+970 🇵🇸 Palestine</option>
                        <option>+962 🇯🇴 Jordan</option>
                        <option>+20 🇪🇬 Egypt</option>
                        <option>+966 🇸🇦 Saudi Arabia</option>
                        <option>+971 🇦🇪 UAE</option>
                        <option>+1 🇺🇸 United States</option>
                        <option>+44 🇬🇧 United Kingdom</option>
                        <option>+213 🇩🇿 Algeria</option>
                        <option>+376 🇦🇩 Andorra</option>
                        <option>+244 🇦🇴 Angola</option>
                        <option>+54 🇦🇷 Argentina</option>
                        <option>+374 🇦🇲 Armenia</option>
                        <option>+61 🇦🇺 Australia</option>
                        <option>+43 🇦🇹 Austria</option>
                        <option>+994 🇦🇿 Azerbaijan</option>
                        <option>+973 🇧🇭 Bahrain</option>
                        <option>+880 🇧🇩 Bangladesh</option>
                        <option>+375 🇧🇾 Belarus</option>
                        <option>+32 🇧🇪 Belgium</option>
                        <option>+501 🇧🇿 Belize</option>
                        <option>+229 🇧🇯 Benin</option>
                        <option>+975 🇧🇹 Bhutan</option>
                        <option>+591 🇧🇴 Bolivia</option>
                        <option>+387 🇧🇦 Bosnia</option>
                        <option>+267 🇧🇼 Botswana</option>
                        <option>+55 🇧🇷 Brazil</option>
                        <option>+673 🇧🇳 Brunei</option>
                        <option>+359 🇧🇬 Bulgaria</option>
                        <option>+226 🇧🇫 Burkina Faso</option>
                        <option>+257 🇧🇮 Burundi</option>
                        <option>+855 🇰🇭 Cambodia</option>
                        <option>+237 🇨🇲 Cameroon</option>
                        <option>+1 🇨🇦 Canada</option>
                        <option>+236 🇨🇫 Central Africa</option>
                        <option>+235 🇹🇩 Chad</option>
                        <option>+56 🇨🇱 Chile</option>
                        <option>+86 🇨🇳 China</option>
                        <option>+57 🇨🇴 Colombia</option>
                        <option>+269 🇰🇲 Comoros</option>
                        <option>+242 🇨🇬 Congo</option>
                        <option>+243 🇨🇩 Congo DR</option>
                        <option>+682 🇨🇰 Cook Islands</option>
                        <option>+506 🇨🇷 Costa Rica</option>
                        <option>+385 🇭🇷 Croatia</option>
                        <option>+53 🇨🇺 Cuba</option>
                        <option>+357 🇨🇾 Cyprus</option>
                        <option>+420 🇨🇿 Czech Republic</option>
                        <option>+45 🇩🇰 Denmark</option>
                        <option>+253 🇩🇯 Djibouti</option>
                        <option>+1767 🇩🇲 Dominica</option>
                        <option>+670 🇹🇱 East Timor</option>
                        <option>+593 🇪🇨 Ecuador</option>
                        <option>+503 🇸🇻 El Salvador</option>
                        <option>+240 🇬🇶 Equatorial Guinea</option>
                        <option>+291 🇪🇷 Eritrea</option>
                        <option>+372 🇪🇪 Estonia</option>
                        <option>+251 🇪🇹 Ethiopia</option>
                        <option>+500 🇫🇰 Falkland Islands</option>
                        <option>+298 🇫🇴 Faroe Islands</option>
                        <option>+679 🇫🇯 Fiji</option>
                        <option>+358 🇫🇮 Finland</option>
                        <option>+33 🇫🇷 France</option>
                        <option>+689 🇵🇫 French Polynesia</option>
                        <option>+241 🇬🇦 Gabon</option>
                        <option>+220 🇬🇲 Gambia</option>
                        <option>+995 🇬🇪 Georgia</option>
                        <option>+49 🇩🇪 Germany</option>
                        <option>+233 🇬🇭 Ghana</option>
                        <option>+350 🇬🇮 Gibraltar</option>
                        <option>+30 🇬🇷 Greece</option>
                        <option>+299 🇬🇱 Greenland</option>
                        <option>+502 🇬🇹 Guatemala</option>
                        <option>+224 🇬🇳 Guinea</option>
                        <option>+245 🇬🇼 Guinea-Bissau</option>
                        <option>+592 🇬🇾 Guyana</option>
                        <option>+509 🇭🇹 Haiti</option>
                        <option>+504 🇭🇳 Honduras</option>
                        <option>+852 🇭🇰 Hong Kong</option>
                        <option>+36 🇭🇺 Hungary</option>
                        <option>+354 🇮🇸 Iceland</option>
                        <option>+91 🇮🇳 India</option>
                        <option>+62 🇮🇩 Indonesia</option>
                        <option>+98 🇮🇷 Iran</option>
                        <option>+964 🇮🇶 Iraq</option>
                        <option>+353 🇮🇪 Ireland</option>
                        <option>+44 🇮🇲 Isle of Man</option>
                        <option>+972 🇮🇱 Israel</option>
                        <option>+39 🇮🇹 Italy</option>
                        <option>+225 🇨🇮 Ivory Coast</option>
                        <option>+1876 🇯🇲 Jamaica</option>
                        <option>+81 🇯🇵 Japan</option>
                        <option>+7 🇰🇿 Kazakhstan</option>
                        <option>+254 🇰🇪 Kenya</option>
                        <option>+686 🇰🇮 Kiribati</option>
                        <option>+965 🇰🇼 Kuwait</option>
                        <option>+996 🇰🇬 Kyrgyzstan</option>
                        <option>+856 🇱🇦 Laos</option>
                        <option>+371 🇱🇻 Latvia</option>
                        <option>+961 🇱🇧 Lebanon</option>
                        <option>+266 🇱🇸 Lesotho</option>
                        <option>+370 🇱🇹 Lithuania</option>
                        <option>+352 🇱🇺 Luxembourg</option>
                        <option>+853 🇲🇴 Macau</option>
                        <option>+389 🇲🇰 Macedonia</option>
                        <option>+261 🇲🇬 Madagascar</option>
                        <option>+60 🇲🇼 Malawi</option>
                        <option>+960 🇲🇻 Maldives</option>
                        <option>+223 🇲🇱 Mali</option>
                        <option>+356 🇲🇹 Malta</option>
                        <option>+692 🇲🇭 Marshall Islands</option>
                        <option>+596 🇲🇶 Martinique</option>
                        <option>+222 🇲🇷 Mauritania</option>
                        <option>+230 🇲🇺 Mauritius</option>
                        <option>+262 🇾🇹 Mayotte</option>
                        <option>+52 🇲🇽 Mexico</option>
                        <option>+691 🇫🇲 Micronesia</option>
                        <option>+373 🇲🇩 Moldova</option>
                        <option>+377 🇲🇨 Monaco</option>
                        <option>+976 🇲🇳 Mongolia</option>
                        <option>+382 🇲🇪 Montenegro</option>
                        <option>+212 🇲🇦 Morocco</option>
                        <option>+258 🇲🇿 Mozambique</option>
                        <option>+95 🇲🇲 Myanmar</option>
                        <option>+264 🇳🇦 Namibia</option>
                        <option>+674 🇳🇷 Nauru</option>
                        <option>+977 🇳🇵 Nepal</option>
                        <option>+31 🇳🇱 Netherlands</option>
                        <option>+687 🇳🇨 New Caledonia</option>
                        <option>+64 🇳🇿 New Zealand</option>
                        <option>+505 🇳🇮 Nicaragua</option>
                        <option>+227 🇳🇪 Niger</option>
                        <option>+234 🇳🇬 Nigeria</option>
                        <option>+683 🇳🇺 Niue</option>
                        <option>+850 🇰🇵 North Korea</option>
                        <option>+47 🇳🇴 Norway</option>
                        <option>+968 🇴🇲 Oman</option>
                        <option>+92 🇵🇰 Pakistan</option>
                        <option>+680 🇵🇼 Palau</option>
                        <option>+507 🇵🇦 Panama</option>
                        <option>+675 🇵🇬 Papua New Guinea</option>
                        <option>+595 🇵🇾 Paraguay</option>
                        <option>+51 🇵🇪 Peru</option>
                        <option>+63 🇵🇭 Philippines</option>
                        <option>+48 🇵🇱 Poland</option>
                        <option>+351 🇵🇹 Portugal</option>
                        <option>+974 🇶🇦 Qatar</option>
                        <option>+262 🇷🇪 Réunion</option>
                        <option>+40 🇷🇴 Romania</option>
                        <option>+7 🇷🇺 Russia</option>
                        <option>+250 🇷🇼 Rwanda</option>
                        <option>+1869 🇰🇳 Saint Kitts</option>
                        <option>+1758 🇱🇨 Saint Lucia</option>
                        <option>+1784 🇻🇨 Saint Vincent</option>
                        <option>+685 🇼🇸 Samoa</option>
                        <option>+378 🇸🇲 San Marino</option>
                        <option>+966 🇸🇦 Saudi Arabia</option>
                        <option>+221 🇸🇳 Senegal</option>
                        <option>+381 🇷🇸 Serbia</option>
                        <option>+248 🇸🇨 Seychelles</option>
                        <option>+232 🇸🇱 Sierra Leone</option>
                        <option>+65 🇸🇬 Singapore</option>
                        <option>+421 🇸🇰 Slovakia</option>
                        <option>+386 🇸🇮 Slovenia</option>
                        <option>+677 🇸🇧 Solomon Islands</option>
                        <option>+252 🇸🇴 Somalia</option>
                        <option>+27 🇿🇦 South Africa</option>
                        <option>+82 🇰🇷 South Korea</option>
                        <option>+34 🇪🇸 Spain</option>
                        <option>+94 🇱🇰 Sri Lanka</option>
                        <option>+249 🇸🇩 Sudan</option>
                        <option>+597 🇸🇷 Suriname</option>
                        <option>+46 🇸🇪 Sweden</option>
                        <option>+41 🇨🇭 Switzerland</option>
                        <option>+963 🇸🇾 Syria</option>
                        <option>+886 🇹🇼 Taiwan</option>
                        <option>+992 🇹🇯 Tajikistan</option>
                        <option>+255 🇹🇿 Tanzania</option>
                        <option>+66 🇹🇭 Thailand</option>
                        <option>+228 🇹🇬 Togo</option>
                        <option>+690 🇹🇰 Tokelau</option>
                        <option>+676 🇹🇴 Tonga</option>
                        <option>+216 🇹🇳 Tunisia</option>
                        <option>+90 🇹🇷 Turkey</option>
                        <option>+993 🇹🇲 Turkmenistan</option>
                        <option>+688 🇹🇻 Tuvalu</option>
                        <option>+256 🇺🇬 Uganda</option>
                        <option>+380 🇺🇦 Ukraine</option>
                        <option>+971 🇦🇪 United Arab Emirates</option>
                        <option>+598 🇺🇾 Uruguay</option>
                        <option>+1 🇺🇸 USA</option>
                        <option>+998 🇺🇿 Uzbekistan</option>
                        <option>+678 🇻🇺 Vanuatu</option>
                        <option>+58 🇻🇪 Venezuela</option>
                        <option>+84 🇻🇳 Vietnam</option>
                        <option>+681 🇼🇫 Wallis</option>
                        <option>+967 🇾🇪 Yemen</option>
                        <option>+260 🇿🇲 Zambia</option>
                        <option>+263 🇿🇼 Zimbabwe</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mx-3 h-6 border-l border-gray-300"></div>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="interior number"
                      className="flex-1 text-sm outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendCode}
                  disabled={!phoneNumber.trim()}
                  className="mb-2 w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-300"
                >
                  Save and send code
                </button>
                <button
                  onClick={() => setPhoneStep(2)}
                  className="w-full py-2 text-gray-600"
                >
                  Cancel
                </button>
              </>
            )}

            {phoneStep === 3 && (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h2 className="mb-2 text-xl font-bold">Phone verified</h2>
                <p className="mb-6 text-gray-600">
                  Your phone number has been verified successfully.
                </p>
                <button
                  onClick={handleCloseOverlay}
                  className="w-full rounded-md bg-blue-600 py-2 text-white"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Email Verification Overlay */}
      {showEmailVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm rounded-lg bg-white p-8">
            {/* Email Step 1: Enter Email */}
            {emailStep === 1 && (
              <>
                <h2 className="mb-2 text-xl font-bold">Verify email address</h2>
                <p className="mb-6 text-gray-600">Enter your email address</p>

                <div className="mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                  />
                </div>

                <button
                  onClick={handleSendEmailCode}
                  disabled={!email.trim()}
                  className="mb-2 w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-300"
                >
                  Send code
                </button>
                <button
                  onClick={handleCloseEmailOverlay}
                  className="w-full py-2 text-gray-600"
                >
                  Cancel
                </button>
              </>
            )}

            {/* Email Step 2: Enter OTP */}
            {emailStep === 2 && (
              <>
                <h2 className="mb-2 text-xl font-bold">Verify email address</h2>
                <p className="mb-6 text-gray-600">
                  Enter the 4-digit verification code we sent to{" "}
                  {email.substring(0, 3)}***@
                  {email.split("@")[1] || "domain.com"}
                </p>

                <div className="mb-6 flex justify-center space-x-2">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => {
                        const newOtp = [...otp];
                        newOtp[index] = e.target.value;
                        setOtp(newOtp);
                        if (e.target.value && index < 3) {
                          const nextInput = document.getElementById(
                            `otp-${index + 1}`,
                          ) as HTMLInputElement;
                          if (nextInput) nextInput.focus();
                        }
                      }}
                      id={`otp-${index}`}
                      className="h-12 w-12 rounded-md border text-center text-lg outline-none focus:border-blue-500"
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerifyEmailCode}
                  disabled={otp.some((digit) => !digit)}
                  className="mb-4 w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-300"
                >
                  Verify
                </button>

                <div className="text-center">
                  <p className="mb-2 text-sm text-gray-600">
                    Didn't receive the code?{" "}
                    <a href="#" className="text-blue-600">
                      Resend
                    </a>
                  </p>
                  <a
                    href="#"
                    onClick={handleChangeEmail}
                    className="text-sm text-gray-600"
                  >
                    Change email address
                  </a>
                </div>
              </>
            )}

            {/* Email Step 3: Success */}
            {emailStep === 3 && (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h2 className="mb-2 text-xl font-bold">Email verified</h2>
                <p className="mb-6 text-gray-600">
                  Your email address has been verified successfully.
                </p>
                <button
                  onClick={handleCloseEmailOverlay}
                  className="w-full rounded-md bg-blue-600 py-2 text-white"
                >
                  Done
                </button>
              </>
            )}

            {/* Email Step 4: Change Email */}
            {emailStep === 4 && (
              <>
                <h2 className="mb-2 text-xl font-bold">Change email address</h2>
                <p className="mb-6 text-gray-600">
                  We will send a verification code to your new email address
                </p>

                <div className="mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter new email address"
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                  />
                </div>

                <button
                  onClick={handleSendEmailCode}
                  disabled={!email.trim()}
                  className="mb-2 w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-300"
                >
                  Save and send code
                </button>
                <button
                  onClick={() => setEmailStep(2)}
                  className="w-full py-2 text-gray-600"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
