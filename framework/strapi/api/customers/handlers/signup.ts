import { StrapiApiError } from '../../utils/errors'
import login from '../../../auth/login'
import { SignupHandlers } from '../signup'

const signup: SignupHandlers['signup'] = async ({
  res,
  body: { username, email, password },
  config,
}) => {
  if (!(username && email && password)) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }
  // TODO: validate the password and email
  // Passwords must be at least 7 characters and contain both alphabetic
  // and numeric characters.

  try {
    await config.storeApiFetch('/v3/customers', {
      method: 'POST',
      body: JSON.stringify([
        {
          username,
          email,
          authentication: {
            new_password: password,
          },
        },
      ]),
    })
  } catch (error) {
    if (error instanceof StrapiApiError && error.status === 422) {
      const hasEmailError = '0.email' in error.data?.errors

      // If there's an error with the email, it most likely means it's duplicated
      if (hasEmailError) {
        return res.status(400).json({
          data: null,
          errors: [
            {
              message: 'The email is already in use',
              code: 'duplicated_email',
            },
          ],
        })
      }
    }

    throw error
  }

  // Login the customer right after creating it
  await login({ variables: { email, password }, res, config })

  res.status(200).json({ data: null })
}

export default signup
