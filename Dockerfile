FROM python:3.12-slim
WORKDIR /demo
COPY demo.py ./
USER nobody
ENTRYPOINT ["python", "demo.py"]
