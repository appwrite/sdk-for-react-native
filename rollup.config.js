import pkg from "./package.json";
import typescript from "@rollup/plugin-typescript";

const external = Object.keys(pkg.dependencies ?? {});

export default {
    input: "src/index.ts",
    external,
    plugins: [typescript()],
    output: [
        {
            format: "cjs",
            file: pkg.main,
            esModule: false,
            sourcemap: true,
        },
        {
            format: "es",
            file: pkg.module,
            sourcemap: true,
        },
    ],
};
