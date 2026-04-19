# --- STAGE 1: BUILD (Install Dependencies) ---
FROM python:3.10-slim AS builder

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install build tools for high-scale database drivers
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# --- STAGE 2: RUNTIME (Production Ready) ---
FROM python:3.10-slim

WORKDIR /app

# ---------------------------------------------------------
# FULL STACK CONNECTIONS
# We moved the Backend to 5000 to avoid conflict with Frontend (on 8000)
# ---------------------------------------------------------
ENV DATABASE_URL=postgresql://nexabank_user:password@db:5432/nexabank
ENV OLLAMA_URL=http://ollama:11434/api/generate
ENV FRONTEND_URL=http://localhost:8000
# ---------------------------------------------------------

# Fast healthchecks and runtime libraries
RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq5 curl && \
    rm -rf /var/lib/apt/lists/*

# Copy only the essential files
COPY --from=builder /install /usr/local
COPY . .

# DEVSECOPS SECURITY: Run as a non-privileged user
RUN adduser --disabled-password --gecos "" appuser && \
    chown -R appuser:appuser /app
USER appuser

# MOVED TO 5000 to avoid conflict with Frontend
EXPOSE 5000

# Updated healthcheck for Port 5000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Start the application on Port 5000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
