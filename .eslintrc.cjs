module.exports = {
  extends: "next/core-web-vitals",
  rules: {
    /* Enforce no console.log in production code */
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
};

