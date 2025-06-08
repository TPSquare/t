import prefixSelector from "postcss-prefix-selector";
import nested from "postcss-nested";

export default {
  plugins: [nested, prefixSelector({ prefix: "#frame" })],
};
