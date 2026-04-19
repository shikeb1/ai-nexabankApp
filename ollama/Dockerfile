# Industry Standard: Lightweight Baked Ollama Image
FROM ollama/ollama:latest

# Put our Agent configuration in the image
COPY Modelfile /Modelfile

# PRE-LOADING THE MODEL (The DevSecOps way)
# This script starts the Ollama server temporarily, pulls the 1B model,
# creates our custom 'nexabot' agent, and then shuts down.
# This makes the final image "Baked" (contains the model inside).
RUN nohup bash -c "ollama serve &" && \
    sleep 10 && \
    ollama pull llama3.2:1b && \
    ollama create nexabot -f /Modelfile && \
    pkill ollama

# Environment variables for performance and security
ENV OLLAMA_HOST=0.0.0.0
ENV OLLAMA_ORIGINS=*

EXPOSE 11434

# Standard healthcheck to ensure the AI is responsive
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ollama list || exit 1

ENTRYPOINT ["ollama", "serve"]
