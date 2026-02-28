# backend/app/app_routes/pki_routes.py
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException
from pydantic import BaseModel
from ..database import get_db
from ..models import User, Certificate, PrivateKey
from ..pki_engine import (
    generate_rsa_key_pair,
    create_self_signed_cert,
    serialize_key,
    serialize_cert,
    encrypt_aes256,
    decrypt_aes256,
    encrypt_hybrid,
    decrypt_hybrid,
    sign_message,
    verify_signature,
    validate_certificate,
    encrypt_private_key
)

router = APIRouter(prefix="/pki", tags=["PKI"])

# -----------------------------
# Request schemas
# -----------------------------
class PKIUserRequest(BaseModel):
    username: str

class EncryptRequest(PKIUserRequest):
    text: str

class DecryptRequest(PKIUserRequest):
    text: str
    key_hex: str
    iv_hex: str

class HybridDecryptRequest(PKIUserRequest):
    ciphertext: str
    encrypted_key: str
    iv: str

class SignRequest(PKIUserRequest):
    text: str

class VerifyRequest(PKIUserRequest):
    text: str
    signature: str

# In-memory storage for demo purposes
USER_KEYS = {}
USER_CERTS = {}

# -----------------------------
# Generate RSA keys + self-signed cert
# -----------------------------
@router.post("/generate")
def generate_keys(request: PKIUserRequest, db: Session = Depends(get_db)):
    username = request.username
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        private_key, public_key = generate_rsa_key_pair()
        private_pem = serialize_key(private_key, private=True)
        public_pem = serialize_key(public_key, private=False)

        encrypted_private = encrypt_private_key(private_pem)
        cert = create_self_signed_cert(username, private_key, public_key)
        cert_pem = serialize_cert(cert)

        db_private = PrivateKey(user_id=user.id, encrypted_private_key=encrypted_private)
        db.add(db_private)
        db_cert = Certificate(
            user_id=user.id,
            certificate_pem=cert_pem,
            issuer=cert.issuer.rfc4514_string(),
            serial_number=str(cert.serial_number),
            # Use UTC-aware datetime
            valid_from=cert.not_valid_before_utc,
            valid_to=cert.not_valid_after_utc
        )
        db.add(db_cert)
        db.commit()

        # Add to in-memory storage for testing
        USER_KEYS[username] = {"private": private_key, "public": public_key}
        USER_CERTS[username] = cert_pem

        return {"message": "PKI generated successfully", "public_key": public_pem, "certificate": cert_pem}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error generating PKI: {str(e)}")

# -----------------------------
# AES-256 Encryption / Decryption
# -----------------------------
@router.post("/encrypt")
def encrypt(request: EncryptRequest):
    ciphertext, key_hex, iv_hex = encrypt_aes256(request.text)
    return {"ciphertext": ciphertext, "key_hex": key_hex, "iv_hex": iv_hex}

@router.post("/decrypt")
def decrypt(request: DecryptRequest):
    try:
        plaintext = decrypt_aes256(request.text, request.key_hex, request.iv_hex)
        return {"plaintext": plaintext.decode()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# -----------------------------
# Hybrid Encryption / Decryption
# -----------------------------
@router.post("/hybrid/encrypt")
def hybrid_encrypt(request: EncryptRequest):
    user = USER_KEYS.get(request.username)
    if not user:
        raise HTTPException(status_code=404, detail="User keys not found")
    return encrypt_hybrid(request.text, user["public"])

@router.post("/hybrid/decrypt")
def hybrid_decrypt(request: HybridDecryptRequest):
    user = USER_KEYS.get(request.username)
    if not user:
        raise HTTPException(status_code=404, detail="User keys not found")
    try:
        plaintext = decrypt_hybrid(request.ciphertext, request.encrypted_key, request.iv, user["private"])
        return {"plaintext": plaintext}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# -----------------------------
# Digital Signatures
# -----------------------------
@router.post("/sign")
def sign(request: SignRequest):
    user = USER_KEYS.get(request.username)
    if not user:
        raise HTTPException(status_code=404, detail="User keys not found")
    signature = sign_message(user["private"], request.text)
    return {"signature": signature}

@router.post("/verify")
def verify(request: VerifyRequest):
    user = USER_KEYS.get(request.username)
    if not user:
        raise HTTPException(status_code=404, detail="User keys not found")
    valid = verify_signature(user["public"], request.text, request.signature)
    return {"valid": valid}

# -----------------------------
# Certificate Validation
# -----------------------------
@router.get("/validate/{username}")
def validate_cert(username: str):
    if username not in USER_CERTS:
        raise HTTPException(status_code=404, detail="Certificate not found")
    valid = validate_certificate(username)
    return {"username": username, "valid": valid}
