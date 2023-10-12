import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Login,
  Register,
  Forgot,
  Reset,
  Onboarding,
  Verify,
} from "../screens/signedOut";
import {
  Chat,
  Pharmacies,
  Pharmacy,
  Product,
  Products,
  UserPharmacies,
  CreatePharmacy,
  Pricing,
  Terms,
  Privacy,
  Contact,
  Payment,
  PharmacyDetails,
} from "../screens/signedIn";
import UserHomeNavigation from "./UserHomeNavigation";
import { useAppContext } from "../context/AppContext";
import AddProduct from "../screens/signedIn/AddProduct";
import LocationRequest from "../components/LocationRequest";

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const { launched, location } = useAppContext();

  if (!location) return <LocationRequest />;

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      initialRouteName={launched !== null ? "Bottom" : "Onboarding"}
    >
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Bottom" component={UserHomeNavigation} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Verify" component={Verify} />
      <Stack.Screen name="Forgot" component={Forgot} />
      <Stack.Screen name="Reset" component={Reset} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Pharmacies" component={Pharmacies} />
      <Stack.Screen name="Pharmacy" component={Pharmacy} />
      <Stack.Screen name="Product" component={Product} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="UserPharmacies" component={UserPharmacies} />
      <Stack.Screen name="CreatePharmacy" component={CreatePharmacy} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      <Stack.Screen name="Pricing" component={Pricing} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="Contact" component={Contact} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="PharmacyDetails" component={PharmacyDetails} />
    </Stack.Navigator>
  );
};

export default AppNavigation;
