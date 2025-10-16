import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, CreditCard, Calendar, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user)
    return <p className="text-center text-[#0c4139] mt-20">Please login first.</p>;

  const date = new Date(user.dateOnBoard);
  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const avatarLetter = user.firstName?.[0]?.toUpperCase() + user.lastName?.[0]?.toUpperCase() || "U";

  return (
    <div className="max-w-4xl mx-auto mt-16 mb-16 bg-white shadow-md rounded-2xl p-10 border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6 mb-8">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0c4139] to-[#1f6b58] flex items-center justify-center text-white text-3xl font-bold shadow-md">
          {avatarLetter}
        </div>

        {/* Basic Info */}
        <div>
          <h2 className="text-3xl font-semibold text-[#0c4139]">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-400 mt-1">
            Member since <span className="font-medium text-gray-600">{formattedDate}</span>
          </p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
        <div className="flex items-center gap-3">
          <User size={20} className="text-[#0c4139]" />
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Mail size={20} className="text-[#0c4139]" />
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Phone size={20} className="text-[#0c4139]" />
          <p>
            <strong>Mobile:</strong> {user.countryCode}-{user.mobile}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CreditCard size={20} className="text-[#0c4139]" />
          <p>
            <strong>PAN Card:</strong> {user.PanCard || "Not provided"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-[#0c4139]" />
          <p>
            <strong>Date Onboarded:</strong> {formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Shield size={20} className="text-[#0c4139]" />
          <p>
            <strong>Risk Profile:</strong>{" "}
            <span
              className={`font-semibold ${
                user.riskProfile === "Aggressive"
                  ? "text-red-600"
                  : user.riskProfile === "Balanced"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {user.riskProfile}
            </span>
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
        <div className="bg-[#f6fdfb] border border-[#cde6de] rounded-xl p-6 text-center shadow-sm">
          <h3 className="text-sm text-gray-500 mb-2">Total Investments</h3>
          <p className="text-2xl font-bold text-[#0c4139]">₹3,45,000</p>
        </div>

        <div className="bg-[#f6fdfb] border border-[#cde6de] rounded-xl p-6 text-center shadow-sm">
          <h3 className="text-sm text-gray-500 mb-2">Portfolio Risk</h3>
          <p
            className={`text-2xl font-bold ${
              user.riskProfile === "Aggressive"
                ? "text-red-600"
                : user.riskProfile === "Balanced"
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {user.riskProfile}
          </p>
        </div>

        <div className="bg-[#f6fdfb] border border-[#cde6de] rounded-xl p-6 text-center shadow-sm">
          <h3 className="text-sm text-gray-500 mb-2">Last Login</h3>
          <p className="text-2xl font-bold text-[#0c4139]">
            {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>
      </div> */}
    </div>
  );
}
