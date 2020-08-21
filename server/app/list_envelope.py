from app.docusign_esign import ApiClient, EnvelopesApi
from datetime import datetime, timedelta

api_client = ApiClient()
api_client.host = 'https://demo.docusign.net/restapi'
api_client.set_default_header(
    "Authorization",
    "Bearer " + "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwCAvWye2grYSAgAgP2PrB0L2EgCAIyGYj2Ii1NGpUdCZxZhtnQVAAEAAAAYAAEAAAAFAAAADQAkAAAAZjBmMjdmMGUtODU3ZC00YTcxLWE0ZGEtMzJjZWNhZTNhOTc4IgAkAAAAZjBmMjdmMGUtODU3ZC00YTcxLWE0ZGEtMzJjZWNhZTNhOTc4MACAvmqe1grYSDcAfI5QdmpU_kagUesLmBotDg.AMH_k4xRHuje-tyCA61u0-Vx7s_xdFwuZ1cOYz_SIRCxk9h7bHzJTtHBxLu2ywO9WvWeDlLZouO8PBaxRDYAzN_y5ZcPU-R01mMEBPIXNNBgGhLBuh23-TmbahaGfoiKH59DMzXq4DTYH06AJ9BGrLJTssiClXKnLPQrt0cchfwtHlSUDzhp9AE1soN2QjmbTmp2BbFw3DqMe1m3UeNMEjOC4P_KoJxh4gWn5nsaWA257Ff1yj3G2bJyq318Khj8K_mTGeJotR3HMLuKf7XOCfzwexW7ES5E77Dw5F3CMTJvJnge63d1GRfHK991_qQiM3_PcJth1DNwph53gCjPXQ"
    )

envelope_api = EnvelopesApi(api_client)
from_date = (datetime.utcnow() - timedelta(days=30)).isoformat()
try:
    envelope = envelope_api.recipents('957b17e7-1218-4865-8fff-ad974ed8f6a7', envelope_id='99e42f47-0250-4222-b5e7-ebe12a06928e', recipient_id='6669ff8e-6bc6-4d17-9481-88687a5dd928')
    print(envelope)
except Exception as e:
    print(e)
