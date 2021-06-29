import * as Yup from 'yup';

export const ActivateValidation = Yup.object().shape({
  password: Yup.string()
    .required()
    .min(6, 'Password is too short'),
  repeatPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), null], 'Repeat password must be same with password')
    .min(6, 'Repeat password is too short')
});
