'''
Start up Braintree with provided config. Should be called once when server is started. Could achieve this by importing
this module in Django settings for example.
'''
import braintree

# Currently set to sandbox credentials
BRAINTREE_MERCHANT_ID_UK = 'p3wtkd4pvzgx7sw9'
BRAINTREE_PUBLIC_KEY = 'yzkprcnmyd2p5tfv'
BRAINTREE_PRIVATE_KEY = '0848b85d1d77eee1a2155168536e1dc5'

braintree.Configuration.configure(braintree.Environment.Sandbox,
                                  merchant_id=BRAINTREE_MERCHANT_ID_UK,
                                  public_key=BRAINTREE_PUBLIC_KEY,
                                  private_key=BRAINTREE_PRIVATE_KEY)