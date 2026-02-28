# CIPHER_AI_KRIPA_RAJBHANDARI_14806010_STD_ID_230380
 🔐 Cipher AI

Cipher AI is an AI-powered cryptographic analysis and encoding/decoding platform designed for academic learning, cybersecurity experimentation, and CTF challenges. The system integrates encryption, decryption, digital signatures, PKI-based certificate management, and AI-assisted encoding detection into a secure and user-friendly web application.

---

## 🚀 Features

- 🔑 Multiple Encoding & Decoding Algorithms  
  - Base64  
  - Hex  
  - Binary  
  - ROT13  
  - AES  
  - DES / Triple DES  
  - XOR  
  - Vigenere  

- 🤖 AI-Assisted Encoding Detection  
- 🔐 Hybrid Encryption (AES + RSA/ECC)  
- ✍️ Digital Signature Creation & Verification  
- 🏛 PKI-based Certificate Management  
- 🗄 AES-256 Encrypted Data Storage  
- 👤 Secure JWT Authentication  
- 🌙 Dark/Light Theme Toggle  
- 📜 Personal History Panel  

---

## 🏗️ System Architecture

- **Frontend:** React  
- **Backend:** FastAPI  
- **Database:** PostgreSQL  
- **Authentication:** JWT  
- **Encryption:** AES, RSA/ECC  
- **Containerization:** Docker  
- **Orchestration:** Kubernetes  

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone (link)
cd cipher-ai
```

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🧪 Testing

Unit testing was conducted using Vitest for frontend components and backend functional testing for cryptographic modules.

To run frontend tests:

```bash
npx vitest
```

---

## 📊 Project Objectives

- Implement secure encoding and decoding platform  
- Integrate AI-assisted detection  
- Apply PKI and digital signatures  
- Ensure confidentiality, integrity, and availability (CIA model)  

---

## ⚠️ Ethical Use

Cipher AI is developed strictly for academic, research, and controlled cybersecurity testing purposes. It is not intended for malicious use.

---

## 📌 Future Improvements

- Support for additional encryption algorithms  
- Performance optimization for large files  
- Multi-factor authentication  
- Advanced AI-based cipher analysis  
- Improved scalability for concurrent users  

---

## 👨‍💻 Author

Developed as part of a Cybersecurity academic project.

---

## 📄 License

This project is for educational purposes only.
