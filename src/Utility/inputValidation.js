const checkValidity = (value, rules) => {
  if (!rules) {
    return null;
  }

  if (rules.required) {
    if (value.trim() === "") {
      return "Required Field";
    }
  }

  if (rules.minWordCount) {
    if (value && value.split(" ").length < rules.minWordCount) {
      return `Minimum Word Count must be ${rules.minWordCount}.`;
    }
  }

  if (rules.maxWordCount) {
    if (value && value.split(" ").length > rules.maxWordCount) {
      return `Maximum allowed Word Count is ${rules.maxWordCount}.`;
    }
  }

  if (rules.minLength) {
    if (value && value.length < rules.minLength) {
      return `Length must be greater than or equal to ${rules.minLength}.`;
    }
  }

  if (rules.maxLength) {
    if (value && value.length > rules.maxLength) {
      return `Length must be less than or equal to ${rules.maxLength}.`;
    }
  }

  if (rules.maxTagCount) {
    if (value.trim().split(",").length > 5) {
      return "Only upto 5 Tags are Allowed.";
    }
  }

  if (rules.isEmail) {
    const pattern =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!pattern.test(value)) {
      return "Invalid Email";
    }
  }

  if (rules.isNumeric) {
    const pattern = /^\d+$/;
    if (!pattern.test(value)) {
      return "Should be Numeric";
    }
  }

  if (rules.isStrongPassword) {
    // let regex = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/;
    const isWhitespace = /^(?=.*\s)/;
    if (isWhitespace.test(value)) {
      return "Password must not contain Whitespaces.";
    }

    const isContainsUppercase = /^(?=.*[A-Z])/;
    if (!isContainsUppercase.test(value)) {
      return "Password must have at least one Uppercase Character.";
    }

    const isContainsLowercase = /^(?=.*[a-z])/;
    if (!isContainsLowercase.test(value)) {
      return "Password must have at least one Lowercase Character.";
    }

    const isContainsNumber = /^(?=.*[0-9])/;
    if (!isContainsNumber.test(value)) {
      return "Password must contain at least one Digit.";
    }

    const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}[\]|\\:;"'<>,.?/_₹])/;
    if (!isContainsSymbol.test(value)) {
      return "Password must contain at least one Special Symbol.";
    }

    const isValidLength = /^.{10,16}$/;
    if (!isValidLength.test(value)) {
      return "Password must be 10-16 Characters Long.";
    }
  }

  return null;
};

export default checkValidity;
