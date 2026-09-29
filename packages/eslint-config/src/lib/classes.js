/** @param {string} value */
export function splitClasses(value) {
  return value.split(/\s+/).filter(Boolean);
}

/**
 * Retorna só a utilidade de uma classe Tailwind, sem variantes.
 * "hover:[&>svg]:bg-[#fff]" -> "bg-[#fff]"
 * @param {string} cls
 */
export function utilityOf(cls) {
  let depth = 0;
  let start = 0;
  for (let i = 0; i < cls.length; i++) {
    const char = cls[i];
    if (char === "[" || char === "(") depth++;
    else if (char === "]" || char === ")") depth--;
    else if (char === ":" && depth === 0) start = i + 1;
  }
  return cls.slice(start).replace(/^!/, "").replace(/!$/, "");
}
