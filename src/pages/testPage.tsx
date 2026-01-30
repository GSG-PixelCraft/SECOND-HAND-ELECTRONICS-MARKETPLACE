import PhoneImage from "../images/Phone.jpg"
import AdCardUiVertical from "../components/data-display/card/AdCardComponenet/ui-vertical";
import AdCardWfVertical from "../components/data-display/card/AdCardComponenet/wf-vertical";
export default function App() {
  return (
    <div className="p-6 flex gap-4">
 
     <AdCardUiVertical title="iPhone 14 Pro Max"
      price="2000 ILS" location="Gaza City" 
      category="Phones" image={PhoneImage} 
      showCategory={true} showLocation={true} 
      showFavorite={true} showImage={true} 
      showCategoryOnImage={true} 
      onFavoriteClick={() => alert("Added to favorites!")

      }
      />
     <AdCardWfVertical 
     title="iPhone 14 Pro Max" 
     price="2000 ILS" 
     location="Gaza City" 
     category="Phones" 
      showCategory={true} showLocation={true} showFavorite={true}   onFavoriteClick={() => alert("Added to favorites!")} />

    </div>
  );
}
