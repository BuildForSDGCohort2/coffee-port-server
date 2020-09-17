module.exports.validateSignUpInput = (
  password,
  confirmPassword,
  email,
  firstName,
  lastName,
  phoneNumber,

  companyWebsite,
  companyName,
  companyEmail,

  city,
  country,
  postalCode,
  street,
) => {
  const errors = {};

  // if (firstName.trim() === '') {
  //   errors.firstName = 'First name must not be empty';
  // }

  // if (lastName.trim() === '') {
  //   errors.firstName = 'Last name must not be empty';
  // }

  // if (phoneNumber.trim() === '') {
  //   errors.firstName = 'Phone number  must not be empty';
  // }

  // if (city.trim() === '') {
  //   errors.city = 'city  must not be empty';
  // }

  // if (country.trim() === '') {
  //   errors.country = 'country must not be empty';
  // }

  // if (street.trim() === '') {
  //   errors.street = 'street  must not be empty';
  // }

  // if (postalCode.trim() === '') {
  //   errors.postalCode = 'Postal code must not be empty';
  // }

  // if (companyEmail.trim() === '') {
  //   errors.companyEmail = 'Company eamil  must not be empty';
  // }

  // if (companyWebsite.trim() === '') {
  //   errors.companyWebsite = 'company website must not be empty';
  // }

  // if (companyName.trim() === '') {
  //   errors.companyName = 'Company name must not be empty';
  // }

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

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (email, password) => {
  const errors = {};
  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
  }
  if (password.trim() === '') {
    errors.password = 'Password must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
