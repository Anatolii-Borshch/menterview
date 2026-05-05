FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1
WORKDIR /worker-manager
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV PYTHONPATH="/worker-manager:/worker-manager/generated"
EXPOSE 6000
CMD ["python", "-m", "app.main"]