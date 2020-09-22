module.exports.validateSignUpInput = (
  password,
  confirmPassword,
  email,
  firstName,
  lastName,
  phoneNumber,
  companyEmail,
  companyName,
  websiteUrl,
  city,
  country,
  postalCode,
) => {
  const errors = {};

  if (firstName.trim() === '') {
    errors.firstName = 'First name must not be empty';
  }

  if (lastName.trim() === '') {
    errors.lastName = 'Last name must not be empty';
  }

  if (phoneNumber.trim() === '') {
    errors.phoneNumber = 'Phone number  must not be empty';
  }

  if (city.trim() === '') {
    errors.city = 'city  must not be empty';
  }

  if (country.trim() === '') {
    errors.country = 'country must not be empty';
  }

  if (postalCode.trim() === '') {
    errors.postalCode = 'Postal code must not be empty';
  }

  if (companyEmail.trim() === '') {
    errors.companyEmail = 'Company email  must not be empty';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!companyEmail.match(regEx)) {
      errors.companyEmail =
        'Company email must be a valid email address';
    }
  }

  if (websiteUrl.trim() === '') {
    errors.websiteUrl = 'company website must not be empty';
  }

  if (companyName.trim() === '') {
    errors.companyName = 'Company name must not be empty';
  }

  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }
  if (password.trim() === '') {
    errors.password = 'Password must not empty';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }
  // console.log(errors);
  return {
    __typename: 'UserInputError',
    userErrors: errors,
    type: 'UserInputError',
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (email, password) => {
  const userErrors = {};
  if (email.trim() === '') {
    userErrors.email = 'Email must not be empty';
  }
  if (password.trim() === '') {
    userErrors.password = 'Password must not be empty';
  }

  return {
    __typename: 'UserInputError',
    userErrors,
    valid: Object.keys(userErrors).length < 1,
  };
};
