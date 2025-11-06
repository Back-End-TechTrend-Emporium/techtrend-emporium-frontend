// Reexporta todos los átomos desde aquí
export { default as Input } from "./Input";
export { default as Label } from "./Label";

// Tu botón está en carpeta propia con su propio index.ts
// (src/components/atoms/Button/index.ts reexporta Button)
export { default as Button } from "./Button";

// Si usas Select/Avatar/etc. añade sus exports también:
export { default as Select } from "./Select";
