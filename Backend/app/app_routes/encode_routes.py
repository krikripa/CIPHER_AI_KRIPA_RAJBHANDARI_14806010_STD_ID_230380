from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import History, User
from pydantic import BaseModel

router = APIRouter(prefix="/encode")

# Request schema
class EncodeRequest(BaseModel):
    user_id: int
    input_text: str
    method: str = "reverse"
    mode: str = "encode"

# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def encode_text(request: EncodeRequest, db: Session = Depends(get_db)):
    # Simple encoding logic (reverse text) - replace with actual
    output_text = request.input_text[::-1]

    # Verify user exists
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Save history
    history_item = History(
        user_id=request.user_id,
        input_text=request.input_text,
        output_text=output_text,
        method=request.method,
        mode=request.mode
    )
    db.add(history_item)
    db.commit()
    db.refresh(history_item)

    return {
        "input": request.input_text,
        "output": output_text,
        "method": request.method,
        "mode": request.mode,
        "history_id": history_item.id
    }
