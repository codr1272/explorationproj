const context = require.context("./", false, /\.(svg)$/);

const markerImage = {};

context.keys().forEach((key) => {
  const imageKey = key.replace("./", "").replace(".svg", "");
  markerImage[imageKey] = context(key);
});

export default markerImage;
