require("babel-register")({
    presets: ["es2015", "react"],
});

require("babel-register");

const router = require("./src/App").default;
const Sitemap = require("./react-router-sitemap").default;

new Sitemap(router)
    .build("https://giglist.com.au")
    .save("./public/sitemap.xml");
