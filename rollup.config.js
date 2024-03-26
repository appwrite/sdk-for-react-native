import pkg from "./package.json";
import typescript from "@rollup/plugin-typescript";

export default {
    external: Object.keys(pkg.dependencies),
    input: "src/index.ts",
    plugins: [typescript()],
    output: [
        {
            format: "es",
            file: pkg.module,
            sourcemap: true,
        }
    ],
};
