from fastapi import FastAPI
from routes import files  # your new routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Smart Pipeline")
app.include_router(files.router, prefix="/files", tags=["Files"])

origins = [
    "http://localhost:5173",  # Vite frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Smart Pipeline API running"}