from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

    history = relationship("History", back_populates="user")


class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    input_text = Column(String)
    output_text = Column(String)
    method = Column(String)
    mode = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="history")

# =========================
# PKI TABLES
# =========================

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    certificate_pem = Column(String, nullable=False)
    issuer = Column(String, nullable=False)
    serial_number = Column(String, nullable=False)
    valid_from = Column(DateTime, nullable=False)
    valid_to = Column(DateTime, nullable=False)
    revoked = Column(String, default="false")
    created_at = Column(DateTime, default=datetime.utcnow)


class PrivateKey(Base):
    __tablename__ = "private_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    encrypted_private_key = Column(String, nullable=False)
    key_type = Column(String, default="RSA")
    created_at = Column(DateTime, default=datetime.utcnow)
