import PhoneImage from "../images/Phone.jpg";
import { AdCard } from "@/components/ui/AdCard";
export default function App() {
  return (
    <div className="flex gap-4 p-6">
      <AdCard
        title="iPhone 14 Pro Max"
        price="2000 ILS"
        location="Gaza City"
        category="Phones"
        image={PhoneImage}
        isFavorite={true}
        onToggleFavorite={() => alert("Added to favorites!")}
      />
      <AdCard
        title="iPhone 14 Pro Max"
        price="2000 ILS"
        location="Gaza City"
        category="Phones"
        image={PhoneImage}
        downBadge
        onToggleFavorite={() => alert("Added to favorites!")}
      />
    </div>
  );
}
