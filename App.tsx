import {store} from "./src/store"
import { Provider } from "react-redux";
import NavigationComponent from "./src/components/navigation";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationComponent/>
    </Provider>
  );
}
