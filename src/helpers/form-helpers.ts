import { FieldError, Merge } from "react-hook-form";

export const extractErrorMessages = (errors: Merge<FieldError, (FieldError | undefined)[]> | undefined) => {
  if (!errors) {
    return undefined;
  }
  if (Array.isArray(errors)) {
    const fieldErrors: FieldError[] = errors;
    return fieldErrors.filter(x => x.message).map(x => x.message).join("; ");
  }
  return errors.message;
}