import io, hashlib
from PIL import Image
from PyPDF2 import PdfReader

def extract_text_from_pdf_bytes(b: bytes) -> str:
    reader = PdfReader(io.BytesIO(b))
    text = [p.extract_text() or "" for p in reader.pages]
    return "\n".join(text)

def generate_thumbnail_from_image_bytes(b: bytes, size=(300,300)) -> bytes:
    img = Image.open(io.BytesIO(b))
    img.thumbnail(size)
    out = io.BytesIO()
    img.save(out, format="JPEG")
    out.seek(0)
    return out.read()

def sha256_bytes(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()