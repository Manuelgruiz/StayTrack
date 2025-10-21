.PHONY: install test run

install:
	pip install -r requirements.txt
	pip install pytest httpx

test:
	pytest -v --disable-warnings

run:
	uvicorn app.main:app --reload
