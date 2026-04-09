import DodoPayments from 'dodopayments'

export const dodo = new DodoPayments({
  bearerToken:
    process.env.NODE_ENV === 'production'
      ? process.env.DODO_API_KEY_LIVE!
      : process.env.DODO_API_KEY_TEST!,
  environment:
    process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode',
})