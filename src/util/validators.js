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
  street,
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

  if (street.trim() === '') {
    errors.street = 'street  must not be empty';
  }

  if (postalCode.trim() === '') {
    errors.postalCode = 'Postal code must not be empty';
  }

  if (companyEmail.trim() === '') {
    errors.companyEmail = 'Company email  must not be empty';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!companyEmail.match(regEx)) {
      errors.companyEmail = 'Company email must be a valid email address';
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

module.exports.validateUpdateUserInput = (
  updateUserInput,
) => {
  const {
    password,
    email,
    firstName,
    lastName,
    phoneNumber,
    company,
  } = updateUserInput;
  const {
    companyEmail, companyName, websiteUrl, address,
  } = company || {};
  const {
    city, street, country, postalCode,
  } = address || {};
  const errors = {};

  if (firstName !== undefined && firstName.trim() === '') {
    errors.firstName = 'First name must not be empty';
  }

  if (lastName !== undefined && lastName.trim() === '') {
    errors.lastName = 'Last name must not be empty';
  }

  if (phoneNumber !== undefined && phoneNumber.trim() === '') {
    errors.phoneNumber = 'Phone number  must not be empty';
  }

  if (city !== undefined && city.trim() === '') {
    errors.city = 'city  must not be empty';
  }

  if (country !== undefined && country.trim() === '') {
    errors.country = 'country must not be empty';
  }

  if (street !== undefined && street.trim() === '') {
    errors.street = 'street  must not be empty';
  }

  if (postalCode !== undefined && postalCode.trim() === '') {
    errors.postalCode = 'Postal code must not be empty';
  }

  if (companyEmail !== undefined && companyEmail.trim() === '') {
    errors.companyEmail = 'Company email  must not be empty';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (companyEmail !== undefined && !companyEmail.match(regEx)) {
      errors.companyEmail = 'Company email must be a valid email address';
    }
  }

  if (websiteUrl !== undefined && websiteUrl.trim() === '') {
    errors.websiteUrl = 'company website must not be empty';
  }

  if (companyName !== undefined && companyName.trim() === '') {
    errors.companyName = 'Company name must not be empty';
  }

  if (email !== undefined && email.trim() === '') {
    errors.email = 'Email must not be empty';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (email !== undefined && !email.match(regEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }
  if (password !== undefined && password.trim() === '') {
    errors.password = 'Password must not be empty';
  }

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

module.exports.validateReview = (comment) => {
  const reviewErrors = {};
  if (comment.trim() === '') {
    reviewErrors.comment = 'Review comment cannot be empty';
  }
  return {
    __typename: 'ReviewInputErrors',
    reviewErrors,
    type: 'ReviewInputErrors',
    valid: Object.keys(reviewErrors).length < 1,

module.exports.validateProductInput = (product) => {
  const errors = {};

  if (product.productName && product.productName.trim() === '') {
    errors.ProductName = 'Product name must not be empty';
  }

  if (product.productPrice && typeof (product.productPrice) !== 'number') {
    errors.productPrice = 'Product price must not be empty';
  }

  if (product.productQuantity && typeof (product.productQuantity) !== 'number') {
    errors.productQuantity = 'Product quantity must not be empty';
  }

  if (product.productMeasurementUnit && product.productMeasurementUnit.trim() === '') {
    errors.productMeasurementUnit = 'Product measurement unit must not be empty';
  }
  if (product.uniqueAttributes) {
    if (product.uniqueAttributes.uniqueName && product.uniqueAttributes.uniqueName.trim() === '') {
      errors.uniqueName = 'Unique name must not be empty';
    }
    if (product.uniqueAttributes.group && product.uniqueAttributes.group.trim() === '') {
      errors.group = 'Group must not be empty';
    }
    if (product.uniqueAttributes.grade) {
      if (product.uniqueAttributes.grade.trim() === '') {
        errors.grade = 'Grade must not be empty';
      }
    }
    if (product.uniqueAttributes.geographicalDesignation && product.uniqueAttributes.geographicalDesignation.trim() === '') {
      errors.geographicalDesignation = 'Geographical Designation must not be empty';
    }
  }
  // console.log(errors);
  return {
    __typename: 'ProductInputError',
    productErrors: errors,
    type: 'ProductInputError',
    valid: Object.keys(errors).length < 1,

  };
};
