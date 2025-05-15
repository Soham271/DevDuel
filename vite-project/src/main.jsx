import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Store } from "./Store/Store";
import { Provider } from "react-redux";

// import { ChakraProvider, extendTheme } from '@chakra-ui/react';
// import { ChakraProvider } from "@chakra-ui/react";

// const theme = extendTheme({
//   // your custom settings here
//   config: {
//     initialColorMode: 'light',
//     useSystemColorMode: false,
//   },
// });


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={Store}>
     {/* <ChakraProvider  >  */}
       <App />
     {/* </ChakraProvider> */}
       
    
    </Provider>
  </StrictMode>
);
