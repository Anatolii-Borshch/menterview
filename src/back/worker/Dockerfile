FROM python:3.12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir -p generated && \
    python -m grpc_tools.protoc \
    -I proto \
    --python_out=generated \
    --grpc_python_out=generated \
    proto/session.proto \
    proto/callback.proto && \
    touch generated/__init__.py && \
    sed -i 's/import session_pb2 as session__pb2/from generated import session_pb2 as session__pb2/' \
    generated/session_pb2_grpc.py && \
    sed -i 's/import callback_pb2 as callback__pb2/from generated import callback_pb2 as callback__pb2/' \
    generated/callback_pb2_grpc.py
EXPOSE 50051 8765
CMD ["python", "-m", "app.main"]