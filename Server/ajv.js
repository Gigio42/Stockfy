import Ajv from "ajv";
import addFormats from "ajv-formats";
import AjvErrors from "ajv-errors";

export default function configureAjv() {
  const ajv = new Ajv({
    allErrors: true,
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: "array",
  });

  addFormats(ajv);
  AjvErrors(ajv);

  return ajv;
}
