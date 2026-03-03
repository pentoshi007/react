import { CartContextProvider } from './store/shopping-cart-context.jsx';

import Header from './components/Header.jsx';
import Shop from './components/Shop.jsx';

function App() {

  return (
    <>
      <CartContextProvider >
        {/* for less than react 19, we need to use CartContext.Provider to provide the value to the context*/}
        <Header />
        <Shop />
      </CartContextProvider >
    </>
  );
}

export default App;
