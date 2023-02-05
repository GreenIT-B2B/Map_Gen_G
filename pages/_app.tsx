import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";

import { wrapper, store } from "../store/store";
import { Provider } from "react-redux";

import Top from "../src/component/common/Top";
import Footer from "../src/component/common/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        {/*<div style={{ width: 1000, margin: "0 auto" }}>*/}
          {/*<Top />*/}
          <Component {...pageProps} />
          {/*<Footer />*/}
        {/*</div>*/}
      </Provider>
    </>
  );
}

export default wrapper.withRedux(MyApp);
