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
  role,
) => {
  const errors = {};

  if (firstName.trim() === '') {
    errors.firstName = 'First name must not be empty';
  }
  if (role.trim() === '') {
    errors.role = 'Role must not be empty';
  } else {
    const validRole =
      role === 'ADMIN' || role === 'SUPPLIER' || role === 'BUYER';
    if (!validRole) {
      errors.role = 'Invalid value for role';
    }
  }

  if (lastName.trim() === '') {
    errors.lastName = 'Last name must not be empty';
  }

  if (phoneNumber.trim() === '') {
    errors.phoneNumber = 'Phone number  must not be empty';
  } else {
    const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    if (!phoneRegex.test(phoneNumber) || phoneNumber.length > 13) {
      errors.phoneNumber =
        'Error input, please enter a valid phone number!';
    }
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
  } else {
    try {
      new URL(websiteUrl);
    } catch (err) {
      errors.websiteUrl = 'company website must be vaild url';
    }
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
  return {
    __typename: 'UserInputError',
    userErrors: errors,
    type: 'UserInputError',
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateUpdateUserInput = (updateUserInput) => {
  const {
    password,
    email,
    firstName,
    lastName,
    isVerified,
    phoneNumber,
    company,
  } = updateUserInput;

  const errors = {};

  if (firstName !== undefined && firstName.trim() === '') {
    errors.firstName = 'First name must not be empty';
  }

  if (lastName !== undefined && lastName.trim() === '') {
    errors.lastName = 'Last name must not be empty';
  }

  if (isVerified !== undefined && typeof isVerified !== 'boolean') {
    errors.isVerified = 'isVerified must be a boolean value';
  }

  if (phoneNumber !== undefined && phoneNumber.trim() === '') {
    errors.phoneNumber = 'Phone number  must not be empty';
  }
  if (company !== undefined) {
    if (
      company.address.city !== undefined &&
      company.address.city.trim() === ''
    ) {
      errors.city = 'city  must not be empty';
    }

    if (
      company.address.country !== undefined &&
      company.address.country.trim() === ''
    ) {
      errors.country = 'country must not be empty';
    }

    if (
      company.address.street !== undefined &&
      company.address.street.trim() === ''
    ) {
      errors.street = 'street  must not be empty';
    }

    if (
      company.address.postalCode !== undefined &&
      company.address.postalCode.trim() === ''
    ) {
      errors.postalCode = 'Postal code must not be empty';
    }

    if (
      company.companyEmail !== undefined &&
      company.companyEmail.trim() === ''
    ) {
      errors.companyEmail = 'Company email  must not be empty';
    } else {
      const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
      if (
        company.companyEmail !== undefined &&
        !company.companyEmail.match(regEx)
      ) {
        errors.company.companyEmail =
          'Company email must be a valid email address';
      }
    }

    if (
      company.websiteUrl !== undefined &&
      company.websiteUrl.trim() === ''
    ) {
      errors.websiteUrl = 'company website must not be empty';
    } else {
      try {
        new URL(company.websiteUrl);
      } catch (err) {
        errors.company.websiteUrl =
          'company website must be vaild url';
      }
    }
    if (
      company.companyName !== undefined &&
      company.companyName.trim() === ''
    ) {
      errors.company.companyName = 'Company name must not be empty';
    }
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
  };
};

module.exports.validateProductInput = (product) => {
  const errors = {};
  const {
    productName,
    productPrice,
    productQuantity,
    productMeasurementUnit,
  } = product;

  if (productName.trim() === '') {
    errors.ProductName = 'Product name must not be empty';
  }

  if (
    typeof productPrice !== 'number' ||
    Math.sign(productPrice) !== 1
  ) {
    errors.productPrice = 'please enter a valid number';
  }

  if (
    typeof productQuantity !== 'number' ||
    Math.sign(productQuantity) !== 1
  ) {
    errors.productQuantity = 'please enter a valid number';
  }

  if (
    product.productDescription &&
    product.productDescription.trim() === ''
  ) {
    errors.productDescription =
      'Product description must not be empty';
  }

  if (productMeasurementUnit.trim() === '') {
    errors.productMeasurementUnit =
      'Product measurement unit must not be empty';
  }
  if (product.uniqueAttributes) {
    if (
      product.uniqueAttributes.uniqueName &&
      product.uniqueAttributes.uniqueName.trim() === ''
    ) {
      errors.uniqueName = 'Unique name must not be empty';
    }
    if (
      product.uniqueAttributes.group &&
      product.uniqueAttributes.group.trim() === ''
    ) {
      errors.group = 'Group must not be empty';
    }
    if (
      product.uniqueAttributes.grade &&
      product.uniqueAttributes.grade.trim() === ''
    ) {
      errors.grade = 'Grade must not be empty';
    }

    if (
      product.uniqueAttributes.flowerType &&
      product.uniqueAttributes.flowerType.trim() === ''
    ) {
      errors.grade = 'flowerType must not be empty';
    }

    if (
      product.uniqueAttributes.geographicalDesignation &&
      product.uniqueAttributes.geographicalDesignation.trim() === ''
    ) {
      errors.geographicalDesignation =
        'Geographical Designation must not be empty';
    }
  }
  return {
    __typename: 'ProductInputError',
    productErrors: errors,
    type: 'ProductInputError',
    valid: Object.keys(errors).length < 1,
  };
};
