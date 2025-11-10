.PHONY: install test \
		run-users run-tracker run-goals run-auth run-stats run-catalog run-gateway run-all \
		stop-users stop-tracker stop-goals stop-auth stop-stats stop-catalog stop-gateway stop-all \
		restart-all \ test-all

# ---- INSTALL ----
install:
	pip install -r services/user-service/requirements.txt
	pip install -r services/tracker-service/requirements.txt
	pip install -r services/goals-service/requirements.txt
	pip install -r services/auth-service/requirements.txt
	pip install -r services/stats-service/requirements.txt
	pip install -r services/catalog-service/requirements.txt
	pip install -r gateway/requirements.txt
	pip install pytest httpx

# ---- TESTS ----
test:
	pytest -v --disable-warnings

# ---- RUN INDIVIDUAL SERVICES ----
run-users:
	cd app/services/user-service && uvicorn app.main:app --reload --port 8001

run-tracker:
	cd app/services/tracker-service && uvicorn app.main:app --reload --port 8002

run-auth:
	cd app/services/auth-service && uvicorn app.main:app --reload --port 8003

run-goals:
	cd app/services/goals-service && uvicorn app.main:app --reload --port 8004

run-stats:
	cd app/services/stats-service && uvicorn app.main:app --reload --port 8005

run-catalog:
	cd app/services/catalog-service && uvicorn app.main:app --reload --port 8006

run-gateway:
	cd app/gateway && uvicorn app:app --reload --port 8000

# ---- RUN ALL SERVICES ----
run-all:
	make run-users & \
	make run-tracker & \
	make run-auth & \
	make run-goals & \
	make run-stats & \
	make run-catalog & \
	make run-gateway

# ---- STOP INDIVIDUAL SERVICES ----
stop-users:
	-lsof -ti :8001 | xargs kill -9

stop-tracker:
	-lsof -ti :8002 | xargs kill -9

stop-auth:
	-lsof -ti :8003 | xargs kill -9

stop-goals:
	-lsof -ti :8004 | xargs kill -9

stop-stats:
	-lsof -ti :8005 | xargs kill -9

stop-catalog:
	-lsof -ti :8006 | xargs kill -9

stop-gateway:
	-lsof -ti :8000 | xargs kill -9

# ---- STOP ALL SERVICES ----
stop-all: stop-users stop-tracker stop-auth stop-goals stop-stats stop-catalog stop-gateway
	@echo "All services stopped."

# ---- RESTART ALL ----
restart-all: stop-all run-all
	@echo "All services restarted."

test-all:
	pytest -v app/services/user-service/tests
	pytest -v app/services/tracker-service/tests
	pytest -v app/services/goals-service/tests
	pytest -v app/services/stats-service/tests
	pytest -v app/services/catalog-service/tests
	pytest -v app/services/auth-service/tests
