import pyotp
import qrcode
import io
import base64

class OTPService:
    @staticmethod
    def generate_secret():
        """Genera una clave secreta para OTP"""
        return pyotp.random_base32()

    @staticmethod
    def verify_otp(secret, token):
        """Verifica un token OTP con la clave secreta"""
        totp = pyotp.TOTP(secret)
        return totp.verify(token)

    @staticmethod
    def generate_qr_code(username, secret):
        """Genera un código QR para la configuración de Google Authenticator"""
        issuer_name = "FT Trascendence"
        totp = pyotp.TOTP(secret)
        uri = totp.provisioning_uri(name=username, issuer_name=issuer_name)
        
        # Crea el código QR
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(uri)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convertir la imagen a una cadena base64
        buffered = io.BytesIO()
        img.save(buffered)
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"