let zod;

try {
  zod = require("zod");
} catch (error) {
  zod = require("../../frontend/node_modules/zod");
}

module.exports = zod;
