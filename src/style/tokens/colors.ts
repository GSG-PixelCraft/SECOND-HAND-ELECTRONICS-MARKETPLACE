const colors = {
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",

  neutral: {
    DEFAULT: "hsl(var(--neutral))",
    20: "hsl(var(--neutral) / 0.2)",
    10: "hsl(var(--neutral) / 0.1)",
    5:  "hsl(var(--neutral) / 0.05)",
  },


  
  primary: {
    DEFAULT: "hsla(221, 83%, 53%, 1)",
    40: "hsla(221, 83%, 53%, 0.4)",
    20: "hsla(221, 83%, 53%, 0.2)",
    10: "hsla(221, 83%, 53%, 0.1)",
    5:  "hsla(221, 83%, 53%, 0.05)",
  },
 muted: {   // رمادي فاتح
    DEFAULT: "hsla(0, 17%, 93%, 1.00)",  // اللون الأساسي
    20: "hsla(0, 0%, 89%, 0.2)",
    10: "hsla(0, 0%, 89%, 0.1)",
    5:  "hsla(0, 0%, 89%, 0.05)",
    foreground: "hsla(0, 3%, 72%, 1.00)",
  },
  secondary: {
    DEFAULT: "hsla(173, 80%, 40%, 1)",
    40: "hsla(173, 80%, 40%, 0.4)",
    20: "hsla(173, 80%, 40%, 0.2)",
    10: "hsla(173, 80%, 40%, 0.1)",
    5:  "hsla(173, 80%, 40%, 0.05)",
  },

  success: {
    DEFAULT: "hsla(142, 71%, 45%, 1)",
    20: "hsla(142, 71%, 45%, 0.2)",
    10: "hsla(142, 71%, 45%, 0.1)",
  },

  warning: {
    DEFAULT: "hsla(48, 96%, 53%, 1)",
    20: "hsla(48, 96%, 53%, 0.2)",
    10: "hsla(48, 96%, 53%, 0.1)",
  },

  error: {
    DEFAULT: "hsla(0, 84%, 60%, 1)",
    20: "hsla(0, 84%, 60%, 0.2)",
    10: "hsla(0, 84%, 60%, 0.1)",
  },
};

export default colors;
