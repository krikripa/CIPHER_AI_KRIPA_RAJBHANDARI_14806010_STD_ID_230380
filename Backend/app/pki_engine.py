# backend/app/pki_engine.py

from cryptography.hazmat.primitives.asymmetric import rsa, padding as asym_padding
from cryptography.hazmat.primitives import serialization, hashes, padding as sym_padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.x509 import NameOID
from cryptography import x509
from datetime import datetime, timedelta, timezone
import os

# -----------------------------
# RSA Key Pair Generation
# -----------------------------
def generate_rsa_key_pair(key_size: int = 2048):
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=key_size)
    public_key = private_key.public_key()
    return private_key, public_key

# -----------------------------
# Serialize Keys
# -----------------------------
def serialize_key(key, private=False):
    if private:
        return key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=serialization.NoEncryption()
        ).decode()
    else:
        return key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode()

# -----------------------------
# X.509 Self-signed Certificate
# -----------------------------
def create_self_signed_cert(username: str, private_key, public_key):
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COMMON_NAME, username)
    ])
    cert = x509.CertificateBuilder().subject_name(
        subject
    ).issuer_name(
        issuer
    ).public_key(
        public_key
    ).serial_number(
        x509.random_serial_number()
    ).not_valid_before(
        datetime.now(timezone.utc)
    ).not_valid_after(
        datetime.now(timezone.utc) + timedelta(days=365)
    ).sign(private_key, hashes.SHA256(), default_backend())
    return cert

def serialize_cert(cert):
    return cert.public_bytes(serialization.Encoding.PEM).decode()

# -----------------------------
# AES-256 Encryption / Decryption
# -----------------------------
def encrypt_aes256(plaintext: str, key: bytes = None):
    if not key:
        key = os.urandom(32)
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(key), modes.CFB(iv))
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(plaintext.encode()) + encryptor.finalize()
    return ciphertext.hex(), key.hex(), iv.hex()

def decrypt_aes256(ciphertext_hex: str, key_hex: str, iv_hex: str):
    key = bytes.fromhex(key_hex)
    iv = bytes.fromhex(iv_hex)
    ciphertext = bytes.fromhex(ciphertext_hex)
    cipher = Cipher(algorithms.AES(key), modes.CFB(iv))
    decryptor = cipher.decryptor()
    return decryptor.update(ciphertext) + decryptor.finalize()

# -----------------------------
# Hybrid Encryption (AES + RSA)
# -----------------------------
def encrypt_hybrid(plaintext: str, recipient_public_key):
    aes_key = os.urandom(32)
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(aes_key), modes.CFB(iv))
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(plaintext.encode()) + encryptor.finalize()

    encrypted_key = recipient_public_key.encrypt(
        aes_key,
        asym_padding.OAEP(
            mgf=asym_padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

    return {
        "ciphertext": ciphertext.hex(),
        "encrypted_key": encrypted_key.hex(),
        "iv": iv.hex()
    }

def decrypt_hybrid(ciphertext_hex: str, encrypted_key_hex: str, iv_hex: str, private_key):
    encrypted_key = bytes.fromhex(encrypted_key_hex)
    aes_key = private_key.decrypt(
        encrypted_key,
        asym_padding.OAEP(
            mgf=asym_padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

    iv = bytes.fromhex(iv_hex)
    ciphertext = bytes.fromhex(ciphertext_hex)
    cipher = Cipher(algorithms.AES(aes_key), modes.CFB(iv))
    decryptor = cipher.decryptor()
    plaintext = decryptor.update(ciphertext) + decryptor.finalize()
    return plaintext.decode()

# -----------------------------
# Digital Signature
# -----------------------------
def sign_message(private_key, message: str):
    signature = private_key.sign(
        message.encode(),
        asym_padding.PSS(
            mgf=asym_padding.MGF1(hashes.SHA256()),
            salt_length=asym_padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    return signature.hex()

def verify_signature(public_key, message: str, signature_hex: str):
    signature = bytes.fromhex(signature_hex)
    try:
        public_key.verify(
            signature,
            message.encode(),
            asym_padding.PSS(
                mgf=asym_padding.MGF1(hashes.SHA256()),
                salt_length=asym_padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return True
    except:
        return False

# -----------------------------
# Certificate Validation (placeholder)
# -----------------------------
def validate_certificate(username: str) -> bool:
    return True

# -----------------------------
# Encrypt private key with MASTER_KEY (AES-CBC + PKCS7)
# -----------------------------
MASTER_KEY = os.environ.get("MASTER_KEY", "supersecretmasterkey123").encode().ljust(32)[:32]

def encrypt_private_key(private_pem: bytes):
    iv = os.urandom(16)
    padder = sym_padding.PKCS7(128).padder()
    padded_data = padder.update(private_pem.encode() if isinstance(private_pem, str) else private_pem) + padder.finalize()

    cipher = Cipher(algorithms.AES(MASTER_KEY), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()

    return iv.hex() + ":" + ciphertext.hex()
