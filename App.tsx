import { store } from "./src/store";
import { Provider } from "react-redux";
import FlashMessage from "react-native-flash-message";
import Routes from "screens";
import { View } from "react-native";

export default function App() {
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <Routes />
        <FlashMessage position="bottom" floating />
      </View>
    </Provider>
  );
}
