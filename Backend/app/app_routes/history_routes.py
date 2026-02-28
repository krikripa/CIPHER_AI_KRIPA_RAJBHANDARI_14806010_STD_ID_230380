from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from ..schemas import HistoryCreate
from app.pki_engine import encrypt_aes256, decrypt_aes256

router = APIRouter(prefix="/history", tags=["History"])


@router.post("/add")
def add_history(data: HistoryCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.username == data.username
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_history = models.History(
        user_id=user.id,
        input_text=encrypt_aes256(data.input_text),
        output_text=encrypt_aes256(data.output_text),
        method=data.method,
        mode=data.mode,
    )

    db.add(new_history)
    db.commit()
    db.refresh(new_history)

    return {"message": "History saved"}
