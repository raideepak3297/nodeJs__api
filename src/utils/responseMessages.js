exports.ERROR = {
    DEFAULT: {
        statusCode: 501,
        customMessage: 'Something went wrong.',
        type: 'DEFAULT'
    },
    UNATHORIZE_ACCES: {
        statusCode: 400,
        customMessage: 'You dont have access to perform this action.',
        type: 'UNATHORIZE_ACCES'
    },
    ACCOUNT_DEACTIVATED : {
        statusCode : 400,
        customMessage : 'You have already an account with us, Please contact with admin for activate your account',
        type : 'ACCOUNT_DEACTIVATED'
    },
    USER_NOT_FOUND: {
        statusCode: 400,
        customMessage: 'User not found.',
        type: 'USER_NOT_FOUND'
    },
    PASSWORD_LENGTH : {
        statusCode: 400,
        customMessage: 'Password length should be equal or greater than {PASSWORD_LENGTH}.',
        type: 'PASSWORD_LENGTH'
    },
    PASSWORD_STRENGTH : {
        statusCode: 400,
        customMessage: 'Password strength should be {STRENGTH_DETAILS}.',
        type: 'PASSWORD_LENGTH'
    },
    INAVLID_EMAIL_ID: {
        statusCode: 400,
        customMessage: 'The email you entered is invalid.',
        type: 'INAVLID_EMAIL_ID'
    },
    NOT_REGISTERED: {
        statusCode: 400,
        customMessage: 'Its seems like you dont have an account with us, Please register.',
        type: 'NOT_REGISTERED'
    },
    INVALID_PASSWORD : {
        statusCode: 400,
        customMessage: 'The password you entered is invalid.',
        type: 'INVALID_PASSWORD'
    },
    INVALID_ACCESS_TOKEN: {
        statusCode: 400,
        customMessage: 'Invalid access token.',
        type: 'INVALID_ACCESS_TOKEN'
    }
};

exports.SUCCESS = {
    DEFAULT: {
        statusCode: 200,
        customMessage: 'Success',
        type: 'DEFAULT'
    },
    REGISTER: {
        statusCode: 200,
        customMessage: 'Registered successfully.',
        type: 'REGISTER'
    },
    LOGIN: {
        statusCode: 200,
        customMessage: 'Logged in successfully.',
        type: 'LOGIN'
    },
    USER_EXIST: {
        statusCode: 200,
        customMessage: 'You have already registered with us.',
        type: 'USER_EXIST'
    },
};